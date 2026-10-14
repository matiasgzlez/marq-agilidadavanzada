import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MarquiLive } from "./marqui-live";

/* ——— MARQui's poses ———
   The ten poses of the brand artwork (reference images live in
   docs/marqui-poses). <MarquiLive> draws them as one vector character. */

export const POSES = ["reposo", "parpadeo", "guino", "alegria", "sorpresa", "pensando", "izquierda", "derecha", "inclinado", "salto"] as const;
export type Pose = (typeof POSES)[number];

/**
 * Keeps MARQui alive while `active`: mostly at rest, a blink every few
 * seconds and, now and then, a glance to one side. `base` is the pose he
 * returns to; `override` wins while it is set (a reaction).
 */
export function useMarquiLife({ active = true, base = "reposo", override }: { active?: boolean; base?: Pose; override?: Pose | null } = {}): Pose {
  const [pose, setPose] = useState<Pose>(base);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    clear();
    setPose(override ?? base);
    if (!active || override || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return clear;

    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    const loop = () => {
      const wait = 2600 + Math.random() * 2200;
      const roll = Math.random();
      if (roll < 0.62) {
        // Blink.
        at(wait, () => setPose("parpadeo"));
        at(wait + 140, () => setPose(base));
      } else if (roll < 0.92) {
        // A glance to one side.
        const side: Pose = Math.random() < 0.5 ? "izquierda" : "derecha";
        at(wait, () => setPose(side));
        at(wait + 1100, () => setPose(base));
      } else {
        // A small thought.
        at(wait, () => setPose("pensando"));
        at(wait + 1300, () => setPose(base));
      }
      at(wait + 1400, loop);
    };
    loop();
    return clear;
  }, [active, base, override]);

  return pose;
}

/** MARQui's profile picture: the 3D character on a teal disc, like a WhatsApp avatar. */
export function MarquiBadge({ pose = "reposo", className }: { pose?: Pose; className?: string }) {
  return (
    <span className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#00a390,#008c7e_55%,#014645)]", className)}>
      {/* The head sits in the middle of the disc; the tail peeks out. */}
      <MarquiLive pose={pose} shadow={false} className="absolute left-[5%] top-[-2.7%] w-[87%]" />
    </span>
  );
}
