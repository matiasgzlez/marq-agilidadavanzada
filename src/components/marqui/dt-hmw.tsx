import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Landmark, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeUp, RiseLines, Section, ease } from "./primitives";
import { MarquiMark } from "./marqui-mark";
import { MarqadorMark } from "./marqador-mark";
import { BigList, PartTitle, Scrolly, StageCaption, TechniquePill, useWide } from "./dt-kit";
import { SKY } from "./sky";

/* ——— Técnica 4 · ¿Cómo podríamos…? + ideación ———
   The Dinngo canvas: each row is an insight from the techniques before
   (green) turned into four questions (orange). We pick the best one per
   row and brainstorm under each one; ideas that break a restriction, or
   don't answer their question, are crossed out. Only here does the solution
   get a name: the ideas left add up to MARQui, MARQador and MARQ Alloy. */

const ROWS: { from: string; insight: string; questions: string[]; pick: number }[] = [
  {
    from: "Clustering",
    insight: "Responder se come el día y no sabemos quién va a comprar.",
    questions: ["¿Cómo podríamos responder en la primera hora sin pasar cuatro horas escribiendo?", "¿Cómo podríamos no escribir dos veces la misma respuesta?", "¿Cómo podríamos atender cien consultas con el mismo equipo?", "¿Cómo podríamos saber qué pauta trae compradores?"],
    pick: 0,
  },
  {
    from: "Personas",
    insight: "Mismo «precio?», cuatro necesidades distintas.",
    questions: ["¿Cómo podríamos saber quién escribe sin hacerle una encuesta?", "¿Cómo podríamos responder distinto a cada uno con el mismo esfuerzo?", "¿Cómo podríamos priorizar al que va en serio sin ignorar al curioso?", "¿Cómo podríamos lograr que el inversor de siempre no espere?"],
    pick: 0,
  },
  {
    from: "Customer Journey",
    insight: "La venta se pierde en el silencio.",
    questions: ["¿Cómo podríamos retomar a quien se enfrió sin presionarlo?", "¿Cómo podríamos recordar cada conversación aunque pasen meses?", "¿Cómo podríamos enterarnos apenas alguien vuelve?", "¿Cómo podríamos estar presentes mientras lo piensa?"],
    pick: 0,
  },
  {
    from: "Clustering",
    insight: "La gente conoce los edificios, no a quien los hace.",
    questions: ["¿Cómo podríamos lograr que se sepa quién está detrás de cada edificio?", "¿Cómo podríamos hacer que un edificio sea un lugar conocido de la ciudad?", "¿Cómo podríamos mostrar la trayectoria de MARQ sin pagar más pauta?", "¿Cómo podríamos generar confianza antes de que exista el edificio?"],
    pick: 0,
  },
];

const RULES = ["Responde una persona", "Sin sistemas nuevos", "Sin encuestas"];

/* ——— ¿Por qué? Del dolor a la pregunta ———
   One pain from the techniques before turns into a question, in a loop. */

