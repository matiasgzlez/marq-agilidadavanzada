import { ArrowRight } from "lucide-react";
import { FadeUp, RiseLines, Section } from "./primitives";
import { Steps } from "./reveal";
import { MarquiMark } from "./marqui-mark";
import { PartTitle, TECHNIQUES } from "./dt-kit";
import { SKY } from "./sky";

/* ——— Cierre: qué aprendimos ———
   What the class asks for: what each technique taught us to define and build
   the proposal (and what it changed in it), then what we learned doing the
   work, and the whole road in numbers. Short on screen; said over it. */

const BY_TECHNIQUE: Record<string, { learned: string; changed: string }> = {
  clustering: { learned: "El problema no era el de las quejas más concretas", changed: "Atacamos las consultas, no la web" },
  personas: { learned: "Un mismo «precio?» esconde necesidades opuestas", changed: "Tres respuestas y una ficha con tres preguntas" },
  journey: { learned: "La venta se pierde en el silencio", changed: "Recordatorios, avisos y memoria de cada charla" },
  "como-podriamos": { learned: "Las restricciones también deciden", changed: "Sin chatbot, sin CRM y sin encuestas" },
  prototipo: { learned: "El boceto era otro sistema más", changed: "MARQui vive dentro de WhatsApp" },
};

const FROM_TP = ["Escuchar antes de proponer", "Validar con la clienta en cada paso", "Separar lo que sabemos de lo que suponemos", "Unir las ideas del equipo en una sola propuesta"];

const ROAD = [
  { n: "1", what: "entrevista" },
  { n: "34", what: "notas" },
  { n: "4", what: "grupos" },
  { n: "1", what: "problema" },
  { n: "4", what: "Personas" },
  { n: "3", what: "momentos críticos" },
  { n: "4", what: "preguntas" },
  { n: "3", what: "propuestas" },
  { n: "1", what: "validación" },
];

export function Learnings() {
  return (
    <>
      <Section sky={SKY.dusk} id="aprendizajes" className="py-28 sm:py-40" aria-labelledby="aprendizajes-title">
        <PartTitle id="aprendizajes-title" sub="Qué nos dejó cada técnica para definir y construir la propuesta.">
          ¿Qué aprendimos?
        </PartTitle>

        {/* One row per technique: what it taught us → what it changed in the proposal. */}
        <Steps className="mx-auto mt-14 grid max-w-[76rem] gap-3" gap={0.12}>
          {TECHNIQUES.map((t) => {
            const l = BY_TECHNIQUE[t.id]!;
            return (
              <article key={t.id} data-step className="grid items-center gap-4 overflow-hidden rounded-[2rem] bg-[#f7f7f5] p-2.5 text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)] md:grid-cols-[13rem_minmax(0,1fr)_auto_minmax(0,0.9fr)] md:gap-6 md:pr-7">
                <span className="flex items-center gap-3 rounded-[1.6rem] bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#eef3f1_60%,#e3ebe8_100%)] p-4 ring-1 ring-black/[0.04] md:h-full">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#19d3b4,#014645)] text-[0.95rem] font-semibold text-white">{t.n}</span>
                  <span className="text-[1.05rem] font-semibold leading-tight">{t.name}</span>
                </span>
                <p className="px-4 text-[clamp(1.15rem,1.6vw,1.6rem)] font-semibold leading-tight tracking-[-0.02em] md:px-0">{l.learned}</p>
                <ArrowRight className="hidden size-6 text-ink-3 md:block" aria-hidden />
                <p className="flex items-center gap-2.5 px-4 pb-4 text-[clamp(1rem,1.15vw,1.2rem)] font-medium leading-snug text-ink-2 md:p-0">
                  <MarquiMark tone="ink" className="size-6 shrink-0" title="" />
                  {l.changed}
                </p>
              </article>
            );
          })}
        </Steps>
      </Section>

      <Section sky={SKY.dusk} id="aprendizajes-tp" className="pb-28 sm:pb-40" aria-labelledby="aprendizajes-tp-title">
        <PartTitle id="aprendizajes-tp-title" sub="Lo que nos llevamos de hacer este trabajo.">
          Y como equipo
        </PartTitle>
        <Steps className="mx-auto mt-14 grid max-w-[76rem] gap-3.5 sm:grid-cols-2" gap={0.12}>
          {FROM_TP.map((x, i) => (
            <div key={x} data-step className="ink flex items-center gap-5 rounded-[2rem] p-6 sm:p-8">
              <span className="text-[clamp(2.4rem,3.6vw,3.6rem)] font-bold leading-none tracking-[-0.05em] text-teal-bright tabular-nums">0{i + 1}</span>
              <span className="text-[clamp(1.25rem,1.8vw,1.85rem)] font-semibold leading-tight tracking-[-0.02em]">{x}</span>
            </div>
          ))}
        </Steps>
      </Section>

      <Section sky={SKY.dawn} id="recorrido" className="pb-32 pt-12 sm:pb-44" aria-labelledby="recorrido-title">
        <div className="mx-auto grid max-w-[72rem] justify-items-center text-center">
          <RiseLines id="recorrido-title" lines={["De una entrevista sin problema", <em key="e" className="text-white/75">a una propuesta validada.</em>]} className="display sky-type text-[clamp(2rem,4.6vw,5rem)]" />
        </div>
        {/* The whole road, in numbers. */}
        <FadeUp delay={0.2} className="mx-auto mt-14 max-w-[84rem]">
          <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
            {ROAD.map((r, i) => (
              <li key={r.what} className="flex items-center gap-2">
                <span className="grid min-w-[6.5rem] justify-items-center rounded-[1.4rem] bg-[#f7f7f5] px-4 py-3 text-ink shadow-[0_1.5rem_3rem_-1.5rem_rgb(1_30_27/0.5)]">
                  <span className="text-[clamp(1.8rem,2.6vw,2.6rem)] font-bold leading-none tracking-[-0.04em] tabular-nums">{r.n}</span>
                  <span className="mt-1 text-[0.9rem] font-medium text-ink-3">{r.what}</span>
                </span>
                {i < ROAD.length - 1 && <ArrowRight className="size-4 text-white/70" aria-hidden />}
              </li>
            ))}
          </ol>
        </FadeUp>
      </Section>
    </>
  );
}
