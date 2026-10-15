import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowLeft, CheckCheck, Info, Megaphone, MessageCircle, PenLine, Sunrise, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pose } from "./marqui-character";
import { FadeUp, MarquiAvatar, Section, ease } from "./primitives";
import { Lead } from "./story";
import { MarquiMark } from "./marqui-mark";
import { SKY } from "./sky";
import { FollowVisual } from "./follow";
import { AskVisual } from "./ask";
import { LearnText, LearnVisual } from "./learn";
import { MobileLimits, MobileSteps, MobileVisual } from "./mobile";
import { BUBBLE, ChatHeader, ChatWindow, Composer, Cursor, Face, SuggestionTray, Tail, Time } from "./wa-kit";

/** `wide`: the visual is a full WhatsApp Web window (chat list + chat) and takes the larger column. */
/** `center`: the visual sits in the middle of the page, the text on its left, and `aside` under the text. */
type Feature = { title: string; text: ReactNode; visual: ReactNode; tint?: string; pose: Pose; wide?: boolean; center?: boolean; aside?: ReactNode; after?: ReactNode };

const features: Feature[] = [
  {
    title: "Te sugiere qué responder",
    text: "Abrís el chat de un potencial cliente y MARQui ya lo leyó. Te deja tres respuestas con el tono de MARQ: tocás una, la ajustás si querés y la mandás vos, con tu nombre.",
    visual: <RepliesVisual />,
    pose: "guino",
  },
  {
    title: "Arma la ficha de cada cliente",
    text: "Mientras charlan, MARQui anota qué proyecto le interesa, qué busca, cómo piensa pagar y en qué etapa está. Si falta un dato, lo pregunta sutilmente dentro de una respuesta.",
    visual: <CardVisual />,
    pose: "pensando",
  },
  {
    title: "Tu día, resumido cada mañana",
    text: "A las 9 te llega lo que pasó ayer y lo que no puede esperar hoy. Tocás un nombre y abrís su chat. Durante el día, solo te escribe si vuelve un cliente, reaparece alguien, llega un referido o te escribe alguien que seguís.",
    visual: <BriefVisual />,
    pose: "sorpresa",
  },
  {
    title: "Seguí a los que importan",
    text: "Marcás a un potencial cliente importante y MARQui te avisa apenas te escribe, para que no espere. Y le podés dar tareas que se repiten, como una lista diaria por proyecto. Todo queda a la vista en sus reglas.",
    visual: <FollowVisual />,
    wide: true,
    pose: "guino",
  },
  {
    title: "Le preguntás lo que necesites",
    text: "Le escribís o le mandás un audio, como a un compañero. Te contesta con los números de un vistazo, o con la lista: cada nombre abre su chat, y viene en Excel si la necesitás.",
    visual: <AskVisual />,
    pose: "alegria",
  },
  {
    title: "Aprende cómo trabaja MARQ",
    text: <LearnText />,
    visual: <LearnVisual />,
    wide: true,
    pose: "derecha",
  },
  {
    title: "También en el celular",
    text: "En el celular, MARQui es un contacto más: le preguntás y te contesta, o le reenviás el mensaje de un cliente y te devuelve tres respuestas para copiar.",
    visual: <MobileVisual />,
    center: true,
    aside: <MobileLimits />,
    after: <MobileSteps />,
    pose: "inclinado",
  },
];