function PainToQuestion() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % ROWS.length), 3200);
    return () => clearInterval(t);
  }, [inView, reduce]);
  const r = ROWS[i]!;
  return (
    <div ref={ref} className="w-full max-w-[40rem] rounded-[2rem] bg-[#f7f7f5] p-2.5 shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)]">
      <div className="grid min-h-[17rem] items-center gap-4 rounded-[1.6rem] bg-[#f4f3ef] bg-[radial-gradient(circle,rgb(0_0_0/0.09)_1px,transparent_1.2px)] bg-[length:18px_18px] p-6 ring-1 ring-black/[0.04] sm:grid-cols-[1fr_auto_1fr]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`p${i}`} initial={{ opacity: 0, y: 10, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: -2 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease }} className="rounded-[0.3rem] bg-[#cfe86a] p-4 text-[1.05rem] font-semibold leading-snug text-[#2f3d07] shadow-[0_0.6rem_1.2rem_-0.5rem_rgb(0_0_0/0.3)]">
            {r.insight}
          </motion.div>
        </AnimatePresence>
        <ArrowRight className="mx-auto size-7 rotate-90 text-ink-3 sm:rotate-0" aria-hidden />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`q${i}`} initial={{ opacity: 0, y: 10, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 2 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, delay: 0.35, ease }} className="rounded-[0.3rem] bg-[#f6bd6b] p-4 text-[1.05rem] font-semibold leading-snug text-[#4a2405] shadow-[0_0.6rem_1.2rem_-0.5rem_rgb(0_0_0/0.3)]">
            {r.questions[r.pick]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ——— ¿Cómo? Las preguntas ———
   The canvas, in cqw on a fixed shape so it scales to the screen: a row per
   insight, four questions each; then the best one per row is picked. */

const Q_RATIO = 2.05;
const Q_STEPS: { title: string; text?: ReactNode }[] = [
  { title: "1. Partimos de los hallazgos", text: "Uno por fila, de las técnicas anteriores." },
  { title: "2. Cuatro preguntas por hallazgo", text: "Todas empiezan con «¿Cómo podríamos…?» y no dicen cómo resolverlo." },
  { title: "3. Elegimos la mejor de cada fila" },
  {
    title: "4. Con tres restricciones",
    text: (
      <span className="mt-1 flex flex-wrap justify-center gap-2">
        {RULES.map((r) => (
          <span key={r} className="rounded-full bg-white px-3.5 py-1 text-[0.95rem] font-semibold text-ink">
            {r}
          </span>
        ))}
      </span>
    ),
  },
];

function QuestionsCanvas({ step, fit }: { step: number; fit: boolean }) {
  const f = (a: string, b: string) => (fit ? a : b);
  return (
    <div className={cn("overflow-hidden bg-[#f4f3ef] bg-[radial-gradient(circle,rgb(0_0_0/0.08)_1px,transparent_1.2px)] shadow-[0_2.5rem_6rem_-2rem_rgb(1_40_36/0.45)] ring-1 ring-white/60", f("grid content-center gap-[1cqw] rounded-[1.6cqw] bg-[length:1.6cqw_1.6cqw] p-[1.6cqw]", "grid gap-4 rounded-[1.5rem] bg-[length:20px_20px] p-3"))} style={fit ? { aspectRatio: Q_RATIO } : undefined}>
      {ROWS.map((r, ri) => (
        <div key={r.insight} className={cn("grid", f("grid-cols-[1.15fr_repeat(4,1fr)] gap-[1cqw]", "gap-2"))}>
          <motion.div initial={false} animate={{ opacity: 1 }} className={cn("relative rounded-[0.3rem] bg-[#cfe86a] font-semibold leading-snug text-[#2f3d07] shadow-[0_0.3cqw_0.8cqw_-0.3cqw_rgb(0_0_0/0.3)]", f("min-h-[9.4cqw] p-[0.8cqw] pt-[2.6cqw] text-[1.15cqw]", "p-3 pt-8 text-[1rem]"))}>
            <span className={cn("absolute rounded-full bg-white/80 font-semibold text-[#2f3d07]", f("left-[0.7cqw] top-[0.7cqw] px-[0.6cqw] text-[0.8cqw]", "left-2 top-2 px-2 text-[0.75rem]"))}>{r.from}</span>
            {r.insight}
          </motion.div>
          {r.questions.map((q, qi) => {
            const on = step >= 1;
            const picked = step >= 2 && qi === r.pick;
            const dim = step >= 2 && qi !== r.pick;
            return (
              <motion.div
                key={q}
                initial={false}
                animate={{ opacity: on ? (dim ? 0.4 : 1) : 0, y: on ? 0 : -8, rotate: on ? (((ri + qi) % 3) - 1) * 1.1 : 0, scale: picked ? 1.04 : 1 }}
                transition={{ duration: 0.45, delay: on && step === 1 ? ri * 0.12 + qi * 0.05 : 0, ease }}
                className={cn("relative rounded-[0.3rem] bg-[#f6bd6b] font-medium leading-snug text-[#4a2405] shadow-[0_0.3cqw_0.8cqw_-0.3cqw_rgb(0_0_0/0.3)]", f("min-h-[9.4cqw] p-[0.8cqw] text-[1.02cqw]", "p-3 text-[0.92rem]"), picked && "ring-[0.3cqw] ring-ink", !fit && dim && "hidden")}
              >
                {picked && (
                  <span className={cn("absolute grid place-items-center rounded-full bg-ink text-white", f("-right-[0.8cqw] -top-[0.8cqw] size-[2.2cqw]", "-right-2 -top-2 size-6"))}>
                    <Star className={f("size-[1.2cqw]", "size-3.5")} fill="currentColor" />
                  </span>
                )}
                {q}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ——— ¿Cómo? Las ideas ———
   A brainstorm under each chosen question. Ideas that break a restriction,
   or don't answer their question, are crossed out with the reason; the ones
   left are the proposal, and each gets where it goes. */

type Goes = "marqui" | "marqador" | "alloy";
const IDEAS: { id: string; q: number; text: string; out?: string; goes?: Goes }[] = [
  { id: "i1", q: 0, text: "Un chatbot que conteste solo", out: "Responde una persona" },
  { id: "i2", q: 0, text: "Respuestas sugeridas que el vendedor elige y edita", goes: "marqui" },
  { id: "i3", q: 0, text: "Llamar por teléfono a cada consulta", out: "No responde: suma horas" },
  { id: "i4", q: 0, text: "Resumen diario de lo que quedó pendiente", goes: "marqui" },
  { id: "i5", q: 1, text: "Formulario de datos antes de chatear", out: "Sin encuestas" },
  { id: "i6", q: 1, text: "Ficha del cliente que se completa sola con la charla", goes: "marqui" },
  { id: "i7", q: 1, text: "Etiquetar a cada cliente según su intención", goes: "marqador" },
  { id: "i8", q: 1, text: "Tablero que cruce la pauta con las consultas", goes: "marqador" },
  { id: "i9", q: 2, text: "Un CRM nuevo para cargar cada consulta", out: "Sin sistemas nuevos" },
  { id: "i10", q: 2, text: "Recordatorio de a quién retomar y cuándo", goes: "marqui" },
  { id: "i11", q: 2, text: "Aviso cuando vuelve un cliente o uno importante", goes: "marqui" },
  { id: "i12", q: 2, text: "Mensaje masivo a todos los que no respondieron", out: "No responde: presiona" },
  { id: "i13", q: 3, text: "Una obra de arte regional en cada edificio", goes: "alloy" },
  { id: "i14", q: 3, text: "La firma de MARQ al pie de cada obra", goes: "alloy" },
  { id: "i15", q: 3, text: "Más pauta en redes", out: "No responde: ya sobran consultas" },
  { id: "i16", q: 3, text: "Inaugurar el edificio y su obra en un evento abierto", goes: "alloy" },
];

const GOES: Record<Goes, { name: string; ring: string }> = {
  marqui: { name: "MARQui", ring: "ring-teal" },
  marqador: { name: "MARQador", ring: "ring-orange" },
  alloy: { name: "MARQ Alloy", ring: "ring-[#23488f]" },
};

const I_RATIO = 2.05;
const I_STEPS = ["5. Lluvia de ideas para cada pregunta", "6. Afuera las que no sirven", "7. Las que quedan forman la propuesta"];

function IdeasCanvas({ step, fit }: { step: number; fit: boolean }) {
  const f = (a: string, b: string) => (fit ? a : b);
  return (
    <div className={cn("grid overflow-hidden bg-[#f4f3ef] bg-[radial-gradient(circle,rgb(0_0_0/0.08)_1px,transparent_1.2px)] shadow-[0_2.5rem_6rem_-2rem_rgb(1_40_36/0.45)] ring-1 ring-white/60", f("grid-cols-4 content-start gap-[1.2cqw] rounded-[1.6cqw] bg-[length:1.6cqw_1.6cqw] p-[1.6cqw]", "gap-4 rounded-[1.5rem] bg-[length:20px_20px] p-3"))} style={fit ? { aspectRatio: I_RATIO } : undefined}>
      {ROWS.map((r, qi) => (
        <section key={r.insight} className={cn("grid content-start", f("gap-[0.8cqw]", "gap-2"))}>
          {/* The chosen question heads its column. */}
          <div className={cn("rounded-[0.3rem] bg-[#f6bd6b] font-semibold leading-snug text-[#4a2405] shadow-[0_0.3cqw_0.8cqw_-0.3cqw_rgb(0_0_0/0.3)] ring-[0.25cqw] ring-ink", f("min-h-[8.4cqw] p-[0.9cqw] text-[1.2cqw]", "p-3 text-[0.95rem]"))}>{r.questions[r.pick]}</div>
          {IDEAS.filter((x) => x.q === qi).map((x, k) => {
            const crossed = step >= 1 && !!x.out;
            const goes = step >= 2 && x.goes ? GOES[x.goes] : null;
            return (
              <motion.div
                key={x.id}
                initial={false}
                animate={{ opacity: crossed ? 0.55 : 1, rotate: ((qi + k) % 3 - 1) * 0.9, scale: goes ? 1.02 : 1 }}
                transition={{ duration: 0.45, ease }}
                className={cn("relative rounded-[0.3rem] bg-[#c9dcff] font-medium leading-snug text-[#132b5c] shadow-[0_0.3cqw_0.8cqw_-0.3cqw_rgb(0_0_0/0.3)]", f("min-h-[7cqw] p-[0.9cqw] text-[1.25cqw]", "p-3 text-[0.92rem]"), goes && cn("ring-[0.28cqw]", goes.ring))}
              >
                {x.text}
                {crossed && <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, ease }} aria-hidden className="absolute inset-x-[0.8cqw] top-[45%] h-[0.2cqw] origin-left -rotate-3 bg-ink/70" />}
                <AnimatePresence>
                  {crossed && (
                    <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn("mt-[0.4cqw] block font-semibold text-orange-deep", f("text-[1cqw]", "text-[0.8rem]"))}>
                      ✕ {x.out}
                    </motion.span>
                  )}
                  {goes && (
                    <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.15 + k * 0.05 }} className={cn("mt-[0.5cqw] inline-flex items-center rounded-full bg-white font-semibold text-ink", f("gap-[0.4cqw] px-[0.6cqw] py-[0.15cqw] text-[0.95cqw]", "gap-1 px-2 text-[0.75rem]"))}>
                      → {goes.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

function FitStage({ ratio, children }: { ratio: number; children: ReactNode }) {
  return (
    <div className="relative mt-4 min-h-0 flex-1 [container-type:size]">
      <div className="mx-auto [container-type:inline-size]" style={{ width: `min(100cqw, calc(100cqh * ${ratio}))` }}>
        {children}
      </div>
    </div>
  );
}

/* ——— ¿Qué obtuvimos? ———
   The chosen ideas add up to the proposal: here the solution gets its name. */

const PROPOSAL = [
  { name: "MARQui", what: "Un asistente dentro del WhatsApp que ya usan", goes: "marqui" as Goes, mark: <MarquiMark tone="ink" className="size-10" title="" /> },
  { name: "MARQador", what: "Su módulo de datos", goes: "marqador" as Goes, mark: <MarqadorMark className="size-10" title="" /> },
  { name: "MARQ Alloy", what: "La segunda propuesta", goes: "alloy" as Goes, mark: <span className="grid size-10 place-items-center rounded-full bg-ink text-white"><Landmark className="size-5" /></span> },
];

export function HowMightWe() {
  const wide = useWide();
  return (
    <>
      <Section sky={SKY.noon} id="como-podriamos" className="py-28 sm:py-40" aria-labelledby="como-podriamos-title">
        <TechniquePill id="como-podriamos" />
        <div className="mx-auto mt-6 grid max-w-[64rem] justify-items-center text-center">
          <RiseLines id="como-podriamos-title" lines={["¿Cómo podríamos…?"]} className="display sky-type text-[clamp(3rem,7.4vw,8rem)]" />
          <FadeUp delay={0.15}>
            <p className="sky-type mt-5 text-[clamp(1.2rem,2vw,2.1rem)] font-medium text-white/85">Convertir cada hallazgo en una pregunta, y las preguntas en ideas.</p>
          </FadeUp>
        </div>

        <article className="mx-auto mt-24 grid max-w-[84rem] items-center gap-10 sm:mt-32 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <FadeUp className="flex min-w-0 justify-center">
            <PainToQuestion />
          </FadeUp>
          <FadeUp delay={0.1} className="grid gap-5">
            <h3 className="display sky-type text-[clamp(2.4rem,4vw,4.4rem)] font-bold!">¿Por qué la elegimos?</h3>
            <BigList items={["Cande nos pidió ideas", "Antes, definir qué resolver", "Del problema a las ideas"]} />
          </FadeUp>
        </article>
      </Section>

      <Section sky={SKY.noon} id="como-podriamos-aplicacion" className="pt-12 sm:pt-20" aria-labelledby="como-podriamos-aplicacion-title">
        <PartTitle id="como-podriamos-aplicacion-title">¿Cómo la aplicamos?</PartTitle>
        <Scrolly steps={Q_STEPS.length}>
          {(step) => (
            <>
              <StageCaption step={step} steps={Q_STEPS.length} title={Q_STEPS[step]!.title} text={Q_STEPS[step]!.text} />
              {wide ? (
                <FitStage ratio={Q_RATIO}>
                  <QuestionsCanvas step={step} fit />
                </FitStage>
              ) : (
                <div className="mt-8">
                  <QuestionsCanvas step={step} fit={false} />
                </div>
              )}
            </>
          )}
        </Scrolly>
        <Scrolly steps={I_STEPS.length}>
          {(step) => (
            <>
              <StageCaption step={step} steps={I_STEPS.length} title={I_STEPS[step]} />
              {wide ? (
                <FitStage ratio={I_RATIO}>
                  <IdeasCanvas step={step} fit />
                </FitStage>
              ) : (
                <div className="mt-8">
                  <IdeasCanvas step={step} fit={false} />
                </div>
              )}
            </>
          )}
        </Scrolly>
      </Section>

      <Section sky={SKY.noon} id="como-podriamos-resultado" className="py-28 sm:py-40" aria-labelledby="como-podriamos-resultado-title">
        <PartTitle id="como-podriamos-resultado-title">¿Qué obtuvimos?</PartTitle>
        <div className="mx-auto mt-10 grid max-w-[72rem] justify-items-center text-center">
          <RiseLines as="h3" lines={["Las ideas elegidas", <em key="e" className="text-white/70">forman la propuesta.</em>]} className="display sky-type text-[clamp(2rem,4.4vw,4.8rem)]" />
        </div>
        <div className="mx-auto mt-14 grid max-w-[80rem] gap-3.5 md:grid-cols-3">
          {PROPOSAL.map((p, i) => (
            <FadeUp key={p.name} delay={i * 0.1} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-[#f7f7f5] text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)]">
                <div className="m-2.5 flex items-center gap-4 rounded-[1.6rem] bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#eef3f1_60%,#e3ebe8_100%)] p-5 ring-1 ring-black/[0.04]">
                  {p.mark}
                  <span className="leading-tight">
                    <span className="block text-[clamp(1.4rem,1.9vw,2rem)] font-semibold tracking-[-0.02em]">{p.name}</span>
                    <span className="block text-[clamp(0.95rem,1.05vw,1.1rem)] text-ink-3">{p.what}</span>
                  </span>
                </div>
                <ul className="grid gap-2 px-5 pb-6 pt-2">
                  {IDEAS.filter((x) => x.goes === p.goes).map((x) => (
                    <li key={x.id} className="rounded-[0.3rem] bg-[#c9dcff] px-3 py-2 text-[clamp(0.92rem,1vw,1.05rem)] font-medium leading-snug text-[#132b5c]">
                      {x.text}
                    </li>
                  ))}
                </ul>
              </article>
            </FadeUp>
          ))}
        </div>
      </Section>
    </>
  );
}
