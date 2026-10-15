import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { at, clamp01, easeIn, easeInOut, easeOutBack, lerp, progress, ring, track } from "./film";
import { IntroControls, IntroTitle, Typed } from "./intro-text";
import { MARQADOR } from "./marqador-mark";
import { useMarquiLife, type Pose } from "./marqui-character";
import { MarquiLive } from "./marqui-live";

/* ——— MARQui brings his brother ———
   A close-up of MARQui. Two little hands pop out holding a rope that runs
   off the right of the frame. He pulls: nothing. He pulls harder and
   MARQador slides into view, sees us and digs in, dragging MARQui forward.
   One big yank: the camera pulls back as MARQador flies in head over heels
   and lands beside him. MARQui lets go, presents him with a little "ta-da",
   and "Presentamos MARQador" comes in, then the sentence types itself.

   Like the hero, every value is a pure function of `t` (seconds). It plays
   the first time the section comes into view; then it can be skipped or
   replayed from the corner. */

const FL = 820; // the floor
const MQ = { s: 1.54, x: 520 }; // MARQui: big, his head r ≈ 300
const MQ_TAIL = (737 - 525.2) * MQ.s; // head centre → tip of his tail
const MD = { s: 0.486, x: 1210 }; // MARQador: smaller, his head r ≈ 190
const MD_R = MARQADOR.head.r * MD.s;
const MD_BASE = MD_R; // head centre → bottom (his tail sits a little higher)

/* Each character's own svg, placed with the centre of his head on (0, 0). */
const CHAR_MQ = { x: -(622.6 - 380) * MQ.s, y: -(525.2 - 240) * MQ.s, width: 470 * MQ.s, height: 590 * MQ.s };
const CHAR_MD = { x: -(MARQADOR.head.cx - 170) * MD.s, y: -(MARQADOR.head.cy - 150) * MD.s, width: 960 * MD.s, height: 1060 * MD.s };

/** Each beat, in seconds. */
const T = {
  rise: [0.1, 0.9],
  hands: [1.3, 1.6],
  flight: [4.05, 4.75],
  zoomOut: [3.95, 4.9],
  letGo: [5.0, 5.4],
  ropeOut: [5.2, 5.8],
  handsOut: [6.1, 6.4],
  title: 5.7,
  copy: 7.0,
  end: 8.3,
} as const;
export const MARQADOR_INTRO_END = T.end;

/** How far the hands have pulled the rope (negative is towards MARQui). */
const PULL = [[1.8, 0], [2.1, -45], [2.35, -30], [2.6, -30], [2.95, -100], [3.2, -100], [3.45, -50], [3.7, -50], [3.95, -30], [4.1, -170], [4.6, -150]] as const;
/** MARQui leaning: back into each pull, forward when his brother pulls back. */
const LEAN = [[1.8, 0], [2.1, -8], [2.35, -4], [2.6, -4], [2.95, -12], [3.2, -12], [3.45, 7], [3.7, 4], [3.95, 9], [4.1, -18], [4.6, -14], [5.1, 0]] as const;
/** MARQui's feet: dragged forward, then stumbling back after the yank. */
const MQ_X = [[3.2, 520], [3.45, 565], [4.1, 555], [4.6, 495], [5.2, 520]] as const;
/** MARQador, measured from the right edge of the screen: just out, then a peek (about a third of him), then back out. */
const MD_X = [[0, 60], [2.1, 30], [2.35, 50], [2.6, 50], [2.95, -150], [3.2, -150], [3.45, 10], [4.05, 10]] as const;
/** He leans back against the rope (positive is away from MARQui). */
const MD_LEAN = [[2.6, 0], [2.8, 12], [3.2, 6], [3.45, 16], [3.95, 14], [4.05, 0]] as const;
/** How much the rope hangs. */
const SAG = [[1.4, 70], [1.85, 70], [2.1, 4], [4.1, 4], [4.75, 95]] as const;

