import { useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ——— Results ———
   An Apple-style bento: light tiles of one tone, a big gradient number, a
   few words, and a small piece of the product in each tile so the number has
   something to stand on. Five results, two rows, one screen. Sources sit in
   one line under the grid. */

const out = [0.16, 1, 0.3, 1] as const;

function Tile({ className, children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay, ease: out }}
      className={cn("relative flex flex-col overflow-hidden rounded-[2rem] bg-[#f7f7f5] p-5 text-ink shadow-[0_1.5rem_3rem_-1.5rem_rgb(1_30_27/0.35)] sm:p-6", className)}
    >
      {children}
    </motion.article>
  );
}

/** A big, heavy number that counts up when it arrives, painted with the brand gradient. */
function Num({ value, from = 0, prefix = "", suffix = "", tone = "teal", className }: { value: number; from?: number; prefix?: string; suffix?: string; tone?: "teal" | "orange"; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const n = useMotionValue(reduce ? value : from);
  const text = useTransform(n, (v) => `${prefix}${Math.round(v)}${suffix}`);
  useEffect(() => {
    if (!seen || reduce) return;
    const c = animate(n, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [seen, reduce, n, value]);
  return (
    <motion.span
      ref={ref}
      className={cn(
        "block w-fit bg-clip-text pb-[0.06em] pr-[0.08em] font-bold leading-[0.9] tracking-[-0.05em] text-transparent tabular-nums",
        tone === "teal" ? "bg-[linear-gradient(135deg,#19d3b4_0%,#00927f_45%,#014645_100%)]" : "bg-[linear-gradient(135deg,#ffa25c_0%,#f4661a_45%,#b13d0c_100%)]",
        className,
      )}
    >
      {text}
    </motion.span>
  );
}

const lead = "text-[clamp(1.3rem,1.75vw,1.95rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink";
const sub = "mt-1.5 text-[clamp(1.05rem,1.25vw,1.35rem)] leading-snug text-ink-3";

export function ResultsBento() {
  return (
    <div className="mx-auto max-w-[80rem]">
      <div id="resultados" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {/* 1 · Speed, the headline. */}
        <Tile className="sm:col-span-2 lg:col-span-3">
          <Num value={5} suffix="×" className="text-[clamp(4.4rem,7vw,7.6rem)]" />
          <p className={cn(lead, "mt-2")}>más rápido para responder cada consulta.</p>
          <div className="mt-auto grid gap-2.5 pt-5">
            <Race label="Escribiendo de cero" seconds={190} duration={15} bar="bg-[linear-gradient(90deg,#ffb27a,#f4661a)]" />
            <Race label="Eligiendo una de MARQui" seconds={40} duration={3} bar="bg-[linear-gradient(90deg,#19d3b4,#014645)]" bold />
          </div>
        </Tile>

        {/* 2 · Nobody important waits: the followed chat rises, MARQui taps you, it's answered. */}
        <Tile className="sm:col-span-2 lg:col-span-3" delay={0.08}>
          <div className="grid h-full items-center gap-6 sm:grid-cols-[1fr_1fr]">
            <div>
              <Num value={0} from={6} tone="orange" className="text-[clamp(4.4rem,7vw,7.6rem)]" />
              <p className={cn(lead, "mt-2")}>clientes importantes esperando.</p>
              <p className={sub}>Los que seguís: MARQui te avisa apenas escriben.</p>
            </div>
            <Followed />
          </div>
        </Tile>

        {/* 3 to 5 · Typographic, like Apple's spec tiles. */}
        <Tile className="lg:col-span-2" delay={0.12}>
          <Num value={8} suffix=" h" className="text-[clamp(3.6rem,5.4vw,5.8rem)]" />
          <p className={cn(lead, "mt-3")}>por semana para vender.</p>
          <p className={sub}>Una jornada entera de trabajo que vuelve.</p>
        </Tile>
        <Tile className="lg:col-span-2" delay={0.18}>
          <Num value={7} prefix="×" tone="orange" className="text-[clamp(3.6rem,5.4vw,5.8rem)]" />
          <p className={cn(lead, "mt-3")}>más chances de avanzar.</p>
          <p className={sub}>Si respondés dentro de la primera hora.</p>
        </Tile>
        <Tile className="sm:col-span-2 lg:col-span-2" delay={0.24}>
          <Num value={34} prefix="+" suffix="%" className="text-[clamp(3.6rem,5.4vw,5.8rem)]" />
          <p className={cn(lead, "mt-3")}>consultas resueltas por hora.</p>
          <p className={sub}>En quienes recién empiezan, con un asistente de IA.</p>
        </Tile>
      </div>

      {/* How it's proven, not just promised. */}
      <p className="sky-type mx-auto mt-6 w-fit max-w-full rounded-full bg-white/12 px-5 py-2.5 text-center text-[clamp(0.95rem,1.1vw,1.15rem)] font-medium leading-snug text-white ring-1 ring-white/20">
        Lo medimos en MARQador: dos semanas sin MARQui como base, y después comparamos.
      </p>

      <p className="sky-type mx-auto mt-3 max-w-[70rem] text-center text-[0.8rem] leading-snug text-white/75">
        5× y 8 h: caso estimado para MARQ, con 4 h por día respondiendo y la mitad de las consultas repetidas. ×7:{" "}
        <a className="underline decoration-white/40 underline-offset-2 hover:text-white" href="https://scholarsarchive.byu.edu/facpub/9711" target="_blank" rel="noreferrer">
          Harvard Business Review, 2011
        </a>
        . +34% (y +14% en promedio):{" "}
        <a className="underline decoration-white/40 underline-offset-2 hover:text-white" href="https://www.nber.org/papers/w31161" target="_blank" rel="noreferrer">
          NBER, 2023, 5.179 agentes
        </a>
        .
      </p>
    </div>
  );
}

/* ——— Mockups ——— */

/**
 * One lane of the race, played in real proportion: both start together when the tile
 * comes into view, and the clock runs with the bar. MARQui's lane takes 3 s; writing
 * from scratch takes 5 times as long.
 */
function Race({ label, seconds, duration, bar, bold }: { label: string; seconds: number; duration: number; bar: string; bold?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.8 });
  const t = useMotionValue(reduce ? 1 : 0);
  const width = useTransform(t, (v) => `${v * (seconds / 190) * 100}%`);
  const clock = useTransform(t, (v) => {
    const s = Math.round(v * seconds);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  });
  useEffect(() => {
    if (!seen || reduce) return;
    const c = animate(t, 1, { duration, ease: "linear", delay: 0.4 });
    return () => c.stop();
  }, [seen, reduce, t, duration]);
  return (
    <div ref={ref}>
      <div className="mb-2 flex justify-between gap-3 text-[clamp(1.02rem,1.2vw,1.3rem)]">
        <span className={bold ? "font-medium text-ink" : "text-ink-3"}>{label}</span>
        <motion.span className={cn("tabular-nums", bold ? "font-semibold text-teal" : "text-ink-3")}>{clock}</motion.span>
      </div>
      <div className="h-3.5 overflow-hidden rounded-full bg-[#ebe9e3]">
        <motion.div className={cn("h-full rounded-full", bar)} style={{ width }} />
      </div>
    </div>
  );
}

/**
 * A chat list as abstract shapes, in the same language as the old replies: grey rows,
 * one followed (amber, with its star). A MARQui pill drops in ("she wrote"), the
 * followed row lights up and gets its double check: answered, nobody waits.
 */
function Followed() {
  const reduce = useReducedMotion();
  const rows = [
    { w: ["58%", "36%"], followed: false },
    { w: ["64%", "44%"], followed: true },
    { w: ["50%", "30%"], followed: false },
  ];
  const t = (d: number) => ({ duration: 0.7, delay: d, ease: out });
  return (
    <div className="relative grid gap-2.5 pt-12" aria-hidden>
      {/* MARQui's tap on the shoulder. */}
      <motion.span
        initial={reduce ? false : { opacity: 0, y: -14, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1 }}
        className="absolute left-1/2 top-0 flex h-9 -translate-x-1/2 items-center gap-2 rounded-full bg-ink pl-1.5 pr-4 shadow-[0_0.8rem_1.6rem_-0.6rem_rgb(1_30_27/0.6)]"
      >
        <span className="grid size-6 place-items-center rounded-full bg-[linear-gradient(135deg,#19d3b4,#014645)]">
          <Star className="size-3 fill-[#ffc53d] text-[#ffc53d]" />
        </span>
        <span className="h-1.5 w-16 rounded-full bg-white/70" />
        <span className="h-1.5 w-8 rounded-full bg-white/35" />
      </motion.span>

      {rows.map((r, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={t(0.3 + i * 0.12)}
          className={cn("relative flex h-14 items-center gap-3 overflow-hidden rounded-2xl px-3", r.followed ? "bg-[#fff1cf]" : "bg-[#efede8]")}
        >
          {r.followed && (
            <motion.span
              className="absolute inset-0 bg-[linear-gradient(110deg,#ffd27a,#ffb347_55%,#f4661a)]"
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={t(1.35)}
            />
          )}
          <span className={cn("relative size-8 shrink-0 rounded-full", r.followed ? "bg-white/80" : "bg-[#dcd9d2]")} />
          <span className="relative grid flex-1 gap-2">
            <span className={cn("h-1.5 rounded-full", r.followed ? "bg-white/85" : "bg-[#d3d0c8]")} style={{ width: r.w[0] }} />
            <span className={cn("h-1.5 rounded-full", r.followed ? "bg-white/55" : "bg-[#dcd9d2]")} style={{ width: r.w[1] }} />
          </span>
          {r.followed && (
            <>
              <Star className="relative size-4 shrink-0 fill-white text-white" />
              {/* Answered: the double check lands last. */}
              <motion.span
                initial={reduce ? false : { scale: 0, rotate: -40 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 16, delay: 1.9 }}
                className="relative grid size-8 shrink-0 place-items-center rounded-full bg-ink text-[0.8rem] font-bold text-[#53bdeb]"
              >
                ✓✓
              </motion.span>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}
