import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { BellRing, CalendarClock, Clock, FileText, ListChecks, MessageCircle, MessageSquarePlus, MoreVertical, Pin, Search, Star, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarquiAvatar, ease } from "./primitives";
import { MarquiMark } from "./marqui-mark";
import { BUBBLE, ChatHeader, ChatWindow, Composer, Cursor, Face, Tail, Time } from "./wa-kit";

type ChatId = "marqui" | "laura";
type Aim = "seguir" | "list-marqui" | "reglas" | "abrir" | null;

const RULE = "Todos los días a las 18 pasame la lista de los que preguntaron por Fontana y MARQ Collection";

/* The scene at rest: what reduced motion shows, and where autoplay starts from. */
const START = { active: "laura" as ChatId, following: false, toast: false, draft: "", ruleSent: false, marquiTyping: false, ruleMade: false, panel: false, clock: false, later: false, notified: false, lauraRead: false };
const SETTLED = { ...START, active: "marqui" as ChatId, following: true, ruleSent: true, ruleMade: true, later: true, notified: true };

/**
 * Seguimiento y reglas, in the full WhatsApp Web layout: chat list on the left,
 * the conversation on the right. Three beats, each caused by the cursor:
 * you follow Laura · you give MARQui a daily task and it shows up in his rules ·
 * days later Laura writes, and MARQui tells you first. The first real click
 * stops the autoplay and hands you the controls.
 */