const MQ_POSES: [number, Pose][] = [
  [0, "reposo"],
  [0.9, "parpadeo"],
  [1.05, "reposo"],
  [1.2, "derecha"], // what's he got there?
  [1.85, "parpadeo"], // pull
  [2.4, "derecha"],
  [2.65, "parpadeo"], // harder
  [3.2, "sorpresa"], // he pulls back!
  [3.55, "derecha"],
  [3.8, "parpadeo"], // one big one
  [4.15, "sorpresa"],
  [4.85, "alegria"],
  [5.7, "derecha"], // this is him
  [6.5, "reposo"],
  [7.1, "alegria"],
];
const MD_POSES: [number, Pose][] = [
  [0, "reposo"],
  [2.9, "sorpresa"], // a camera!
  [3.25, "inclinado"], // digs in
  [4.05, "sorpresa"], // whoa
  [4.75, "parpadeo"],
  [4.95, "izquierda"], // looks at his brother
  [5.9, "alegria"], // and at us
  [6.8, "reposo"],
];
const noop = () => {};

export function marqadorStep(t: number) {
  return t >= T.end ? 3 : t >= T.copy ? 2 : t >= T.title ? 1 : 0;
}

type Pt = { x: number; y: number };
const rot = (p: Pt, c: Pt, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return { x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a) };
};

/** `edge` is where the right edge of the screen falls in the stage's own units (the stage can be narrower than the screen). */
function frame(t: number, edge: number) {
  // The camera starts close on MARQui and pulls back for the yank.
  const zp = easeInOut(progress(T.zoomOut, t));
  const z = lerp(1.35, 1, zp);
  const focus = { x: lerp(600, 800, zp), y: lerp(470, 450, zp) };
  // Just past the edge of the screen, in the world MARQador walks in.
  const offstage = focus.x + (edge - 800) / z + MD_R;

  // MARQui rises into the close-up and lands with a squash.
  const lean = track(LEAN, t);
  const mq = { x: track(MQ_X, t), y: FL + 560 * (1 - easeOutBack(progress(T.rise, t))), rot: lean, sx: 1, sy: 1 };
  const hit = ring(t - T.rise[1], 0.12) + ring(t - 4.6, 0.08);
  mq.sy -= hit;
  mq.sx += 0.8 * hit;

  // MARQador: dragged along the floor, then the flight, head over heels.
  const md = { x: offstage + track(MD_X, t), y: FL, rot: track(MD_LEAN, t), sx: 1, sy: 1 };
  if (t >= T.flight[0]) {
    const p = progress(T.flight, t);
    md.x = lerp(offstage + 10, MD.x, p);
    md.y = FL - 340 * 4 * p * (1 - p);
    md.rot = -360 * easeInOut(p);
    if (p < 1) {
      md.sy = 1 + 0.08 * Math.abs(1 - 2 * p);
      md.sx = 1 - 0.05 * Math.abs(1 - 2 * p);
    }
    const land = ring(t - T.flight[1], 0.2);
    md.sy -= land;
    md.sx += 0.8 * land;
  }

  // The hands hang in front of him and follow his lean.
  const base = { x: mq.x, y: FL };
  const pull = track(PULL, t);
  let h1 = rot({ x: mq.x + 330 + pull, y: 612 }, base, lean * 0.5);
  let h2 = rot({ x: mq.x + 420 + pull, y: 598 }, base, lean * 0.5);
  // Once he lets go: up and towards his brother, "ta-da", with a little wiggle.
  const lg = easeInOut(progress(T.letGo, t));
  const wiggle = t > T.letGo[1] ? Math.sin((t - T.letGo[1]) * 26) * 9 * clamp01(1 - (t - T.letGo[1]) / 0.8) : 0;
  h1 = { x: lerp(h1.x, mq.x + 340, lg), y: lerp(h1.y, 380, lg) };
  h2 = { x: lerp(h2.x, mq.x + 460, lg), y: lerp(h2.y, 320, lg) };
  const handScale = [progress([T.hands[0], T.hands[1]], t), progress([T.hands[0] + 0.12, T.hands[1] + 0.12], t)].map((p) => easeOutBack(p) * (1 - easeIn(progress(T.handsOut, t))));

  // The rope: from a loose end behind him, through both fists, to the loop around MARQador.
  const mdCenter = { x: md.x, y: md.y - MD_BASE };
  const loop = rot({ x: md.x - MD_R * 1.0, y: mdCenter.y + 34 }, mdCenter, md.rot);
  // When he lets go it drops where the fists were and falls to the floor.
  const drop = easeIn(progress(T.letGo, t));
  const r1 = { x: mq.x + 330 + track(PULL, Math.min(t, T.letGo[0])), y: lerp(612, FL - 10, drop) };
  const r2 = { x: mq.x + 420 + track(PULL, Math.min(t, T.letGo[0])), y: lerp(598, FL - 10, drop) };
  const grip1 = t < T.letGo[0] ? h1 : r1;
  const grip2 = t < T.letGo[0] ? h2 : r2;
  const sag = track(SAG, t) + drop * 60;
  const mid = { x: (grip2.x + loop.x) / 2, y: (grip2.y + loop.y) / 2 + sag };
  const tail = { x: grip1.x - 110, y: FL - 6 };
  const rope = `M${tail.x} ${tail.y} Q${grip1.x - 60} ${grip1.y + 90} ${grip1.x} ${grip1.y} L${grip2.x} ${grip2.y} Q${mid.x} ${mid.y} ${loop.x} ${loop.y}`;
  const ropeOpacity = clamp01((t - T.hands[0]) / 0.25) * (1 - progress(T.ropeOut, t));
  const ropeAngle = (Math.atan2(loop.y - grip2.y, loop.x - grip2.x) * 180) / Math.PI;

  return { mq, md, h1, h2, handScale, wiggle, ropeAngle: t < T.letGo[0] ? ropeAngle : -20, rope, ropeOpacity, pull, z, focus, mdCenter };
}

