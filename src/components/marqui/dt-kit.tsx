import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { FadeUp, ease } from "./primitives";

/* ——— Design thinking, shared pieces ——— */

export const TECHNIQUES = [
  { id: "clustering", n: 1, name: "Clustering", phase: "Definir", text: "Ordenar la entrevista" },
  { id: "personas", n: 2, name: "Personas", phase: "Definir", text: "Quién nos escribe" },
  { id: "journey", n: 3, name: "Customer Journey", phase: "Empatizar", text: "Dónde se pierde el prospecto" },
  { id: "como-podriamos", n: 4, name: "¿Cómo podríamos…?", phase: "Definir e Idear", text: "Del problema a las ideas" },
  { id: "prototipo", n: 5, name: "Prototipo", phase: "Prototipar", text: "Probar la propuesta" },
] as const;

export type TechniqueId = (typeof TECHNIQUES)[number]["id"];

/* One idea per note, in the board's yellow. */
export const STICKY = "rounded-[0.3rem] bg-[#fff3a3] text-[#3d3208] shadow-[0_0.15rem_0.2rem_rgb(0_0_0/0.06),0_0.6rem_1.2rem_-0.5rem_rgb(0_0_0/0.25)]";

/** Which technique this is and its Design Thinking stage, in the same pill as the header switch. */
export function TechniquePill({ id }: { id: TechniqueId }) {
  const t = TECHNIQUES.find((x) => x.id === id)!;
  return (
    <FadeUp className="flex justify-center">
      <span className="inline-flex items-center gap-2.5 rounded-full bg-ink/85 py-1.5 pl-1.5 pr-5 text-[clamp(0.95rem,1.05vw,1.1rem)] font-medium text-white ring-1 ring-white/15">
        <span className="grid size-8 place-items-center rounded-full bg-[linear-gradient(135deg,#19d3b4,#014645)] text-[0.9rem] font-semibold">{t.n}</span>
        Técnica {t.n} de {TECHNIQUES.length}
        <span className="text-white/55">· Etapa: {t.phase}</span>
      </span>
    </FadeUp>
  );
}

/** Wide enough to pin a stage to the screen and drive it with the scroll. */
export function useWide() {
  const query = "(min-width: 1024px) and (min-height: 600px)";
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setWide(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return wide;
}

/**
 * A stage pinned to the screen while you scroll past it: each stretch of
 * scroll plays the next step, so whoever presents (or records the video)
 * only has to scroll. On small screens it isn't pinned: it shows its last step.
 */
export function Scrolly({ steps, children, className }: { steps: number; children: (step: number) => ReactNode; className?: string }) {
  const wide = useWide();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(Math.min(steps - 1, Math.max(0, Math.floor(v * steps)))));

  if (!wide) return <div className={className}>{children(steps - 1)}</div>;
  return (
    <div ref={ref} className="relative" style={{ height: `${steps * 75 + 45}svh` }}>
      <div className={cn("sticky top-0 flex h-svh flex-col pb-5 pt-[4.5rem]", className)}>{children(step)}</div>
    </div>
  );
}

/** What the current step shows, in the words we'd say over it, with a dot per step. */
export function StageCaption({ step, steps, title, text }: { step: number; steps: number; title: ReactNode; text?: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-[60rem] shrink-0 justify-items-center text-center">
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: steps }, (_, i) => (
          <span key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i === step ? "w-8 bg-white" : "w-1.5 bg-white/40")} />
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }} className="mt-3" aria-live="polite">
          <h4 className="display sky-type text-[clamp(1.7rem,2.8vw,3rem)]">{title}</h4>
          {text && <p className="sky-type mx-auto mt-1.5 max-w-[52rem] text-balance text-[clamp(1rem,1.2vw,1.25rem)] font-medium leading-snug text-white/85">{text}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** A part of the technique (¿Por qué…? ¿Cómo…? ¿Qué…?), big on the sky. */
export function PartTitle({ id, children, sub }: { id?: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <FadeUp className="mx-auto max-w-[56rem] text-center">
      <h3 id={id} className="display sky-type text-[clamp(2.4rem,4.4vw,4.8rem)]">
        {children}
      </h3>
      {sub && <p className="sky-type mt-4 text-balance text-[clamp(1.1rem,1.5vw,1.6rem)] font-medium leading-snug text-white/85">{sub}</p>}
    </FadeUp>
  );
}

/** A few short, numbered lines, big on the sky: the on-screen version of a paragraph we say out loud. */
export function BigList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((x, i) => (
        <li key={x} className="sky-type flex items-center gap-4 text-[clamp(1.4rem,2.2vw,2.4rem)] font-semibold leading-tight tracking-[-0.02em]">
          <span className="grid size-[1.6em] shrink-0 place-items-center rounded-full bg-white text-[0.55em] font-semibold text-ink">{i + 1}</span>
          {x}
        </li>
      ))}
    </ul>
  );
}