export function FollowVisual() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.5 });
  const [s, setS] = useState(reduce ? SETTLED : START);
  const [aim, setAim] = useState<Aim>(null);
  const [manual, setManual] = useState(false);
  const [run, setRun] = useState(0);
  const set = (patch: Partial<typeof START>) => setS((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!inView || reduce || manual) return;
    setS(START);
    setAim(null);
    const ids: number[] = [];
    const at = (ms: number, fn: () => void) => ids.push(window.setTimeout(fn, ms));
    // The cursor takes ~1.35 s to glide in and press.
    const press = (ms: number, target: Exclude<Aim, null>, fn: () => void) => {
      at(ms, () => setAim(target));
      at(ms + 1400, () => {
        setAim(null);
        fn();
      });
    };
    // 1 · Follow Laura.
    press(1200, "seguir", () => set({ following: true, toast: true }));
    at(4300, () => set({ toast: false }));
    // 2 · Give MARQui a rule, then look at his rules.
    press(4500, "list-marqui", () => set({ active: "marqui" }));
    for (let i = 0; i <= RULE.length; i += 3) at(6400 + i * 13, () => set({ draft: RULE.slice(0, i) }));
    at(6400 + RULE.length * 13 + 30, () => set({ draft: RULE }));
    at(8300, () => set({ draft: "", ruleSent: true }));
    at(8800, () => set({ marquiTyping: true }));
    at(9900, () => set({ marquiTyping: false, ruleMade: true }));
    press(10900, "reglas", () => set({ panel: true }));
    at(16200, () => set({ panel: false }));
    // 3 · Three days later, Laura writes. MARQui tells you first.
    at(16800, () => set({ clock: true, later: true }));
    at(18500, () => set({ clock: false, notified: true }));
    press(19700, "abrir", () => set({ active: "laura", lauraRead: true }));
    at(26500, () => setRun((r) => r + 1));
    return () => ids.forEach(clearTimeout);
  }, [inView, reduce, manual, run]);

  /** A real click: autoplay stops where it is, and you drive. */
  const take = (patch: Partial<typeof START>) => {
    setManual(true);
    setAim(null);
    set({ clock: false, toast: false, draft: "", ...patch });
  };
  const open = (id: ChatId) => take({ active: id, panel: false, ...(id === "laura" && s.notified ? { lauraRead: true } : {}) });

  return (
    <div ref={root} className="wa-font relative w-full max-w-[50rem] text-[#111b21]">
      <ChatWindow>
        <div className="relative flex h-[36rem]">
          <ChatList s={s} aim={aim} onOpen={open} />
          <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden" aria-label={s.active === "marqui" ? "Chat con MARQui" : "Chat con Laura Gómez"}>
            {s.active === "laura" ? (
              <LauraChat s={s} aim={aim} onFollow={() => take({ following: !s.following })} />
            ) : (
              <MarquiChat s={s} aim={aim} onRules={() => take({ panel: !s.panel })} onOpenLaura={() => open("laura")} />
            )}

            <AnimatePresence>
              {s.panel && <RulesPanel s={s} onClose={() => take({ panel: false })} />}
            </AnimatePresence>

          </section>
          {/* Time passes: a beat of its own, so the jump reads. */}
          <AnimatePresence>
            {s.clock && (
              <motion.div
                className="absolute inset-0 z-20 grid place-items-center bg-white/40 backdrop-blur-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
              >
                <motion.span
                  initial={{ y: 10, scale: 0.96 }}
                  animate={{ y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease }}
                  className="flex items-center gap-3 rounded-2xl bg-[#111b21] px-5 py-3.5 text-white shadow-[0_1.5rem_3rem_-1rem_rgb(0_0_0/0.5)]"
                >
                  <Clock className="size-5 text-[#25d366]" aria-hidden />
                  <span className="leading-tight">
                    <b className="block text-[1.05rem] font-semibold">Jueves · 16:20</b>
                    <span className="text-[0.78rem] text-white/60">Tres días después</span>
                  </span>
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ChatWindow>
      <p className="sky-type mt-4 flex items-center justify-center gap-2 text-[0.9rem] font-medium text-white/85">
        <Star className="size-4" /> Seguís a quien importa. Las reglas, siempre a la vista.
      </p>
    </div>
  );
}

type Scene = typeof START;

/* ——— Left: the chat list ——— */

function ChatList({ s, aim, onOpen }: { s: Scene; aim: Aim; onOpen: (id: ChatId) => void }) {
  const rows: { id: string; name: string; avatar: ReactNode; preview: ReactNode; time: string; unread?: number; pinned?: boolean; star?: boolean; open?: ChatId }[] = [
    {
      id: "marqui",
      name: "MARQui",
      avatar: <MarquiAvatar className="size-10 shrink-0" />,
      preview: s.notified ? "⭐ Laura Gómez te escribió" : s.ruleMade ? "Listo, regla creada ✓" : "☀️ Buen día, Cande. Ayer entraron…",
      time: s.notified ? "16:20" : s.ruleSent ? "11:04" : "9:00",
      pinned: true,
      open: "marqui",
    },
    {
      id: "laura",
      name: "Laura Gómez",
      avatar: <Face name="Laura Gómez" className="size-10" />,
      preview: s.notified ? "¿El sábado se puede ir a ver la 2A? 🙌" : "Genial, lo veo con mi pareja y te digo 🙂",
      time: s.notified ? "16:20" : "10:42",
      unread: s.notified && !s.lauraRead ? 1 : 0,
      star: s.following,
      open: "laura",
    },
    { id: "sofia", name: "Sofía Acosta", avatar: <Face name="Sofía Acosta" className="size-10" />, preview: "¡Gracias! Nos vemos el sábado", time: s.later ? "lunes" : "10:58" },
    { id: "marta", name: "Marta Ríos", avatar: <Face name="Marta Ríos" className="size-10" />, preview: "Con crédito hipotecario 👍", time: s.later ? "lunes" : "10:15" },
    { id: "juan", name: "Juan", avatar: <Face name="Juan" className="size-10" />, preview: "precio?", time: s.later ? "domingo" : "ayer" },
  ];
  // Pinned first, then by the last message. Laura's new message lifts her to the top.
  const order = s.notified ? ["marqui", "laura", "sofia", "marta", "juan"] : ["marqui", "sofia", "laura", "marta", "juan"];
  rows.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  return (
    <aside className="hidden w-[42%] max-w-[19rem] shrink-0 flex-col border-r border-black/[0.08] bg-white sm:flex" aria-label="Chats">
      <div className="flex items-center gap-2 px-4 pb-2 pt-3.5">
        <b className="flex-1 text-[1.2rem] font-bold tracking-[-0.01em]">Chats</b>
        <MessageSquarePlus className="size-[1.15rem] text-[#54656f]" aria-hidden />
        <MoreVertical className="size-[1.15rem] text-[#54656f]" aria-hidden />
      </div>
      <div className="px-3">
        <span className="flex h-8 items-center gap-2.5 rounded-full bg-[#f0f2f5] px-3 text-[0.78rem] text-[#667781]">
          <Search className="size-3.5" aria-hidden /> Buscar
        </span>
      </div>
      <div className="flex gap-1.5 px-3 pb-1.5 pt-2.5 text-[0.72rem]" aria-hidden>
        <span className="rounded-full bg-[#d9fdd3] px-2.5 py-1 font-medium text-[#008069]">Todos</span>
        <span className="rounded-full bg-[#f0f2f5] px-2.5 py-1 text-[#54656f]">No leídos</span>
        <span className="rounded-full bg-[#f0f2f5] px-2.5 py-1 text-[#54656f]">Favoritos</span>
      </div>
      <ul className="min-h-0 flex-1 overflow-hidden">
        {rows.map((r) => {
          const on = r.open === s.active;
          const body = (
            <>
              {r.avatar}
              <span className="min-w-0 flex-1 py-0.5">
                <span className="flex items-center gap-1">
                  <span className="truncate text-[0.88rem]">{r.name}</span>
                  <AnimatePresence>
                    {r.star && (
                      <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} className="shrink-0">
                        <Star className="size-3.5 fill-[#f5b301] text-[#f5b301]" aria-label="Seguido" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className={cn("ml-auto shrink-0 pl-1 text-[0.66rem]", r.unread ? "font-semibold text-[#1fa855]" : "text-[#667781]")}>{r.time}</span>
                </span>
                <span className="mt-0.5 flex items-center gap-1">
                  <span className={cn("truncate text-[0.76rem]", r.unread ? "font-medium text-[#111b21]" : "text-[#667781]")}>{r.preview}</span>
                  {r.unread ? (
                    <motion.span key={`${r.id}-unread`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }} className="ml-auto grid size-[1.15rem] shrink-0 place-items-center rounded-full bg-[#25d366] text-[0.62rem] font-bold text-white">
                      {r.unread}
                    </motion.span>
                  ) : (
                    r.pinned && <Pin className="ml-auto size-3.5 shrink-0 rotate-45 text-[#8696a0]" aria-label="Fijado" />
                  )}
                </span>
              </span>
            </>
          );
          return (
            <motion.li key={r.id} layout transition={{ duration: 0.5, ease }}>
              {r.open ? (
                <button
                  type="button"
                  onClick={() => onOpen(r.open!)}
                  className={cn("relative flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#008069]", on ? "bg-[#f0f2f5]" : "hover:bg-[#f5f6f6]")}
                  aria-current={on ? "true" : undefined}
                >
                  {body}
                  {aim === "list-marqui" && r.id === "marqui" && <Cursor play delay={0} />}
                </button>
              ) : (
                <div className="flex items-center gap-3 px-3 py-2">{body}</div>
              )}
            </motion.li>
          );
        })}
      </ul>
    </aside>
  );
}

/* ——— Right: the two conversations ——— */

const DAY = cn("mx-auto my-1 rounded-md bg-white px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wide text-[#54656f]", BUBBLE);
const IN = cn("relative w-fit max-w-[78%] rounded-[0.55rem] bg-white px-2.5 py-1.5 text-[0.84rem] leading-[1.35]", BUBBLE);
const OUT = cn("relative ml-auto w-fit max-w-[78%] rounded-[0.55rem] bg-wa-bubble px-2.5 py-1.5 text-[0.84rem] leading-[1.35]", BUBBLE);
const pop = { initial: { opacity: 0, y: 10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.4, ease } };

function LauraChat({ s, aim, onFollow }: { s: Scene; aim: Aim; onFollow: () => void }) {
  const tags = [
    { label: "Proyecto", value: "MARQ Collection" },
    { label: "Busca", value: "2A · 2 dorm" },
    { label: "Paga", value: null },
  ];
  return (
    <>
      <ChatHeader
        name="Laura Gómez"
        avatar={<Face name="Laura Gómez" className="size-9" />}
        actions={
          /* The extension's addition to a client's chat: follow them, right by their name. */
          <button
            type="button"
            onClick={onFollow}
            aria-pressed={s.following}
            className={cn(
              "relative mr-1 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[0.76rem] font-semibold leading-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008069]",
              s.following ? "bg-[#f5b301] text-[#3d2c00] shadow-[0_4px_12px_-4px_rgb(245_179_1/0.7)]" : "bg-white text-[#54656f] shadow-[0_0_0_1px_rgb(0_0_0/0.12)] hover:bg-[#fff8e1]",
            )}
          >
            <motion.span key={String(s.following)} initial={{ scale: 0.4, rotate: -60 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 16 }} className="grid">
              <Star className={cn("size-4", s.following && "fill-current")} aria-hidden />
            </motion.span>
            <span className="max-sm:sr-only">{s.following ? "Siguiendo" : "Seguir"}</span>
            {aim === "seguir" && <Cursor play delay={0} />}
          </button>
        }
        below={
          <div className="flex flex-wrap items-center gap-1 pb-0.5 pl-12 pt-2">
            <MarquiMark tone="teal" className="mr-0.5 size-3.5" title="Etiquetas de MARQui" />
            {tags.map((t) => (
              <span key={t.label} className={cn("inline-flex h-[1.35rem] items-center gap-1 rounded-full px-2 text-[0.68rem] leading-none", t.value ? "bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.07)]" : "border border-dashed border-black/25 text-[#667781]")}>
                <span className="text-[#667781]">{t.label}</span>
                <b className="font-semibold">{t.value ?? "?"}</b>
              </span>
            ))}
          </div>
        }
      >
        {s.notified ? "en línea" : "últ. vez hoy a las 10:42"}
      </ChatHeader>

      <div className="wa-paper flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-4 pb-3 pt-3">
        <span className={DAY}>{s.later ? "Lunes" : "Hoy"}</span>
        <div className={cn(IN, "rounded-tl-none")}>
          <Tail />
          Hola, ¿la 2A de Collection sigue disponible?
          <Time>10:31</Time>
        </div>
        <div className={cn(OUT, "rounded-tr-none p-1")}>
          <Tail out />
          <span className="flex items-center gap-2 rounded-[0.4rem] bg-black/[0.05] p-2">
            <span className="grid size-8 place-items-center rounded-md bg-[#e5484d] text-white">
              <FileText className="size-4" aria-hidden />
            </span>
            <span className="leading-tight">
              <b className="block text-[0.78rem] font-semibold">Plano 2A · Collection.pdf</b>
              <span className="text-[0.66rem] text-[#667781]">1 página · PDF</span>
            </span>
          </span>
          <p className="px-1.5 pb-0.5 pt-1">
            ¡Hola Laura! Sí, sigue. Te paso el plano 📐
            <Time read>10:36</Time>
          </p>
        </div>
        <div className={cn(IN, "rounded-tl-none")}>
          <Tail />
          Genial, lo veo con mi pareja y te digo 🙂
          <Time>10:42</Time>
        </div>

        <AnimatePresence>
          {s.toast && (
            <motion.p {...pop} exit={{ opacity: 0, y: 6 }} className="mx-auto mt-1 flex items-center gap-1.5 rounded-full bg-[#fff3c4] px-3 py-1.5 text-[0.72rem] font-medium text-[#5c4300] shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">
              <Star className="size-3 fill-[#f5b301] text-[#f5b301]" aria-hidden />
              Listo. MARQui te avisa apenas Laura escriba.
            </motion.p>
          )}
        </AnimatePresence>

        {s.notified && (
          <>
            <span className={DAY}>Hoy</span>
            <motion.div {...pop} className={cn(IN, "rounded-tl-none")}>
              <Tail />
              ¿El sábado se puede ir a ver la 2A? 🙌
              <Time>16:20</Time>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.5, ease }}
              className="mt-1.5 rounded-[0.8rem] bg-white text-[0.8rem] leading-[1.38] shadow-[0_0_0_1.5px_#008c7e,0_8px_20px_-8px_rgb(0_140_126/0.45)]"
            >
              <div className="flex items-center gap-1.5 px-3 pt-2.5">
                <MarquiMark tone="teal" className="size-3.5" />
                <span className="text-[0.74rem] font-semibold">MARQui</span>
                <span className="text-[0.74rem] text-[#667781]">sugiere</span>
              </div>
              <p className="px-3 pb-2.5 pt-1 text-[#3b4a54]">¡Hola Laura! Sí, el sábado abrimos de 10 a 13. ¿Les reservo a las 11 para verla juntos?</p>
            </motion.div>
          </>
        )}
      </div>
      <Composer />
    </>
  );
}

