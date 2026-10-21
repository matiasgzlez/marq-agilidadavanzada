import { motion } from "motion/react";
import { Frown, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeUp, RiseLines, Section, ease } from "./primitives";
import { BigList, PartTitle, Scrolly, StageCaption, TechniquePill, useWide } from "./dt-kit";
import { SKY } from "./sky";

/* ——— Técnica 3 · Customer Journey Map ———
   The Dinngo canvas: time runs left to right, satisfaction bottom to top,
   and each stage is a stack of three notes (what she does, what she needs,
   where she meets MARQ) sitting at the height of how she feels. Drawn for
   one Persona, Lucía, from the road Cande described. It stays in the
   problem: the low points are what the ideas will have to fix. */

/* Satisfaction from -2 (bad) to 2 (good). `low`: a critical moment, with what goes wrong in it. */
const STAGES: { id: string; name: string; sat: number; does: string; needs: string; touch: string; low?: string }[] = [
  { id: "ve", name: "Ve el anuncio", sat: 1, does: "Ve un edificio de MARQ en Instagram", needs: "Saber si le conviene", touch: "Pauta en Meta" },
  { id: "consulta", name: "Consulta", sat: 0.5, does: "Escribe «precio?»", needs: "Una respuesta rápida", touch: "WhatsApp de pauta" },
  { id: "espera", name: "Espera", sat: -1.3, does: "Espera horas la respuesta", needs: "Datos claros, a tiempo", touch: "WhatsApp, horas después", low: "Se enfría" },
  { id: "reunion", name: "Se reúne", sat: 1.7, does: "Charla con Cande y ve la obra", needs: "Confiar en quién está detrás", touch: "Reunión en el estudio" },
  { id: "piensa", name: "Lo piensa", sat: -0.2, does: "Lo consulta con su contador", needs: "Tiempo y respuestas a sus dudas", touch: "Ninguno" },
  { id: "silencio", name: "Desaparece", sat: -1.9, does: "Deja de responder semanas", needs: "Que la retomen sin presionar", touch: "Nadie la vuelve a contactar", low: "Se pierde" },
  { id: "vuelve", name: "Vuelve", sat: 0.4, does: "Escribe de nuevo, meses después", needs: "Que se acuerden de ella", touch: "WhatsApp, desde cero", low: "Empieza de cero" },
];

const NOTE = {
  does: { label: "Actividad", bg: "bg-[#f9b8dc]", ink: "text-[#5c1840]" },
  needs: { label: "Necesidad", bg: "bg-[#fff0a0]", ink: "text-[#3d3208]" },
  touch: { label: "Punto de contacto", bg: "bg-[#d4ec7a]", ink: "text-[#2f3d07]" },
} as const;
type NoteKind = keyof typeof NOTE;
const KINDS: NoteKind[] = ["does", "needs", "touch"];

/* The canvas is drawn in cqw on a fixed shape, so it scales as a whole to fit the screen. */
const RATIO = 2.1;
const H = 100 / RATIO;
const PAD_X = 7.5;
const COL = (100 - PAD_X - 2) / STAGES.length;
const NOTE_W = COL - 1.6;
const NOTE_H = 4.7;
const GAP = 0.45;
const STACK = NOTE_H * 3 + GAP * 2;
const TOP = 2.5;
const BOTTOM = H - 5.5;
const MID = (TOP + BOTTOM) / 2;
const K = (BOTTOM - TOP - STACK) / 2 / 2;
const cx = (i: number) => PAD_X + COL * i + COL / 2;
const cy = (sat: number) => MID - sat * K;

/* A smooth line through the middle of each stack. */
const CURVE = STAGES.map((s, i) => {
  const x = cx(i);
  const y = cy(s.sat);
  if (i === 0) return `M ${x} ${y}`;
  const px = cx(i - 1);
  const py = cy(STAGES[i - 1]!.sat);
  const m = (x - px) / 2;
  return `C ${px + m} ${py} ${x - m} ${y} ${x} ${y}`;
}).join(" ");

