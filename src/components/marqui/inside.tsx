import { AppWindow, ArrowRight, BarChart3, Smartphone } from "lucide-react";
import { Kicker, MarquiAvatar, RiseLines, Section } from "./primitives";
import { Steps } from "./reveal";
import { SKY } from "./sky";

const outputs = [
  { icon: AppWindow, title: "WhatsApp Web", text: "Una extensión de Chrome muestra la tarjeta y las respuestas en cada chat." },
  { icon: Smartphone, title: "Contacto MARQui", text: "En el celular de cada línea, para reenviarle mensajes y preguntarle." },
  { icon: BarChart3, title: "MARQador", text: "El tablero, en una pestaña nueva del navegador." },
];

const notes = [
  "Las dos líneas siguen funcionando como hoy, en el celular y en WhatsApp Web.",
  "MARQui recibe los mensajes por la conexión oficial de WhatsApp. La extensión no lee ni envía nada.",
  "Si WhatsApp cambia su página y la extensión deja de andar, MARQui sigue por el contacto y MARQador no se entera.",
];

export function Inside() {
  return (
    <Section sky={SKY.dusk} id="por-dentro" className="py-28 sm:py-40" aria-labelledby="por-dentro-title">
      <div className="mx-auto max-w-[90rem]">
        <Kicker n="05">Por dentro</Kicker>
        <RiseLines id="por-dentro-title" lines={["Lo mismo de siempre,", <em key="e">con MARQui atrás.</em>]} className="display sky-type mt-6 text-[clamp(2.2rem,5.8vw,7.4rem)]" />

        <Steps className="mt-14" gap={0.28}>
          <div data-step className="paper rounded-[2rem] p-6 sm:p-10 xl:p-14">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1.3fr]">
              <div data-step className="rounded-3xl bg-wa-bubble p-6">
                <span className="eyebrow text-wa-deep">Entra</span>
                <h3 className="mt-3 font-display text-[clamp(1.25rem,1.7vw,1.75rem)] font-bold leading-tight tracking-[-0.03em]">Las dos líneas de MARQ</h3>
                <p className="mt-2 text-[1.1rem] text-ink-2">Pauta y clientes. Cada mensaje llega por la API oficial de WhatsApp.</p>
              </div>
              <span data-step="arrow" className="mx-auto"><ArrowRight className="size-8 text-ink-3 max-lg:rotate-90" aria-hidden /></span>
              <div data-step className="rounded-3xl bg-ink p-6 text-white">
                <MarquiAvatar tone="light" className="size-12" />
                <h3 className="mt-4 font-display text-[clamp(1.25rem,1.7vw,1.75rem)] font-bold leading-tight tracking-[-0.03em]">MARQui</h3>
                <p className="mt-2 text-[1.1rem] text-white/80">Una IA con la memoria de MARQ: proyectos, precios, tono y cada conversación.</p>
              </div>
              <span data-step="arrow" className="mx-auto"><ArrowRight className="size-8 text-ink-3 max-lg:rotate-90" aria-hidden /></span>
              <ul className="grid gap-3">
                {outputs.map((o) => (
                  <li data-step key={o.title} className="flex items-start gap-4 rounded-2xl bg-paper-2 p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-blue">
                      <o.icon className="size-5" />
                    </span>
                    <span className="leading-snug">
                      <b className="block text-[1.15rem]">{o.title}</b>
                      <span className="text-[1rem] text-ink-2">{o.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 grid gap-3 border-t border-line pt-8 md:grid-cols-3">
              {notes.map((n, i) => (
                <p data-step key={i} className="flex gap-3 text-[clamp(1.02rem,1.25vw,1.25rem)] leading-snug text-ink-2">
                  <span className="mt-[0.5em] size-2 shrink-0 rounded-full bg-blue" />
                  {n}
                </p>
              ))}
            </div>
          </div>
        </Steps>
      </div>
    </Section>
  );
}
