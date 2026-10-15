import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CalendarClock, Check, ChevronLeft, ChevronRight, FileSpreadsheet, FileText, MessageCircle, Mic, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pose } from "./marqui-character";
import { MarquiLive } from "./marqui-live";
import { Section, ease } from "./primitives";
import { SKY } from "./sky";
import { Face } from "./wa-kit";
import { Lead } from "./story";

/* ——— Un día con MARQui ———
   The dots timeline: a ruler of the working day, a pill on the current
   hour, MARQui saying what he did, and underneath the moment told as pain →
   solution. The sky follows the hour. Arrows (or ← →) move through the day. */

/** One message of the moment: Cande (the team) on the right, MARQui on the left. */
type Msg = {
  from: "cande" | "marqui";
  text?: string;
  file?: { name: string; type: "pdf" | "xlsx"; meta: string };
  /** MARQui's three suggested replies, the picked one solid. */
  replies?: { list: string[]; pick: number };
  /** A client's message quoted inside MARQui's alert. */
  quote?: { name: string; text: string };
  /** A button under the message, like "Abrir chat". */
  action?: string;
  /** A rule MARQui just saved, as a card. */
  rule?: { title: string; when: string };
  /** A voice note, with WhatsApp's transcript. */
  audio?: { secs: string; transcript: string };
};
type Stop = { h: number; time: string; sky: number; where: string; chat: Msg[]; pose: Pose; title: string; text: string; brother?: boolean };

const stops: Stop[] = [
  {
    h: 9,
    time: "9:00",
    sky: SKY.dawn,
    where: "Al empezar el día",
    chat: [
      { from: "marqui", text: "☀️ Buen día, Cande. Ayer entraron 23 consultas y 4 quedaron sin responder.", file: { name: "Resumen · viernes 17.pdf", type: "pdf", meta: "2 páginas · PDF" } },
      { from: "marqui", text: "Marta volvió después de 40 días. Yo arrancaría por ella.", action: "Abrir chat de Marta" },
      { from: "cande", text: "Abro el de Marta 👍" },
    ],
    pose: "alegria",
    title: "Arrancá sabiendo por dónde empezar",
    text: "Antes había que revisar los dos WhatsApp para ver qué quedó pendiente. Ahora MARQui te lo cuenta en un mensaje, con lo importante primero.",
  },
  {
    h: 10.5,
    time: "10:30",
    sky: SKY.noon,
    where: "En la línea de pauta",
    chat: [
      { from: "cande", text: "Me escribió Juan desde el anuncio de Collection: «precio?»" },
      {
        from: "marqui",
        text: "Te dejé tres respuestas en su chat:",
        replies: {
          list: [
            "¡Hola Juan! Hay de 1, 2 y 3 dorm desde USD 68.000. ¿Cuántos buscás?",
            "¡Hola Juan! Arrancan en USD 68.000, con anticipo y cuotas. ¿Lo pensás para vivir o para invertir?",
            "¡Hola Juan! Te paso la lista de valores. ¿Te llamo hoy?",
          ],
          pick: 1,
        },
      },
      { from: "cande", text: "Mandé la 2 ✓" },
    ],
    pose: "guino",
    title: "Respondé en segundos, no en minutos",
    text: "Llegan diez «precio?» seguidos desde el anuncio. Elegís una respuesta, la ajustás y la mandás vos. Juan nunca supo que MARQui existía.",
  },
  {
    h: 12.25,
    time: "12:15",
    sky: SKY.noon,
    where: "Entre consulta y consulta",
    chat: [
      { from: "marqui", text: "⭐ Laura Gómez, que seguís, te escribió:", quote: { name: "Laura Gómez", text: "¿El sábado se puede ir a ver la 2A? 🙌" }, action: "Abrir chat" },
      { from: "cande", text: "¡Le contesto ya!" },
    ],
    pose: "sorpresa",
    title: "No se te enfría nadie importante",
    text: "Una persona importante podía quedar perdida entre cien mensajes. Ahora la marcás con una estrella y MARQui te avisa apenas escribe.",
  },
  {
    h: 14,
    time: "14:00",
    sky: SKY.noon,
    where: "Después del almuerzo",
    chat: [
      { from: "cande", text: "Desde hoy, todos los días a las 18 pasame los que preguntaron por Fontana y Collection" },
      { from: "marqui", text: "Listo, regla creada ✓", rule: { title: "Lista de Fontana y Collection", when: "Todos los días · 18:00" }, action: "Ver reglas" },
    ],
    pose: "guino",
    title: "Pedíselo una vez y se encarga",
    text: "Lo que hacías a mano todos los días, se lo pedís una sola vez. Queda en sus Reglas, a la vista, y lo cumple solo.",
  },
  {
    h: 16,
    time: "16:00",
    sky: SKY.noon,
    where: "En una visita, desde el celular",
    chat: [
      { from: "cande", audio: { secs: "0:04", transcript: "¿Cuántos lotes quedan en Fontana?" } },
      { from: "marqui", text: "Quedan 12 de 40. Los de esquina son los más pedidos esta semana." },
      { from: "cande", text: "Genial, se lo digo ahora 👌" },
    ],
    pose: "pensando",
    title: "Preguntale desde donde estés",
    text: "Para saber un dato había que volver a la oficina y revisar chat por chat. Ahora le mandás un audio desde el celular y te contesta al instante.",
  },
  {
    h: 18,
    time: "18:00",
    sky: SKY.dusk,
    where: "Al cerrar el día",
    chat: [
      { from: "marqui", text: "📋 Tu lista de hoy: 7 personas preguntaron por Fontana y Collection.", file: { name: "Fontana y Collection · viernes 17.xlsx", type: "xlsx", meta: "7 contactos · Excel" } },
      { from: "marqui", text: "Y ya está la semana en MARQador 🧡 Las recomendaciones traen 6 veces más interesados que el anuncio de Instagram." },
      { from: "cande", text: "Buenísimo, lo llevo a la reunión del lunes." },
    ],
    pose: "derecha",
    title: "Cerrá el día sabiendo qué funciona",
    text: "La lista que le pediste llega sola, todos los días. Y su hermanito, MARQador, muestra qué canal trae a los que avanzan, para poner la plata donde rinde.",
    brother: true,
  },
];

