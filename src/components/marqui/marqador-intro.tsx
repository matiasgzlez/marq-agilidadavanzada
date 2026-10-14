import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useAnimate, useInView, useReducedMotion, type AnimationPlaybackControls, type AnimationSequence } from "motion/react";
import { MARQ_LETTERS, MARQ_Q, MARQ_TAGLINE, MARQ_VIEWBOX, Q_CENTER } from "./brand";
import { MARQADOR, MarqadorEye, MarqadorGradient } from "./marqador-mark";

/* ——— From MARQ to MARQador ———
   Plays on its own each time the section comes into view, no scroll
   hijacking: the tagline drops, a light eraser wipes "r", "a" and "m", the
   Q travels to the centre, grows and wakes
   up: the ring fills in and becomes MARQador, orange with MARQ's tail, and
   opens his eyes. Then he stays alive: he floats, blinks and glances
   around. Tap him to replay. */

// The stage is taller than the logo so the Q has room to grow.
const VB = { x: 0, y: -300, w: MARQ_VIEWBOX.w, h: 1060 };
const TARGET = { x: VB.w / 2, y: 140, scale: 1.62 };
const MOVE = { x: TARGET.x - Q_CENTER.x, y: TARGET.y - Q_CENTER.y };
// MARQador's own mark, placed so his head lands exactly on the grown Q.
const K = (Q_CENTER.r * TARGET.scale) / MARQADOR.head.r;
const PLACE = `translate(${TARGET.x - MARQADOR.head.cx * K} ${TARGET.y - MARQADOR.head.cy * K}) scale(${K})`;
const pivot = { transformBox: "fill-box", transformOrigin: "50% 50%" } as const;
const order = ["r", "a", "m"] as const;
// Where each clip starts and how wide it is: the eraser travels its width.
const clips = { m: { x: 40, w: 510 }, a: { x: 545, w: 300 }, r: { x: 860, w: 150 } };
const WORD = "MARQador";
const inOut = [0.65, 0, 0.35, 1] as const;
const out = [0.16, 1, 0.3, 1] as const;
const now = { duration: 0 };

