import { useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ——— Presenting things one at a time ———
   GSAP + ScrollTrigger reveal the page as the presenter scrolls: titles rise
   line by line, blocks fade up, and <Steps> plays its [data-step] children in
   order, so a comparison or a diagram is told point by point. Reduced motion
   shows everything at once. */

const START = "top 82%";

/** Lines that rise out of a mask, one after another. */
export function RiseLines({ lines, className, delay = 0, as: Tag = "h2", id }: { lines: ReactNode[]; className?: string; delay?: number; as?: "h1" | "h2" | "h3"; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-line]", { yPercent: 108, duration: 1.1, delay, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: START, once: true } });
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className} id={id}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <span data-line className="block">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** A block that fades up when it reaches the screen. */
export function FadeUp({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, { y: 40, autoAlpha: 0, duration: 1, delay, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: START, once: true } });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Plays its [data-step] descendants in document order. Give a step
 * data-step="arrow" to draw it in from the left instead of rising.
 */
export function Steps({ children, className, as: Tag = "div", gap = 0.22 }: { children: ReactNode; className?: string; as?: ElementType; gap?: number }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 72%", once: true } });
        steps.forEach((el, i) => {
          const from = el.dataset.step === "arrow" ? { autoAlpha: 0, x: -24, scale: 0.6 } : { autoAlpha: 0, y: 28 };
          tl.from(el, { ...from, duration: 0.7, ease: "expo.out" }, i * gap);
        });
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