const START = 8;
const END = 20;
const pct = (h: number) => ((h - START) / (END - START)) * 100;
const ticks = Array.from({ length: (END - START) * 4 + 1 }, (_, i) => START + i / 4);

export function Day() {
  const [step, setStep] = useState(1);
  // While dragging, the pill follows the pointer hour by hour; on release it settles on the nearest moment.
  const [dragH, setDragH] = useState<number | null>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const hourAt = (clientX: number) => {
    const r = ruler.current!.getBoundingClientRect();
    const f = Math.min(Math.max((clientX - r.left) / r.width, 0), 1);
    return START + f * (END - START);
  };
  const nearest = (h: number) => stops.reduce((best, x, i) => (Math.abs(x.h - h) < Math.abs(stops[best]!.h - h) ? i : best), 0);
  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-nav]")) return;
    ruler.current!.setPointerCapture(e.pointerId);
    const h = hourAt(e.clientX);
    setDragH(h);
    setStep(nearest(h));
  };
  const onMove = (e: React.PointerEvent) => {
    if (dragH === null) return;
    const h = hourAt(e.clientX);
    setDragH(h);
    setStep(nearest(h));
  };
  const onUp = () => setDragH(null);
  const hours = Math.floor(dragH ?? 0);
  const label = dragH === null ? null : `${hours}:${String(Math.floor(((dragH - hours) * 60) / 5) * 5).padStart(2, "0")}`;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const s = stops[step]!;
  const go = (d: number) => setStep((x) => Math.min(Math.max(x + d, 0), stops.length - 1));

  // Presenter keys: ← → move through the day while it is on screen.
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("textarea, input")) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView]);

  return (
    <Section ref={ref} sky={s.sky} id="un-dia" className="py-28 sm:py-40" aria-labelledby="un-dia-title">
      <Lead id="un-dia-title" title={["Un día con MARQui"]}>
        Desde el primer mate hasta que se cierra la oficina, mirá cómo encaja MARQui en el día del equipo.
      </Lead>

      {/* The moment: Cande and MARQui, talking on WhatsApp. */}
      <div className="mx-auto mt-16 grid max-w-[62rem] grid-cols-[auto_1fr] items-end gap-4 sm:gap-10">
        <div className="relative w-[clamp(6rem,13vw,11rem)]">
          <MarquiLive pose={s.pose} />
          <AnimatePresence>
            {s.brother && (
              <motion.div
                key="bro"
                initial={{ opacity: 0, scale: 0.4, x: -30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.4 }}
                className="absolute bottom-[2%] w-[52%] max-sm:bottom-[88%] max-sm:left-[24%] sm:-left-[36%]"
              >
                <MarquiLive who="marqador" pose="alegria" shadow={false} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Thread key={step} chat={s.chat} />
      </div>

      {/* The ruler of the working day. */}
      <div className="mx-auto mt-6 max-w-[78rem] px-3">
        <div
          ref={ruler}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className={cn("relative h-32 touch-none select-none", dragH === null ? "cursor-grab" : "cursor-grabbing")}
          aria-label="Arrastrá para cambiar la hora"
        >
          <motion.div
            className="absolute bottom-3 z-10 -translate-x-1/2"
            animate={{ left: `${pct(dragH ?? s.h)}%`, scale: dragH === null ? 1 : 1.06 }}
            transition={dragH === null ? { type: "spring", stiffness: 220, damping: 26 } : { duration: 0 }}
          >
            <div className="flex items-center gap-1 rounded-full bg-orange px-2 py-1.5 text-white shadow-[0_0.75rem_1.5rem_-0.5rem_rgb(180_60_0/0.6)]">
              <button data-nav onClick={() => go(-1)} disabled={step === 0} aria-label="Momento anterior" className="grid size-9 place-items-center rounded-full transition-opacity hover:bg-white/15 disabled:opacity-35">
                <ChevronLeft className="size-5" />
              </button>
              <span className="min-w-[4.2rem] text-center text-[1.15rem] font-medium tabular-nums">{label ?? s.time}</span>
              <button data-nav onClick={() => go(1)} disabled={step === stops.length - 1} aria-label="Momento siguiente" className="grid size-9 place-items-center rounded-full transition-opacity hover:bg-white/15 disabled:opacity-35">
                <ChevronRight className="size-5" />
              </button>
            </div>
            <span className="mx-auto block h-9 w-1 rounded-full bg-orange" />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-6">
            {ticks.map((t) => {
              const i = stops.findIndex((x) => Math.abs(x.h - t) < 0.13);
              return i >= 0 ? (
                <button
                  key={t}
                  onClick={() => setStep(i)}
                  aria-label={`Ir a las ${stops[i]!.time}`}
                  style={{ left: `${pct(t)}%` }}
                  className={cn("absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors", i === step ? "bg-orange" : "bg-white/75 hover:bg-white")}
                />
              ) : (
                <span key={t} style={{ left: `${pct(t)}%` }} className={cn("absolute top-1/2 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45", t % 1 === 0 ? "h-4" : "h-2.5")} aria-hidden />
              );
            })}
          </div>
        </div>
        <div className="sky-type mt-2 flex justify-between text-[0.9rem] font-medium text-white/70">
          <span>8:00</span>
          <span>20:00</span>
        </div>
      </div>

      {/* The moment, told as pain → solution. */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }} className="mx-auto mt-14 grid max-w-[46rem] justify-items-center gap-3 text-center">
          <span className="sky-type text-[clamp(1rem,1.2vw,1.2rem)] font-medium text-white/75">{s.where}</span>
          <h3 className="display sky-type text-[clamp(1.9rem,3.2vw,3.4rem)]">{s.title}</h3>
          <p className="sky-type text-balance text-[clamp(1.1rem,1.45vw,1.5rem)] font-medium leading-[1.45] text-white/90">{s.text}</p>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

/**
 * The moment as a WhatsApp exchange. Messages land one by one; before each of MARQui's,
 * he's "typing". Fixed height, newest at the bottom, so nothing jumps.
 */
function Thread({ chat }: { chat: Msg[] }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? chat.length : 0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const ids: number[] = [];
    let t = 250;
    chat.forEach((m, i) => {
      if (m.from === "marqui") {
        ids.push(window.setTimeout(() => setTyping(true), t));
        t += 750;
      }
      ids.push(
        window.setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
        }, t),
      );
      t += m.from === "cande" ? 1100 : 900;
    });
    return () => ids.forEach(clearTimeout);
  }, [chat, reduce]);

  return (
    <div className="wa-font flex h-[clamp(24rem,33vw,31rem)] flex-col justify-end gap-2 overflow-hidden pb-2 text-[#111b21]">
      {chat.slice(0, shown).map((m, i) => {
        const me = m.from === "cande";
        const first = i === 0 || chat[i - 1]!.from !== m.from;
        return (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease }}
            className={cn("flex items-end gap-2.5", me && "flex-row-reverse")}
          >
            {/* Cande's face on her first message of a run; MARQui is the character beside the chat. */}
            {me ? first ? <Face name="Cande" className="size-[clamp(2rem,2.6vw,2.6rem)] ring-2 ring-white/70" /> : <span className="w-[clamp(2rem,2.6vw,2.6rem)] shrink-0" /> : null}
            <div
              className={cn(
                "max-w-[82%] rounded-[1.1rem] px-4 py-2.5 text-[clamp(1rem,1.35vw,1.4rem)] leading-[1.4] shadow-[0_0.8rem_1.6rem_-1rem_rgb(1_30_27/0.5)]",
                me ? "bg-wa-bubble" : "bg-white",
                first && (me ? "rounded-br-md" : "rounded-bl-md"),
              )}
            >
              {first && <b className={cn("mb-0.5 block text-[0.72em] font-semibold", me ? "text-[#c4511b]" : "text-[#008069]")}>{me ? "Cande" : "MARQui"}</b>}
              {m.audio && <Voice {...m.audio} />}
              {m.text}
              {m.quote && (
                <span className="mt-2 block rounded-xl border-l-4 border-[#06cf9c] bg-black/[0.04] px-3 py-1.5 text-[0.85em]">
                  <b className="block text-[0.85em] font-semibold text-[#06a17a]">{m.quote.name}</b>
                  {m.quote.text}
                </span>
              )}
              {m.replies && (
                <span className="mt-2 grid gap-1.5 text-[0.78em] leading-[1.35]">
                  {m.replies.list.map((r, k) => {
                    const on = k === m.replies!.pick;
                    return (
                      <motion.span
                        key={k}
                        initial={reduce ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 + k * 0.12, ease }}
                        className={cn("flex items-start gap-2 rounded-xl px-2.5 py-1.5", on ? "bg-[#008c7e] text-white" : "bg-[#f3f5f6] text-[#3b4a54]")}
                      >
                        <span className={cn("mt-px grid size-[1.35em] shrink-0 place-items-center rounded-md text-[0.8em] font-semibold", on ? "bg-white/20" : "bg-white text-[#667781] shadow-[0_0_0_1px_rgb(0_0_0/0.06)]")}>{k + 1}</span>
                        <span className="flex-1">{r}</span>
                        {on && <Check className="mt-0.5 size-[1em] shrink-0" strokeWidth={3} aria-hidden />}
                      </motion.span>
                    );
                  })}
                </span>
              )}
              {m.rule && (
                <span className="mt-2 flex items-center gap-3 rounded-xl bg-black/[0.05] py-2 pl-2 pr-4">
                  <span className="grid size-[2.4em] shrink-0 place-items-center rounded-lg bg-[linear-gradient(135deg,#a78bfa,#6d42d6)] text-white">
                    <CalendarClock className="size-[1.2em]" aria-hidden />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <b className="block text-[0.85em] font-semibold">{m.rule.title}</b>
                    <span className="text-[0.7em] text-[#667781]">{m.rule.when}</span>
                  </span>
                </span>
              )}
              {m.file && (
                <span className="mt-2 flex items-center gap-3 rounded-xl bg-black/[0.05] py-2 pl-2 pr-4">
                  <span className={cn("grid size-[2.4em] shrink-0 place-items-center rounded-lg text-white", m.file.type === "pdf" ? "bg-[#e5484d]" : "bg-[#1d8f4e]")}>
                    {m.file.type === "pdf" ? <FileText className="size-[1.2em]" aria-hidden /> : <FileSpreadsheet className="size-[1.2em]" aria-hidden />}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <b className="block truncate text-[0.85em] font-semibold">{m.file.name}</b>
                    <span className="text-[0.7em] text-[#667781]">{m.file.meta}</span>
                  </span>
                </span>
              )}
              {m.action && (
                <span className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-[#e7f6f2] px-3 py-1 text-[0.78em] font-semibold text-[#00705f]">
                  <MessageCircle className="size-[1.05em]" aria-hidden /> {m.action}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
      <AnimatePresence>
        {typing && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            className="flex w-fit gap-1.5 rounded-[1.1rem] rounded-bl-md bg-white px-4 py-3.5 shadow-[0_0.8rem_1.6rem_-1rem_rgb(1_30_27/0.5)]"
            aria-label="MARQui está escribiendo"
          >
            {[0, 1, 2].map((d) => (
              <motion.i key={d} className="size-2 rounded-full bg-black/35" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Cande's voice note, sent from the phone, with the transcript under it. */
function Voice({ secs, transcript }: { secs: string; transcript: string }) {
  const bars = [6, 10, 14, 9, 16, 12, 7, 15, 18, 11, 8, 13, 17, 10, 6, 12, 15, 9, 14, 7, 11, 16];
  return (
    <span className="block min-w-[14em]">
      <span className="flex items-center gap-2.5">
        <span className="relative shrink-0">
          <Face name="Cande" className="size-[2.3em]" />
          <Mic className="absolute -bottom-0.5 -right-1 size-[1em] rounded-full bg-wa-bubble p-px text-[#53bdeb]" aria-hidden />
        </span>
        <Play className="size-[1.1em] shrink-0 fill-[#54656f] text-[#54656f]" aria-hidden />
        <span className="flex h-[1.4em] flex-1 items-center gap-[2px]" aria-hidden>
          {bars.map((h, i) => (
            <i key={i} className={cn("w-[3px] rounded-full", i < 3 ? "bg-[#53bdeb]" : "bg-[#8aa79a]")} style={{ height: h }} />
          ))}
        </span>
        <span className="text-[0.7em] text-[#667781]">{secs}</span>
      </span>
      <span className="mt-1.5 block border-t border-black/[0.08] pt-1.5 text-[0.85em] italic text-[#3b4a54]">«{transcript}»</span>
    </span>
  );
}