/* The canvas is built in the order the technique is done: who, the stages in time, the
   three notes on the neutral line, then each stage moves to how she feels and the line
   is drawn, and last the critical moments. */
const JOURNEY_STEPS: { title: string; text?: string }[] = [
  { title: "1. Elegimos a una Persona", text: "Lucía, la que tiene el recorrido más largo." },
  { title: "2. Ordenamos sus etapas en el tiempo" },
  { title: "3. Qué hace en cada etapa" },
  { title: "4. Qué necesita" },
  { title: "5. Por dónde se contacta con MARQ" },
  { title: "6. Cómo se siente", text: "Cada etapa sube o baja según su satisfacción." },
  { title: "7. Dónde se pierde" },
];
const FEEL = 5;
const LOSE = 6;
const shownKinds = (step: number) => KINDS.slice(0, Math.max(0, Math.min(step - 1, 3)));

function Lucia({ big }: { big: boolean }) {
  return (
    <motion.div
      layoutId="journey-lucia"
      transition={{ type: "spring", stiffness: 160, damping: 24 }}
      className={cn("absolute z-10 flex items-center bg-white text-ink shadow-[0_0.6cqw_1.6cqw_-0.6cqw_rgb(1_30_27/0.45)] ring-1 ring-black/[0.06]", big ? "gap-[1.6cqw] rounded-[1.6cqw] p-[1.4cqw] pr-[2.4cqw]" : "gap-[0.7cqw] rounded-full p-[0.4cqw] pr-[1.2cqw]")}
      style={big ? { left: "50%", top: `${MID}cqw`, x: "-50%", y: "-50%" } : { left: "6cqw", top: "1.4cqw" }}
    >
      <img src="/assets/personas/lucia.jpg" alt="" className={cn("object-cover", big ? "size-[9cqw] rounded-[1cqw]" : "size-[2.6cqw] rounded-full")} />
      <span className="leading-tight">
        <span className={cn("block font-semibold tracking-[-0.02em]", big ? "text-[2.4cqw]" : "text-[1.05cqw]")}>Lucía, 41</span>
        <span className={cn("block text-ink-3", big ? "mt-[0.3cqw] text-[1.4cqw]" : "text-[0.85cqw]")}>La inversora que llega por primera vez</span>
      </span>
    </motion.div>
  );
}

