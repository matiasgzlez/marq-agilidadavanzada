import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { animate, useMotionValue, type MotionValue } from "motion/react";
import { CloudShader } from "@/components/ui/cloud-shader";

/** Sky phases: 0 noon · 1 dusk · 2 night · 3 dawn. */
export const SKY = { noon: 0, dusk: 1, night: 2, dawn: 3 } as const;
const THEME = ["#0f7d72", "#b45521", "#031a18", "#0d6a61"];

type SkyApi = { phase: MotionValue<number>; goTo: (next: number) => void };
const SkyContext = createContext<SkyApi | null>(null);

export function useSky() {
  const api = useContext(SkyContext);
  if (!api) throw new Error("useSky needs <SkyProvider>");
  return api;
}

/**
 * Each section declares its hour with `data-sky`; whichever crosses the
 * middle of the viewport sets the sky. Sections can also steer it directly
 * (the day demo walks it from morning to dusk).
 */
export function SkyProvider({ children }: { children: ReactNode }) {
  const phase = useMotionValue<number>(SKY.noon);
  const current = useRef<number>(SKY.noon);

  const goTo = useCallback(
    (next: number) => {
      if (next === current.current) return;
      current.current = next;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      animate(phase, next, reduce ? { duration: 0 } : { duration: 2, ease: [0.45, 0, 0.2, 1] });
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME[next] ?? THEME[0]!);
    },
    [phase],
  );

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const next = Number((entry.target as HTMLElement).dataset.sky);
          if (!Number.isNaN(next)) goTo(next);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    const observe = () => document.querySelectorAll("[data-sky]").forEach((el) => io.observe(el));
    observe();
    // Sections swap their data-sky (the day demo) and panels mount later.
    const mo = new MutationObserver(() => {
      observe();
      document.querySelectorAll<HTMLElement>("[data-sky]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const mid = window.innerHeight / 2;
        if (r.top <= mid && r.bottom >= mid) goTo(Number(el.dataset.sky));
      });
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-sky"] });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [goTo]);

  const value = useMemo(() => ({ phase, goTo }), [phase, goTo]);
  return <SkyContext.Provider value={value}>{children}</SkyContext.Provider>;
}

export function SkyBackground() {
  const { phase } = useSky();
  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <CloudShader className="h-full w-full" timeOfDay={phase} cover={0.55} />
      {/* A steady veil plus a low vignette keep white headlines legible on the brightest cloud banks. */}
      <div className="pointer-events-none absolute inset-0 bg-[rgb(1_40_36/0.14)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_35%,transparent_35%,rgb(1_30_27/0.34))]" />
    </div>
  );
}
