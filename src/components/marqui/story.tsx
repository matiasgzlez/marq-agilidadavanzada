import type { ReactNode } from "react";
import { Ban, Hand, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeUp, RiseLines, Section } from "./primitives";
import { Steps } from "./reveal";
import { SKY } from "./sky";
import { ResultsBento } from "./results";

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
      <Lead id="tiempo-title" title={["Lo que gana", <em key="e">el equipo.</em>]}>
        Hoy se van 4 horas por día respondiendo la misma pregunta, en dos WhatsApp y un formulario. Con MARQui, esto es lo que cambia.
      </Lead>

      <div className="mt-12">
        <ResultsBento />
      </div>
    </Section>
  );
}

/* ——— De tu lado, bajo tu control ——— */

const control = [
  { icon: Hand, title: "No es un bot", text: "El cliente habla siempre con una persona de MARQ. MARQui escribe en tu cuadro de texto; el que envía sos vos." },
  { icon: Ban, title: "Nada de encuestas", text: "MARQui saca los datos de la charla. Si falta alguno, te lo deja como una pregunta normal dentro de la respuesta." },
  { icon: ShieldCheck, title: "Vos tenés la última palabra", text: "Si algo nuevo contradice lo que sabía, como un precio, te pregunta antes de cambiarlo." },
];

export function Control() {
  return (
    <Section sky={SKY.noon} id="control" className="py-28 sm:py-40" aria-labelledby="control-title">
      <Lead id="control-title" title={["De tu lado,", <em key="e">bajo tu control.</em>]}>
        Ya probaron con un bot y la gente se dio cuenta y dejó de contestar. MARQui no reemplaza a nadie: trabaja para el que atiende.
      </Lead>
      <Steps className="mx-auto mt-16 grid max-w-[78rem] gap-4 md:grid-cols-3" gap={0.15}>
        {control.map((c) => (
          <article key={c.title} data-step className="paper rounded-[2rem] p-8">
            <c.icon className="size-7 text-teal" />
            <h3 className="mt-6 text-[clamp(1.35rem,1.8vw,1.9rem)] font-medium leading-tight tracking-[-0.02em]">{c.title}</h3>
            <p className="mt-3 text-[clamp(1.05rem,1.25vw,1.3rem)] leading-snug text-ink-2">{c.text}</p>
          </article>
        ))}
      </Steps>
    </Section>
  );
}
