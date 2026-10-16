import { useEffect, useRef, useState } from "react";
import type { Pose } from "./marqui-character";
import { bump, clamp01, easeIn, easeInOut, easeOut, inside, lerp, progress } from "./film";
import { MARQ_LOGO } from "./marq-logo";
import { MarquiLive } from "./marqui-live";

/* ——— The MARQ intro, like Pixar's lamp ———
   The wordmark sits on the floor. MARQui hops in from the right and stops
   beside the Q. He notices it, shakes himself and jumps on top. Three
   bounces push it a little further into the floor each time; a last, too-high
   jump crushes it flat. He looks around, a bit scared and confused, and then
   at us: he is the Q of MARQ now. The logo holds a few seconds, then the
   letters go, he hops to the middle growing to his hero size and
   "Presentamos MARQui" comes in underneath.

   Every value is a pure function of the time `t` (in seconds), so each beat
   can be retimed in one place and skipping just means drawing `INTRO_END`.

   Space is the logo's own (viewBox 0 0 1433 499): the floor is y = 441 and
   MARQui is drawn at the Q's size, so where he lands the logo still reads. */

const { floor: FL, q_height: QH, q_center: QC } = MARQ_LOGO;
const qTop = (k: number) => FL - QH * k;

/** MARQui at the Q's size: his head (r 194.6 in his own space) matches the ring. */
const S = 0.9435;
/** From the centre of his head to the bottom of the head (sitting on the Q) and to the tip of his tail (standing on the floor). */
const ON_HEAD = 194.6 * S;
const ON_TAIL = (737 - 525.2) * S;
/** Where he waits beside the Q, and how far right the camera starts so both fit. */
const WAIT_X = 1560;
const CAM0 = 200;
/** The middle of the stage, and how much bigger he is once he stands there alone. */
const CENTER_X = 710;
const HERO_SIZE = 1.55;

/** Each beat of the film, in seconds. */
const T = {
  logoIn: [0, 0.8],
  entry: [
    // [start, end, from x, to x, height]
    // Each hop lands on a thud of the soundtrack (1.505, 1.98, 2.45, 2.965 s).
    [1.03, 1.505, 3600, 2900, 190],
    [1.53, 1.98, 2900, 2380, 150],
    [2.0, 2.45, 2380, 1940, 120],
    [2.47, 2.965, 1940, WAIT_X, 70],
  ],
  recoil: [3.09, 3.64],
  // Timed to the soundtrack, measured to 5 ms: each landing on the Q is a thud
  // (6.145, 6.62, 7.085, 7.6 s) and the crush hits the floor on the big hit at 8.39 s.
  shake: [4.58, 5.18],
  crouch: [5.26, 5.48],
  onto: [5.48, 6.145],
  // [start, end, k while in the air, k once he lands]
  bounces: [
    [6.185, 6.62, 0.84, 0.7],
    [6.66, 7.085, 0.7, 0.56],
    [7.125, 7.6, 0.56, 0.42],
  ],
  crouch2: [7.64, 7.84],
  leap: [7.84, 8.29],
  crush: [8.29, 8.39],
  pan: [8.96, 10.16],
  // He is the Q for a while (from the crash at 8.4 s), then the letters go.
  logoOut: [12.06, 12.76],
  toCenter: [12.46, 13.21],
  // The title comes in as soon as he has settled in the Q; the sentence types itself a little later.
  headline: 8.86,
  copy: 11.26,
  end: 13.46,
} as const;

export const INTRO_END = T.end;
/** 0 film · 1 headline · 2 the sentence starts typing · 3 done, MARQui is alive. */
export function introStep(t: number) {
  return t >= T.end ? 3 : t >= T.copy ? 2 : t >= T.headline ? 1 : 0;
}

/** His face through the film (the body follows on its own springs). */
const POSES: [number, Pose][] = [
  [0, "izquierda"], // hopping in, looking where he is going
  [2.98, "reposo"],
  [3.09, "sorpresa"], // a Q!
  [3.55, "izquierda"], // looks at it
  [5.5, "reposo"],
  [6.145, "sorpresa"], // it gives under him
  [6.32, "alegria"], // and that is fun
  [7.6, "reposo"],
  [7.86, "alegria"],
  [8.33, "parpadeo"], // the crash
  [8.47, "sorpresa"],
  [9.06, "izquierda"], // where did it go?
  [9.66, "derecha"],
  [10.21, "sorpresa"],
  [10.46, "reposo"], // looks at us
  [10.86, "alegria"],
  [11.66, "reposo"],
  [12.41, "alegria"], // off to the middle
  [13.41, "reposo"],
];
const poseAt = (t: number) => POSES.reduce<Pose>((p, [at, pose]) => (t >= at ? pose : p), POSES[0]![1]);


