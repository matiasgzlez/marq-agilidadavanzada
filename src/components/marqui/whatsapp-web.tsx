import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, CheckCheck, CircleDashed, Megaphone, MessageSquareText, MessagesSquare, Mic, MoreVertical, Pin, Plus, RotateCcw, Search, SendHorizontal, Settings, Smile, SquarePen, Star, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarqadorMark } from "./marqador-mark";
import { TextShimmer } from "@/components/arc/text-shimmer/text-shimmer";
import { useMarquiLife, type Pose } from "./marqui-character";
import { BrowserFrame, MarquiAvatar, Mascot } from "./primitives";
import { Face } from "./wa-kit";

/* ——— The story ———
   Juan writes "precio?" from an ad. Each time he answers, MARQui fills his
   card and offers three new replies. Nobody asks him a survey: the missing
   data is folded into a natural question that a person sends. */

export type Card = { proyecto: string; busca?: string; paga?: string; etapa: "Consultó" | "Interesado" | "Reservó"; marca?: string };

type Turn = {
  /** What Juan writes (before the suggestions appear). */
  juan: string;
  /** What MARQui learns from it. */
  learns: Partial<Card>;
  /** Short note shown when the card changes. */
  note?: string;
  replies: [string, string, string];
  /** The reply the demo picks on its own. */
  pick: number;
};

const turns: Turn[] = [
  {
    juan: "precio?",
    learns: {},
    replies: [
      "¡Hola Juan! En MARQ Collection hay departamentos de 1, 2 y 3 dormitorios desde USD 68.000. ¿Cuántos dormitorios estás buscando?",
      "¡Hola Juan! Soy de MARQ 👋 Los valores de MARQ Collection arrancan en USD 68.000, con anticipo y cuotas. ¿Lo pensás para vivir o para invertir?",
      "¡Hola Juan! Te paso la lista con valores y disponibilidad de MARQ Collection. ¿Te viene bien una llamada corta hoy?",
    ],
    pick: 1,
  },
  {
    juan: "Para invertir. ¿Tienen de 2 dormitorios?",
    learns: { busca: "2 dorm · invertir" },
    note: "MARQui anotó qué busca",
    replies: [
      "¡Sí! Quedan 4 unidades de 2 dormitorios, desde USD 89.000. ¿Lo pensás con crédito o de contado?",
      "Sí, tenemos. Te mando los planos de las de 2 dormitorios por acá. ¿Querés verlos en el estudio esta semana?",
      "¡Genial! Para invertir, la 2B es la que más se alquila en la zona. ¿Te paso cómo es la financiación?",
    ],
    pick: 0,
  },
  {
    juan: "Con crédito hipotecario. ¿Puedo ir a verlos el sábado?",
    learns: { paga: "Crédito", etapa: "Interesado" },
    note: "Pidió visita: pasa a Interesado",
    replies: [
      "¡Claro! El sábado estamos de 10 a 13 en el estudio. ¿Te agendo a las 11?",
      "¡Buenísimo! Te espero el sábado. Llevate el recibo de sueldo así vemos el crédito juntos.",
      "Sí. El sábado a las 11 tengo un lugar. Te paso la ubicación del estudio.",
    ],
    pick: 0,
  },
];

const initialCard: Card = { proyecto: "MARQ Collection", etapa: "Consultó" };

type Msg = { from: "juan" | "me"; text: string; time: string };

type Row = { name: string; line?: string; preview: string; time: string; unread?: number; active?: boolean; pinned?: boolean; followed?: boolean; mark?: string };
const chats: Row[] = [
  { name: "MARQui", preview: "☀️ Buen día, Cande. Ayer entraron 23…", time: "9:00", pinned: true },
  { name: "Juan", line: "Pauta", preview: "precio?", time: "10:30", unread: 1, active: true },
  { name: "Laura Gómez", line: "Pauta", preview: "Genial, lo veo con mi pareja 🙂", time: "10:12", followed: true },
  { name: "Marta Ríos", line: "Clientes", preview: "¿Sigue disponible la 3B?", time: "9:48", unread: 2, mark: "Reaparece" },
  { name: "Sofía Acosta", line: "Clientes", preview: "Me pasó tu contacto Pablo Sosa", time: "9:20", mark: "Referida" },
];

