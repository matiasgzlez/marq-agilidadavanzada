import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { BookOpen, Check, CheckCheck, FileSpreadsheet, Info, Megaphone, MessagesSquare, Mic, MoreVertical, PenLine, Plus, Search, SendHorizontal, Smile, Tag, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pose } from "./marqui-character";
import { FadeUp, MarquiAvatar, Section, ease } from "./primitives";
import { Lead } from "./story";
import { Phone } from "./phone";
import { MarquiMark } from "./marqui-mark";
import { SKY } from "./sky";

type Feature = { title: string; text: string; visual: ReactNode; tint?: string; pose: Pose };

/* Soft brand gradients for the cards, like the coloured panels on the dots page. */
const TINTS = {
  mint: "bg-[linear-gradient(140deg,#eefaf6_0%,#bfe9df_55%,#86d1c1_100%)]",
  sand: "bg-[linear-gradient(140deg,#fff7e8_0%,#f8deb4_55%,#efb57a_100%)]",
  sea: "bg-[linear-gradient(140deg,#e3f6fb_0%,#a9dfe6_55%,#5fbcc4_100%)]",
  coral: "bg-[linear-gradient(140deg,#ffe9df_0%,#f9b493_55%,#e8784a_100%)]",
};

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
    title: "Te avisa solo lo importante",
    text: "Un resumen cada mañana y un aviso al instante cuando vuelve un cliente, reaparece alguien después de un mes o llega un referido. Nada de una notificación por consulta.",
    visual: (
      <Phone
        messages={[
          { kind: "day", text: "Hoy" },
          { kind: "in", time: "9:00", text: <><b>☀️ Buen día. Ayer:</b><br />23 consultas · 4 sin responder<br />2 nuevos interesados</> },
          { kind: "in", time: "11:14", text: <><b>🔁 Reaparece:</b> Marta Ríos volvió a escribir después de 40 días. Pregunta por la 3B.</> },
          { kind: "in", time: "12:02", text: <><b>⭐ Cliente:</b> Pablo Sosa, que invirtió en Torre Natalini, consulta por lotes.</> },
        ]}
      />
    ),
    tint: TINTS.mint,
    pose: "sorpresa",
  },
  {
    title: "Le preguntás lo que necesites",
    text: "«¿Cuántas consultas trajo Collection esta semana?». «Pasame los que buscan invertir». Le escribís como a un compañero y te contesta con datos, o con la lista lista en Excel.",
    visual: (
      <Phone
        messages={[
          { kind: "out", time: "17:40", text: "¿Cuántas consultas hubo por MARQ Collection esta semana?" },
          { kind: "in", time: "17:40", text: <><b>41 de 112</b> (37%). 9 ya son interesados y 2 reservaron.</> },
          { kind: "out", time: "17:41", text: "Pasame los interesados que buscan invertir" },
          { kind: "file", from: "in", name: "Interesados · Collection.xlsx", meta: "9 contactos · Excel", type: "xlsx", time: "17:41" },
        ]}
      />
    ),
    tint: TINTS.sand,
    pose: "alegria",
  },
  {
    title: "Aprende cómo trabaja MARQ",
    text: "MARQui aprende de las charlas, de los documentos que ya tienen y de lo que le contás. Nadie tiene que cargar nada en otro sistema.",
    visual: <LearnVisual />,
    tint: TINTS.sea,
    pose: "derecha",
  },
  {
    title: "También en el celular",
    text: "MARQui es un contacto más de WhatsApp. Le reenviás el mensaje de un cliente desde el celular de la línea y te devuelve las tres respuestas.",
    visual: (
      <Phone
        messages={[
          { kind: "out", forwarded: true, time: "19:05", text: "Hola, ¿los lotes de Fontana tienen financiación?" },
          { kind: "in", time: "19:05", text: <><b>1.</b> ¡Hola! Sí, financiamos hasta 36 cuotas en pesos. ¿Te paso el plano con los lotes disponibles?</> },
          { kind: "in", time: "19:05", text: <><b>2.</b> ¡Sí! Anticipo del 30% y el resto en cuotas. ¿Lo pensás para construir ya o como inversión?</> },
          { kind: "in", time: "19:05", text: <><b>3.</b> Sí, tenemos financiación propia. ¿Te llamo mañana y lo vemos?</> },
        ]}
        stagger={0.35}
      />
    ),
    tint: TINTS.coral,
    pose: "inclinado",
  },
];

