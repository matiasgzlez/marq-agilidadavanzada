import type { ReactNode } from "react";
import { Ban, Hand, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeUp, RiseLines, Section } from "./primitives";
import { Steps } from "./reveal";
import { SKY } from "./sky";

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

/* ——— Hoy ———
   The pain, in the team's own numbers, before anything else. */

const today = [
  { value: "4 h", label: "por día respondiendo a mano cuando hay pauta" },
  { value: "2 + 1", label: "dos WhatsApp y un formulario, cada uno por su lado" },
  { value: "500", label: "consultas en un proyecto, sin saber cuántos podían pagar" },
];

export function Pain() {
  return (
    <Section sky={SKY.noon} id="hoy" className="py-28 sm:py-40" aria-labelledby="hoy-title">
      <Lead id="hoy-title" title={["Hoy, cada consulta", <em key="e">se responde a mano.</em>]}>
        La misma pregunta, cien veces por día, en dos WhatsApp. Lo que busca cada persona se pierde en el chat, y nadie sabe qué está pidiendo el mercado.
      </Lead>
      <Steps className="mx-auto mt-16 grid max-w-[72rem] gap-4 md:grid-cols-3" gap={0.15}>
        {today.map((t) => (
          <div key={t.value} data-step className="paper rounded-[2rem] p-8">
            <span className="block text-[clamp(3rem,5vw,5.5rem)] font-medium leading-none tracking-[-0.04em] text-orange-deep">{t.value}</span>
            <span className="mt-4 block text-[clamp(1.05rem,1.3vw,1.35rem)] leading-snug text-ink-2">{t.label}</span>
          </div>
        ))}
      </Steps>
      <p className="mx-auto mt-6 w-fit rounded-full bg-ink px-5 py-2.5 text-center text-[0.95rem] text-white/80">Datos que nos dio el equipo de MARQ.</p>
    </Section>
  );
}

/* ——— Tiempo ———
   What the team gets back, grounded in published studies, with the math
   shown so nobody has to take it on faith. */

const studies = [
  {
    big: "+14%",
    text: "consultas resueltas por hora cuando el equipo de atención trabaja con un asistente de IA que sugiere respuestas. +34% en quienes recién empiezan.",
    source: "Brynjolfsson, Li y Raymond · «Generative AI at Work» · NBER, 2023 · 5.179 agentes",
    href: "https://www.nber.org/papers/w31161",
  },
  {
    big: "×7",
    text: "más chances de avanzar con un interesado si se le responde dentro de la primera hora, frente a responderle una hora más tarde.",
    source: "Oldroyd, McElheran y Elkington · «The Short Life of Online Sales Leads» · Harvard Business Review, 2011",
    href: "https://scholarsarchive.byu.edu/facpub/9711",
  },
];

export function TimeSaved() {
  return (
    <Section sky={SKY.noon} id="tiempo" className="py-28 sm:py-40" aria-labelledby="tiempo-title">
      <Lead id="tiempo-title" title={["Más tiempo", <em key="e">para vender.</em>]}>
        Elegir y corregir una respuesta lleva segundos. Escribirla de cero, buscando el precio y el plano, lleva minutos. Y en ventas, el primero que contesta gana.
      </Lead>

      <div className="mx-auto mt-16 grid max-w-[78rem] gap-4 lg:grid-cols-[1.15fr_1fr]">
        <FadeUp className="h-full">
          <div className="paper flex h-full flex-col rounded-[2rem] p-8 sm:p-10">
            <span className="eyebrow text-teal">Para MARQ</span>
            <p className="mt-4 text-[clamp(3.2rem,6vw,6.4rem)] font-medium leading-none tracking-[-0.045em] text-ink">
              3 a 7 h
            </p>
            <p className="mt-3 text-[clamp(1.2rem,1.6vw,1.7rem)] font-medium leading-snug text-ink">menos por semana respondiendo consultas.</p>
            <div className="mt-8 grid gap-3 border-t border-line pt-6 text-[clamp(1rem,1.2vw,1.2rem)] text-ink-2">
              <p className="flex justify-between gap-4">
                <span>Hoy, respondiendo a mano con pauta</span>
                <b className="text-ink">4 h por día</b>
              </p>
              <p className="flex justify-between gap-4">
                <span>Con un asistente, entre 14% y 34% más rápido</span>
                <b className="text-ink">35 a 80 min por día</b>
              </p>
              <p className="flex justify-between gap-4">
                <span>En una semana de 5 días</span>
                <b className="text-teal">3 a 7 h</b>
              </p>
            </div>
            <p className="mt-auto pt-6 text-[0.9rem] text-ink-3">Estimación: aplica los resultados del estudio de NBER a las horas que hoy dedica el equipo. Se confirma midiendo las dos primeras semanas.</p>
          </div>
        </FadeUp>
        <Steps className="grid gap-4" gap={0.18}>
          {studies.map((s) => (
            <a key={s.big} data-step href={s.href} target="_blank" rel="noreferrer" className="paper group grid gap-3 rounded-[2rem] p-8 transition-transform hover:-translate-y-0.5">
              <span className="text-[clamp(2.6rem,4.4vw,4.6rem)] font-medium leading-none tracking-[-0.04em] text-orange-deep">{s.big}</span>
              <span className="text-[clamp(1.05rem,1.3vw,1.35rem)] leading-snug text-ink">{s.text}</span>
              <span className="text-[0.88rem] text-ink-3 group-hover:text-ink-2">{s.source} ↗</span>
            </a>
          ))}
        </Steps>
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
