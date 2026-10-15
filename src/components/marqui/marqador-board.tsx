import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { Bell, BookOpen, CalendarDays, Check, Download, FileText, Megaphone, MessageCircle, OctagonAlert, PieChart, SendHorizontal, Star, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrowserFrame, ease } from "./primitives";
import { MarqadorMark } from "./marqador-mark";
import { MarquiMark } from "./marqui-mark";
import { Face } from "./wa-kit";

/* ——— MARQador, in the presentation ———
   A whole working tab that fits one screen: the five screens on the left, each one a
   business question; the answer on the right, readable at a glance, with one takeaway.
   It presents itself (a progress bar fills under the current screen) until you click. */

type Id = "pauta" | "demanda" | "contactos" | "frenos" | "semana";
const SCREENS: { id: Id; label: string; question: string; icon: typeof Megaphone }[] = [
  { id: "pauta", label: "Pauta", question: "¿Dónde conviene poner la plata?", icon: Megaphone },
  { id: "demanda", label: "Demanda", question: "¿Qué piden y cómo piensan pagar?", icon: PieChart },
  { id: "contactos", label: "Contactos", question: "¿A quién llamo o invito?", icon: Users },
  { id: "frenos", label: "Frenos", question: "¿Por qué no avanzan?", icon: OctagonAlert },
  { id: "semana", label: "Semana", question: "¿Cómo venimos?", icon: Wallet },
];
const STEP = 8; // seconds per screen while it presents itself

/**
 * `standalone`: the real tab (/?app=marqador). Same board, full window, no autoplay,
 * with the controls of a working app: the lines, the alerts, the report and a bar to ask MARQui.
 */