/** Every landing: [time, how hard]. Each one squashes him and rings out. */
const LANDINGS: [number, number][] = [
  ...T.entry.map(([, end], i): [number, number] => [end, i === 3 ? 0.14 : 0.11]),
  [T.onto[1], 0.16],
  ...T.bounces.map(([, end]): [number, number] => [end, 0.14]),
  [T.crush[1], 0.3],
  [T.toCenter[1], 0.14],
];

/** The Q only ever goes down: each landing on it drops it to the next height. */
const Q_STEPS: [number, number, number][] = [[T.onto[1], 1, 0.84], ...T.bounces.map(([, end, before, after]): [number, number, number] => [end, before, after])];
function qAt(t: number) {
  if (t >= T.crush[0]) return 0.42 * (1 - easeIn(progress(T.crush, t)));
  let k = 1;
  for (const [at, before, after] of Q_STEPS) if (t >= at) k = lerp(before, after, easeOut(clamp01((t - at) / 0.14)));
  return k;
}

type Frame = { x: number; y: number; off: number; rot: number; sx: number; sy: number; size: number; k: number; cam: number; shake: number; logo: number };

export function introFrame(t: number): Frame {
  let x: number = WAIT_X;
  let y: number = FL;
  let off = ON_TAIL;
  let rot = 0;
  let sx = 1;
  let sy = 1;
  const k = qAt(t);
  // In the air he stretches along the jump and is roundest at the top.
  const air = (p: number) => {
    sy = 1 + 0.08 * Math.abs(1 - 2 * p);
    sx = 1 - 0.05 * Math.abs(1 - 2 * p);
  };

  if (t < T.entry[0]![0]) x = T.entry[0]![2];
  else if (t < T.onto[0]) {
    // Hopping in, one hop after another, each a little lower.
    for (const [a, b, x0, x1, h] of T.entry) {
      if (t >= b) x = x1;
      else if (t >= a) {
        const p = progress([a, b], t);
        x = lerp(x0, x1, p);
        y = FL - h * 4 * p * (1 - p);
        rot = -6 * bump(p);
        air(p);
        break;
      } else break;
    }
    // Leans back when he sees it, then shakes himself to get ready.
    if (inside(T.recoil, t)) rot = 6 * bump(progress(T.recoil, t));
    if (inside(T.shake, t)) {
      const p = progress(T.shake, t);
      rot = 8 * Math.sin(p * Math.PI * 2 * 3.5) * bump(p);
    }
    if (inside(T.crouch, t)) {
      const p = easeOut(progress(T.crouch, t));
      sy = 1 - 0.14 * p;
      sx = 1 + 0.1 * p;
    }
  } else if (t < T.onto[1]) {
    // Up onto the Q.
    const p = progress(T.onto, t);
    x = lerp(WAIT_X, QC.x, easeInOut(p) * 0.4 + p * 0.6);
    y = lerp(FL, qTop(1), p) - 380 * 4 * p * (1 - p);
    off = lerp(ON_TAIL, ON_HEAD, p);
    rot = -9 * bump(p);
    air(p);
  } else if (t < T.crush[1]) {
    x = QC.x;
    off = ON_HEAD;
    y = qTop(k);
    for (const [a, b, before] of T.bounces) {
      if (inside([a, b], t)) {
        const p = progress([a, b], t);
        y = qTop(before) - 120 * 4 * p * (1 - p);
        air(p);
      }
    }
    if (inside(T.crouch2, t)) {
      const p = easeOut(progress(T.crouch2, t));
      sy = 1 - 0.2 * p;
      sx = 1 + 0.14 * p;
    }
    if (inside(T.leap, t)) {
      // Too high this time.
      const p = progress(T.leap, t);
      y = qTop(0.42) - 300 * 4 * p * (1 - p);
      air(p);
    }
    if (inside(T.crush, t)) {
      // He comes down through it and takes it to the floor.
      const p = easeIn(progress(T.crush, t));
      y = lerp(qTop(0.42), FL, p);
      off = lerp(ON_HEAD, ON_TAIL, p);
      sy = 1.08;
      sx = 0.95;
    }
  } else if (t < T.toCenter[0]) {
    x = QC.x;
  } else {
    // Once the letters go, one happy hop to the middle, growing as he goes.
    const p = progress(T.toCenter, t);
    x = lerp(QC.x, CENTER_X, easeInOut(p));
    y = FL - 170 * 4 * p * (1 - p);
    rot = p < 1 ? -7 * bump(p) : 0;
    if (p < 1) air(p);
  }
  const size = lerp(1, HERO_SIZE, easeInOut(progress(T.toCenter, t)));

  // Landings squash him and ring out.
  for (const [at, amp] of LANDINGS) {
    const d = t - at;
    if (d < 0 || d > 1) continue;
    const q = amp * Math.exp(-9 * d) * Math.cos(22 * d);
    sy -= q;
    sx += 0.8 * q;
  }

  const crash = t - T.crush[1];
  const shake = crash > 0 && crash < 0.5 ? 9 * Math.exp(-10 * crash) * Math.sin(70 * crash) : 0;
  const cam = CAM0 * (1 - easeInOut(progress(T.pan, t)));
  const logo = easeOut(progress(T.logoIn, t)) * (1 - easeInOut(progress(T.logoOut, t)));

  return { x, y, off, rot, sx, sy, size, k, cam, shake, logo };
}

