import { Camera, CreditCard, LayoutTemplate, Tags } from "lucide-react";
import { FadeUp, Kicker, MarqLogo, RiseLines, Section } from "./primitives";
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
      <div className="mx-auto max-w-[90rem]">
        <Kicker n="06">Próximamente</Kicker>
        <RiseLines id="lo-que-viene-title" lines={["Lo que viene,", <em key="e">también por chat.</em>]} className="display sky-type mt-6 text-[clamp(2.2rem,5.8vw,7.4rem)]" />
        <Steps className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" gap={0.14}>
          {next.map((n) => (
            <div data-step key={n.title} className="h-full">
              <article className="paper flex h-full flex-col rounded-[1.75rem] p-7">
                <span className="grid size-14 place-items-center rounded-2xl bg-blue-soft text-blue">
                  <n.icon className="size-7" />
                </span>
                <h3 className="mt-6 font-display text-[clamp(1.15rem,1.45vw,1.5rem)] font-bold leading-tight tracking-[-0.03em]">{n.title}</h3>
                <p className="mt-3 text-[clamp(1.05rem,1.2vw,1.2rem)] leading-snug text-ink-2">{n.text}</p>
                <p className="mt-auto pt-6 text-[1rem] font-medium italic text-blue">{n.quote}</p>
              </article>
            </div>
          ))}
        </Steps>
        <p className="mt-6 w-fit rounded-full bg-ink px-5 py-2.5 text-[1rem] text-white">Próximas integraciones: se suman una vez que MARQui y MARQador estén funcionando.</p>
      </div>
    </Section>
  );
}

export function Outro() {
  return (
    <Section sky={SKY.dawn} id="cierre" className="pb-20 pt-24 sm:pt-32">
      <div className="mx-auto grid max-w-[90rem] place-items-center text-center">
        <FadeUp>
          <MarquiLive pose="alegria" title="MARQui contento" className="mx-auto w-[clamp(9rem,13vw,14rem)]" />
        </FadeUp>
        <RiseLines lines={["El equipo responde.", <em key="e">MARQui sopla.</em>]} className="display sky-type mt-10 text-[clamp(2.2rem,6.4vw,8.6rem)]" />
        <FadeUp className="mt-12">
          <MarqLogo className="mx-auto h-[clamp(1.5rem,2vw,2.2rem)]" />
        </FadeUp>
      </div>
      <footer className="mx-auto mt-24 flex max-w-[90rem] flex-wrap items-center justify-between gap-3 rounded-full bg-ink px-6 py-4 text-[0.9rem] text-white/75">
        <span>MARQui · Agilidad avanzada · 2026</span>
        <span>Conversaciones, nombres y números son ilustrativos.</span>
      </footer>
    </Section>
  );
}

export function Thinking() {
  return (
    <Section sky={SKY.dawn} id="panel-thinking" role="tabpanel" className="grid min-h-[100svh] place-items-center pb-20 pt-32">
      <div className="paper max-w-[44rem] rounded-[2rem] p-10 text-center sm:p-14">
        <span className="eyebrow text-blue">Design thinking</span>
        <h1 className="mt-5 font-display text-[clamp(1.8rem,3vw,3rem)] font-bold leading-none tracking-[-0.03em]">En preparación.</h1>
        <p className="mt-5 text-[1.25rem] leading-snug text-ink-2">Acá va a estar el proceso que nos llevó a MARQui. Por ahora, mirá la solución.</p>
      </div>
    </Section>
  );
}