export function MarqadorBoard({ standalone = false }: { standalone?: boolean }) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.5 });
  const [screen, setScreen] = useState<Id>(() => {
    const q = standalone ? (new URLSearchParams(location.search).get("s") as Id | null) : null;
    return q && SCREENS.some((x) => x.id === q) ? q : "pauta";
  });
  const [manual, setManual] = useState(standalone);
  const playing = inView && !manual && !reduce;

  useEffect(() => {
    if (!standalone) return;
    const url = new URL(location.href);
    url.searchParams.set("s", screen);
    history.replaceState(null, "", url);
  }, [standalone, screen]);

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      const i = SCREENS.findIndex((s) => s.id === screen);
      setScreen(SCREENS[(i + 1) % SCREENS.length]!.id);
    }, STEP * 1000);
    return () => clearTimeout(t);
  }, [playing, screen]);

  const current = SCREENS.find((s) => s.id === screen)!;

  const shell = (
        /* Fits the screen: never taller than the viewport, minus the header and a breath. */
        <div className={cn("grid min-w-0 grid-cols-[minmax(0,1fr)] text-ink lg:grid-cols-[16.5rem_1fr]", standalone ? "h-[100dvh] max-lg:grid-rows-[auto_1fr]" : "lg:h-[clamp(34rem,calc(100svh-9.5rem),46rem)]")}>
          {/* ——— Sidebar ——— */}
          <nav className="flex flex-col border-black/[0.06] bg-[#fbf6f1] max-lg:border-b lg:border-r" aria-label="Pantallas de MARQador">
            <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
              <MarqadorMark className="size-8" />
              <span className="leading-tight">
                <b className="block font-display text-[1.15rem] font-bold tracking-[-0.03em]">MARQador</b>
                <span className="text-[0.72rem] font-medium text-ink-3">Módulo de MARQui</span>
              </span>
            </div>
            <ul className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:grid lg:overflow-visible">
              {SCREENS.map((s) => {
                const on = s.id === screen;
                return (
                  <li key={s.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setManual(true);
                        setScreen(s.id);
                      }}
                      aria-current={on ? "page" : undefined}
                      className={cn(
                        "relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange",
                        on ? "bg-white shadow-[0_0.5rem_1.2rem_-0.6rem_rgb(120_50_10/0.35)] ring-1 ring-black/[0.05]" : "hover:bg-white/60",
                      )}
                    >
                      <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg transition-colors duration-300", on ? "bg-[linear-gradient(135deg,#ffa25c,#f4661a_55%,#b13d0c)] text-white" : "bg-[#f3e6da] text-orange-deep")}>
                        <s.icon className="size-[1.05rem]" aria-hidden />
                      </span>
                      <span className="min-w-0 leading-tight">
                        <b className="block text-[0.98rem] font-semibold">{s.label}</b>
                        <span className="block text-[0.74rem] text-ink-3 max-lg:hidden">{s.question}</span>
                      </span>
                      {/* While it presents itself, the current screen's time runs out under it. */}
                      {on && playing && (
                        <motion.i key={`${s.id}-bar`} className="absolute inset-x-3 bottom-1 h-[3px] origin-left rounded-full bg-orange/70" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: STEP, ease: "linear" }} aria-hidden />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto hidden gap-2 border-t border-black/[0.06] px-5 py-4 text-[0.76rem] text-ink-3 lg:grid">
              <span className="flex items-center gap-2">
                <i className="size-2 animate-pulse rounded-full bg-[#25d366]" /> Actualizado hace 2 min
              </span>
              <span>Las dos líneas · pauta y clientes</span>
              {standalone && (
                <span className="mt-2 flex items-center gap-2.5 border-t border-black/[0.06] pt-3 text-ink-2">
                  <Face name="Cande" className="size-8" />
                  <span className="leading-tight">
                    <b className="block text-[0.85rem] font-semibold">Cande</b>
                    Equipo MARQ
                  </span>
                </span>
              )}
            </div>
          </nav>

          {/* ——— The screen ——— */}
          <section className="flex min-h-0 min-w-0 flex-col bg-white" aria-live="polite">
            <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-black/[0.06] px-6 py-4 sm:px-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h3
                  key={screen}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease }}
                  className="mr-auto font-display text-[clamp(1.35rem,2vw,2rem)] font-bold leading-tight tracking-[-0.03em]"
                >
                  {current.question}
                </motion.h3>
              </AnimatePresence>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1.5 text-[0.82rem] font-medium text-ink-2">
                <CalendarDays className="size-4 text-ink-3" aria-hidden /> 13 al 17 de octubre
              </span>
              {standalone && <AppActions />}
            </header>
            <div className="min-h-0 flex-1 overflow-hidden px-4 py-5 sm:px-8 sm:py-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={screen} className="flex h-full flex-col gap-6" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease }}>
                  {VIEWS[screen]}
                </motion.div>
              </AnimatePresence>
            </div>
            {standalone && <AskBar />}
          </section>
        </div>
  );

  if (standalone) return <div ref={root} className="arc-marqador overflow-hidden bg-white">{shell}</div>;
  return (
    <div ref={root} className="min-w-0 max-w-full">
      <BrowserFrame
        url="marqador.marq.com.ar"
        className="arc-marqador"
        badge={<span className="hidden items-center gap-1.5 rounded-md bg-[#fdeee3] px-2 py-1 text-[0.72rem] font-medium text-orange-deep sm:flex">Pestaña nueva</span>}
      >
        {shell}
      </BrowserFrame>
    </div>
  );
}

/* ——— Only in the real tab ——— */

const ALERTS = [
  { who: "Laura Gómez", text: "te escribió: «¿El sábado se puede ir a ver la 2A?»", time: "16:20", star: true },
  { who: "Marta Ríos", text: "volvió después de 40 días.", time: "11:14" },
  { who: "Sofía Acosta", text: "llegó recomendada por Pablo Sosa.", time: "12:15" },
];

function AppActions() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <span className="relative flex items-center gap-2">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Avisos" className="relative grid size-9 cursor-pointer place-items-center rounded-full bg-paper-2 text-ink-2 transition-colors hover:bg-[#f3e6da]">
        <Bell className="size-4" aria-hidden />
        <i className="absolute right-1.5 top-1.5 size-2 rounded-full bg-orange ring-2 ring-white" />
      </button>
      <button
        type="button"
        onClick={() => {
          setSent(true);
          window.setTimeout(() => setSent(false), 2400);
        }}
        className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-ink px-4 text-[0.85rem] font-semibold text-white transition-transform hover:-translate-y-0.5"
      >
        {sent ? <Check className="size-4" aria-hidden /> : <Download className="size-4" aria-hidden />}
        {sent ? "Enviado por WhatsApp" : "Reporte en PDF"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease }}
            className="absolute right-0 top-11 z-30 w-[22rem] overflow-hidden rounded-2xl bg-white shadow-[0_1.5rem_3rem_-1rem_rgb(60_25_5/0.35)] ring-1 ring-black/[0.06]"
          >
            <b className="block border-b border-black/[0.06] px-4 py-3 text-[0.9rem]">Avisos de hoy</b>
            <ul className="divide-y divide-black/[0.05]">
              {ALERTS.map((a) => (
                <li key={a.who} className="flex items-start gap-3 px-4 py-3 text-[0.85rem] leading-snug">
                  <Face name={a.who} className="size-8" />
                  <span className="min-w-0 flex-1">
                    <b className="font-semibold">{a.who}</b> {a.star && <Star className="inline size-3 -translate-y-px fill-[#f5b301] text-[#f5b301]" aria-hidden />} {a.text}
                  </span>
                  <span className="shrink-0 text-[0.74rem] text-ink-3">{a.time}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/** Ask MARQui without leaving the tab: same data, same answers as by chat. */
function AskBar() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  return (
    <form
      className="border-t border-black/[0.06] bg-[#fbf6f1] px-6 py-3 sm:px-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (!q.trim()) return;
        setAnswer("41 de 112 consultas fueron por MARQ Collection esta semana. 19 piensan pagar con crédito.");
        setQ("");
      }}
    >
      <AnimatePresence>
        {answer && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-2 flex items-start gap-2 text-[0.88rem] text-ink-2">
            <MarquiMark tone="teal" className="mt-0.5 size-4 shrink-0" /> {answer}
          </motion.p>
        )}
      </AnimatePresence>
      <span className="flex items-center gap-3 rounded-full bg-white p-1.5 pl-4 ring-1 ring-black/[0.08]">
        <MarquiMark tone="teal" className="size-5 shrink-0" />
        <label htmlFor="ask-marqui" className="sr-only">
          Preguntale a MARQui
        </label>
        <input id="ask-marqui" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Preguntale a MARQui: «¿cuántas consultas trajo Collection esta semana?»" className="min-w-0 flex-1 bg-transparent text-[0.92rem] outline-none placeholder:text-ink-3" />
        <button aria-label="Preguntar" className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-ink text-white">
          <SendHorizontal className="size-4" aria-hidden />
        </button>
      </span>
    </form>
  );
}

/* ——— Pieces ——— */

/** The one thing to take away from the screen, signed by MARQador. */
function Takeaway({ children }: { children: ReactNode }) {
  return (
    <p className="mt-auto flex shrink-0 items-start gap-3 rounded-2xl bg-[linear-gradient(100deg,#fff1e4,#fde4d0)] px-5 py-3.5 text-[clamp(0.98rem,1.15vw,1.15rem)] leading-snug ring-1 ring-[#f4661a]/15">
      <MarqadorMark className="mt-0.5 size-6 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/** A thin bar that grows from the left, value at its end. */
function Bar({ pct, max = 100, lit, label, delay = 0, tone = "orange" }: { pct: number; max?: number; lit?: boolean; label?: string; delay?: number; tone?: "orange" | "teal" }) {
  const reduce = useReducedMotion();
  const fill = tone === "teal" ? (lit ? "bg-[linear-gradient(90deg,#19d3b4,#014645)]" : "bg-[#b9e3da]") : lit ? "bg-[linear-gradient(90deg,#ffa25c,#f4661a)]" : "bg-[#f4cfb3]";
  return (
    <span className="flex items-center gap-3">
      <span className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#f3efea]">
        <motion.span className={cn("absolute inset-y-0 left-0 rounded-full", fill)} initial={reduce ? false : { width: 0 }} animate={{ width: `${(pct / max) * 100}%` }} transition={{ duration: 0.9, delay, ease }} />
      </span>
      {label && <span className={cn("min-w-[3.2rem] shrink-0 text-right text-[0.98rem] tabular-nums", lit ? "font-bold" : "text-ink-2")}>{label}</span>}
    </span>
  );
}

/** A number that counts up when the screen lands. */
function Count({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) return;
    const c = animate(0, to, { duration: 1, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [to, reduce]);
  return (
    <>
      {prefix}
      {n}
      {suffix}
    </>
  );
}

const label = "mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-ink-3";

/* ——— 1 · Pauta ——— volume against quality, per channel. */

const pauta = [
  { name: "Instagram · «Collection 2D»", consultas: 180, interesados: 13 },
  { name: "Facebook · «Lotes Fontana»", consultas: 96, interesados: 11 },
  { name: "Google · búsqueda", consultas: 41, interesados: 8 },
  { name: "Formulario de la web", consultas: 34, interesados: 9 },
  { name: "Recomendación de clientes", consultas: 25, interesados: 11 },
];

function Pauta() {
  const max = Math.max(...pauta.map((r) => r.consultas));
  const best = Math.max(...pauta.map((r) => r.interesados / r.consultas));
  return (
    <>
      <div className="grid flex-1 content-center gap-6 xl:grid-cols-[1fr_16rem]">
        <div>
          <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.8rem] text-ink-3">
            <span className="flex items-center gap-1.5">
              <i className="h-2.5 w-5 rounded-full bg-[#efe7df]" /> Consultas
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-2.5 w-5 rounded-full bg-[linear-gradient(90deg,#ffa25c,#f4661a)]" /> Llegan a Interesado
            </span>
          </div>
          <ul className="grid gap-[clamp(0.75rem,2.2svh,1.4rem)]">
            {pauta.map((r, i) => {
              const pct = r.interesados / r.consultas;
              const top = pct === best;
              return (
                <li key={r.name} className="grid grid-cols-[1fr_3.2rem] items-center gap-x-3 gap-y-1 sm:grid-cols-[minmax(9rem,13rem)_1fr_3.6rem]">
                  <span className={cn("truncate text-[0.95rem] max-sm:col-span-2", top ? "font-bold" : "text-ink-2")}>{r.name}</span>
                  {/* The grey bar is how many wrote; the orange inside it, how many moved forward. */}
                  <span className="relative h-[clamp(1.75rem,4.2svh,2.6rem)] overflow-hidden rounded-lg bg-[#f7f3ee]">
                    <motion.span className="absolute inset-y-0 left-0 rounded-lg bg-[#efe7df]" initial={{ width: 0 }} animate={{ width: `${(r.consultas / max) * 100}%` }} transition={{ duration: 0.9, delay: i * 0.06, ease }} />
                    <motion.span className={cn("absolute inset-y-0 left-0 rounded-lg", top ? "bg-[linear-gradient(90deg,#ffa25c,#f4661a)]" : "bg-[#f6b98f]")} initial={{ width: 0 }} animate={{ width: `${(r.interesados / r.consultas) * (r.consultas / max) * 100}%` }} transition={{ duration: 0.9, delay: 0.35 + i * 0.06, ease }} />
                    <span className="absolute inset-y-0 right-2 grid place-items-center text-[0.78rem] tabular-nums text-ink-3">{r.consultas}</span>
                  </span>
                  <span className={cn("text-right text-[1rem] tabular-nums", top ? "font-bold text-orange-deep" : "text-ink-2")}>{Math.round(pct * 100)}%</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="grid content-center rounded-2xl bg-[#1d130d] p-5 text-white">
          <span className="text-[0.8rem] text-white/60">Por cada consulta, una recomendación trae</span>
          <b className="mt-1 bg-[linear-gradient(135deg,#ffd2ae,#ff8a3d_55%,#f4661a)] bg-clip-text font-display text-[clamp(3.4rem,5vw,4.8rem)] font-bold leading-none tracking-[-0.05em] text-transparent">
            <Count to={6} suffix="×" />
          </b>
          <span className="mt-1 text-[0.9rem] leading-snug text-white/80">más interesados que el anuncio de Instagram.</span>
        </div>
      </div>
      <Takeaway>
        Instagram trae más consultas, pero solo el 7% avanza. <b>Conviene invertir en que los clientes recomienden.</b>
      </Takeaway>
    </>
  );
}

/* ——— 2 · Demanda ——— per project: what, what for, how they pay. */

const demanda = {
  collection: {
    label: "MARQ Collection",
    total: 41,
    busca: [["1 dorm", 18], ["2 dorm", 55], ["3 dorm", 27]],
    para: [["Invertir", 62], ["Vivir", 38]],
    paga: [["Crédito", 48], ["Contado", 22], ["Financiación", 21], ["No lo dijo", 9]],
    takeaway: <>Más de la mitad pide 2 dormitorios y casi la mitad pagaría con crédito: <b>hay demanda para un producto apto crédito.</b></>,
  },
  fontana: {
    label: "Lotes Fontana",
    total: 35,
    busca: [["300 m²", 46], ["400 m²", 34], ["600 m²", 20]],
    para: [["Construir y vivir", 71], ["Invertir", 29]],
    paga: [["Financiación", 58], ["Contado", 30], ["Crédito", 6], ["No lo dijo", 6]],
    takeaway: <>Familias que quieren construir y necesitan cuotas: <b>conviene destacar la financiación propia en los anuncios.</b></>,
  },
} as const;
const PAY = ["#f4661a", "#ffa25c", "#f8cfae", "#ece6df"];

function Demanda() {
  const [p, setP] = useState<keyof typeof demanda>("collection");
  const d = demanda[p];
  const topBusca = Math.max(...d.busca.map((r) => r[1]));
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full bg-paper-2 p-1" role="tablist" aria-label="Proyecto">
          {(Object.keys(demanda) as (keyof typeof demanda)[]).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={p === k} onClick={() => setP(k)} className={cn("relative cursor-pointer rounded-full px-4 py-1.5 text-[0.88rem] font-semibold transition-colors", p === k ? "text-ink" : "text-ink-3 hover:text-ink-2")}>
              {p === k && <motion.span layoutId="demanda-pill" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="relative">{demanda[k].label}</span>
            </button>
          ))}
        </div>
        <span className="text-[0.85rem] text-ink-3">{d.total} consultas esta semana</span>
      </div>
      <div key={p} className="grid flex-1 content-center gap-8 md:grid-cols-3">
        <div>
          <h4 className={label}>Qué buscan</h4>
          <ul className="grid gap-3">
            {d.busca.map(([n, v], i) => (
              <li key={n}>
                <span className={cn("mb-1 block text-[0.95rem]", v === topBusca ? "font-bold" : "text-ink-2")}>{n}</span>
                <Bar pct={v} lit={v === topBusca} label={`${v}%`} delay={i * 0.07} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={label}>Para qué</h4>
          {/* Two halves of one bar: the split is the answer. */}
          <div className="flex h-[clamp(6rem,18svh,10rem)] overflow-hidden rounded-2xl">
            {d.para.map(([n, v], i) => (
              <motion.div key={n} className={cn("flex flex-col justify-end p-3", i === 0 ? "bg-[linear-gradient(160deg,#ffa25c,#f4661a)] text-white" : "bg-[#fbe3d1] text-ink")} initial={{ flexGrow: 0.001 }} animate={{ flexGrow: v }} transition={{ duration: 0.9, delay: 0.15, ease }} style={{ flexBasis: 0 }}>
                <b className="text-[clamp(1.6rem,2.4vw,2.4rem)] font-bold leading-none tabular-nums">{v}%</b>
                <span className="mt-1 truncate text-[0.82rem]">{n}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h4 className={label}>Cómo piensan pagar</h4>
          <div className="flex h-[clamp(1.25rem,3svh,1.75rem)] gap-[2px] overflow-hidden rounded-full">
            {d.paga.map(([n, v], i) => (
              <motion.span key={n} className="h-full" style={{ background: PAY[i], flexBasis: 0 }} initial={{ flexGrow: 0.001 }} animate={{ flexGrow: v }} transition={{ duration: 0.9, delay: 0.25 + i * 0.05, ease }} />
            ))}
          </div>
          <ul className="mt-3 grid gap-1.5 text-[0.92rem]">
            {d.paga.map(([n, v], i) => (
              <li key={n} className="flex items-center gap-2">
                <i className="size-3 rounded-sm" style={{ background: PAY[i] }} />
                <span className={i === 0 ? "font-semibold" : "text-ink-2"}>{n}</span>
                <b className="ml-auto tabular-nums">{v}%</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Takeaway>{d.takeaway}</Takeaway>
    </>
  );
}

/* ——— 3 · Contactos ——— filter, tick, export (or ask MARQui for the list). */

const people = [
  { name: "Laura Gómez", busca: "2 dorm", paga: "¿?", etapa: "Visita", followed: true, hace: "hoy" },
  { name: "Juan", busca: "2 dorm", paga: "Crédito", etapa: "Interesado", hace: "hoy" },
  { name: "Marta Ríos", busca: "3 dorm", paga: "Crédito", etapa: "Interesado", mark: "Reaparece", hace: "hoy" },
  { name: "Valeria Paz", busca: "2 dorm", paga: "Contado", etapa: "Interesado", hace: "ayer" },
  { name: "Martín Duarte", busca: "1 dorm", paga: "Contado", etapa: "Interesado", hace: "hace 2 días" },
];

function Contactos() {
  const [checked, setChecked] = useState<string[]>(people.map((p) => p.name));
  const toggle = (n: string) => setChecked((c) => (c.includes(n) ? c.filter((x) => x !== n) : [...c, n]));
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["MARQ Collection", "Busca: invertir", "Etapa: Interesado o más"].map((f) => (
          <span key={f} className="rounded-full bg-paper-2 px-3.5 py-1.5 text-[0.85rem] font-medium">
            {f}
          </span>
        ))}
        <span className="inline-flex items-center gap-2 rounded-full sm:ml-auto bg-[linear-gradient(135deg,#ffa25c,#f4661a)] px-4 py-2 text-[0.88rem] font-semibold text-white shadow-[0_0.6rem_1.2rem_-0.6rem_rgb(244_102_26/0.8)]">
          <Download className="size-4" aria-hidden /> Exportar a Excel · {checked.length}
        </span>
      </div>
      <ul className="grid flex-1 content-start divide-y divide-black/[0.06] overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
        {people.map((p, i) => {
          const on = checked.includes(p.name);
          return (
            <motion.li key={p.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.06, ease }} className={cn("flex items-center gap-3 px-4 py-[clamp(0.5rem,1.6svh,1rem)]", p.followed && "bg-[#fff8e6]")}>
              <button type="button" onClick={() => toggle(p.name)} aria-pressed={on} aria-label={`Incluir a ${p.name}`} className={cn("grid size-5 shrink-0 cursor-pointer place-items-center rounded-md text-[0.7rem] font-bold text-white transition-colors", on ? "bg-orange" : "bg-white ring-1 ring-black/20")}>
                {on && "✓"}
              </button>
              <Face name={p.name} className="size-9" />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="flex items-center gap-1.5">
                  <b className="truncate text-[0.95rem] font-semibold">{p.name}</b>
                  {p.followed && <Star className="size-3.5 shrink-0 fill-[#f5b301] text-[#f5b301]" aria-label="Seguida" />}
                  {p.mark && <span className="rounded-full bg-[#ffecc7] px-1.5 text-[0.62rem] font-semibold text-[#7a4a00]">{p.mark}</span>}
                </span>
                <span className="text-[0.78rem] text-ink-3">Última charla {p.hace}</span>
              </span>
              <span className="hidden gap-1.5 sm:flex">
                {[p.busca, p.paga].map((t, k) => (
                  <span key={k} className={cn("rounded-full px-2.5 py-1 text-[0.78rem]", t === "¿?" ? "border border-dashed border-black/25 text-ink-3" : "bg-paper-2 text-ink-2")}>
                    {t}
                  </span>
                ))}
              </span>
              <span className={cn("w-[5.5rem] shrink-0 rounded-full py-1 text-center max-sm:hidden text-[0.78rem] font-semibold", p.etapa === "Visita" ? "bg-[#008c7e] text-white" : "bg-[#e7f6f2] text-[#00705f]")}>{p.etapa}</span>
            </motion.li>
          );
        })}
      </ul>
      <Takeaway>
        La lista para invitar al lanzamiento, en un clic. <b>También se la podés pedir a MARQui por chat, o con una regla diaria.</b>
      </Takeaway>
    </>
  );
}

/* ——— 4 · Frenos ——— where conversations stall, and what MARQui couldn't answer. */

const frenos: [string, number][] = [
  ["Financiación", 38],
  ["Precio", 24],
  ["Fecha de entrega", 16],
  ["Ubicación", 12],
  ["Tamaño", 10],
];
const unanswered: [string, number][] = [
  ["¿Aceptan un auto como parte de pago?", 7],
  ["¿Las unidades tienen cochera?", 5],
  ["¿Se puede escriturar a nombre de una empresa?", 3],
];

function Frenos() {
  return (
    <>
      <div className="grid flex-1 content-center gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h4 className={label}>Tema en el que se cortó la charla</h4>
          <ul className="grid gap-[clamp(0.75rem,2.6svh,1.5rem)]">
            {frenos.map(([n, v], i) => (
              <li key={n} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 sm:grid-cols-[8.5rem_1fr]">
                <span className={cn("text-[0.95rem]", i === 0 ? "font-bold" : "text-ink-2")}>{n}</span>
                <Bar pct={v} max={40} lit={i === 0} label={`${v}%`} delay={i * 0.07} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={label}>Lo que MARQui no supo responder</h4>
          <ul className="grid gap-2">
            {unanswered.map(([q, n], i) => (
              <motion.li key={q} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease }} className="flex items-center gap-3 rounded-xl bg-paper-2 px-3.5 py-2.5">
                <span className="flex-1 text-[0.92rem] leading-snug">{q}</span>
                <span className="shrink-0 text-[0.8rem] tabular-nums text-ink-3">{n} veces</span>
                {/* Teaching him closes the gap: next time he knows. */}
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e7f6f2] px-2.5 py-1 text-[0.75rem] font-semibold text-[#00705f]">
                  <BookOpen className="size-3.5" aria-hidden /> Enseñárselo
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
      <Takeaway>
        4 de cada 10 que no avanzan se frenan en la financiación. <b>Ahí está la próxima mejora de la oferta.</b>
      </Takeaway>
    </>
  );
}

/* ——— 5 · Semana ——— the four numbers, the time MARQui gave back, your followed, the PDF. */

function Semana() {
  const kpis = [
    { label: "Consultas", n: 112, change: "+14%" },
    { label: "Nuevos interesados", n: 19, change: "+5" },
    { label: "Reservas", n: 3, change: "igual" },
    { label: "Sin responder", n: 4, change: "3 menos" },
  ];
  return (
    <>
      <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-paper-2 px-4 py-3">
            <span className="text-[0.8rem] text-ink-3">{k.label}</span>
            <b className="block font-display text-[2rem] font-bold leading-tight tracking-[-0.04em] tabular-nums">
              <Count to={k.n} />
            </b>
            <span className={cn("text-[0.78rem] font-semibold", k.change === "igual" ? "text-ink-3" : "text-[#008069]")}>{k.change} vs. semana anterior</span>
          </div>
        ))}
      </div>
      <div className="grid content-start gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col justify-center rounded-2xl bg-paper-2 p-5">
          <div className="flex items-baseline justify-between gap-2">
            <b className="text-[1rem]">Tiempo ahorrado con MARQui</b>
            <b className="font-display text-[1.5rem] tracking-[-0.03em] text-orange-deep">
              ≈ <Count to={5} /> h
            </b>
          </div>
          <div className="mt-5 grid gap-5 text-[0.95rem]">
            <span>
              <span className="mb-1 block text-ink-2">Escribiendo de cero</span>
              <Bar pct={190} max={190} label="3:10" />
            </span>
            <span>
              <span className="mb-1 block font-semibold">Eligiendo una de MARQui</span>
              <Bar pct={40} max={190} lit tone="teal" label="0:40" delay={0.2} />
            </span>
          </div>
        </div>
        <div className="grid gap-3">
          <div className="flex flex-col justify-center rounded-2xl bg-paper-2 p-5">
            <b className="flex items-center gap-1.5 text-[1rem]">
              <Star className="size-4 fill-[#f5b301] text-[#f5b301]" aria-hidden /> Tus seguidos
            </b>
            <ul className="mt-3 grid gap-2.5 text-[0.92rem]">
              <li className="flex items-center gap-2">
                <Face name="Laura Gómez" className="size-8" /> Laura escribió 2 veces <span className="ml-auto rounded-full bg-[#008c7e] px-2 py-0.5 text-[0.7rem] font-semibold text-white">Visita</span>
              </li>
              <li className="flex items-center gap-2">
                <Face name="Pablo Sosa" className="size-8" /> Pablo, 12 días sin escribir <span className="ml-auto rounded-full bg-[#ffe3dc] px-2 py-0.5 text-[0.7rem] font-semibold text-[#9a2f17]">Escribile</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-paper-2 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#e5484d] text-white">
              <FileText className="size-[1.1rem]" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <b className="block truncate text-[0.88rem]">Resumen semanal · viernes 17.pdf</b>
              <span className="text-[0.74rem] text-ink-3">También llegó por WhatsApp</span>
            </span>
            <MessageCircle className="size-4 shrink-0 text-[#25d366]" aria-hidden />
          </div>
        </div>
      </div>
      <Takeaway>
        Más consultas y menos chats sin responder, con 5 h devueltas al equipo. <b>Pablo hace 12 días que no escribe: buen momento para retomarlo.</b>
      </Takeaway>
    </>
  );
}

const VIEWS: Record<Id, ReactNode> = {
  pauta: <Pauta />,
  demanda: <Demanda />,
  contactos: <Contactos />,
  frenos: <Frenos />,
  semana: <Semana />,
};