export function Functions() {
  return (
    <Section sky={SKY.noon} id="funciones" className="py-28 sm:py-40" aria-labelledby="funciones-title">
      <Lead id="funciones-title" title={["¿Qué podés hacer", <em key="e">con MARQui?</em>]}>
        Siete cosas que cambian el día a día del equipo, sin salir de WhatsApp.
      </Lead>


      <div className="mx-auto mt-20 grid max-w-[84rem] gap-24 sm:gap-32">
        {features.map((f, i) => (
          <article key={f.title} className={cn("grid items-center gap-8 lg:gap-16", f.center ? "lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-12" : f.wide ? (i % 2 === 1 ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]" : "lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]") : "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]")}>
            <FadeUp className={cn("min-w-0", (i % 2 === 1 || f.center) && "lg:order-2")}>
              <div className={cn("relative grid min-h-[30rem] grid-cols-[minmax(0,1fr)] place-items-center text-ink", f.tint ? "overflow-hidden rounded-[2.5rem] p-6 sm:p-12" : "items-start lg:min-h-[36rem]", f.tint)}>
                {f.visual}
              </div>
            </FadeUp>
            <FadeUp delay={0.1} className={cn("grid gap-4", (i % 2 === 1 || f.center) && "lg:order-1")}>
              <h3 className="display sky-type text-[clamp(2.4rem,4vw,4.4rem)] font-bold!">{f.title}</h3>
              <p className="sky-type text-[clamp(1.25rem,1.75vw,1.85rem)] font-medium leading-[1.45] text-white/90">{f.text}</p>
              {f.aside && <div className="mt-3">{f.aside}</div>}
            </FadeUp>
            {f.after && (
              <FadeUp delay={0.2} className="min-w-0 lg:order-3">
                {f.after}
              </FadeUp>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}


/* ——— Visuals ——— */

function RepliesVisual() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.6 });
  const replies = [
    "¡Hola Juan! En MARQ Collection hay de 1, 2 y 3 dormitorios desde USD 68.000. ¿Cuántos dormitorios buscás?",
    "¡Hola Juan! Los valores arrancan en USD 68.000, con anticipo y cuotas. ¿Lo pensás para vivir o para invertir?",
    "¡Hola Juan! Te paso la lista con valores y disponibilidad. ¿Te viene bien una llamada corta hoy?",
  ];
  const pick = 1;
  const full = replies[pick]!;
  // The hand causes the reaction: the cursor taps a reply, and it lands in your text box.
  const [picked, setPicked] = useState<number | null>(reduce ? pick : null);
  const [draft, setDraft] = useState(reduce ? full : "");

  useEffect(() => {
    if (!inView || reduce) return;
    const ids: number[] = [];
    const at = (ms: number, fn: () => void) => ids.push(window.setTimeout(fn, ms));
    at(2500, () => setPicked(pick));
    for (let i = 0; i <= full.length; i += 3) at(2750 + i * 9, () => setDraft(full.slice(0, i)));
    at(2750 + full.length * 9 + 40, () => setDraft(full));
    return () => ids.forEach(clearTimeout);
  }, [inView, reduce, full]);

  const typing = draft.length > 0 && draft.length < full.length;

  return (
    <div ref={root} className="wa-font relative w-full max-w-[29rem] text-[#111b21]">
      <ChatWindow>
        <ChatHeader name="Juan">en línea</ChatHeader>

        <div className="wa-paper grid gap-2 px-4 pb-4 pt-3">
          <span className={cn("mx-auto rounded-md bg-white px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wide text-[#54656f]", BUBBLE)}>Hoy</span>
          <div className={cn("relative w-fit max-w-[78%] rounded-[0.55rem] rounded-tl-none bg-white p-1", BUBBLE)}>
            <Tail />
            <div className="flex items-center gap-2 rounded-[0.4rem] bg-[#f5f6f6] py-1.5 pl-1.5 pr-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-[0.3rem] bg-[linear-gradient(140deg,#8ad8c8,#014645)]">
                <Megaphone className="size-4 text-white" />
              </span>
              <span className="min-w-0 leading-tight">
                <b className="block text-[0.74rem] font-semibold text-black/75">Anuncio · MARQ Collection</b>
                <span className="block truncate text-[0.7rem] text-[#667781]">Departamentos en Resistencia</span>
              </span>
            </div>
            <p className="px-1.5 pb-0.5 pt-1 text-[0.9rem] leading-[1.35]">
              precio?
              <span className="ml-3 inline-block translate-y-1 text-[0.66rem] text-[#667781]">10:30</span>
            </p>
          </div>
        </div>

        <SuggestionTray replies={replies} picked={picked} show={inView} cursorAt={pick} cursor={<Cursor play={inView} />} />

        <Composer draft={draft} typing={typing} />
      </ChatWindow>
      <p className="sky-type mt-4 flex items-center justify-center gap-2 text-[0.9rem] font-medium text-white/85">
        <PenLine className="size-4" /> Se escribe en tu cuadro de texto. La enviás vos.
      </p>
    </div>
  );
}

function CardVisual() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.6 });
  // 0 MARQui suggests · 1 you tap it: it lands in your text box · 2 you tweak it · 3 you send it
  // · 4 Marta types · 5 Marta answers · 6 MARQui writes it down.
  // It loops while on screen, so the explanation always comes back. With reduced motion it stays on the suggestion.
  const reply = "¡Qué bueno que volviste, Marta! La 3B sigue disponible. ¿La pensás con crédito o de contado?";
  const edited = `${reply} 😊`;
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    setStep(0);
    setDraft("");
    const ids: number[] = [];
    const at = (ms: number, fn: () => void) => ids.push(window.setTimeout(fn, ms));
    at(2550, () => setStep(1));
    for (let i = 0; i <= reply.length; i += 4) at(2650 + i * 6, () => setDraft(reply.slice(0, i)));
    at(2650 + reply.length * 6 + 20, () => setDraft(reply));
    at(3700, () => setStep(2));
    at(3900, () => setDraft(edited));
    at(5150, () => {
      setStep(3);
      setDraft("");
    });
    at(6300, () => setStep(4));
    at(7700, () => setStep(5));
    at(8300, () => setStep(6));
    at(12000, () => setRun((r) => r + 1));
    return () => ids.forEach(clearTimeout);
  }, [inView, reduce, run, reply, edited]);

  const tags: { label: string; value: string | null; solid?: boolean }[] = [
    { label: "Proyecto", value: "MARQ Collection" },
    { label: "Busca", value: "3 dorm · vivir" },
    { label: "Paga", value: step >= 6 ? "Crédito" : null },
    { label: "Etapa", value: "Interesado", solid: true },
  ];
  const pop = { initial: { opacity: 0, y: 10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.4, ease } };

  return (
    <div ref={root} className="wa-font relative w-full max-w-[29rem] self-center text-[#111b21]">
      <ChatWindow>
        {/* MARQui's tags, right under the name: what we know, and what's still missing. */}
        <ChatHeader
          name="Marta Ríos"
          below={
            <div className="flex flex-wrap items-center gap-1 pb-0.5 pl-12 pt-2">
              <MarquiMark tone="teal" className="mr-0.5 size-3.5" title="Etiquetas de MARQui" />
              {tags.map((t) => (
                <motion.span
                  key={`${t.label}-${t.value ?? "none"}`}
                  initial={t.label === "Paga" && t.value && !reduce ? { scale: 0.8, backgroundColor: "#25d366" } : false}
                  animate={{ scale: 1, backgroundColor: t.value ? (t.solid ? "#008c7e" : "#ffffff") : "rgba(255,255,255,0)" }}
                  transition={{ duration: 0.7, ease }}
                  className={cn(
                    "inline-flex h-[1.35rem] items-center gap-1 rounded-full px-2 text-[0.68rem] leading-none",
                    !t.value ? "border border-dashed border-black/25 text-[#667781]" : t.solid ? "text-white" : "shadow-[0_0_0_1px_rgb(0_0_0/0.07)]",
                  )}
                >
                  <span className={t.solid ? "text-white/75" : "text-[#667781]"}>{t.label}</span>
                  <b className="font-semibold">{t.value ?? "?"}</b>
                </motion.span>
              ))}
              <span className="inline-flex h-[1.35rem] items-center rounded-full bg-[#ffecc7] px-2 text-[0.68rem] font-semibold leading-none text-[#7a4a00]">Reaparece · 40 días</span>
            </div>
          }
        >
          en línea
        </ChatHeader>

        <div className="flex h-[27rem] flex-col">
        <div className="wa-paper flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-4 pb-3 pt-3">
          <span className={cn("mx-auto mb-1 rounded-md bg-white px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wide text-[#54656f]", BUBBLE)}>Hoy</span>
          <motion.div layout transition={{ duration: 0.45, ease }} className={cn("relative w-fit max-w-[78%] rounded-[0.55rem] rounded-tl-none bg-white px-2.5 py-1.5 text-[0.86rem] leading-[1.35]", BUBBLE)}>
            <Tail />
            ¡Hola! ¿Sigue disponible la 3B? Ahora sí estamos para mudarnos 🙂
            <Time>11:12</Time>
          </motion.div>
          <AnimatePresence initial={false} mode="popLayout">
            {step >= 3 && (
              <motion.div key={`sent-${run}`} layout {...pop} className={cn("relative ml-auto w-fit max-w-[82%] rounded-[0.55rem] rounded-tr-none bg-wa-bubble px-2.5 py-1.5 text-[0.86rem] leading-[1.35]", BUBBLE)}>
                <Tail out />
                {edited}
                <Time read>11:14</Time>
              </motion.div>
            )}
            {step === 4 && (
              <motion.span key={`typing-${run}`} {...pop} exit={{ opacity: 0 }} className={cn("relative flex w-fit gap-1 rounded-[0.55rem] rounded-tl-none bg-white px-3 py-2.5", BUBBLE)} aria-label="Marta está escribiendo">
                <Tail />
                {[0, 1, 2].map((d) => (
                  <motion.i key={d} className="size-1.5 rounded-full bg-black/35" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
                ))}
              </motion.span>
            )}
            {step >= 5 && (
              <motion.div key={`answer-${run}`} layout {...pop} className={cn("relative w-fit max-w-[78%] rounded-[0.55rem] rounded-tl-none bg-white px-2.5 py-1.5 text-[0.86rem] leading-[1.35]", BUBBLE)}>
                <Tail />
                Con crédito hipotecario 👍
                <Time>11:15</Time>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence initial={false}>
          {step === 0 && (
            /* Three replies; the first carries the question that was missing. */
            <motion.div key={`tray-${run}`} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
              <SuggestionTray
                replies={[
                  <>
                    ¡Qué bueno que volviste, Marta! La 3B sigue disponible. <mark className="rounded-[0.25rem] bg-[#008c7e]/12 px-0.5 font-medium text-[#00594f]">¿La pensás con crédito o de contado?</mark>
                  </>,
                  "¡Hola Marta! Sí, la 3B sigue libre. ¿Querés venir a verla esta semana?",
                  "¡Hola Marta! Sigue disponible. Te paso el plano y los valores actualizados.",
                ]}
                show={inView}
                cursorAt={0}
                cursor={<Cursor play={inView} />}
                note={
                  <span className="flex items-start gap-1.5">
                    <Info className="mt-px size-3.5 shrink-0 text-[#008c7e]" aria-hidden />
                    <span>
                      <b className="font-semibold text-[#111b21]">Faltaba saber cómo paga.</b> Por eso la 1 suma la pregunta al final.
                    </span>
                  </span>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Composer draft={draft} typing={step === 1 && draft !== reply} cursor={step === 2 && <Cursor key={run} play delay={0} />} />
        </div>
      </ChatWindow>
      <p className="sky-type mt-4 flex items-center justify-center gap-2 text-[0.9rem] font-medium text-white/85">
        <Tag className="size-4" /> La ficha se completa sola mientras charlan.
      </p>
    </div>
  );
}

type Mark = "reaparece" | "referido" | "pendiente";
type Pending = {
  id: string;
  name: string;
  mark: Mark;
  markText: string;
  why: string;
  tags: { label: string; value: string | null }[];
  message: string;
  time: string;
  suggestions: [string, string, string];
  /** The last time they talked, if there was one. */
  before?: { day: string; msgs: { out?: boolean; text: string; time: string }[] };
};

const MARKS: Record<Mark, string> = {
  reaparece: "bg-[#ffecc7] text-[#7a4a00]",
  referido: "bg-[#d7f3ec] text-[#00594f]",
  pendiente: "bg-[#ffe3dc] text-[#9a2f17]",
};

/* What can't wait today. Each one opens its chat, with the tags and a reply already waiting. */
const pending: Pending[] = [
  {
    id: "marta",
    name: "Marta Ríos",
    mark: "reaparece",
    markText: "Reaparece · 40 días",
    why: "Volvió a escribir anoche. Pregunta si sigue la 3B.",
    tags: [{ label: "Proyecto", value: "MARQ Collection" }, { label: "Busca", value: "3 dorm · vivir" }, { label: "Paga", value: null }],
    message: "¡Hola! ¿Sigue disponible la 3B? Ahora sí estamos para mudarnos 🙂",
    time: "21:48",
    suggestions: [
      "¡Qué bueno que volviste, Marta! La 3B sigue disponible. ¿La pensás con crédito o de contado?",
      "¡Hola Marta! Sí, la 3B sigue libre. ¿Querés venir a verla esta semana?",
      "¡Hola Marta! Sigue disponible. Te paso el plano y los valores actualizados.",
    ],
    before: {
      day: "5 de septiembre",
      msgs: [
        { text: "Buenas, ¿cuánto sale la 3B de Collection?", time: "16:02" },
        { out: true, text: "¡Hola Marta! La 3B está en USD 92.000. ¿Te paso el plano?", time: "16:10" },
        { text: "Dale, lo vemos con mi marido y te aviso 👍", time: "16:31" },
      ],
    },
  },
  {
    id: "sofia",
    name: "Sofía Acosta",
    mark: "referido",
    markText: "Referida · Pablo Sosa",
    why: "La recomendó un cliente de Torre Natalini. Quiere ver Fontana.",
    tags: [{ label: "Proyecto", value: "Fontana" }, { label: "Busca", value: "Lote" }, { label: "Paga", value: null }],
    message: "Hola, me pasó tu contacto Pablo Sosa. ¿Puedo ir a ver los lotes de Fontana el sábado?",
    time: "19:20",
    suggestions: [
      "¡Hola Sofía! Qué bueno que te recomendó Pablo. El sábado a las 10 te esperamos en Fontana, ¿te queda bien?",
      "¡Hola Sofía! Sí, el sábado abrimos de 10 a 13. ¿A qué hora te queda mejor?",
      "¡Hola Sofía! Te paso el plano de Fontana con los lotes libres, así elegís antes de venir.",
    ],
  },
  {
    id: "juan",
    name: "Juan",
    mark: "pendiente",
    markText: "Sin responder · 14 h",
    why: "Preguntó el precio de MARQ Collection por el anuncio.",
    tags: [{ label: "Proyecto", value: "MARQ Collection" }, { label: "Busca", value: null }, { label: "Paga", value: null }],
    message: "precio?",
    time: "18:40",
    suggestions: [
      "¡Hola Juan! Perdón la demora. Los valores arrancan en USD 68.000, con anticipo y cuotas. ¿Lo pensás para vivir o para invertir?",
      "¡Hola Juan! Perdón la demora. Hay de 1, 2 y 3 dormitorios desde USD 68.000. ¿Cuántos buscás?",
      "¡Hola Juan! Perdón la demora. Te paso la lista con valores y disponibilidad. ¿Te llamo hoy?",
    ],
  },
];

/**
 * MARQui's morning brief, in its own chat: yesterday in three numbers and today's
 * short list. Every name opens that person's chat. It plays itself while on screen
 * (the cursor opens Marta, then Sofía); the first real click hands you the wheel.
 */
function BriefVisual() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.55 });
  const [arrived, setArrived] = useState(!!reduce);
  const [open, setOpen] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [aim, setAim] = useState<string | null>(null);
  const [manual, setManual] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView || reduce || manual) return;
    setArrived(false);
    setOpen(null);
    setSeen([]);
    setAim(null);
    const ids: number[] = [];
    const at = (ms: number, fn: () => void) => ids.push(window.setTimeout(fn, ms));
    const visit = (id: string, start: number) => {
      // The cursor needs ~1.35 s to glide in and press.
      at(start, () => setAim(id));
      at(start + 1450, () => {
        setAim(null);
        setOpen(id);
        setSeen((s) => [...s, id]);
      });
      at(start + 5600, () => setOpen(null));
    };
    at(1100, () => setArrived(true));
    visit("marta", 4200);
    visit("sofia", 11400);
    at(19800, () => setRun((r) => r + 1));
    return () => ids.forEach(clearTimeout);
  }, [inView, reduce, manual, run]);

  const take = () => {
    setManual(true);
    setAim(null);
    setArrived(true);
  };
  const openChat = (id: string) => {
    take();
    setOpen(id);
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  };
  const person = pending.find((p) => p.id === open);
  const slide = reduce ? { duration: 0 } : { duration: 0.55, ease };

  return (
    <div ref={root} className="wa-font relative w-full max-w-[31rem] text-[#111b21]">
      <ChatWindow>
        {/* The brief stays put underneath; a chat slides over it, like a screen pushed on a phone. */}
        <div className="relative h-[40rem] overflow-hidden sm:h-[34.5rem]">
          <motion.div className="absolute inset-0 flex flex-col bg-white" animate={{ x: person ? -40 : 0, opacity: person ? 0.55 : 1 }} transition={slide} inert={!!person} aria-hidden={!!person}>
            <ChatHeader name="MARQui" avatar={<MarquiAvatar className="size-9 shrink-0" />}>
              {arrived ? "Asistente de MARQ" : <span className="text-[#00a884]">escribiendo…</span>}
            </ChatHeader>
            <div className="wa-paper no-scrollbar flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3.5 pb-3 pt-3">
              <span className={cn("mx-auto mb-auto rounded-md bg-white px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wide text-[#54656f]", BUBBLE)}>Hoy</span>
              <AnimatePresence mode="popLayout" initial={false}>
                {arrived ? (
                  <Brief key={`brief-${run}`} play={!reduce} seen={seen} aim={aim} onOpen={openChat} />
                ) : (
                  <motion.span key={`typing-${run}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease }} className={cn("relative flex w-fit gap-1 rounded-[0.55rem] rounded-tl-none bg-white px-3 py-2.5", BUBBLE)} aria-label="MARQui está escribiendo">
                    <Tail />
                    {[0, 1, 2].map((d) => (
                      <motion.i key={d} className="size-1.5 rounded-full bg-black/35" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
                    ))}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <Composer />
          </motion.div>
          <AnimatePresence initial={false}>
            {person && (
              <motion.div
                key={person.id}
                className="absolute inset-0 flex flex-col bg-white shadow-[-1rem_0_2rem_-1rem_rgb(1_30_27/0.35)]"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={slide}
              >
                <PersonChat p={person} onBack={() => (take(), setOpen(null))} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ChatWindow>
      <p className="sky-type mt-4 flex items-center justify-center gap-2 text-[0.9rem] font-medium text-white/85">
        <Sunrise className="size-4" /> Llega a las 9:00. Tocá un nombre y abrís su chat.
      </p>
    </div>
  );
}

function Brief({ play, seen, aim, onOpen }: { play: boolean; seen: string[]; aim: string | null; onOpen: (id: string) => void }) {
  // Sections land one after the other, the way a long message reads top to bottom.
  const rise = (i: number) => (play ? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.15 + i * 0.14, ease } } : {});
  const stats = [
    { n: 23, label: "consultas" },
    { n: 2, label: "interesados nuevos" },
    { n: 4, label: "sin responder", alert: true },
  ];
  return (
    <motion.div
      initial={play ? { opacity: 0, y: 14, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease }}
      className={cn("relative w-[94%] origin-top-left rounded-[0.6rem] rounded-tl-none bg-white px-3 pb-1.5 pt-2.5 text-[0.84rem] leading-[1.35]", BUBBLE)}
    >
      <Tail />
      <motion.p {...rise(0)} className="text-[0.95rem] font-semibold tracking-[-0.01em]">
        ☀️ Buen día, Cande
      </motion.p>
      <motion.p {...rise(0)} className="text-[0.76rem] text-[#667781]">
        Tu resumen de las dos líneas
      </motion.p>

      <motion.p {...rise(1)} className="mt-3 text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-[#008069]">
        Ayer
      </motion.p>
      <motion.div {...rise(1)} className="mt-1.5 grid grid-cols-3 gap-1.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[0.55rem] bg-[#f3f5f6] px-2.5 py-2">
            <b className={cn("block text-[1.35rem] font-semibold leading-none tracking-[-0.02em] tabular-nums", s.alert && "text-[#c4381b]")}>
              <Count to={s.n} play={play} />
            </b>
            <span className="mt-1 block text-[0.68rem] leading-tight text-[#667781]">{s.label}</span>
          </div>
        ))}
      </motion.div>

      <motion.p {...rise(2)} className="mt-3.5 text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-[#008069]">
        Hoy, lo importante
      </motion.p>
      <ul className="mt-1 divide-y divide-black/[0.06]">
        {pending.map((p, i) => {
          const done = seen.includes(p.id);
          return (
            <motion.li key={p.id} {...rise(3 + i)} className="flex items-center gap-2.5 py-2">
              <Face name={p.name} className="size-8" />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  <b className="text-[0.84rem] font-semibold">{p.name}</b>
                  <span className={cn("inline-flex h-[1.15rem] items-center rounded-full px-1.5 text-[0.62rem] font-semibold leading-none", MARKS[p.mark])}>{p.markText}</span>
                </span>
                <span className="block text-[0.74rem] leading-snug text-[#54656f]">{p.why}</span>
              </span>
              <button
                type="button"
                onClick={() => onOpen(p.id)}
                aria-label={`Abrir el chat de ${p.name}`}
                className={cn(
                  "relative inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-full px-2.5 text-[0.72rem] font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008069]",
                  done ? "bg-transparent text-[#667781] hover:bg-[#f3f5f6]" : "bg-[#e7f6f2] text-[#00705f] hover:bg-[#d2eee7]",
                  aim === p.id && "bg-[#d2eee7]",
                )}
              >
                {done ? <CheckCheck className="size-3.5 text-[#53bdeb]" aria-hidden /> : <MessageCircle className="size-3.5" aria-hidden />}
                {done ? "Visto" : "Abrir chat"}
                {aim === p.id && <Cursor play delay={0} />}
              </button>
            </motion.li>
          );
        })}
      </ul>

      <motion.p {...rise(6)} className="pt-1 text-[0.72rem] text-[#667781]">
        Lo demás va al resumen del viernes.
        <Time>9:00</Time>
      </motion.p>
    </motion.div>
  );
}

/** Rolls a number up from zero when the brief lands. */
function Count({ to, play }: { to: number; play: boolean }) {
  const [n, setN] = useState(play ? 0 : to);
  useEffect(() => {
    if (!play) return;
    const c = animate(0, to, { duration: 0.9, delay: 0.45, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [play, to]);
  return <>{n}</>;
}

/** The chat you land in from the brief: the person's tags on top, their message, and MARQui's reply waiting. */
function PersonChat({ p, onBack }: { p: Pending; onBack: () => void }) {
  return (
    <>
      <ChatHeader
        name={p.name}
        back={
          <button type="button" onClick={onBack} aria-label="Volver al resumen" className="-ml-1.5 -mr-1.5 grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-[#54656f] transition-colors hover:bg-black/[0.06] focus-visible:outline-2 focus-visible:outline-[#008069]">
            <ArrowLeft className="size-[1.15rem]" />
          </button>
        }
        below={
          <div className="flex flex-wrap items-center gap-1 pb-0.5 pl-1 pt-2">
            <MarquiMark tone="teal" className="mr-0.5 size-3.5" title="Etiquetas de MARQui" />
            {p.tags.map((t) => (
              <span
                key={t.label}
                className={cn("inline-flex h-[1.35rem] items-center gap-1 rounded-full px-2 text-[0.68rem] leading-none", t.value ? "bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.07)]" : "border border-dashed border-black/25 text-[#667781]")}
              >
                <span className="text-[#667781]">{t.label}</span>
                <b className="font-semibold">{t.value ?? "?"}</b>
              </span>
            ))}
            {p.mark !== "pendiente" && <span className={cn("inline-flex h-[1.35rem] items-center rounded-full px-2 text-[0.68rem] font-semibold leading-none", MARKS[p.mark])}>{p.markText}</span>}
          </div>
        }
      >
        últ. vez ayer a las {p.time}
      </ChatHeader>
      <div className="wa-paper flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-4 pb-3 pt-3">
        {p.before ? (
          <>
            <span className={cn("mx-auto mb-1 rounded-md bg-white px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wide text-[#54656f]", BUBBLE)}>{p.before.day}</span>
            {p.before.msgs.map((m) => (
              <div key={m.text} className={cn("relative w-fit max-w-[80%] rounded-[0.55rem] px-2.5 py-1.5 text-[0.86rem] leading-[1.35]", BUBBLE, m.out ? "ml-auto bg-wa-bubble" : "bg-white")}>
                {m.text}
                <Time read={m.out}>{m.time}</Time>
              </div>
            ))}
            {/* Forty days of silence, then she's back. */}
            <span className="my-1 flex items-center gap-2 text-[0.66rem] font-medium text-[#8a6a2f]">
              <i className="h-px flex-1 bg-[#e8c98f]" />
              40 días sin escribir
              <i className="h-px flex-1 bg-[#e8c98f]" />
            </span>
          </>
        ) : (
          <span className={cn("mx-auto mb-auto max-w-[88%] rounded-md bg-[#ffeecd] px-3 py-1.5 text-center text-[0.68rem] leading-snug text-[#54656f]", BUBBLE)}>
            🔒 Los mensajes y las llamadas están cifrados de extremo a extremo.
          </span>
        )}
        <span className={cn("mx-auto my-1 rounded-md bg-white px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wide text-[#54656f]", BUBBLE)}>Ayer</span>
        <div className={cn("relative w-fit max-w-[80%] rounded-[0.55rem] rounded-tl-none bg-white px-2.5 py-1.5 text-[0.86rem] leading-[1.35]", BUBBLE)}>
          <Tail />
          {p.message}
          <Time>{p.time}</Time>
        </div>
      </div>
      <SuggestionTray replies={p.suggestions} />
      <Composer />
    </>
  );
}
