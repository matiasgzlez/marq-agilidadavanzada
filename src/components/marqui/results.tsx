import { useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { SendHorizontal } from "lucide-react";
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
function Num({ value, prefix = "", suffix = "", tone = "teal", className }: { value: number; prefix?: string; suffix?: string; tone?: "teal" | "orange"; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const n = useMotionValue(reduce ? value : 0);
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
            <Race label="Escribiendo de cero" value="3:10" width="100%" bar="bg-[#dcd9d2]" />
            <Race label="Eligiendo una de MARQui" value="0:40" width="21%" bar="bg-[linear-gradient(90deg,#19d3b4,#014645)]" bold />
          </div>
        </Tile>

        {/* 2 · Three replies, drawn as shapes: one is picked and goes out. */}
        <Tile className="sm:col-span-2 lg:col-span-3" delay={0.08}>
          <div className="grid h-full items-center gap-6 sm:grid-cols-[1fr_1fr]">
            <div>
              <Num value={3} className="text-[clamp(4.4rem,7vw,7.6rem)]" />
              <p className={cn(lead, "mt-2")}>respuestas personalizadas en cada chat, listas para enviar.</p>
            </div>
            <Replies />
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

function Race({ label, value, width, bar, bold }: { label: string; value: string; width: string; bar: string; bold?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-[clamp(1.02rem,1.2vw,1.3rem)]">
        <span className={bold ? "font-medium text-ink" : "text-ink-3"}>{label}</span>
        <span className={cn("tabular-nums", bold ? "font-semibold text-teal" : "text-ink-3")}>{value}</span>
      </div>
      <div className="h-3.5 overflow-hidden rounded-full bg-[#ebe9e3]">
        <motion.div className={cn("h-full rounded-full", bar)} initial={reduce ? false : { width: 0 }} whileInView={{ width }} viewport={{ once: true }} transition={{ duration: 1.3, delay: 0.4, ease: out }} />
      </div>
    </div>
  );
}

/** Three replies as abstract bubbles; the middle one lights up and is sent. */
function Replies() {
  const reduce = useReducedMotion();
  const widths = ["78%", "92%", "64%"];
  return (
    <div className="relative grid gap-3" aria-hidden>
      {widths.map((w, i) => {
        const picked = i === 1;
        return (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: out }}
            className="flex items-center gap-3"
          >
            <motion.span
              className={cn("relative block h-12 overflow-hidden rounded-2xl", picked ? "bg-[linear-gradient(110deg,#19d3b4,#00927f_55%,#014645)] shadow-[0_0.9rem_1.8rem_-0.8rem_rgb(0_120_105/0.6)]" : "bg-[#e8e6e0]")}
              style={{ width: w }}
              initial={reduce ? false : picked ? { scale: 1 } : undefined}
              whileInView={reduce || !picked ? undefined : { scale: [1, 1.04, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.1, ease: out }}
            >
              {/* Two lines of "text" inside each bubble. */}
              <span className={cn("absolute left-4 top-3.5 h-1.5 w-[58%] rounded-full", picked ? "bg-white/70" : "bg-[#d3d0c8]")} />
              <span className={cn("absolute bottom-3.5 left-4 h-1.5 w-[36%] rounded-full", picked ? "bg-white/45" : "bg-[#dcd9d2]")} />
            </motion.span>
            {picked && (
              <motion.span
                initial={reduce ? false : { scale: 0, rotate: -40 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 16, delay: 1.25 }}
                className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white"
              >
                <SendHorizontal className="size-5" />
              </motion.span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}



