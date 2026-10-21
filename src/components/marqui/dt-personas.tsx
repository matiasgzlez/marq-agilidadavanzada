import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { FadeUp, RiseLines, Section, ease } from "./primitives";
import { MarquiMark } from "./marqui-mark";
import { MarqadorMark } from "./marqador-mark";
import { BigList, PartTitle, STICKY, Scrolly, StageCaption, TechniquePill } from "./dt-kit";
import { SKY } from "./sky";

/* ——— Técnica 2 · Personas ———
   Same shape as Clustering: what it is, why, how (where the four come from,
   then each one), and what we got (the three questions that tell them
   apart, which MARQui asks inside a reply). Text stays short on screen;
   the explanation is said over it and lives in the doc. */

type PersonaId = "roberto" | "lucia" | "marta" | "tomas";

const PERSONAS: {
  id: PersonaId;
  name: string;
  age: number;
  who: string;
  quote: string;
  segment: "inversor" | "final";
  tone: string;
  from: string;
  fields: [string, string][];
  says: string;
  marqui: string;
}[] = [
  {
    id: "roberto",
    name: "Roberto",
    age: 58,
    who: "El inversor que ya confía",
    quote: "Anotame, ya los conozco.",
    segment: "inversor",
    tone: "from-[#19d3b4] to-[#014645]",
    from: "«Tiene gente fija que ya confía en ellos»",
    fields: [
      ["Busca", "Entrar primero a la preventa"],
      ["Piensa y siente", "Confía en MARQ, quiere rentabilidad"],
      ["Le frustra", "Que lo traten como uno más"],
      ["Cómo decide", "Rápido y solo"],
      ["Llega por", "WhatsApp de clientes"],
      ["Necesita de MARQ", "Prioridad y trato directo"],
    ],
    says: "Hola Cande, ¿sale algo nuevo? Anotame.",
    marqui: "Cliente destacado: te avisa apenas escribe",
  },
  {
    id: "lucia",
    name: "Lucía",
    age: 41,
    who: "La inversora que llega por primera vez",
    quote: "¿Y si el edificio no se termina?",
    segment: "inversor",
    tone: "from-[#7fb4ff] to-[#23488f]",
    from: "«Hay gente que es su primera vez invirtiendo»",
    fields: [
      ["Busca", "Renta o revalorización"],
      ["Piensa y siente", "Miedo a comprar algo que no se ve"],
      ["Le frustra", "Que la presionen o la olviden"],
      ["Cómo decide", "En semanas, con su contador"],
      ["Llega por", "Un anuncio en Instagram"],
      ["Necesita de MARQ", "Pruebas de trayectoria y seguimiento"],
    ],
    says: "¿Qué pasa si la obra se atrasa?",
    marqui: "Respuesta con obras entregadas, y aviso si reaparece",
  },
  {
    id: "marta",
    name: "Marta",
    age: 63,
    who: "La que compra para vivir",
    quote: "Contame todo, desde acá hasta acá.",
    segment: "final",
    tone: "from-[#ffa25c] to-[#b13d0c]",
    from: "«Su consumidor final es una persona grande»",
    fields: [
      ["Busca", "Su casa, con cada detalle claro"],
      ["Piensa y siente", "Desconfía de lo automático"],
      ["Le frustra", "Hablar con una máquina"],
      ["Cómo decide", "En familia, con tiempo"],
      ["Llega por", "Teléfono o recomendación"],
      ["Necesita de MARQ", "Una persona con nombre"],
    ],
    says: "¿Me pueden llamar? Prefiero hablar.",
    marqui: "Respuesta con tu nombre y propuesta de llamada",
  },
  {
    id: "tomas",
    name: "Tomás",
    age: 26,
    who: "El joven que hoy no llega",
    quote: "Me encanta, pero no me dan crédito.",
    segment: "final",
    tone: "from-[#c4b5fd] to-[#4b3b9a]",
    from: "«32 casas en 120 cuotas: muchas consultas y ninguna venta»",
    fields: [
      ["Busca", "Dejar de alquilar"],
      ["Piensa y siente", "Entusiasmo, pero no le alcanza"],
      ["Le frustra", "No tener una respuesta clara"],
      ["Cómo decide", "Según la cuota"],
      ["Llega por", "Un anuncio, con un «precio?»"],
      ["Necesita de MARQ", "Honestidad y seguir en contacto"],
    ],
    says: "¿Se puede con crédito?",
    marqui: "Anota cómo paga; MARQador lo suma a Frenos",
  },
];

