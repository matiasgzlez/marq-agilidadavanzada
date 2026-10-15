import { Camera, CreditCard, LayoutTemplate, Tags } from "lucide-react";
import { FadeUp, MarqLogo, RiseLines, Section } from "./primitives";
import { Lead } from "./story";
import { MarquiLive } from "./marqui-live";
import { Steps } from "./reveal";
import { SKY } from "./sky";

const next = [
  { icon: Tags, title: "Precios al día", text: "Cambia un precio en la lista y MARQui pregunta si lo actualiza en la web.", quote: "«¿Cambio también el lote 12 en la web?»" },
  { icon: CreditCard, title: "Señas con Mercado Pago", text: "Un link de pago por chat. Cuando se acredita, la unidad pasa sola a reservada.", quote: "«Generá un link de seña de la 2A para Juan»" },
  { icon: LayoutTemplate, title: "Landing de proyectos", text: "Un proyecto nuevo se carga respondiendo preguntas por WhatsApp.", quote: "«Cargá un proyecto nuevo»" },
  { icon: Camera, title: "Avance de obra", text: "Una foto desde la obra llega a la galería del proyecto, después de tu OK.", quote: "«Avance de MARQ Collection»" },
];

export function Next() {
  return (
    <Section sky={SKY.dawn} id="lo-que-viene" className="py-28 sm:py-40" aria-labelledby="lo-que-viene-title">
      <Lead id="lo-que-viene-title" title={["Lo que viene,", <em key="e">también por chat.</em>]}>
        Una vez que MARQui y MARQador estén andando, el mismo chat puede ocuparse de lo que hoy depende del programador o se hace dos veces.
      </Lead>
      <Steps className="mx-auto mt-16 grid max-w-[84rem] gap-4 sm:grid-cols-2 xl:grid-cols-4" gap={0.14}>
        {next.map((n) => (
          <article data-step key={n.title} className="paper flex h-full flex-col rounded-[2rem] p-7">
            <n.icon className="size-7 text-teal" />
            <h3 className="mt-6 text-[clamp(1.25rem,1.6vw,1.7rem)] font-medium leading-tight tracking-[-0.02em]">{n.title}</h3>
            <p className="mt-3 text-[clamp(1.05rem,1.2vw,1.25rem)] leading-snug text-ink-2">{n.text}</p>
            <p className="mt-auto pt-6 text-[1rem] font-medium text-teal">{n.quote}</p>
          </article>
        ))}
      </Steps>
    </Section>
  );
}

/** The dots ending: one last line, and the two brothers peeking up from the bottom of the page. */
export function Outro() {
  return (
    <Section sky={SKY.dawn} id="cierre" className="overflow-hidden pt-24 sm:pt-32">
      <div className="mx-auto grid max-w-[64rem] place-items-center text-center">
        <RiseLines lines={["El equipo responde.", <em key="e">MARQui sopla.</em>]} className="display sky-type text-[clamp(2.6rem,7vw,8.4rem)]" />
        <FadeUp className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#inicio" className="inline-flex h-14 items-center rounded-full bg-ink px-7 text-[1.1rem] font-medium text-white transition-transform hover:-translate-y-0.5">
            Volver a empezar
          </a>
          <a href="#un-dia" className="inline-flex h-14 items-center rounded-full bg-white px-7 text-[1.1rem] font-medium text-ink transition-transform hover:-translate-y-0.5">
            Ver un día con MARQui
          </a>
        </FadeUp>
      </div>
      <FadeUp className="relative mx-auto mt-16 flex h-[clamp(11rem,20vw,19rem)] max-w-[44rem] items-start justify-center gap-[3%]">
        <div className="w-[52%] translate-y-[4%]">
          <MarquiLive pose="alegria" shadow={false} />
        </div>
        <div className="w-[40%] translate-y-[22%]">
          <MarquiLive who="marqador" pose="guino" shadow={false} />
        </div>
      </FadeUp>
      <footer className="relative -mx-4 flex flex-wrap items-center justify-between gap-3 bg-ink px-6 py-5 text-[0.95rem] text-white/75 sm:-mx-8 lg:-mx-12 lg:px-12">
        <MarqLogo className="h-7" />
        <span>MARQui y MARQador · Agilidad avanzada · 2026</span>
        <span>Conversaciones, nombres y números son ilustrativos.</span>
      </footer>
    </Section>
  );
}

export { ThinkingPanel as Thinking } from "./thinking";
