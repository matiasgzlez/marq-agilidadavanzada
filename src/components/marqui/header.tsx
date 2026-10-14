import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { MarquiLive } from "./marqui-live";
import { MarqLogo, ease } from "./primitives";

export type Panel = "solucion" | "thinking";
type Brand = "marqui" | "marqador";

/**
 * Three things, floating: MARQ on the left, the switch in the middle, and on
 * the right whoever is on stage, MARQui or, inside his sections, MARQador.
 */
export function Header({ panel, onPanel }: { panel: Panel; onPanel: (p: Panel) => void }) {
  const [brand, setBrand] = useState<Brand>("marqui");

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      // MARQador takes the corner while one of his sections covers the top third of the screen.
      const line = window.innerHeight * 0.3;
      const inMarqador = [...document.querySelectorAll<HTMLElement>("[data-brand='marqador']")].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      setBrand(inMarqador ? "marqador" : "marqui");
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [panel]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.2, ease }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 pt-3 sm:px-6 sm:pt-5 lg:px-10"
    >
      {/* MARQ, white and on its own, no chip behind it; a soft shadow keeps it readable over light content. */}
      <a href="#inicio" onClick={() => onPanel("solucion")} aria-label="MARQ, volver al inicio" className="pointer-events-auto flex h-16 w-fit items-center sm:h-20">
        <MarqLogo className="h-7 max-w-full drop-shadow-[0_0.15rem_0.6rem_rgb(1_30_27/0.55)] sm:h-[clamp(2.2rem,3vw,3.2rem)]" />
      </a>

      <div role="tablist" aria-label="Partes de la presentación" className="pointer-events-auto flex rounded-full bg-ink/90 p-1 shadow-[0_0.75rem_2rem_-0.75rem_rgb(0_0_0/0.5)] ring-1 ring-white/15 backdrop-blur-sm">
        {(["solucion", "thinking"] as const).map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={panel === p}
            aria-controls={`panel-${p}`}
            onClick={() => {
              onPanel(p);
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            className={cn("relative rounded-full px-4 py-2 text-[clamp(0.9rem,1vw,1.05rem)] font-semibold transition-colors sm:px-6 sm:py-2.5", panel === p ? "text-ink" : "text-white/80 hover:text-white")}
          >
            {panel === p && <motion.span layoutId="panel-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
            <span className="relative">{p === "solucion" ? "MARQui" : "Design thinking"}</span>
          </button>
        ))}
      </div>

      {/* MARQui is always here; in MARQador's sections his little brother joins him, side by side. */}
      <a href={brand === "marqador" ? "#marqador" : "#inicio"} onClick={() => onPanel("solucion")} className="pointer-events-auto ml-auto flex h-14 items-end gap-0.5 sm:h-16 lg:h-[4.5rem]" aria-label={brand === "marqador" ? "MARQui y MARQador" : "MARQui"}>
        <AnimatePresence initial={false}>
          {brand === "marqador" && (
            <motion.span
              key="bro"
              initial={{ opacity: 0, scale: 0.3, x: 24 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.3, x: 24 }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
              className="block h-[68%] origin-bottom-right"
            >
              <MarquiLive who="marqador" pose="alegria" shadow={false} className="h-full w-auto drop-shadow-[0_0.4rem_0.8rem_rgb(0_0_0/0.35)]" />
            </motion.span>
          )}
        </AnimatePresence>
        <MarquiLive pose={brand === "marqador" ? "izquierda" : "reposo"} shadow={false} className="h-full w-auto drop-shadow-[0_0.4rem_0.8rem_rgb(0_0_0/0.35)]" />
      </a>
    </motion.header>
  );
}