/* ——— The rope ———
   A twisted three-strand rope: a dark core, and on top of it one slanted,
   shaded strand every few units along the path, so it reads as twisted fibre
   rather than a line. The strands are laid along the path on every frame. */

const STRAND_GAP = 7.5;
const ROPE_W = 15;
/** The loop round MARQador's middle, in his own space. */
const LOOP = `M${-MD_R} 34 A${MD_R} 46 0 0 0 ${MD_R} 34`;

function Rope({ gref, strands }: { gref: React.RefObject<SVGGElement | null>; strands: number }) {
  return (
    <g ref={gref} opacity={0}>
      <path data-core fill="none" stroke="#4a2c12" strokeWidth={ROPE_W + 3} strokeLinecap="round" strokeLinejoin="round" />
      <path data-core fill="none" stroke="#8f5e2e" strokeWidth={ROPE_W} strokeLinecap="round" strokeLinejoin="round" />
      <g>
        {Array.from({ length: strands }, (_, i) => (
          <ellipse key={i} rx="9.4" ry="4.1" fill="url(#strand)" stroke="#5a3616" strokeOpacity="0.55" strokeWidth="1" visibility="hidden" />
        ))}
      </g>
      {/* A faint sheen along the top. */}
      <path data-core fill="none" stroke="#f6dcae" strokeOpacity="0.18" strokeWidth="3" strokeLinecap="round" transform="translate(0 -3)" />
    </g>
  );
}

