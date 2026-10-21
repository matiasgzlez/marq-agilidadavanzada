import { ArrowRight } from "lucide-react";
import { MarqLogo } from "./primitives";
import { Clustering } from "./dt-clustering";
import { Learnings } from "./dt-learnings";
import { Opening } from "./dt-opening";
import { Journey } from "./dt-journey";
import { Personas } from "./dt-personas";

/* ——— Design thinking ———
   The road from the interview to MARQui, one technique after the other,
   and what we learned along the way. Each technique lives in its own file. */

export function ThinkingPanel({ onGoToSolution }: { onGoToSolution?: () => void }) {
  return (
    <div id="panel-thinking" role="tabpanel" aria-label="Design thinking">
      <Opening />
      <Clustering />
      <Personas />
      <Journey />
      <Learnings />

      <footer className="relative -mx-4 flex flex-wrap items-center justify-between gap-3 bg-ink px-6 py-5 text-[0.95rem] text-white/75 sm:-mx-8 lg:-mx-12 lg:px-12">
        <MarqLogo className="h-7" />
        <span>Design Thinking · MARQui · Agilidad avanzada · 2026</span>
        {onGoToSolution && (
          <button onClick={onGoToSolution} className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-white transition-colors hover:text-teal-bright">
            <span>Ver la solución: MARQui</span>
            <ArrowRight className="size-4" />
          </button>
        )}
      </footer>
    </div>
  );
}