function Face({ p, className }: { p: (typeof PERSONAS)[number]; className?: string }) {
  return <span className={cn("grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-semibold text-white", p.tone, className)}>{p.name[0]}</span>;
}

/* ——— ¿Por qué? Mismo mensaje, cuatro personas ———
   A chat list where four contacts sent the same "precio?". It loops: first
   they're four unknown numbers, then who's behind each one shows up. */

function SameMessage() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const [known, setKnown] = useState(!!reduce);
  useEffect(() => {
    if (!inView || reduce) return;
    setKnown(false);
    const t = window.setInterval(() => setKnown((k) => !k), 2800);
    return () => clearInterval(t);
  }, [inView, reduce]);
  return (
    <div ref={ref} className="wa-font w-full max-w-[30rem] overflow-hidden rounded-[1.25rem] bg-white text-[#111b21] shadow-[0_3rem_7rem_-2rem_rgb(1_30_27/0.6)] ring-1 ring-black/10">
      <div className="flex h-14 items-center border-b border-black/[0.06] bg-[#f0f2f5] px-4 text-[0.95rem] font-semibold">Chats</div>
      {PERSONAS.map((p, i) => (
        <div key={p.id} className="flex items-center gap-3 border-b border-black/[0.05] px-4 py-3 last:border-0">
          <span className="relative size-12 shrink-0">
            <span className="absolute inset-0 grid place-items-center rounded-full bg-[#dfe5e7] text-[#8696a0]">
              <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
                <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2.2c-4 0-8 2-8 5.3V21h16v-1.5c0-3.3-4-5.3-8-5.3Z" />
              </svg>
            </span>
            <motion.span initial={false} animate={{ opacity: known ? 1 : 0, scale: known ? 1 : 0.7 }} transition={{ duration: 0.45, delay: known ? i * 0.12 : 0, ease }} className="absolute inset-0">
              <Face p={p} className="size-12 text-[1.1rem]" />
            </motion.span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="relative h-5 flex-1 overflow-hidden text-[1rem] font-medium">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={known ? "k" : "u"} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.3, delay: known ? i * 0.12 : 0 }} className="absolute inset-0 truncate">
                    {known ? `${p.name}, ${p.age}` : `+54 9 362 4${i}${7 - i}-${2 + i}81${i}`}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-[0.75rem] text-[#25d366]">10:{12 + i * 3}</span>
            </span>
            <span className="mt-0.5 flex items-center justify-between gap-2">
              <span className="text-[0.9rem] text-[#667781]">precio?</span>
              <motion.span initial={false} animate={{ opacity: known ? 1 : 0 }} transition={{ duration: 0.4, delay: known ? 0.2 + i * 0.12 : 0 }} className="truncate rounded-full bg-[#e7f8f4] px-2 py-0.5 text-[0.72rem] font-semibold text-teal-deep">
                {p.who.replace(/^(El|La) /, "")}
              </motion.span>
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ——— ¿Cómo? De dónde salen ———
   The context note from the clustering splits in two segments, then in
   four profiles, each with the interview line it comes from. The clients
   we left out show last. */

const TREE_STEPS = ["Partimos de una nota del clustering", "Dos segmentos", "Cuatro perfiles", "Lo que dejamos afuera"];

function Tree({ step }: { step: number }) {
  const segs = [
    { id: "inversor", name: "Inversores", sub: "Renta o revalorización" },
    { id: "final", name: "Consumidores finales", sub: "Compran para vivir" },
  ] as const;
  const show = (s: number) => ({ initial: false as const, animate: { opacity: step >= s ? 1 : 0, y: step >= s ? 0 : 14 }, transition: { duration: 0.55, ease } });
  return (
    <div className="mx-auto mt-6 grid w-full max-w-[72rem] justify-items-center">
      <div className={cn(STICKY, "w-[16rem] bg-white p-3.5 text-[0.95rem] font-medium leading-snug text-ink ring-2 ring-teal/40")}>Dos grandes clientes: consumidores finales e inversores.</div>
      {/* The branches: down from the note, across, and down into each segment. */}
      <motion.span {...show(1)} aria-hidden className="block h-6 w-0.5 bg-white/60" />
      <motion.span {...show(1)} aria-hidden className="block h-0.5 w-1/2 bg-white/60" />
      <div className="grid w-full grid-cols-2 gap-4">
        {segs.map((sg) => (
          <motion.div key={sg.id} {...show(1)} className="grid justify-items-center">
            <span aria-hidden className="block h-5 w-0.5 bg-white/60" />
            <div className="rounded-full bg-ink/85 px-5 py-2.5 text-center text-white ring-1 ring-white/15">
              <span className="block text-[clamp(1.05rem,1.3vw,1.35rem)] font-semibold">{sg.name}</span>
              <span className="block text-[0.85rem] text-white/65">{sg.sub}</span>
            </div>
            <motion.span {...show(2)} aria-hidden className="block h-5 w-0.5 bg-white/60" />
            <motion.span {...show(2)} aria-hidden className="block h-0.5 w-1/2 bg-white/60" />
            <div className="grid w-full grid-cols-2 gap-3">
              {PERSONAS.filter((p) => p.segment === sg.id).map((p, k) => (
                <motion.article key={p.id} initial={false} animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 16 }} transition={{ duration: 0.55, delay: step >= 2 ? k * 0.1 : 0, ease }} className="relative mt-5 rounded-[1.5rem] bg-[#f7f7f5] p-4 text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)] before:absolute before:-top-5 before:left-1/2 before:h-5 before:w-0.5 before:bg-white/60">
                  <span className="flex items-center gap-3">
                    <Face p={p} className="size-11 text-[1.05rem]" />
                    <span className="min-w-0 leading-tight">
                      <span className="block text-[clamp(1rem,1.15vw,1.2rem)] font-semibold">
                        {p.name}, {p.age}
                      </span>
                      <span className="block text-[0.85rem] text-ink-3">{p.who}</span>
                    </span>
                  </span>
                  <p className="mt-3 border-t border-line pt-2.5 text-[clamp(0.85rem,0.95vw,1rem)] leading-snug text-ink-2">{p.from}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div {...show(3)} className="mt-5 flex items-center gap-3 rounded-full border-2 border-dashed border-white/50 px-5 py-2.5 text-white">
        <span className="text-[clamp(1rem,1.15vw,1.2rem)] font-semibold">Afuera: arquitectura para terceros</span>
        <span className="text-[0.9rem] text-white/70">Su recorrido es distinto</span>
      </motion.div>
    </div>
  );
}

/* ——— ¿Cómo? Cada Persona ———
   One per stretch of scroll: who, the line that sums them up, and six short
   fields (the empathy map lives in «Piensa y siente» and «Le frustra»). */

function PersonaCard({ p }: { p: (typeof PERSONAS)[number] }) {
  return (
    <motion.article key={p.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease }} className="grid overflow-hidden rounded-[2rem] bg-[#f7f7f5] p-2.5 text-ink shadow-[0_2.5rem_5rem_-2rem_rgb(1_30_27/0.5)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="grid content-between gap-8 rounded-[1.6rem] bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#eef3f1_60%,#e3ebe8_100%)] p-6 ring-1 ring-black/[0.04] sm:p-8">
        <span className="flex items-center gap-4">
          <Face p={p} className="size-16 text-[1.6rem]" />
          <span className="leading-tight">
            <span className="block text-[clamp(1.4rem,1.9vw,2rem)] font-semibold tracking-[-0.02em]">
              {p.name}, {p.age}
            </span>
            <span className="block text-[clamp(0.95rem,1.1vw,1.15rem)] text-ink-3">{p.who}</span>
          </span>
        </span>
        <p className="text-[clamp(1.6rem,2.6vw,2.8rem)] font-semibold leading-[1.1] tracking-[-0.03em]">«{p.quote}»</p>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 p-6 sm:p-8">
        {p.fields.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[0.85rem] font-semibold text-teal">{k}</dt>
            <dd className="mt-1 text-[clamp(1rem,1.2vw,1.25rem)] font-medium leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
    </motion.article>
  );
}

/* ——— ¿Qué obtuvimos? ———
   The same "precio?" asks for four different answers. Three questions tell
   them apart, and MARQui asks them inside a reply; each Persona leaves a
   sign in the chat that MARQui acts on. */

const ASKS = ["¿Para vivir o para invertir?", "¿Ya compró con MARQ?", "¿Cómo piensa pagar?"];

export function Personas() {
  return (
    <>
      <Section sky={SKY.noon} id="personas" className="py-28 sm:py-40" aria-labelledby="personas-title">
        <TechniquePill id="personas" />
        <div className="mx-auto mt-6 grid max-w-[60rem] justify-items-center text-center">
          <RiseLines id="personas-title" lines={["Personas"]} className="display sky-type text-[clamp(3.4rem,8vw,8.5rem)]" />
          <FadeUp delay={0.15}>
            <p className="sky-type mt-5 text-[clamp(1.2rem,2vw,2.1rem)] font-medium text-white/85">Perfiles ficticios, basados en lo que contó Cande.</p>
          </FadeUp>
        </div>

        <article className="mx-auto mt-24 grid max-w-[84rem] items-center gap-10 sm:mt-32 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <FadeUp className="flex min-w-0 justify-center">
            <SameMessage />
          </FadeUp>
          <FadeUp delay={0.1} className="grid gap-5">
            <h3 className="display sky-type text-[clamp(2.4rem,4vw,4.4rem)] font-bold!">¿Por qué la elegimos?</h3>
            <BigList items={["Todos escriben «precio?»", "Detrás hay personas distintas", "Hoy no se pueden distinguir"]} />
          </FadeUp>
        </article>
      </Section>

      <Section sky={SKY.noon} id="personas-aplicacion" className="pt-12 sm:pt-20" aria-labelledby="personas-aplicacion-title">
        <PartTitle id="personas-aplicacion-title">¿Cómo la aplicamos?</PartTitle>
        <Scrolly steps={TREE_STEPS.length} className="justify-center">
          {(step) => (
            <>
              <StageCaption step={step} steps={TREE_STEPS.length} title={TREE_STEPS[step]} />
              <Tree step={step} />
            </>
          )}
        </Scrolly>
        <Scrolly steps={PERSONAS.length} className="justify-center">
          {(step) => {
            const p = PERSONAS[step]!;
            return (
              <>
                <StageCaption step={step} steps={PERSONAS.length} title={p.who} />
                <div className="mx-auto mt-8 w-full max-w-[76rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <PersonaCard key={p.id} p={p} />
                  </AnimatePresence>
                </div>
              </>
            );
          }}
        </Scrolly>
      </Section>

      <Section sky={SKY.noon} id="personas-resultado" className="py-28 sm:py-40" aria-labelledby="personas-resultado-title">
        <PartTitle id="personas-resultado-title">¿Qué obtuvimos?</PartTitle>
        <div className="mx-auto mt-10 grid max-w-[72rem] justify-items-center text-center">
          <RiseLines as="h3" lines={["Mismo «precio?»,", <em key="e" className="text-white/70">cuatro respuestas distintas.</em>]} className="display sky-type text-[clamp(2rem,4.4vw,4.8rem)]" />
        </div>

        {/* The three questions that tell them apart: MARQui slips them into a reply, and they fill the client's card. */}
        <FadeUp delay={0.1} className="mx-auto mt-12 flex max-w-[64rem] flex-wrap justify-center gap-3">
          {ASKS.map((q) => (
            <span key={q} className="inline-flex items-center gap-2.5 rounded-full bg-white py-2 pl-2 pr-5 text-[clamp(1rem,1.25vw,1.3rem)] font-semibold text-ink shadow-[0_1rem_2rem_-1rem_rgb(1_30_27/0.5)]">
              <span className="grid size-8 place-items-center rounded-full bg-ink">
                <MarquiMark tone="light" className="size-5" title="" />
              </span>
              {q}
            </span>
          ))}
        </FadeUp>

        {/* Each Persona leaves a sign in the chat, and MARQui does something with it. */}
        <div className="mx-auto mt-14 grid max-w-[84rem] gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p, i) => (
            <FadeUp key={p.id} delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-[#f7f7f5] text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)]">
                <div className="wa-paper wa-font m-2.5 grid gap-2 rounded-[1.6rem] p-4 ring-1 ring-black/[0.04]">
                  <span className="flex items-center gap-2">
                    <Face p={p} className="size-8 text-[0.85rem]" />
                    <b className="text-[0.9rem] font-medium">{p.name}</b>
                  </span>
                  <span className="w-fit max-w-[92%] rounded-[0.6rem] rounded-tl-none bg-white px-3 py-2 text-[0.92rem] leading-snug text-[#111b21] shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">{p.says}</span>
                </div>
                <p className="flex flex-1 items-start gap-2.5 px-5 pb-6 pt-2 text-[clamp(0.98rem,1.1vw,1.15rem)] font-semibold leading-snug">
                  {p.id === "tomas" ? <MarqadorMark className="mt-0.5 size-6 shrink-0" title="" /> : <MarquiMark tone="ink" className="mt-0.5 size-6 shrink-0" title="" />}
                  {p.marqui}
                </p>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2} className="mt-12 flex justify-center">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-ink/85 py-2 pl-2 pr-5 text-[clamp(0.95rem,1.1vw,1.15rem)] font-medium text-white ring-1 ring-white/15">
            <span className="grid size-8 place-items-center rounded-full bg-white">
              <MarqadorMark className="size-5" title="" />
            </span>
            Son hipótesis: se validan con los datos reales de MARQador
          </span>
        </FadeUp>
      </Section>
    </>
  );
}