/** Sets the rope's path and lays its strands along it; `shift` slides them (the rope moving through the fists). */
function layRope(g: SVGGElement | null, d: string, shift: number) {
  if (!g) return;
  const cores = g.querySelectorAll<SVGPathElement>("[data-core]");
  cores.forEach((p) => p.setAttribute("d", d));
  const path = cores[0];
  if (!path) return;
  const len = path.getTotalLength();
  const strands = g.querySelectorAll("ellipse");
  let s = (((shift % STRAND_GAP) + STRAND_GAP) % STRAND_GAP) + 2;
  strands.forEach((el) => {
    if (s > len - 2) return el.setAttribute("visibility", "hidden");
    const a = path.getPointAtLength(s);
    const b = path.getPointAtLength(Math.min(len, s + 1));
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    el.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle + 58})`);
    el.setAttribute("visibility", "visible");
    s += STRAND_GAP;
  });
}

/** A little floating fist (no arms, like a cartoon glove), drawn round the origin. */
function Fist({ id }: { id: string }) {
  return (
    <g>
      <ellipse rx="54" ry="46" fill={`url(#${id})`} stroke="#014645" strokeOpacity="0.16" strokeWidth="3" />
      <path d="M-34 -26q8-12 18 0M-10 -32q8-12 18 0M14 -26q8-12 18 0" fill="none" stroke="#014645" strokeOpacity="0.16" strokeWidth="5" strokeLinecap="round" />
      {/* The thumb, wrapped over the rope. */}
      <ellipse cx="-6" cy="16" rx="36" ry="17" fill={`url(#${id})`} stroke="#014645" strokeOpacity="0.16" strokeWidth="3" />
    </g>
  );
}

