import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FastForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "./primitives";

/* ——— What both intros share ———
   The title that lands letter by letter with the name in its shine, the
   sentence that types itself out, and the two quiet controls: skip while the
   film runs, a faint reload icon once it is over. */

/**
 * `lead` rises letter by letter out of a blur; `name` lands a beat later,
 * out of focus and a little big, and settles into its shine (`shine` is the
 * CSS class with the moving gradient).
 */
export function IntroTitle({ lead, name, shine, shown, instant, as: Tag = "h1", className }: { lead: string; name: string; shine: string; shown: boolean; instant: boolean; as?: "h1" | "h2"; className?: string }) {
  const t = (delay: number, duration: number) => ({ duration: instant ? 0 : duration, delay: shown && !instant ? delay : 0, ease });
  return (
    <Tag className={cn("display sky-type text-[clamp(2.8rem,7.4vw,8.4rem)] font-bold", className)} aria-label={`${lead} ${name}`}>
      <span aria-hidden className="inline-block whitespace-nowrap">
        {[...lead].map((c, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={false}
            animate={shown ? { opacity: 1, y: "0em", rotate: 0, filter: "blur(0px)" } : { opacity: 0, y: "0.45em", rotate: 8, filter: "blur(10px)" }}
            transition={t(i * 0.035, 0.8)}
          >
            {c}
          </motion.span>
        ))}
      </span>{" "}
      <motion.span
        aria-hidden
        className={cn(shine, "inline-block")}
        initial={false}
        animate={
          shown
            ? { opacity: 1, scale: 1, y: "0em", filter: "blur(0px) drop-shadow(0px 4px 12px rgba(1, 30, 27, 0.3))" }
            : { opacity: 0, scale: 1.18, y: "0.1em", filter: "blur(16px) drop-shadow(0px 0px 0px rgba(1, 30, 27, 0))" }
        }
        transition={t(0.5, 1.1)}
      >
        {name}
      </motion.span>
    </Tag>
  );
}

/**
 * The sentence types itself out, fast, with a caret. The whole text is laid
 * out from the start (the rest is invisible), so nothing below it moves.
 */
export function Typed({ text, start, instant, onDone, className }: { text: string; start: boolean; instant: boolean; onDone: (done: boolean) => void; className?: string }) {
  const [n, setN] = useState(instant ? text.length : 0);

  useEffect(() => {
    if (instant) return setN(text.length);
    if (!start) return setN(0);
    let i = 0;
    let id = 0;
    const tick = () => {
      // One or two letters at a time, a short breath after punctuation.
      i = Math.min(text.length, i + (Math.random() < 0.35 ? 2 : 1));
      setN(i);
      if (i < text.length) id = window.setTimeout(tick, 9 + Math.random() * 16 + (/[,.:]/.test(text[i - 1]!) ? 110 : 0));
    };
    id = window.setTimeout(tick, 0);
    return () => clearTimeout(id);
  }, [start, instant, text]);

  useEffect(() => onDone(n >= text.length), [n, text.length, onDone]);

  const typing = start && !instant && n < text.length;
  return (
    <p className={cn("sky-type mt-6 max-w-[46rem] text-balance text-[clamp(1.2rem,2vw,2.1rem)] font-medium leading-[1.3] text-white/85", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.slice(0, n)}
        {typing && (
          <span className="relative">
            <span className="absolute left-[0.05em] top-[0.05em] h-[1.1em] w-[0.09em] rounded-full bg-white" />
          </span>
        )}
        <span className="opacity-0">{text.slice(n)}</span>
      </span>
    </p>
  );
}

/** "Saltar intro" while it plays; once it is over, only a faint reload icon in the corner. */
export function IntroControls({ done, onSkip, onReplay }: { done: boolean; onSkip: () => void; onReplay: () => void }) {
  return done ? (
    <button type="button" onClick={onReplay} aria-label="Ver la intro de nuevo" title="Ver la intro de nuevo" className="absolute bottom-5 right-5 grid size-9 place-items-center rounded-full opacity-[0.18] transition-opacity hover:opacity-60 focus-visible:opacity-80">
      <img src="/assets/reload.png" alt="" className="size-4" />
    </button>
  ) : (
    <button type="button" onClick={onSkip} className="absolute bottom-6 right-6 inline-flex h-10 items-center gap-2 rounded-full bg-white/15 px-4 text-[0.9rem] font-medium text-white backdrop-blur transition-colors hover:bg-white/25">
      <FastForward className="size-4" aria-hidden />
      Saltar intro
    </button>
  );
}
