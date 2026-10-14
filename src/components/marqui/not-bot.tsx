import { Bot, Check, X } from "lucide-react";
import { MarquiAvatar, RiseLines, Section } from "./primitives";
import { MarquiIntro } from "./marqui-intro";
import { Steps } from "./reveal";
import { SKY } from "./sky";

const rows = [
  { q: "¿Quién le escribe al cliente?", bot: "Un bot", marqui: "Una persona de MARQ" },
  { q: "¿El cliente se da cuenta?", bot: "Sí, y deja de contestar", marqui: "No. Nunca ve a MARQui" },
  { q: "¿Le hace encuestas?", bot: "Sí, preguntas en fila", marqui: "No. Saca los datos de la charla" },
  { q: "¿Quién decide qué se envía?", bot: "La máquina", marqui: "Vos, siempre" },
];

export function NotBot() {
  return (
    <Section sky={SKY.noon} id="que-es" className="pb-28 sm:pb-40" aria-labelledby="que-es-title">
      <div className="-mx-4 sm:-mx-8 lg:-mx-12">
        <MarquiIntro />
      </div>
      <div className="mx-auto max-w-[90rem]">
        <RiseLines id="que-es-title" lines={["No es un bot.", <em key="e">Es un compañero.</em>]} className="display sky-type text-[clamp(2.2rem,5.8vw,7.4rem)]" />

        <Steps className="mt-14" gap={0.16}>
          <div data-step className="paper overflow-hidden rounded-[2rem]">
            <div className="grid grid-cols-[1fr_1fr] border-b border-line md:grid-cols-[1.1fr_1fr_1fr]">
              <span className="max-md:hidden" />
              <p className="flex items-center gap-3 px-5 py-6 text-[clamp(1.1rem,1.6vw,1.6rem)] font-semibold text-ink-3 sm:px-8">
                <span className="grid size-10 place-items-center rounded-full bg-paper-2">
                  <Bot className="size-5" />
                </span>
                Un chatbot
              </p>
              <p className="flex items-center gap-3 bg-ink px-5 py-6 text-[clamp(1.1rem,1.6vw,1.6rem)] font-semibold text-white sm:px-8">
                <MarquiAvatar tone="light" className="size-10" />
                MARQui
              </p>
            </div>
            {rows.map((r) => (
              <div key={r.q} className="grid grid-cols-[1fr_1fr] border-b border-line last:border-0 md:grid-cols-[1.1fr_1fr_1fr]">
                <p data-step className="col-span-2 px-5 pb-1 pt-5 text-[1rem] font-medium text-ink-3 sm:px-8 md:col-span-1 md:py-7 md:text-[clamp(1.05rem,1.4vw,1.4rem)] md:text-ink-2">{r.q}</p>
                <p data-step className="flex items-start gap-2.5 px-5 py-4 text-[clamp(1.05rem,1.5vw,1.55rem)] leading-snug text-ink-3 sm:px-8 md:py-7">
                  <X className="mt-1 size-5 shrink-0 text-[#c4402f]" aria-hidden />
                  {r.bot}
                </p>
                <p data-step className="flex items-start gap-2.5 bg-ink px-5 py-4 text-[clamp(1.05rem,1.5vw,1.55rem)] font-semibold leading-snug text-white sm:px-8 md:py-7">
                  <Check className="mt-1 size-5 shrink-0 text-[#5fe0c8]" aria-hidden />
                  {r.marqui}
                </p>
              </div>
            ))}
          </div>
        </Steps>
      </div>
    </Section>
  );
}