/* MARQui's own svg is placed with the centre of his head on (0, 0). */
const CHAR = { x: -(622.6 - 380) * S, y: -(525.2 - 240) * S, width: 470 * S, height: 590 * S };

/**
 * The stage. `play` restarts the film (from `from` seconds; `INTRO_END` skips
 * it); `livePose` is his face once it is over.
 */
export function MarqIntro({ play, livePose, onStep, onCharClick, className, clock }: { play: { id: number; from: number }; livePose: Pose; onStep: (step: number) => void; onCharClick?: () => void; className?: string; clock?: () => number | null }) {
  const clockRef = useRef(clock);
  clockRef.current = clock;
  const cam = useRef<SVGGElement>(null);
  const logo = useRef<SVGGElement>(null);
  const q = useRef<SVGPathElement>(null);
  const char = useRef<SVGGElement>(null);
  const shadow = useRef<SVGEllipseElement>(null);
  const [filmPose, setFilmPose] = useState<Pose>(poseAt(play.from));
  const [done, setDone] = useState(play.from >= T.end);
  const last = useRef({ pose: filmPose, step: -1 });
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  useEffect(() => {
    const draw = (t: number) => {
      const f = introFrame(t);
      cam.current?.setAttribute("transform", `translate(${-f.cam + f.shake} ${f.shake * 0.4})`);
      logo.current?.setAttribute("opacity", String(f.logo));
      logo.current?.setAttribute("transform", `translate(0 ${24 * (1 - f.logo)})`);
      logo.current?.style.setProperty("visibility", f.logo < 0.01 ? "hidden" : "visible");
      if (q.current) {
        // Squashed from the floor up, spreading a little as it goes.
        q.current.setAttribute("transform", `translate(${QC.x} ${FL}) scale(${1 + 0.3 * (1 - f.k)} ${Math.max(f.k, 0.001)}) translate(${-QC.x} ${-FL})`);
        q.current.style.visibility = f.k < 0.015 ? "hidden" : "visible";
      }
      char.current?.setAttribute("transform", `translate(${f.x} ${f.y}) rotate(${f.rot}) scale(${f.sx * f.size} ${f.sy * f.size}) translate(0 ${-f.off})`);
      if (shadow.current) {
        const near = clamp01(1 - (FL - f.y) / 700);
        shadow.current.setAttribute("cx", String(f.x));
        shadow.current.setAttribute("rx", String(150 * S * f.size * (0.45 + 0.55 * near)));
        shadow.current.setAttribute("opacity", String(0.32 * near));
      }
      const pose = poseAt(t);
      if (pose !== last.current.pose) setFilmPose((last.current.pose = pose));
      const step = introStep(t);
      if (step !== last.current.step) {
        last.current.step = step;
        setDone(step === 3);
        onStepRef.current(step);
      }
    };

    let raf = 0;
    const start = performance.now() - play.from * 1000;
    let start0 = start;
    const tick = (now: number) => {
      // When the soundtrack plays, it is the master clock: the picture follows the sound,
      // re-locking whenever they drift more than 15 ms apart.
      const audioT = clockRef.current?.();
      if (audioT != null) {
        const ours = (now - start0) / 1000;
        if (Math.abs(ours - audioT) > 0.015) start0 = now - audioT * 1000;
      }
      const t = (now - start0) / 1000;
      draw(Math.min(t, T.end));
      if (t < T.end) raf = requestAnimationFrame(tick);
    };
    last.current.step = -1;
    draw(play.from);
    if (play.from < T.end) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);

  return (
    <svg viewBox="-60 -340 1540 830" className={className} overflow="visible" role="img" aria-label="El logo de MARQ. MARQui entra saltando, aplasta la Q y se queda en su lugar.">
      <defs>
        <filter id="intro-shadow" x="-50%" y="-300%" width="200%" height="700%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <g ref={cam}>
        <ellipse ref={shadow} cx={WAIT_X} cy={FL + 4} rx={140} ry={16} fill="#012a27" opacity={0} filter="url(#intro-shadow)" />
        <g ref={logo} fill="#fff" opacity={0}>
          <path d={MARQ_LOGO.m} />
          <path d={MARQ_LOGO.a} />
          <path d={MARQ_LOGO.r} />
          <path d={MARQ_LOGO.tagline} />
          <path ref={q} d={MARQ_LOGO.q} />
        </g>
        <g ref={char} onClick={done ? onCharClick : undefined} className={done ? "cursor-pointer" : undefined}>
          <MarquiLive pose={done ? livePose : filmPose} shadow={false} svgProps={{ ...CHAR, "aria-hidden": true }} />
        </g>
      </g>
    </svg>
  );
}