function JourneyCanvas({ step }: { step: number }) {
  const kinds = shownKinds(step);
  return (
    <motion.div layoutRoot className="relative overflow-hidden rounded-[1.6cqw] bg-[#f4f3ef] bg-[radial-gradient(circle,rgb(0_0_0/0.08)_1px,transparent_1.2px)] bg-[length:1.6cqw_1.6cqw] shadow-[0_2.5rem_6rem_-2rem_rgb(1_40_36/0.45)] ring-1 ring-white/60" style={{ aspectRatio: RATIO }}>
      {/* Axes: satisfaction up the left, time along the middle, like the canvas. */}
      <span aria-hidden className="absolute w-[0.15cqw] bg-ink/25" style={{ left: "4.2cqw", top: `${TOP}cqw`, height: `${BOTTOM - TOP}cqw` }} />
      <motion.span aria-hidden initial={false} animate={{ scaleX: step >= 1 ? 1 : 0 }} transition={{ duration: 0.9, ease }} className="absolute h-[0.15cqw] origin-left bg-ink/25" style={{ left: "4.2cqw", right: "2cqw", top: `${MID}cqw` }} />
      <Lucia big={step === 0} />
      <span aria-hidden className="absolute text-[0.95cqw] font-semibold text-ink-3" style={{ right: "2.2cqw", top: `${MID + 0.6}cqw` }}>
        Tiempo
      </span>
      <motion.span initial={false} animate={{ opacity: step >= FEEL ? 1 : 0.3, scale: step === FEEL ? 1.15 : 1 }} className="absolute grid size-[3cqw] place-items-center rounded-full bg-[linear-gradient(135deg,#19d3b4,#014645)] text-white" style={{ left: "2.7cqw", top: `${TOP}cqw` }}>
        <Smile className="size-[1.9cqw]" aria-label="Contenta" />
      </motion.span>
      <motion.span initial={false} animate={{ opacity: step >= FEEL ? 1 : 0.3, scale: step === FEEL ? 1.15 : 1 }} className="absolute grid size-[3cqw] place-items-center rounded-full bg-ink text-white" style={{ left: "2.7cqw", top: `${BOTTOM - 3}cqw` }}>
        <Frown className="size-[1.9cqw]" aria-label="Disconforme" />
      </motion.span>

      {/* How she feels: drawn once all the notes are up. */}
      <svg viewBox={`0 0 100 ${H}`} className="pointer-events-none absolute inset-0 size-full" aria-hidden>
        <motion.path d={CURVE} fill="none" stroke="#06231f" strokeWidth={0.32} strokeLinecap="round" initial={false} animate={{ pathLength: step >= FEEL ? 1 : 0, opacity: step >= FEEL ? 1 : 0 }} transition={{ duration: 1.4, delay: step >= FEEL ? 0.9 : 0, ease: "easeInOut" }} />
      </svg>

      {STAGES.map((s, i) => {
        // On the neutral line until we ask how she feels; then each stage moves to its height.
        const top = (step >= FEEL ? cy(s.sat) : MID) - STACK / 2;
        const critical = step >= LOSE && !!s.low;
        return (
          <div key={s.id}>
            {/* The stack, at the height of how she feels. */}
            <motion.div
              initial={false}
              animate={{ opacity: step >= LOSE && !s.low ? 0.45 : 1, top: `${top}cqw` }}
              transition={{ opacity: { duration: 0.5 }, top: { type: "spring", stiffness: 110, damping: 18, delay: i * 0.07 } }}
              className="absolute grid"
              style={{ left: `${cx(i) - NOTE_W / 2}cqw`, width: `${NOTE_W}cqw`, gap: `${GAP}cqw` }}
            >
              {KINDS.map((k, ki) => {
                const on = kinds.includes(k);
                return (
                  <motion.div
                    key={k}
                    initial={false}
                    animate={{ opacity: on ? 1 : 0, y: on ? 0 : -8, rotate: on ? (((i + ki) % 3) - 1) * 1.2 : 0 }}
                    transition={{ duration: 0.45, delay: on ? i * 0.06 : 0, ease }}
                    className={cn("flex items-start rounded-[0.3cqw] p-[0.5cqw] text-[0.9cqw] font-medium leading-[1.22] shadow-[0_0.2cqw_0.6cqw_-0.2cqw_rgb(0_0_0/0.3)]", NOTE[k].bg, NOTE[k].ink)}
                    style={{ height: `${NOTE_H}cqw` }}
                  >
                    {s[k]}
                  </motion.div>
                );
              })}
              {critical && (
                <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }} aria-hidden className="pointer-events-none absolute -inset-[0.6cqw] rounded-[0.8cqw] ring-[0.3cqw] ring-orange" />
              )}
            </motion.div>
            {/* What goes wrong there, on top of the stack. */}
            {critical && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2, ease }}
                className="absolute -translate-x-1/2 whitespace-nowrap rounded-full bg-orange px-[0.8cqw] py-[0.25cqw] text-[0.95cqw] font-semibold text-white"
                style={{ left: `${cx(i)}cqw`, top: `${top - 2.6}cqw` }}
              >
                {s.low}
              </motion.span>
            )}
            {/* Stage names along the bottom. */}
            <motion.span initial={false} animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 8 }} transition={{ duration: 0.45, delay: step >= 1 ? 0.3 + i * 0.08 : 0, ease }} className="absolute -translate-x-1/2 text-center text-[1.05cqw] font-semibold leading-tight text-ink" style={{ left: `${cx(i)}cqw`, top: `${BOTTOM + 1.4}cqw`, width: `${COL}cqw` }}>
              <span className="mr-[0.4cqw] text-ink-3">{i + 1}</span>
              {s.name}
            </motion.span>
          </div>
        );
      })}

      {/* Which colour is which, as each one comes in. */}
      <div className="absolute flex gap-[0.6cqw]" style={{ right: "2cqw", top: "1.6cqw" }}>
        {kinds.map((k) => (
          <motion.span key={k} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-[0.4cqw] rounded-full bg-white px-[0.7cqw] py-[0.25cqw] text-[0.85cqw] font-semibold text-ink shadow-sm">
            <i className={cn("block size-[0.9cqw] rounded-[0.15cqw]", NOTE[k].bg)} />
            {NOTE[k].label}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* Phones: the same stages, one under the other, with how she feels as a face. */
function JourneyList() {
  return (
    <ol className="mt-8 grid gap-3">
      {STAGES.map((s, i) => (
        <li key={s.id} className={cn("rounded-[1.5rem] bg-[#f7f7f5] p-4 text-ink", s.low && "ring-4 ring-orange")}>
          <span className="flex items-center justify-between gap-3">
            <span className="text-[1.05rem] font-semibold">
              {i + 1}. {s.name}
            </span>
            {s.low ? <span className="rounded-full bg-orange px-2.5 py-0.5 text-[0.8rem] font-semibold text-white">{s.low}</span> : s.sat > 0 ? <Smile className="size-5 text-teal" /> : <Frown className="size-5 text-ink-3" />}
          </span>
          <span className="mt-3 grid gap-1.5">
            {KINDS.map((k) => (
              <span key={k} className={cn("rounded-[0.3rem] px-3 py-2 text-[0.9rem] font-medium", NOTE[k].bg, NOTE[k].ink)}>
                {s[k]}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ol>
  );
}

function JourneyStage() {
  const wide = useWide();
  return (
    <Scrolly steps={JOURNEY_STEPS.length}>
      {(step) => (
        <>
          <StageCaption step={step} steps={JOURNEY_STEPS.length} title={JOURNEY_STEPS[step]!.title} text={JOURNEY_STEPS[step]!.text} />
          {wide ? (
            <div className="relative mt-4 min-h-0 flex-1 [container-type:size]">
              <div className="mx-auto [container-type:inline-size]" style={{ width: `min(100cqw, calc(100cqh * ${RATIO}))` }}>
                <JourneyCanvas step={step} />
              </div>
            </div>
          ) : (
            <JourneyList />
          )}
        </>
      )}
    </Scrolly>
  );
}

/* ——— ¿Por qué? Una venta que no es rápida ———
   One chat across months: she says she'll think about it, then nothing,
   then she's back and has to start over. */

function LongSale() {
  const bubble = "w-fit max-w-[80%] rounded-[0.7rem] px-3 py-2 text-[0.95rem] leading-snug shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]";
  return (
    <div className="wa-font w-full max-w-[30rem] overflow-hidden rounded-[1.25rem] bg-white text-[#111b21] shadow-[0_3rem_7rem_-2rem_rgb(1_30_27/0.6)] ring-1 ring-black/10">
      <div className="flex h-14 items-center gap-3 border-b border-black/[0.06] bg-[#f0f2f5] px-4">
        <img src="/assets/personas/lucia.jpg" alt="" className="size-9 rounded-full object-cover" />
        <b className="text-[0.95rem] font-medium">Lucía</b>
      </div>
      <div className="wa-paper grid gap-2 px-4 py-4">
        <span className="mx-auto rounded-md bg-white px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-[#54656f]">Semana 1</span>
        <span className={cn(bubble, "bg-white")}>precio?</span>
        <span className={cn(bubble, "ml-auto bg-wa-bubble")}>¡Hola Lucía! Desde USD 68.000. ¿Te paso el brochure?</span>
        <span className={cn(bubble, "bg-white")}>Dale. Lo pienso y te aviso.</span>
        <FadeUp delay={0.3} className="my-3 flex items-center gap-3 text-[0.85rem] font-semibold text-[#54656f]">
          <span className="h-px flex-1 bg-black/15" />
          3 meses sin contacto
          <span className="h-px flex-1 bg-black/15" />
        </FadeUp>
        <span className={cn(bubble, "bg-white")}>Hola, ¿sigue disponible el de 2 dormitorios?</span>
      </div>
    </div>
  );
}

/* ——— ¿Qué obtuvimos? ———
   The three critical moments, each with what goes wrong and what MARQ needs
   to be able to do there. Needs, not features: the ideas come next. */

const MOMENTS = [
  { stage: "Espera", pain: "La respuesta llega tarde", need: "Responder en la primera hora" },
  { stage: "Desaparece", pain: "Nadie la vuelve a contactar", need: "Saber a quién retomar y cuándo" },
  { stage: "Vuelve", pain: "Tiene que empezar de cero", need: "Que la conversación tenga memoria" },
];

export function Journey() {
  return (
    <>
      <Section sky={SKY.noon} id="journey" className="py-28 sm:py-40" aria-labelledby="journey-title">
        <TechniquePill id="journey" />
        <div className="mx-auto mt-6 grid max-w-[64rem] justify-items-center text-center">
          <RiseLines id="journey-title" lines={["Customer Journey"]} className="display sky-type text-[clamp(3rem,7.4vw,8rem)]" />
          <FadeUp delay={0.15}>
            <p className="sky-type mt-5 text-[clamp(1.2rem,2vw,2.1rem)] font-medium text-white/85">El recorrido de una persona, etapa por etapa.</p>
          </FadeUp>
        </div>

        <article className="mx-auto mt-24 grid max-w-[84rem] items-center gap-10 sm:mt-32 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <FadeUp className="flex min-w-0 justify-center">
            <LongSale />
          </FadeUp>
          <FadeUp delay={0.1} className="grid gap-5">
            <h3 className="display sky-type text-[clamp(2.4rem,4vw,4.4rem)] font-bold!">¿Por qué la elegimos?</h3>
            <BigList items={["No es una venta rápida", "Hasta seis contactos por venta", "No sabemos dónde se corta"]} />
          </FadeUp>
        </article>
      </Section>

      <Section sky={SKY.noon} id="journey-aplicacion" className="pt-12 sm:pt-20" aria-labelledby="journey-aplicacion-title">
        <PartTitle id="journey-aplicacion-title">¿Cómo la aplicamos?</PartTitle>
        <JourneyStage />
      </Section>

      <Section sky={SKY.noon} id="journey-resultado" className="py-28 sm:py-40" aria-labelledby="journey-resultado-title">
        <PartTitle id="journey-resultado-title">¿Qué obtuvimos?</PartTitle>
        <div className="mx-auto mt-10 grid max-w-[72rem] justify-items-center text-center">
          <RiseLines as="h3" lines={["La venta no se pierde en la consulta.", <em key="e" className="text-white/70">Se pierde en el silencio.</em>]} className="display sky-type text-[clamp(2rem,4.4vw,4.8rem)]" />
        </div>
        <div className="mx-auto mt-14 grid max-w-[76rem] gap-3.5 md:grid-cols-3">
          {MOMENTS.map((m, i) => (
            <FadeUp key={m.stage} delay={i * 0.1} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-[#f7f7f5] text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)]">
                <div className="m-2.5 rounded-[1.6rem] bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#eef3f1_60%,#e3ebe8_100%)] p-5 ring-1 ring-black/[0.04]">
                  <span className="rounded-full bg-orange px-3 py-1 text-[0.9rem] font-semibold text-white">{m.stage}</span>
                  <p className="mt-4 text-[clamp(1.2rem,1.6vw,1.65rem)] font-semibold leading-tight tracking-[-0.02em]">{m.pain}</p>
                </div>
                <p className="px-6 pb-6 pt-3 leading-snug">
                  <span className="block text-[0.85rem] font-semibold text-teal">MARQ necesita</span>
                  <span className="mt-1 block text-[clamp(1.05rem,1.2vw,1.25rem)] font-semibold">{m.need}</span>
                </p>
              </article>
            </FadeUp>
          ))}
        </div>
      </Section>
    </>
  );
}