export function Functions() {
  return (
    <Section sky={SKY.noon} id="funciones" className="py-28 sm:py-40" aria-labelledby="funciones-title">
      <Lead id="funciones-title" title={["¿Qué podés hacer", <em key="e">con MARQui?</em>]}>
        Seis cosas que cambian el día a día del equipo, sin salir de WhatsApp.
      </Lead>


      <div className="mx-auto mt-20 grid max-w-[84rem] gap-24 sm:gap-32">
        {features.map((f, i) => (
          <article key={f.title} className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <FadeUp className={cn(i % 2 === 1 && "lg:order-2")}>
              <div className={cn("relative grid min-h-[30rem] place-items-center text-ink", f.tint ? "overflow-hidden rounded-[2.5rem] p-6 sm:p-12" : "items-start lg:min-h-[36rem]", f.tint)}>
                {f.visual}
              </div>
            </FadeUp>
            <FadeUp delay={0.1} className={cn("grid gap-4", i % 2 === 1 && "lg:order-1")}>
              <h3 className="display sky-type text-[clamp(2.4rem,4vw,4.4rem)] font-bold!">{f.title}</h3>
              <p className="sky-type text-[clamp(1.25rem,1.75vw,1.85rem)] font-medium leading-[1.45] text-white/90">{f.text}</p>
            </FadeUp>
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

        {/* MARQui's tray: three replies, numbered like shortcuts. The one you tap turns solid. */}
        <div className="border-t border-black/[0.06] bg-white px-2.5 pb-2.5 pt-2.5">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <MarquiMark tone="teal" className="size-4" />
            <span className="text-[0.78rem] font-semibold tracking-[-0.005em] text-[#111b21]">MARQui</span>
            <span className="text-[0.78rem] text-[#667781]">sugiere</span>
          </div>
          <div className="grid gap-1.5">
            {replies.map((r, i) => {
              const on = picked === i;
              return (
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={inView || reduce ? { opacity: 1, y: 0, scale: on && !reduce ? [1, 0.975, 1] : 1 } : undefined}
                  transition={{ opacity: { duration: 0.5, delay: 0.35 + i * 0.12, ease }, y: { duration: 0.5, delay: 0.35 + i * 0.12, ease }, scale: { duration: 0.35, ease } }}
                  className={cn(
                    "relative flex items-start gap-2.5 rounded-[0.7rem] py-2 pl-2 pr-3 text-[0.8rem] leading-[1.38] transition-colors duration-300",
                    on ? "bg-[#008c7e] text-white shadow-[0_6px_16px_-6px_rgb(0_140_126/0.6)]" : "bg-[#f3f5f6] text-[#3b4a54]",
                  )}
                >
                  <span className={cn("mt-px grid size-[1.15rem] shrink-0 place-items-center rounded-[0.3rem] text-[0.66rem] font-semibold tabular-nums transition-colors duration-300", on ? "bg-white/20 text-white" : "bg-white text-[#667781] shadow-[0_0_0_1px_rgb(0_0_0/0.06)]")}>
                    {i + 1}
                  </span>
                  <span className="flex-1">{r}</span>
                  <Check className={cn("mt-0.5 size-3.5 shrink-0 transition-opacity duration-300", on ? "opacity-100" : "opacity-0")} strokeWidth={3} aria-hidden />
                  {i === pick && !reduce && <Cursor play={inView} />}
                </motion.div>
              );
            })}
          </div>
        </div>

        <Composer draft={draft} typing={typing} />
      </ChatWindow>
      <p className="sky-type mt-4 flex items-center justify-center gap-2 text-[0.9rem] font-medium text-white/85">
        <PenLine className="size-4" /> Se escribe en tu cuadro de texto. La enviás vos.
      </p>
    </div>
  );
}

/** A macOS pointer that glides in, taps the reply, and leaves. */
function Cursor({ play, delay = 1.1 }: { play: boolean; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute right-[16%] top-[50%] z-10 size-7 drop-shadow-[0_3px_4px_rgb(0_0_0/0.35)]"
      initial={{ opacity: 0, x: 110, y: 140 }}
      animate={play ? { opacity: [0, 1, 1, 0], x: [110, 0, 0, 0, 8], y: [140, 0, 0, 0, 12], scale: [1, 1, 0.8, 1, 1] } : undefined}
      transition={{
        delay,
        opacity: { delay, duration: 2.6, times: [0, 0.12, 0.85, 1] },
        default: { delay, duration: 2.6, times: [0, 0.45, 0.52, 0.6, 1], ease },
      }}
      aria-hidden
    >
      <path d="M5.5 3.2v15.6l4.1-3.9 2.6 6.1 2.6-1.1-2.6-6h5.7z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </motion.svg>
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

        <div className="flex h-[19.5rem] flex-col">
        <div className="wa-paper flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-4 pb-3 pt-3">
          <span className={cn("mx-auto mb-1 rounded-md bg-white px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wide text-[#54656f]", BUBBLE)}>Hoy</span>
          <motion.div layout transition={{ duration: 0.45, ease }} className={cn("relative w-fit max-w-[78%] rounded-[0.55rem] rounded-tl-none bg-white px-2.5 py-1.5 text-[0.86rem] leading-[1.35]", BUBBLE)}>
            <Tail />
            ¡Hola! ¿Sigue disponible la 3B? Ahora sí estamos para mudarnos 🙂
            <Time>11:12</Time>
          </motion.div>
          <AnimatePresence initial={false} mode="popLayout">
            {step === 0 && (
              /* MARQui's candidate reply, and why it carries one more question. */
              <motion.div
                key={`suggestion-${run}`}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.45, delay: reduce ? 0 : 0.3, ease }}
                className="relative mt-1 rounded-[0.8rem] bg-white text-[0.8rem] leading-[1.38] shadow-[0_0_0_1.5px_#008c7e,0_8px_20px_-8px_rgb(0_140_126/0.45)]"
              >
                <div className="flex items-center gap-1.5 px-3 pt-2.5">
                  <MarquiMark tone="teal" className="size-3.5" />
                  <span className="text-[0.74rem] font-semibold text-[#111b21]">MARQui</span>
                  <span className="text-[0.74rem] text-[#667781]">sugiere</span>
                </div>
                <p className="px-3 pb-2.5 pt-1 text-[#3b4a54]">
                  ¡Qué bueno que volviste, Marta! La 3B sigue disponible.{" "}
                  <mark className="rounded-[0.25rem] bg-[#008c7e]/12 px-0.5 font-medium text-[#00594f]">¿La pensás con crédito o de contado?</mark>
                </p>
                <p className="flex items-start gap-1.5 rounded-b-[0.8rem] border-t border-black/[0.06] bg-[#f6f8f8] px-3 py-2 text-[0.72rem] leading-snug text-[#3b4a54]">
                  <Info className="mt-px size-3.5 shrink-0 text-[#008c7e]" aria-hidden />
                  <span>
                    <b className="font-semibold text-[#111b21]">Faltaba saber cómo paga.</b> Por eso sumé la pregunta al final.
                  </span>
                </p>
                {!reduce && <Cursor play={inView} />}
              </motion.div>
            )}
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
        <Composer draft={draft} typing={step === 1 && draft !== reply} cursor={step === 2 && <Cursor key={run} play delay={0} />} />
        </div>
      </ChatWindow>
      <p className="sky-type mt-4 flex items-center justify-center gap-2 text-[0.9rem] font-medium text-white/85">
        <Tag className="size-4" /> La ficha se completa sola mientras charlan.
      </p>
    </div>
  );
}

/* ——— WhatsApp Web pieces shared by the mockups ——— */

const BUBBLE = "shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]";

function ChatWindow({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[1rem] bg-white shadow-[0_1px_2px_rgb(1_30_27/0.1),0_0.75rem_1.75rem_-0.5rem_rgb(1_30_27/0.28),0_2.5rem_5rem_-1.5rem_rgb(1_30_27/0.5)] ring-1 ring-black/[0.08]">
      {children}
    </div>
  );
}

function ChatHeader({ name, children, below }: { name: string; children: ReactNode; below?: ReactNode }) {
  return (
    <header className="border-b border-black/[0.06] bg-[#f0f2f5] px-3.5 py-2">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#c7d3e6] to-[#9fb3d4] text-[0.9rem] font-semibold text-white">{name[0]}</span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[0.95rem] font-medium">{name}</span>
          <span className="block truncate text-[0.74rem] text-[#667781]">{children}</span>
        </span>
        <Video className="size-[1.15rem] text-[#54656f]" aria-hidden />
        <Search className="size-[1.15rem] text-[#54656f]" aria-hidden />
        <MoreVertical className="size-[1.15rem] text-[#54656f]" aria-hidden />
      </div>
      {below}
    </header>
  );
}

/** The little hook on the first bubble of a run. */
function Tail({ out = false }: { out?: boolean }) {
  return out ? (
    <svg viewBox="0 0 8 13" className="absolute -right-2 top-0 h-[13px] w-2 fill-wa-bubble" aria-hidden>
      <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
    </svg>
  ) : (
    <svg viewBox="0 0 8 13" className="absolute -left-2 top-0 h-[13px] w-2 fill-white" aria-hidden>
      <path d="M1.533 3.568 8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
    </svg>
  );
}

function Time({ children, read = false }: { children: ReactNode; read?: boolean }) {
  return (
    <span className="float-right -mb-1 ml-2.5 mt-1.5 inline-flex items-center gap-0.5 text-[0.64rem] leading-none text-[#667781]">
      {children}
      {read && <CheckCheck className="size-3.5 text-[#53bdeb]" />}
    </span>
  );
}

function Composer({ draft = "", typing = false, cursor }: { draft?: string; typing?: boolean; cursor?: ReactNode }) {
  return (
    <div className="flex items-end gap-2 bg-[#f0f2f5] px-2.5 py-2">
      <div className="flex min-h-10 flex-1 items-center gap-1.5 rounded-[1.4rem] bg-white py-1.5 pl-2.5 pr-3">
        <Plus className="size-5 shrink-0 self-end text-[#54656f]" aria-hidden />
        <Smile className="size-5 shrink-0 self-end text-[#54656f]" aria-hidden />
        <p className="min-w-0 flex-1 py-0.5 pl-1 text-[0.84rem] leading-[1.35]">
          {draft ? (
            <>
              {draft}
              {typing && <i className="ml-px inline-block h-[1.05em] w-px translate-y-[0.18em] animate-pulse bg-[#00a884]" />}
            </>
          ) : (
            <span className="text-[#667781]">Escribe un mensaje</span>
          )}
        </p>
      </div>
      <span className={cn("relative grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300", draft ? "bg-[#00a884] text-white" : "text-[#54656f]")} aria-hidden>
        {draft ? <SendHorizontal className="size-[1.15rem]" /> : <Mic className="size-5" />}
        {cursor}
      </span>
    </div>
  );
}

function LearnVisual() {
  const reduce = useReducedMotion();
  const sources = [
    { icon: MessagesSquare, title: "Las conversaciones", text: "Los últimos 180 días de chats de las dos líneas" },
    { icon: FileSpreadsheet, title: "Los documentos", text: "Lista de precios, folletos y la web" },
    { icon: BookOpen, title: "Lo que le contás", text: "«Collection ahora financia en 36 cuotas»" },
  ];
  return (
    <div className="grid w-full max-w-[34rem] gap-3">
      {sources.map((s, i) => (
        <motion.div
          key={s.title}
          initial={reduce ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease }}
          className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_1rem_2rem_-1rem_rgb(1_30_27/0.3)]"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-soft text-blue">
            <s.icon className="size-6" />
          </span>
          <span className="leading-snug">
            <b className="block text-[1.1rem] text-ink">{s.title}</b>
            <span className="text-[0.95rem] text-ink-3">{s.text}</span>
          </span>
        </motion.div>
      ))}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.75, ease }}
        className="flex items-start gap-3 rounded-2xl bg-ink p-4 text-white"
      >
        <MarquiAvatar tone="light" className="size-10" />
        <p className="text-[1rem] leading-snug">
          Anotado. Antes decía <b>24 cuotas</b>. ¿Reemplazo el dato por <b>36 cuotas</b>?
        </p>
      </motion.div>
    </div>
  );
}
