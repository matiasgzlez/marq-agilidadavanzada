import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useAnimate, useInView, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { useMarquiLife, type Pose } from "./marqui-character";
import { MarquiLive } from "./marqui-live";

/* ——— MARQui says hi ———
   The 3D character, alive. When the section arrives he jumps in, lands
   happy and settles; then he blinks, glances around and floats. Hover and
   he is surprised; tap him and he jumps for joy. */

const WORD = "MARQui";
const out = [0.16, 1, 0.3, 1] as const;
const now = { duration: 0 };

export function MarquiIntro() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, { amount: 0.55 });
  const reduce = useReducedMotion();
  const running = useRef<AnimationPlaybackControls[]>([]);
  const timers = useRef<number[]>([]);
  const [alive, setAlive] = useState(false);
  const [reaction, setReaction] = useState<Pose | null>("salto");
  const pose = useMarquiLife({ active: alive, override: reaction });

  const stopAll = () => {
    running.current.forEach((a) => a.stop());
    running.current = [];
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const reset = () => {
    stopAll();
    setAlive(false);
    setReaction("salto");
    animate("[data-body]", { y: 120, scale: 0.6, opacity: 0, rotate: 0 }, now);
    animate("[data-float]", { y: 0 }, now);
    animate("[data-char]", { y: "110%" }, now);
    animate("[data-sub]", { opacity: 0, y: 12 }, now);
  };

  const enter = () => {
    reset();
    // He jumps in from below, lands with a squash and smiles.
    running.current.push(
      animate("[data-body]", { y: [120, 0], scale: [0.6, 1], opacity: [0, 1] }, { duration: 0.7, ease: out, delay: 0.25 }),
    );
    later(950, () => setReaction("alegria"));
    later(2100, () => {
      setReaction(null);
      setAlive(true);
      running.current.push(animate("[data-float]", { y: [0, -14, 0] }, { duration: 4.6, repeat: Infinity, ease: "easeInOut" }));
    });
    WORD.split("").forEach((_, i) => running.current.push(animate(`[data-char='${i}']`, { y: "0%" }, { duration: 0.7, ease: out, delay: 1.0 + i * 0.05 })));
    running.current.push(animate("[data-sub]", { opacity: 1, y: 0 }, { duration: 0.6, ease: out, delay: 1.45 }));
  };

  const finalFrame = () => {
    stopAll();
    setReaction(null);
    animate("[data-body]", { y: 0, scale: 1, opacity: 1 }, now);
    animate("[data-char]", { y: "0%" }, now);
    animate("[data-sub]", { opacity: 1, y: 0 }, now);
  };

  /** Tap: a jump for joy. */
  const cheer = () => {
    if (reduce || !alive) return;
    setReaction("salto");
    later(420, () => setReaction("alegria"));
    later(1700, () => setReaction(null));
  };

  useEffect(() => {
    if (!scope.current) return;
    if (reduce) finalFrame();
    else if (inView) enter();
    else reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  useEffect(() => stopAll, []);

  return (
    <div ref={scope} className="relative grid min-h-[100svh] place-items-center overflow-hidden pb-10 pt-28">
      <button
        type="button"
        onClick={cheer}
        onPointerEnter={() => alive && !reduce && setReaction((r) => r ?? "sorpresa")}
        onPointerLeave={() => setReaction((r) => (r === "sorpresa" ? null : r))}
        className="relative grid cursor-pointer place-items-center gap-[1svh] rounded-[3rem] outline-offset-8"
        aria-label="Saludar a MARQui"
      >
        <span data-float className="block">
          <span data-body className="block" style={{ opacity: 0 }}>
            <MarquiLive pose={pose} follow className="w-[min(70vw,46svh,30rem)]" />
          </span>
        </span>

        <span className="-mt-[2svh] grid justify-items-center gap-2">
          <span className="display sky-type text-center text-[clamp(2.6rem,7vw,8.2rem)]" aria-label={WORD}>
            {WORD.split("").map((c, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.14em] align-bottom" aria-hidden>
                <span data-char={i} className={cn("inline-block", i >= 4 && "font-[350]")} style={{ transform: "translateY(110%)" }}>
                  {c}
                </span>
              </span>
            ))}
          </span>
          <span data-sub className="rounded-full bg-paper px-5 py-2 text-[clamp(1rem,1.3vw,1.35rem)] font-semibold tracking-[0.04em] text-ink" style={{ opacity: 0 }}>
            Asistente de MARQ
          </span>
        </span>
      </button>

      <p className="eyebrow absolute left-4 top-24 flex items-center gap-3 text-white sm:left-8 lg:left-12">
        <span className="grid h-7 min-w-7 place-items-center rounded-full bg-white px-2 text-ink">01</span> Qué es MARQui
      </p>
    </div>
  );
}