function MarquiChat({ s, aim, onRules, onOpenLaura }: { s: Scene; aim: Aim; onRules: () => void; onOpenLaura: () => void }) {
  const count = 3 + (s.ruleMade ? 1 : 0);
  return (
    <>
      <ChatHeader
        name="MARQui"
        avatar={<MarquiAvatar className="size-9 shrink-0" />}
        actions={
          /* The extension's one addition to this chat: his rules, next to his name. */
          <button
            type="button"
            onClick={onRules}
            aria-expanded={s.panel}
            className={cn(
              "relative mr-1 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full pl-2.5 pr-1.5 text-[0.76rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008069]",
              s.panel ? "bg-[#008c7e] text-white" : "bg-white text-[#00705f] shadow-[0_0_0_1px_rgb(0_140_126/0.25)] hover:bg-[#e7f6f2]",
            )}
          >
            <ListChecks className="size-4" aria-hidden />
            <span className="max-sm:sr-only">Reglas</span>
            <motion.span
              key={count}
              initial={s.ruleMade ? { scale: 1.7 } : false}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 14 }}
              className={cn("grid size-5 place-items-center rounded-full text-[0.66rem] tabular-nums", s.panel ? "bg-white/25" : "bg-[#008c7e] text-white")}
            >
              {count}
            </motion.span>
            {aim === "reglas" && <Cursor play delay={0} />}
          </button>
        }
      >
        {s.marquiTyping ? <span className="text-[#00a884]">escribiendo…</span> : "Asistente de MARQ"}
      </ChatHeader>

      <div className="wa-paper flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-4 pb-3 pt-3">
        <span className={DAY}>{s.later ? "Lunes" : "Hoy"}</span>
        <div className={cn(IN, "rounded-tl-none")}>
          <Tail />
          <b className="font-semibold">☀️ Buen día, Cande.</b> Ayer entraron 23 consultas: 2 interesados nuevos y 4 sin responder.
          <Time>9:00</Time>
        </div>
        {s.ruleSent && (
          <motion.div {...pop} className={cn(OUT, "rounded-tr-none")}>
            <Tail out />
            {RULE}
            <Time read>11:04</Time>
          </motion.div>
        )}
        {s.marquiTyping && (
          <motion.span {...pop} className={cn("relative flex w-fit gap-1 rounded-[0.55rem] rounded-tl-none bg-white px-3 py-2.5", BUBBLE)} aria-label="MARQui está escribiendo">
            <Tail />
            {[0, 1, 2].map((d) => (
              <motion.i key={d} className="size-1.5 rounded-full bg-black/35" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
            ))}
          </motion.span>
        )}
        {s.ruleMade && (
          <motion.div {...pop} className={cn(IN, "w-[80%] rounded-tl-none")}>
            <Tail />
            <b className="font-semibold">Listo, regla creada ✓</b>
            <span className="mt-1.5 flex items-start gap-2 rounded-[0.45rem] bg-[#f3f5f6] p-2">
              <CalendarClock className="mt-px size-4 shrink-0 text-[#008069]" aria-hidden />
              <span className="leading-snug">
                <b className="block text-[0.78rem] font-semibold">Todos los días · 18:00</b>
                <span className="text-[0.74rem] text-[#54656f]">La lista de quienes preguntaron por Fontana y MARQ Collection, con un botón para abrir cada chat.</span>
              </span>
            </span>
            <span className="mt-1 block">
              <button type="button" onClick={onRules} className="cursor-pointer text-[0.78rem] font-semibold text-[#008069] hover:underline">
                Ver reglas
              </button>
              <Time>11:04</Time>
            </span>
          </motion.div>
        )}
        {s.notified && (
          <>
            <span className={DAY}>Hoy</span>
            <motion.div {...pop} className={cn(IN, "w-[80%] rounded-tl-none")}>
              <Tail />
              <b className="font-semibold">⭐ Laura Gómez te escribió</b>
              <span className="mt-1.5 block rounded-[0.45rem] border-l-4 border-[#06cf9c] bg-[#f3f5f6] px-2.5 py-1.5">
                <b className="block text-[0.74rem] font-semibold text-[#06a17a]">Laura Gómez</b>
                <span className="text-[0.8rem] text-[#3b4a54]">¿El sábado se puede ir a ver la 2A? 🙌</span>
              </span>
              <span className="mt-1.5 flex items-center">
                <button
                  type="button"
                  onClick={onOpenLaura}
                  className="relative inline-flex h-7 cursor-pointer items-center gap-1 rounded-full bg-[#e7f6f2] px-2.5 text-[0.72rem] font-semibold text-[#00705f] transition-colors hover:bg-[#d2eee7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008069]"
                >
                  <MessageCircle className="size-3.5" aria-hidden /> Abrir chat
                  {aim === "abrir" && <Cursor play delay={0} />}
                </button>
                <span className="ml-auto">
                  <Time>16:20</Time>
                </span>
              </span>
            </motion.div>
          </>
        )}
      </div>
      <Composer draft={s.draft} typing={!!s.draft && s.draft !== RULE} />
    </>
  );
}

