export { Next } from "./next";
import { FadeUp, MarqLogo, RiseLines, Section } from "./primitives";
import { MarquiLive } from "./marqui-live";
import { SKY } from "./sky";

/** The dots ending: one last line, and the two brothers peeking up from the bottom of the page. */
export function Outro() {
  return (
    <Section sky={SKY.dawn} id="cierre" className="overflow-hidden pt-24 sm:pt-32">
      <div className="mx-auto grid max-w-[64rem] place-items-center text-center">
        <RiseLines lines={["El equipo responde.", <em key="e">MARQui lo respalda.</em>]} className="display sky-type text-[clamp(2.6rem,7vw,8.4rem)]" />
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
