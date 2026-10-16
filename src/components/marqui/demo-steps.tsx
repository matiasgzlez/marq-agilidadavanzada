import { useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Presenter-paced demos. Each feature demo is cut into steps and waits for you:
 * the ‹ › buttons (or ← → on the keyboard) play the next step, so you explain at
 * your own pace. Going back replays the step before. Step 0 is the scene at rest.
 */

/* The demos on screen, newest last: the arrow keys drive only the last one that came into view. */
const onScreen: string[] = [];

/** `onEnd`: what → does on the last step. Without it, the demo starts over. */
export function useDemoSteps(count: number, inView: boolean, start = 0, onEnd?: () => void) {
  const id = useId();
  const [step, setStep] = useState(start);
  // Read by the key handler without re-registering it on every step.
  const now = useRef({ step, onEnd });
  now.current = { step, onEnd };
  const go = (d: number) => setStep((x) => Math.min(Math.max(x + d, 0), count));
  const restart = () => setStep(0);

  useEffect(() => {
    if (!inView) return;
    onScreen.push(id);
    const onKey = (e: KeyboardEvent) => {
      if (onScreen[onScreen.length - 1] !== id) return;
      if ((e.target as HTMLElement).closest("textarea, input")) return;
      if (e.key === "ArrowRight") {
        const { step: at, onEnd: handOff } = now.current;
        if (at >= count && handOff) handOff();
        else setStep((x) => (x >= count ? 0 : x + 1));
      }
      if (e.key === "ArrowLeft") setStep((x) => Math.max(x - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      onScreen.splice(onScreen.indexOf(id), 1);
    };
  }, [inView, id, count]);

  return { step, go, restart };
}

/** Runs a step's beats on a clock, and cancels them if you move on before they finish. */
export function useBeats(fn: (at: (ms: number, beat: () => void) => void) => void, deps: unknown[]) {
  useEffect(() => {
    const ids: number[] = [];
    fn((ms, beat) => ids.push(window.setTimeout(beat, ms)));
    return () => ids.forEach(clearTimeout);
  }, deps);
}

/** ‹ 2 / 4 › with what this step shows. `labels[0]` describes the scene at rest. `next` replaces "start over" on the last step. */
export function StepControls({ step, labels, go, restart, next, className }: { step: number; labels: string[]; go: (d: number) => void; restart: () => void; next?: { label: string; onClick: () => void }; className?: string }) {
  const last = labels.length - 1;
  const done = step >= last;
  return (
    <div className={cn("mx-auto mt-5 flex w-fit max-w-full items-center gap-1 rounded-full bg-[#111b21]/80 p-1.5 text-white shadow-[0_1rem_2rem_-1rem_rgb(0_0_0/0.5)] backdrop-blur", className)}>
      <button type="button" onClick={() => go(-1)} disabled={step === 0} aria-label="Paso anterior" className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/15 disabled:cursor-default disabled:opacity-30">
        <ChevronLeft className="size-5" />
      </button>
      <span className="min-w-0 px-2 text-center leading-tight" aria-live="polite">
        <span className="block text-[0.7rem] font-medium tabular-nums text-white/55">
          {step === 0 ? "Listo para empezar" : `Paso ${step} de ${last}`}
        </span>
        <span className="block text-[0.95rem] font-medium">{labels[step]}</span>
      </span>
      {done && next ? (
        <button type="button" onClick={next.onClick} className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[#25d366] pl-4 pr-2.5 text-[0.85rem] font-semibold text-[#0b2e1a] transition-colors hover:bg-[#3ee07a]">
          {next.label}
          <ChevronRight className="size-5" />
        </button>
      ) : done ? (
        <button type="button" onClick={restart} aria-label="Volver a empezar" className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white/15 transition-colors hover:bg-white/25">
          <RotateCcw className="size-[1.1rem]" />
        </button>
      ) : (
        <button type="button" onClick={() => go(1)} aria-label="Paso siguiente" className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-[#25d366] text-[#0b2e1a] transition-colors hover:bg-[#3ee07a]">
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}