/* ——— The rules panel: what MARQui does without being asked, in one place ——— */

function RulesPanel({ s, onClose }: { s: Scene; onClose: () => void }) {
  const followed = [
    ...(s.following ? [{ name: "Laura Gómez", note: "Potencial cliente · Collection", fresh: true }] : []),
    { name: "Pablo Sosa", note: "Cliente · Torre Natalini", fresh: false },
  ];
  const tasks = [
    { icon: Sun, title: "Resumen diario", when: "Todos los días · 9:00" },
    { icon: BellRing, title: "Avisos al instante", when: "Clientes, reaparecen, referidos y seguidos" },
    ...(s.ruleMade ? [{ icon: ListChecks, title: "Lista: Fontana y Collection", when: "Todos los días · 18:00", fresh: true }] : []),
    { icon: FileText, title: "Resumen semanal", when: "Viernes · 9:00 · con tus seguidos" },
  ];
  return (
    <motion.aside
      className="absolute inset-y-0 right-0 z-10 flex w-[min(19.5rem,90%)] flex-col bg-[#f7f8fa] shadow-[-1rem_0_2.5rem_-1rem_rgb(1_30_27/0.35)]"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.5, ease }}
      aria-label="Reglas de MARQui"
    >
      <header className="flex items-center gap-3 border-b border-black/[0.06] bg-[#f0f2f5] px-3.5 py-3">
        <button type="button" onClick={onClose} aria-label="Cerrar reglas" className="grid size-7 cursor-pointer place-items-center rounded-full text-[#54656f] hover:bg-black/[0.06]">
          <X className="size-4" />
        </button>
        <b className="text-[0.95rem] font-semibold">Reglas de MARQui</b>
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <p className="px-1 text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-[#008069]">Seguís a</p>
        <ul className="mt-1.5 overflow-hidden rounded-[0.7rem] bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.05)]">
          {followed.map((f) => (
            <motion.li
              key={f.name}
              initial={f.fresh ? { opacity: 0, height: 0 } : false}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4, ease }}
              className="flex items-center gap-2.5 border-b border-black/[0.05] px-2.5 py-2 last:border-0"
            >
              <Face name={f.name} className="size-8" />
              <span className="min-w-0 flex-1 leading-tight">
                <b className="block text-[0.8rem] font-semibold">{f.name}</b>
                <span className="text-[0.68rem] text-[#667781]">{f.note}</span>
              </span>
              <Star className="size-3.5 fill-[#f5b301] text-[#f5b301]" aria-hidden />
            </motion.li>
          ))}
        </ul>
        <p className="mt-1.5 px-1 text-[0.66rem] leading-snug text-[#667781]">Te aviso apenas te escriben. En el resumen del viernes, quién escribió y quién está callado.</p>

        <p className="mt-4 px-1 text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-[#008069]">Tareas</p>
        <ul className="mt-1.5 overflow-hidden rounded-[0.7rem] bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.05)]">
          {tasks.map((t) => (
            <motion.li
              key={t.title}
              initial={"fresh" in t ? { backgroundColor: "#c9efe5" } : false}
              animate={{ backgroundColor: "fresh" in t ? "#eef9f6" : "#ffffff" }}
              transition={{ duration: 1.6, ease }}
              className="flex items-center gap-2.5 border-b border-black/[0.05] px-2.5 py-2 last:border-0"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-[0.5rem] bg-[#e7f6f2] text-[#008069]">
                <t.icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="flex items-center gap-1.5">
                  <b className="text-[0.8rem] font-semibold">{t.title}</b>
                  {"fresh" in t && <span className="rounded-full bg-[#008c7e] px-1.5 py-px text-[0.58rem] font-bold uppercase tracking-wide text-white">Nueva</span>}
                </span>
                <span className="text-[0.68rem] text-[#667781]">{t.when}</span>
              </span>
              {/* On/off. Decorative here: pausing one is a tap. */}
              <span className="relative h-[1.1rem] w-8 shrink-0 rounded-full bg-[#00a884]" aria-label="Activa">
                <i className="absolute right-0.5 top-0.5 size-[0.85rem] rounded-full bg-white shadow-sm" />
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <p className="flex items-start gap-2 border-t border-black/[0.06] bg-white px-3.5 py-3 text-[0.7rem] leading-snug text-[#54656f]">
        <MessageCircle className="mt-px size-3.5 shrink-0 text-[#008069]" aria-hidden />
        Para sumar, pausar o cambiar una regla, pedíselo a MARQui en el chat.
      </p>
    </motion.aside>
  );
}