const clock = (turn: number, mine: boolean) => `10:${String(30 + turn * 4 + (mine ? 2 : 0)).padStart(2, "0")}`;

export function WhatsAppWeb({ className, autoplay = true, showSidebar = true, height = "h-[min(41rem,82svh)]" }: { className?: string; autoplay?: boolean; showSidebar?: boolean; height?: string }) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.4 });

  const [turn, setTurn] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "juan", text: turns[0]!.juan, time: clock(0, false) }]);
  const [card, setCard] = useState<Card>(initialCard);
  const [note, setNote] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState(true);
  const [picked, setPicked] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [touched, setTouched] = useState(false);
  const [following, setFollowing] = useState(false);
  const [run, setRun] = useState(0);
  const done = turn >= turns.length - 1 && msgs.at(-1)?.from === "me";
  // MARQui's face follows the chat: thinking while Juan writes, happy when he learns something or Juan moves up.
  const life = useMarquiLife({ active: inView, override: typing ? "pensando" : note || done ? "alegria" : picked !== null ? "guino" : null });
  const mood: Pose = life;

  /** Juan answers the next turn: typing dots, his message, then the card learns. */
  const juanAnswers = useCallback((next: number, delay: (ms: number, fn: () => void) => void) => {
    const t = turns[next];
    if (!t) return;
    delay(700, () => setTyping(true));
    delay(2100, () => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "juan", text: t.juan, time: clock(next, false) }]);
      setTurn(next);
    });
    delay(2700, () => {
      setCard((c) => ({ ...c, ...t.learns }));
      if (t.note) setNote(t.note);
      setShowReplies(true);
      setPicked(null);
    });
    delay(5200, () => setNote(null));
  }, []);

  // Two clocks: the autoplay (cancelled as soon as someone touches the demo)
  // and Juan's answers (which always arrive).
  const auto = useRef<number[]>([]);
  const story = useRef<number[]>([]);
  const clear = () => {
    auto.current.forEach(clearTimeout);
    auto.current = [];
  };
  const clearAll = () => {
    clear();
    story.current.forEach(clearTimeout);
    story.current = [];
  };
  const on = (bucket: typeof auto) => (ms: number, fn: () => void) => void bucket.current.push(window.setTimeout(fn, ms));

  const sendText = useCallback(
    (text: string) => {
      setMsgs((m) => [...m, { from: "me", text, time: clock(turn, true) }]);
      setDraft("");
      setShowReplies(false);
      juanAnswers(turn + 1, on(story));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [turn, juanAnswers],
  );

  // Without interaction, the story plays itself: pick, type, send, and Juan answers.
  useEffect(() => {
    if (!autoplay || !inView || touched || reduce || done || !showReplies) return;
    const t = turns[turn]!;
    const text = t.replies[t.pick]!;
    const at = on(auto);
    at(2600, () => setPicked(t.pick));
    const step = 4;
    for (let i = 0; i <= text.length; i += step) at(2900 + (i / step) * 34, () => setDraft(text.slice(0, i)));
    const typed = 2900 + Math.ceil(text.length / step) * 34;
    at(typed + 60, () => setDraft(text));
    at(typed + 1500, () => sendText(text));
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, inView, touched, reduce, turn, showReplies, run, done]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => clearAll, []);

  const choose = (i: number) => {
    clear();
    setTouched(true);
    setPicked(i);
    setDraft(turns[turn]!.replies[i]!);
  };
  const send = () => {
    if (!draft.trim()) return;
    clear();
    setTouched(true);
    sendText(draft.trim());
  };
  const reset = () => {
    clearAll();
    setTurn(0);
    setMsgs([{ from: "juan", text: turns[0]!.juan, time: clock(0, false) }]);
    setCard(initialCard);
    setNote(null);
    setShowReplies(true);
    setPicked(null);
    setDraft("");
    setTyping(false);
    setTouched(false);
    setRun((r) => r + 1);
  };

  return (
    <div ref={root} className={className}>
      <BrowserFrame
        url="web.whatsapp.com"
        badge={
          <span className="hidden items-center gap-1.5 rounded-md bg-ink px-2 py-1 text-[0.72rem] font-medium text-white sm:flex">
            <Mascot className="size-3.5" /> MARQui activo
          </span>
        }
      >
        <div className={cn("wa-font grid grid-cols-1 text-[#111b21]", height, showSidebar && "lg:grid-cols-[3.75rem_minmax(17rem,24rem)_1fr]")}>
          {showSidebar && <Rail />}
          {showSidebar && <Sidebar juanFollowed={following} />}

          <section className="relative flex min-w-0 flex-col" aria-label="Chat de ejemplo con Juan">
            <header className="flex items-center gap-4 border-b border-black/[0.06] bg-[#f0f2f5] px-4 py-2.5">
              <Face name="Juan" className="size-10" />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-[1rem] font-semibold">Juan</span>
                <span className="block truncate text-[0.8rem] text-black/55">{typing ? <TextShimmer className="text-[#008069]">escribiendo…</TextShimmer> : "Línea de pauta · llegó por un anuncio"}</span>
              </span>
              {/* The extension's button: follow this client, and MARQui tells you the moment they write. */}
              <button
                type="button"
                onClick={() => setFollowing((f) => !f)}
                aria-pressed={following}
                className={cn(
                  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[0.82rem] font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008069]",
                  following ? "bg-[#f5b301] text-[#3d2c00] shadow-[0_4px_12px_-4px_rgb(245_179_1/0.7)]" : "bg-white text-[#54656f] shadow-[0_0_0_1px_rgb(0_0_0/0.12)] hover:bg-[#fff8e1]",
                )}
              >
                <motion.span key={String(following)} initial={{ scale: 0.4, rotate: -60 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 16 }} className="grid">
                  <Star className={cn("size-4", following && "fill-current")} aria-hidden />
                </motion.span>
                <span className="max-sm:sr-only">{following ? "Siguiendo" : "Seguir"}</span>
              </button>
              <Video className="size-5 text-[#54656f] max-sm:hidden" aria-hidden />
              <Search className="size-5 text-[#54656f] max-sm:hidden" aria-hidden />
              <MoreVertical className="size-5 text-[#54656f]" aria-hidden />
            </header>

            {/* MARQui's card: only the team sees it. */}
            <ProspectCard card={card} note={note} pose={mood} />

            <div className="wa-paper flex flex-1 flex-col justify-end gap-2 overflow-hidden px-[5%] py-4">
              <AnimatePresence initial={false}>
                {msgs.map((m, i) => (
                  <motion.div key={`${run}-${i}`} layout initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className={cn("flex", m.from === "me" && "justify-end")}>
                    <Bubble msg={m} withAd={i === 0} />
                  </motion.div>
                ))}
                {typing && (
                  <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex">
                    <span className="flex gap-1 rounded-[0.6rem] rounded-tl-none bg-white px-3 py-3 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]" aria-label="Juan está escribiendo">
                      {[0, 1, 2].map((d) => (
                        <motion.i key={d} className="size-2 rounded-full bg-black/35" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
                      ))}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Suggestions
              replies={turns[turn]!.replies}
              visible={showReplies && !done}
              picked={picked}
              onPick={choose}
              onReset={reset}
              done={done}
              pose={mood}
            />

            <form
              className="flex items-end gap-2 bg-[#f0f2f5] px-3 py-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <div className="flex min-h-12 flex-1 items-end gap-1 rounded-[1.6rem] bg-white px-2 py-1.5 shadow-[0_1px_0.5px_rgb(11_20_26/0.08)]">
                <Plus className="mb-1.5 size-6 shrink-0 text-[#54656f]" aria-hidden />
                <Smile className="mb-1.5 size-6 shrink-0 text-[#54656f] max-sm:hidden" aria-hidden />
                <label className="sr-only" htmlFor={`wa-draft-${run}`}>
                  Tu respuesta para Juan
                </label>
                <textarea
                  id={`wa-draft-${run}`}
                  rows={1}
                  value={draft}
                  onChange={(e) => {
                    clear();
                    setTouched(true);
                    setDraft(e.target.value);
                  }}
                  placeholder="Escribe un mensaje"
                  className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-[0.95rem] leading-snug outline-none [field-sizing:content] placeholder:text-[#667781]"
                />
              </div>
              {draft.trim() ? (
                <button type="submit" aria-label="Enviar (simulado)" className="grid size-12 shrink-0 place-items-center rounded-full bg-[#00a884] text-white">
                  <SendHorizontal className="size-5" />
                </button>
              ) : (
                <span className="grid size-12 shrink-0 place-items-center text-[#54656f]" aria-hidden>
                  <Mic className="size-6" />
                </span>
              )}
            </form>
          </section>
        </div>
      </BrowserFrame>
    </div>
  );
}

function Sidebar({ juanFollowed }: { juanFollowed: boolean }) {
  return (
    <aside className="hidden flex-col border-r border-black/[0.07] bg-white lg:flex" aria-label="Chats de ejemplo">
      <div className="flex items-center gap-2 px-4 pb-2 pt-4">
        <span className="mr-auto text-[1.4rem] font-bold tracking-[-0.01em] text-[#00a884]">WhatsApp</span>
        <SquarePen className="size-5 text-[#54656f]" aria-hidden />
        <MoreVertical className="size-5 text-[#54656f]" aria-hidden />
        {/* The extension adds one button: MARQador opens in a new tab. */}
        <a href="/?app=marqador" title="Abrir MARQador en una pestaña nueva" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-ink py-1.5 pl-2 pr-3 text-[0.78rem] font-semibold text-white transition-transform hover:-translate-y-0.5">
          <MarqadorMark className="size-4.5" /> MARQador <ArrowUpRight className="size-3.5" />
        </a>
      </div>
      <div className="mx-3 mb-2 flex h-10 items-center gap-3 rounded-full bg-[#f0f2f5] px-4 text-[0.88rem] text-[#667781]">
        <Search className="size-4" /> Buscar un chat o iniciar uno nuevo
      </div>
      <div className="mb-1 flex gap-1.5 px-3 text-[0.82rem]">
        {["Todos", "No leídos", "Favoritos", "Grupos"].map((f, i) => (
          <span key={f} className={cn("rounded-full px-3 py-1.5", i === 0 ? "bg-[#d9fdd3] font-medium text-[#008069]" : "border border-[#e9edef] text-[#54656f]")}>
            {f}
          </span>
        ))}
      </div>
      <ul className="flex-1 overflow-hidden">
        {chats.map((c) => {
          const followed = c.followed || (c.name === "Juan" && juanFollowed);
          return (
          <motion.li
            key={c.name}
            layout
            className={cn("relative flex items-center gap-3 px-3 py-2.5 transition-colors duration-500", followed ? (c.active ? "bg-[#fde9ad]" : "bg-[#fff6d9]") : c.active && "bg-wa-panel")}
          >
            {/* Followed chats wear amber, findable at a glance. */}
            {followed && <i className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[#f5b301]" aria-hidden />}
            {c.pinned ? <MarquiAvatar className="size-11" /> : <Face name={c.name} className="size-11" />}
            <span className="min-w-0 flex-1 border-b border-black/[0.05] pb-2.5">
              <span className="flex items-baseline justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1">
                  <span className="truncate text-[0.95rem] font-medium">{c.name}</span>
                  {followed && <Star className="size-3.5 shrink-0 fill-[#f5b301] text-[#f5b301]" aria-label="Seguido" />}
                  {c.mark && <span className={cn("shrink-0 rounded-full px-1.5 py-px text-[0.6rem] font-semibold", c.mark === "Referida" ? "bg-[#d7f3ec] text-[#00594f]" : "bg-[#ffecc7] text-[#7a4a00]")}>{c.mark}</span>}
                </span>
                <span className={cn("text-[0.72rem]", c.unread ? "font-semibold text-[#1daa61]" : "text-black/45")}>{c.time}</span>
              </span>
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-[0.82rem] text-black/55">
                  {c.line && <span className="mr-1 rounded bg-black/[0.05] px-1 text-[0.66rem] font-semibold uppercase tracking-wide text-black/50">{c.line}</span>}
                  {c.preview}
                </span>
                {c.unread ? (
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-wa text-[0.7rem] font-semibold text-white">{c.unread}</span>
                ) : (
                  c.pinned && <Pin className="size-3.5 shrink-0 rotate-45 text-[#8696a0]" aria-label="Fijado" />
                )}
              </span>
            </span>
          </motion.li>
          );
        })}
      </ul>
    </aside>
  );
}

function Bubble({ msg, withAd }: { msg: Msg; withAd: boolean }) {
  const mine = msg.from === "me";
  return (
    <div className={cn("max-w-[82%] rounded-[0.6rem] p-1.5 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]", mine ? "rounded-tr-none bg-wa-bubble" : "rounded-tl-none bg-white")}>
      {withAd && (
        <div className="mb-1 flex items-center gap-2 rounded-md bg-wa-panel p-2 text-[0.78rem] text-black/60">
          <Megaphone className="size-4 shrink-0 text-blue" />
          <span>
            <b className="block font-semibold text-black/75">Anuncio · MARQ Collection</b>
            Departamentos en Resistencia
          </span>
        </div>
      )}
      <p className="px-1.5 text-[0.95rem] leading-[1.4]">
        {msg.text}
        <span className="ml-2 inline-flex translate-y-0.5 items-center gap-0.5 whitespace-nowrap text-[0.68rem] text-black/45">
          {msg.time} {mine && <CheckCheck className="size-3.5 text-[#53bdeb]" />}
        </span>
      </p>
    </div>
  );
}

const fields: { key: keyof Card; label: string }[] = [
  { key: "proyecto", label: "Proyecto" },
  { key: "busca", label: "Busca" },
  { key: "paga", label: "Paga" },
  { key: "etapa", label: "Etapa" },
];

/** The card MARQui pins on top of every chat: what we know, and what's missing. */
export function ProspectCard({ card, note, className, pose = "reposo" }: { card: Card; note?: string | null; className?: string; pose?: Pose }) {
  return (
    <div className={cn("relative flex flex-wrap items-center gap-1.5 border-b border-ink/10 bg-teal-soft px-3 py-2", className)}>
      <MarquiAvatar className="size-7" pose={pose} />
      {fields.map(({ key, label }) => {
        const value = card[key];
        return (
          <motion.span
            key={`${key}-${value ?? "none"}`}
            initial={value && key !== "proyecto" ? { scale: 0.85, backgroundColor: "#25d366" } : false}
            animate={{ scale: 1, backgroundColor: value ? (key === "etapa" && value === "Interesado" ? "#008c7e" : "#ffffff") : "rgba(255,255,255,0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.8rem] leading-none",
              value ? "ring-1 ring-ink/10" : "border border-dashed border-ink/30 text-ink-3",
              key === "etapa" && value === "Interesado" && "text-white ring-0",
            )}
          >
            <span className={cn("font-medium", value && !(key === "etapa" && value === "Interesado") && "text-ink-3", key === "etapa" && value === "Interesado" && "text-white/70")}>{label}</span>
            {value ? <b className="font-semibold">{value}</b> : <b className="font-semibold">¿?</b>}
          </motion.span>
        );
      })}
      {card.marca && <span className="inline-flex items-center rounded-full bg-sun px-2.5 py-1 text-[0.8rem] font-semibold leading-none text-ink">{card.marca}</span>}
      <AnimatePresence>
        {note && (
          <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="ml-auto text-[0.78rem] font-semibold text-wa-deep max-md:hidden">
            ✓ {note}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function Suggestions({ replies, visible, picked, onPick, onReset, done, pose }: { replies: readonly string[]; visible: boolean; picked: number | null; onPick: (i: number) => void; onReset: () => void; done: boolean; pose: Pose }) {
  return (
    <div className="border-t border-ink/10 bg-teal-soft px-3 pb-2 pt-2">
      <div className="mb-1.5 flex items-center gap-2 px-1">
        <MarquiAvatar className="size-7" pose={pose} />
        <span className="text-[0.8rem] font-semibold text-ink">MARQui</span>
        <span className="text-[0.8rem] text-ink-3">sugiere</span>
        <span className="text-[0.75rem] text-ink-3">· solo vos lo ves</span>
        <button type="button" onClick={onReset} className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.75rem] font-medium text-ink-3 hover:bg-ink/5" aria-label="Reiniciar la demo">
          <RotateCcw className="size-3.5" /> Reiniciar
        </button>
      </div>
      <div className="min-h-[5.6rem]">
        <AnimatePresence mode="wait">
          {visible ? (
            <motion.div key={replies[0]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 md:grid md:grid-cols-3 md:overflow-visible">
              {replies.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onPick(i)}
                  aria-pressed={picked === i}
                  className={cn(
                    "flex w-[15rem] shrink-0 cursor-pointer snap-start items-start gap-2 rounded-xl p-2.5 text-left text-[0.82rem] leading-snug transition-[background-color,color,transform,box-shadow] duration-300 ease-out-expo hover:-translate-y-0.5 md:w-auto",
                    picked === i ? "bg-[#008c7e] text-white shadow-[0_8px_18px_-8px_rgb(0_140_126/0.7)]" : "bg-white text-[#3b4a54] shadow-[0_1px_3px_rgb(6_35_31/0.12)]",
                  )}
                >
                  <span className={cn("mt-px grid size-[1.15rem] shrink-0 place-items-center rounded-[0.3rem] text-[0.66rem] font-semibold tabular-nums", picked === i ? "bg-white/20 text-white" : "bg-[#f3f5f6] text-[#667781]")}>{i + 1}</span>
                  <span className="line-clamp-4 flex-1">{r}</span>
                  {picked === i && <Check className="mt-0.5 size-3.5 shrink-0" strokeWidth={3} aria-hidden />}
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.p key={done ? "done" : "wait"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid h-[5.2rem] place-items-center rounded-xl border border-dashed border-ink/15 text-center text-[0.85rem] text-ink-3">
              {done ? "Juan pasó a Interesado y ya tiene visita. Seguilo con ☆ para que MARQui te avise apenas escriba." : <TextShimmer>MARQui espera la respuesta de Juan…</TextShimmer>}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** WhatsApp Web's left rail: chats, status, channels, communities, settings, profile. */
function Rail() {
  const top = [MessageSquareText, CircleDashed, MessagesSquare, Users];
  return (
    <nav className="hidden flex-col items-center gap-2 border-r border-black/[0.06] bg-[#f0f2f5] py-3 lg:flex" aria-hidden>
      {top.map((Icon, i) => (
        <span key={i} className={cn("relative grid size-10 place-items-center rounded-full text-[#54656f]", i === 0 && "bg-[#d9dbdf] text-[#111b21]")}>
          <Icon className="size-5" />
          {i === 0 && <i className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#25d366] px-1 text-[0.6rem] font-semibold not-italic text-white">3</i>}
        </span>
      ))}
      <span className="mt-auto grid size-10 place-items-center text-[#54656f]">
        <Settings className="size-5" />
      </span>
      <Face name="Cande" className="size-8" />
    </nav>
  );
}
