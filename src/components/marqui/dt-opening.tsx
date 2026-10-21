import { cn } from "@/lib/utils";
import { FadeUp, Section } from "./primitives";
import { Lead } from "./story";
import { TECHNIQUES } from "./dt-kit";
import { SKY } from "./sky";

/* ——— Design thinking, opening ———
   The brief had no problem in it: finding one was the job. Under it, the
   road: five techniques in one light tile, each a stop that links down. */

/* Techniques already told on the page; the others show on the road but don't link yet. */
const READY = new Set<string>(["clustering", "personas"]);

export function Opening() {
  return (
    <Section sky={SKY.noon} id="dt-inicio" className="pb-16 pt-40 sm:pb-24 sm:pt-52" aria-labelledby="dt-title">
      <Lead id="dt-title" title={["No nos dieron un problema.", <em key="e">Lo tuvimos que encontrar.</em>]}>
        MARQ nos pidió una consultoría con Design Thinking, pero sin un problema definido. Primero tuvimos que encontrarlo y validarlo con ellos. Para eso usamos cinco técnicas, que explicamos acá una por una.
      </Lead>

      <FadeUp delay={0.2} className="mx-auto mt-16 max-w-[84rem] sm:mt-24">
        <ol className="grid overflow-hidden rounded-[2rem] bg-[#f7f7f5] p-2.5 text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)] sm:grid-cols-5">
          {TECHNIQUES.map((t, i) => {
            const ready = READY.has(t.id);
            const Tag = ready ? "a" : "div";
            return (
              <li key={t.id} className="relative">
                <Tag
                  {...(ready ? { href: `#${t.id}` } : {})}
                  className={cn("group flex h-full flex-col gap-6 rounded-[1.6rem] p-5 transition-colors sm:p-6", ready ? "hover:bg-white" : "cursor-default")}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-[0.95rem] font-semibold", ready ? "bg-[linear-gradient(135deg,#19d3b4,#014645)] text-white" : "bg-black/[0.06] text-ink-3")}>{t.n}</span>
                    {/* The road between stops. */}
                    {i < TECHNIQUES.length - 1 && <span aria-hidden className="hidden h-px flex-1 bg-black/10 sm:block" />}
                  </span>
                  <span>
                    <span className={cn("block text-[clamp(1.15rem,1.4vw,1.45rem)] font-semibold leading-tight tracking-[-0.02em]", !ready && "text-ink-3")}>{t.name}</span>
                    <span className="mt-1 block text-[clamp(0.95rem,1.05vw,1.1rem)] leading-snug text-ink-3">{t.text}</span>
                  </span>
                </Tag>
              </li>
            );
          })}
        </ol>
      </FadeUp>
    </Section>
  );
}
