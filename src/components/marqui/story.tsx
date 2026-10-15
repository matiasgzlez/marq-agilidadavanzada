import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FadeUp, RiseLines, Section } from "./primitives";
import { SKY } from "./sky";
import { ResultsBento } from "./results";
import { ControlCards } from "./control";

/** A centred section opening, like the dots page: one big line, one plain sentence. */
export function Lead({ title, children, id, className }: { title: ReactNode[]; children?: ReactNode; id?: string; className?: string }) {
  return (
    <div className={cn("mx-auto grid max-w-[60rem] justify-items-center text-center", className)}>
      <RiseLines id={id} lines={title} className="display sky-type text-[clamp(2.4rem,6vw,7rem)]" />
      {children && (
        <FadeUp delay={0.15}>
          <p className="sky-type mt-6 text-balance text-[clamp(1.15rem,1.8vw,1.9rem)] font-medium leading-[1.35] text-white/85">{children}</p>
        </FadeUp>
      )}
    </div>
  );
}

/* ——— Tiempo ———
   What the team gets back, grounded in published studies, with the math
   shown so nobody has to take it on faith. */


export function TimeSaved() {
  return (
    <Section sky={SKY.noon} id="tiempo" className="py-24 sm:py-32" aria-labelledby="tiempo-title">
      {/* Pain and gain in one place: today's hours, then what MARQui gives back. */}
      <Lead id="tiempo-title" title={["Más tiempo", <em key="e">para vender.</em>]}>
        Hoy se van 4 horas por día respondiendo lo mismo. Con MARQui, ese tiempo vuelve a la venta.
      </Lead>

      <div className="mt-12">
        <ResultsBento />
      </div>
    </Section>
  );
}

/* ——— De tu lado, bajo tu control ——— */

export function Control() {
  return (
    <Section sky={SKY.noon} id="control" className="py-28 sm:py-40" aria-labelledby="control-title">
      <Lead id="control-title" title={["De tu lado,", <em key="e">bajo tu control.</em>]}>
        Ya probaron con un bot y la gente se dio cuenta y dejó de contestar. MARQui no reemplaza a nadie: trabaja para el que atiende.
      </Lead>
      <ControlCards />
    </Section>
  );
}