export function MarqadorIntro() {
  const scope = useRef<HTMLDivElement>(null);
  const inView = useInView(scope, { amount: 0.45 });
  const reduce = useReducedMotion();
  const [play, setPlay] = useState<{ id: number; from: number } | null>(() => (reduce ? { id: 0, from: T.end } : null));
  const [step, setStep] = useState(0);
  const [poses, setPoses] = useState<[Pose, Pose]>(["reposo", "reposo"]);
  const live = [useMarquiLife({ active: step === 3 }), useMarquiLife({ active: step === 3 })];

  const els = {
    cam: useRef<SVGGElement>(null),
    mq: useRef<SVGGElement>(null),
    md: useRef<SVGGElement>(null),
    h1: useRef<SVGGElement>(null),
    h2: useRef<SVGGElement>(null),
    rope: useRef<SVGGElement>(null),
    loop: useRef<SVGGElement>(null),
    shMq: useRef<SVGEllipseElement>(null),
    shMd: useRef<SVGEllipseElement>(null),
  };
  const last = useRef({ poses: "", step: -1 });

  // The first time the section arrives, the film starts.
  useEffect(() => {
    if (inView && !play) setPlay({ id: 0, from: 0 });
  }, [inView, play]);

  const svg = useRef<SVGSVGElement>(null);
  const draw = useCallback((t: number) => {
    const r = svg.current?.getBoundingClientRect();
    const edge = r && r.width ? 1600 + ((window.innerWidth - r.right) * 1600) / r.width : 1600;
    const f = frame(t, edge);
    const set = (el: Element | null, attr: string, v: string | number) => el?.setAttribute(attr, String(v));
    set(els.cam.current, "transform", `translate(800 500) scale(${f.z}) translate(${-f.focus.x} ${-f.focus.y})`);
    set(els.mq.current, "transform", `translate(${f.mq.x} ${f.mq.y}) rotate(${f.mq.rot}) scale(${f.mq.sx} ${f.mq.sy}) translate(0 ${-MQ_TAIL})`);
    set(els.md.current, "transform", `translate(${f.mdCenter.x} ${f.mdCenter.y}) rotate(${f.md.rot}) translate(0 ${MD_BASE}) scale(${f.md.sx} ${f.md.sy}) translate(0 ${-MD_BASE})`);
    set(els.h1.current, "transform", `translate(${f.h1.x} ${f.h1.y}) rotate(${f.ropeAngle + f.wiggle}) scale(${f.handScale[0]})`);
    set(els.h2.current, "transform", `translate(${f.h2.x} ${f.h2.y}) rotate(${f.ropeAngle - f.wiggle}) scale(${f.handScale[1]})`);
    // The twist slides through his fists as he pulls.
    layRope(els.rope.current, f.rope, -f.pull);
    layRope(els.loop.current, LOOP, 0);
    set(els.rope.current, "opacity", f.ropeOpacity);
    set(els.loop.current, "opacity", f.ropeOpacity);
    const shadow = (el: SVGEllipseElement | null, x: number, y: number, rx: number) => {
      const near = clamp01(1 - (FL - y) / 600);
      set(el, "cx", x);
      set(el, "rx", rx * (0.45 + 0.55 * near));
      set(el, "opacity", 0.4 * near);
    };
    shadow(els.shMq.current, f.mq.x, f.mq.y, 270);
    shadow(els.shMd.current, f.md.x, f.md.y, 170);

    const p: [Pose, Pose] = [at(MQ_POSES, t), at(MD_POSES, t)];
    if (p.join() !== last.current.poses) {
      last.current.poses = p.join();
      setPoses(p);
    }
    const s = marqadorStep(t);
    if (s !== last.current.step) {
      last.current.step = s;
      setStep(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!play) return void draw(0);
    let raf = 0;
    const start = performance.now() - play.from * 1000;
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      draw(Math.min(t, T.end));
      if (t < T.end) raf = requestAnimationFrame(tick);
    };
    last.current.step = -1;
    draw(play.from);
    if (play.from < T.end) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, draw]);

  const done = step === 3;
  const instant = (play?.from ?? 0) >= T.end;
  const restart = (from: number) => setPlay((p) => ({ id: (p?.id ?? 0) + 1, from }));

  return (
    <div ref={scope} className="relative grid min-h-[100svh] place-items-center overflow-hidden px-4 pb-16 pt-20">
      <div className="mx-auto grid w-full max-w-[72rem] justify-items-center text-center">
        <svg ref={svg} viewBox="0 100 1600 800" className="w-[min(92vw,64rem,calc((100svh-27rem)*2))] overflow-visible" role="img" aria-label="MARQui tira de una soga con sus manitos y trae a MARQador, su módulo.">
          <defs>
            <radialGradient id="fist" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.7" stopColor="#eef2f1" />
              <stop offset="1" stopColor="#d6dedc" />
            </radialGradient>
            {/* One strand of the rope: lit on one side, so each twist reads as round. */}
            <linearGradient id="strand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e2b578" />
              <stop offset="0.45" stopColor="#c08a4c" />
              <stop offset="1" stopColor="#7d4f24" />
            </linearGradient>
            <filter id="md-shadow" x="-50%" y="-300%" width="200%" height="700%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>
          <g ref={els.cam}>
            <ellipse ref={els.shMq} cx={MQ.x} cy={FL + 6} rx={270} ry={22} fill="#000" opacity={0} filter="url(#md-shadow)" />
            <ellipse ref={els.shMd} cx={2400} cy={FL + 6} rx={170} ry={16} fill="#000" opacity={0} filter="url(#md-shadow)" />

            <g ref={els.md}>
              <MarquiLive who="marqador" pose={done ? live[1]! : poses[1]} shadow={false} svgProps={{ ...CHAR_MD, "aria-hidden": true }} />
              {/* The rope's loop round his middle. */}
              <Rope gref={els.loop} strands={70} />
            </g>

            <g ref={els.mq}>
              <MarquiLive pose={done ? live[0]! : poses[0]} shadow={false} svgProps={{ ...CHAR_MQ, "aria-hidden": true }} />
            </g>

            <Rope gref={els.rope} strands={300} />
            <g ref={els.h1}>
              <Fist id="fist" />
            </g>
            <g ref={els.h2}>
              <Fist id="fist" />
            </g>
          </g>
        </svg>

        <IntroTitle as="h2" lead="Presentamos" name="MARQador" shine="marqador-shine" shown={step >= 1} instant={instant} className="mt-4 text-[clamp(2.6rem,6.6vw,7.8rem)]" />
        <Typed key={play?.id ?? -1} text="Un módulo de MARQui: mira todas las conversaciones juntas y te muestra qué pide el mercado, dónde conviene invertir y a quién llamar primero." start={step >= 2} instant={instant} onDone={noop} />
      </div>

      {!reduce && play && <IntroControls done={done} onSkip={() => restart(T.end)} onReplay={() => restart(0)} />}
    </div>
  );
}