export function MarqadorIntro() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, { amount: 0.55 });
  const reduce = useReducedMotion();
  const running = useRef<AnimationPlaybackControls[]>([]);

  const stopAll = () => {
    running.current.forEach((a) => a.stop());
    running.current = [];
  };

  /** Back to the first frame: the whole MARQ logo. */
  const reset = () => {
    stopAll();
    animate("[data-tag]", { opacity: 1, y: 0 }, now);
    for (const k of order) {
      animate(`[data-clip='${k}']`, { width: clips[k].w }, now);
      animate(`[data-letter='${k}']`, { x: 0, opacity: 1 }, now);
      animate(`[data-sweep='${k}']`, { x: 0, opacity: 0 }, now);
    }
    animate("[data-float]", { y: 0 }, now);
    animate("[data-q]", { x: 0, y: 0, scale: 1, rotate: 0 }, now);
    animate("[data-q]", { opacity: 1 }, now);
    animate("[data-fill]", { scale: 0 }, now);
    animate("[data-mark]", { opacity: 0 }, now);
    animate("[data-eye]", { scale: 0 }, now);
    animate("[data-look]", { x: 0, y: 0 }, now);
    animate("[data-char]", { y: "110%" }, now);
  };

  /** For reduced motion: the finished frame, still. */
  const finalFrame = () => {
    stopAll();
    animate("[data-tag], [data-letter]", { opacity: 0 }, now);
    animate("[data-q]", { x: MOVE.x, y: MOVE.y, scale: TARGET.scale }, now);
    animate("[data-q]", { opacity: 0 }, now);
    animate("[data-mark]", { opacity: 1 }, now);
    animate("[data-eye]", { scale: 1 }, now);
    animate("[data-char]", { y: "0%" }, now);
  };

  const play = async () => {
    reset();
    const sequence: AnimationSequence = [
      // "CREAMOS VALOR" drops away.
      ["[data-tag]", { opacity: 0, y: 24 }, { duration: 0.45, ease: "easeIn", at: 0.6 }],
      // m, a, r are wiped right to left by a light eraser, last letter first.
      ...order.flatMap((k, i): AnimationSequence => {
        const at = 0.95 + i * 0.32;
        return [
          [`[data-sweep='${k}']`, { opacity: 1 }, { duration: 0.12, at }],
          [`[data-clip='${k}']`, { width: 0 }, { duration: 0.75, ease: inOut, at }],
          [`[data-sweep='${k}']`, { x: -clips[k].w }, { duration: 0.75, ease: inOut, at }],
          [`[data-letter='${k}']`, { x: -36 }, { duration: 0.75, ease: inOut, at }],
          [`[data-sweep='${k}']`, { opacity: 0 }, { duration: 0.15, at: at + 0.65 }],
        ];
      }),
      // The Q travels to the middle and grows, with a small swing.
      ["[data-q]", { x: MOVE.x, y: MOVE.y, scale: TARGET.scale, rotate: [0, -8, 0] }, { duration: 1.3, ease: inOut, at: 2.4 }],
      // The ring fills in…
      ["[data-fill]", { scale: [0, 1.04, 1] }, { duration: 0.45, ease: out, at: 3.55 }],
      // …and turns into MARQador: orange, with MARQ's tail.
      ["[data-mark]", { opacity: 1 }, { duration: 0.55, ease: "easeInOut", at: 3.9 }],
      ["[data-q]", { opacity: 0 }, { duration: 0.4, at: 4.15 }],
      // He opens his eyes.
      ["[data-eye='0']", { scale: [0, 1.2, 1] }, { duration: 0.45, ease: out, at: 4.35 }],
      ["[data-eye='1']", { scale: [0, 1.2, 1] }, { duration: 0.45, ease: out, at: 4.45 }],
      ...Array.from({ length: WORD.length }, (_, i): AnimationSequence[number] => [`[data-char='${i}']`, { y: "0%" }, { duration: 0.7, ease: out, at: 4.5 + i * 0.045 }]),
    ];
    const story = animate(sequence);
    running.current.push(story);
    await story;
    if (!running.current.includes(story)) return;
    // Alive: a slow float, a blink every few seconds and a glance now and then.
    running.current.push(animate("[data-float]", { y: [0, -16, 0] }, { duration: 5, repeat: Infinity, ease: "easeInOut" }));
    running.current.push(animate("[data-eye]", { scaleY: [1, 1, 0.12, 1] }, { duration: 3.6, times: [0, 0.9, 0.94, 1], repeat: Infinity, delay: 0.6 }));
    running.current.push(animate("[data-look]", { x: [0, 0, -22, -22, 0], y: [0, 0, 10, 10, 0] }, { duration: 7, times: [0, 0.55, 0.62, 0.85, 0.92], repeat: Infinity, ease: inOut }));
  };

  // Each time the section arrives on screen, the story plays again.
  useEffect(() => {
    if (!scope.current) return;
    if (reduce) finalFrame();
    else if (inView) void play();
    else reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  useEffect(() => stopAll, []);

  return (
    <div ref={scope} className="relative grid min-h-[100svh] place-items-center overflow-hidden pb-10 pt-28">
      <button type="button" onClick={() => !reduce && void play()} className="relative grid cursor-pointer place-items-center rounded-[3rem] outline-offset-8" aria-label="Ver otra vez cómo MARQ se convierte en MARQador">
        <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="w-[min(92vw,100svh)] overflow-visible" aria-hidden>
          <defs>
            <MarqadorGradient id="marqador-intro-grad" />
            {/* One clip per letter; shrinking its width wipes the letter away. */}
            {order.map((k) => (
              <clipPath key={k} id={`clip-${k}`}>
                <rect data-clip={k} x={clips[k].x} y="80" width={clips[k].w} height="260" />
              </clipPath>
            ))}
          </defs>

          {MARQ_TAGLINE.map((d, i) => (
            <path key={i} data-tag d={d} fill="#fff" />
          ))}
          {(["m", "a", "r"] as const).map((k) => (
            <g key={k} clipPath={`url(#clip-${k})`}>
              <path data-letter={k} d={MARQ_LETTERS[k]} fill="#fff" />
            </g>
          ))}
          {order.map((k) => (
            <rect key={k} data-sweep={k} x={clips[k].x + clips[k].w - 5} y="70" width="10" height="280" rx="5" fill="#fff" opacity="0" style={{ filter: "drop-shadow(0 0 16px #ffd2a8) drop-shadow(0 0 4px #fff)" }} />
          ))}

          <g data-float>
            <g data-q style={pivot}>
              <path d={MARQ_Q} fill="#fff" />
              {/* Fills the ring's hole: the Q becomes solid. */}
              <circle data-fill cx={Q_CENTER.x} cy={Q_CENTER.y} r={128} fill="#fff" style={pivot} />
            </g>
            <g transform={PLACE}>
              <g data-mark opacity="0">
                <path d={MARQADOR.body} fill="url(#marqador-intro-grad)" />
                <g data-look>
                  {MARQADOR.eyes.map((e, i) => (
                    <MarqadorEye key={i} eye={e} data-eye={i} style={pivot} />
                  ))}
                </g>
              </g>
            </g>
          </g>
        </svg>

        <h2 className="display sky-type absolute inset-x-0 bottom-[3%] text-center text-[clamp(2.6rem,7vw,8.2rem)]" aria-label={WORD}>
          {WORD.split("").map((c, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.14em] align-bottom" aria-hidden>
              <span data-char={i} className={cn("inline-block", i >= 4 && "font-[350]")} style={{ transform: "translateY(110%)" }}>
                {c}
              </span>
            </span>
          ))}
        </h2>
      </button>

      <p className="eyebrow absolute left-4 top-24 flex items-center gap-3 text-white sm:left-8 lg:left-12">
        <span className="grid h-7 min-w-7 place-items-center rounded-full bg-white px-2 text-ink">03</span> El tablero
      </p>
    </div>
  );
}
