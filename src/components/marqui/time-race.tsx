import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarquiLive } from "./marqui-live";

/* ——— Two ways to answer «precio?» ———
   One clock runs for both lanes. Without MARQui the reply goes through five
   chores; with him, four short taps. Simulated seconds run 30× faster than
   real ones, so the whole race takes about six seconds. */

type Chore = { label: string; s: number };

const without: Chore[] = [
  { label: "Leer", s: 10 },
  { label: "Buscar el precio en la lista", s: 45 },
  { label: "Buscar el plano", s: 40 },
  { label: "Escribir de cero", s: 80 },
  { label: "Revisar y enviar", s: 15 },
];
const withM: Chore[] = [
  { label: "Leer", s: 10 },
  { label: "Elegir", s: 8 },
  { label: "Ajustar", s: 15 },
  { label: "Enviar", s: 7 },
];
const total = (c: Chore[]) => c.reduce((a, x) => a + x.s, 0);
const MAX = total(without);
const SPEED = 30;

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function Race() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const reduce = useReducedMotion();
  const t = useMotionValue(0);
  const [now, setNow] = useState(0);
  const [run, setRun] = useState(0);
  useMotionValueEvent(t, "change", (v) => setNow(v));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      t.set(MAX);
      return;
    }
    t.set(0);
    const c = animate(t, MAX, { duration: MAX / SPEED, ease: "linear", delay: 0.4 });
    return () => c.stop();
  }, [inView, reduce, run, t]);

  return (
    <div ref={ref} className="paper rounded-[2rem] p-6 sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-teal">Una respuesta a «precio?»</p>
          <h3 className="mt-2 text-[clamp(1.5rem,2.2vw,2.4rem)] font-medium leading-tight tracking-[-0.025em]">El mismo mensaje, dos formas de contestarlo</h3>
        </div>
        <button onClick={() => setRun((r) => r + 1)} className="inline-flex items-center gap-2 rounded-full bg-paper-2 px-4 py-2 text-[0.95rem] font-medium text-ink-2 hover:bg-line">
          <RotateCcw className="size-4" /> Repetir
        </button>
      </div>

      <div className="mt-8 grid gap-8">
        <Lane title="Sin MARQui" chores={without} now={now} tone="slow" />
        <Lane title="Con MARQui" chores={withM} now={now} tone="fast" />
      </div>

      <p className="mt-6 text-[0.9rem] text-ink-3">Ejemplo ilustrativo de una respuesta, con tiempos estimados. El reloj corre 30 veces más rápido.</p>
    </div>
  );
}

function Lane({ title, chores, now, tone }: { title: string; chores: Chore[]; now: number; tone: "slow" | "fast" }) {
  const end = total(chores);
  const done = now >= end;
  const shown = Math.min(now, end);
  let acc = 0;
  const current = chores.find((c) => {
    acc += c.s;
    return shown < acc;
  });
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <span className={cn("w-11 shrink-0", tone === "slow" && "opacity-0")} aria-hidden>
          <MarquiLive pose={done ? "alegria" : now > 0 ? "guino" : "reposo"} shadow={false} />
        </span>
        <b className="text-[clamp(1.1rem,1.4vw,1.4rem)] font-medium">{title}</b>
        <span className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-ink-3">{done ? "✓ Enviado" : current?.label ?? ""}</span>
        <span className={cn("ml-auto text-[clamp(1.8rem,3vw,3rem)] font-medium tabular-nums tracking-[-0.03em]", done ? (tone === "fast" ? "text-teal" : "text-ink") : "text-ink-2")}>{mmss(shown)}</span>
      </div>
      {/* The track is the full slow time; each chore fills its slice as the clock passes it. */}
      <div className="flex h-12 gap-[3px] overflow-hidden rounded-2xl bg-paper-2">
        {chores.map((c, i) => {
          const start = chores.slice(0, i).reduce((a, x) => a + x.s, 0);
          const f = Math.min(Math.max((now - start) / c.s, 0), 1);
          return (
            <div key={c.label} className="relative h-full" style={{ width: `${(c.s / MAX) * 100}%` }}>
              <motion.div className={cn("absolute inset-y-0 left-0", tone === "fast" ? "bg-teal" : i % 2 ? "bg-[#f2b48d]" : "bg-[#ec8f55]")} style={{ width: `${f * 100}%` }} />
              {c.s / MAX > 0.12 && <span className={cn("relative z-10 flex h-full items-center px-3 text-[0.85rem] font-medium", f > 0.5 ? "text-white" : "text-ink-3")}>{c.label}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ——— Hours back in a week ———
   A band, not a line: the low and high estimates (14% and 34% of the 4 hours
   a day the team answers by hand) accumulate from Monday to Friday. */

const days = ["Lun", "Mar", "Mié", "Jue", "Vie"];
const LOW = 4 * 0.145; // h per day
const HIGH = 4 * 0.335;

export function WeekBand() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const reduce = useReducedMotion();
  const p = useMotionValue(0);
  const [hours, setHours] = useState<[number, number]>([0, 0]);
  useMotionValueEvent(p, "change", (v) => setHours([LOW * v, HIGH * v]));
  useEffect(() => {
    if (!inView) return;
    const c = animate(p, 5, reduce ? { duration: 0 } : { duration: 2.6, ease: [0.45, 0, 0.2, 1], delay: 0.3 });
    return () => c.stop();
  }, [inView, reduce, p]);

  const W = 520;
  const H = 260;
  const PAD = { l: 40, r: 16, t: 16, b: 36 };
  const maxY = 7;
  const x = (d: number) => PAD.l + (d / 5) * (W - PAD.l - PAD.r);
  const y = (h: number) => H - PAD.b - (h / maxY) * (H - PAD.t - PAD.b);
  const clip = useTransform(p, (v) => `inset(0 ${100 - (v / 5) * 100}% 0 0)`);
  const band = `M${x(0)} ${y(0)} L${x(5)} ${y(HIGH * 5)} L${x(5)} ${y(LOW * 5)} Z`;

  return (
    <div ref={ref} className="paper flex h-full flex-col rounded-[2rem] p-6 sm:p-8">
      <p className="eyebrow text-teal">Para MARQ, en una semana</p>
      <p className="mt-3 text-[clamp(3rem,5.4vw,5.6rem)] font-medium leading-none tracking-[-0.045em] tabular-nums">
        {hours[0].toFixed(1).replace(".", ",")} a {hours[1].toFixed(1).replace(".", ",")} h
      </p>
      <p className="mt-2 text-[clamp(1.05rem,1.35vw,1.4rem)] font-medium leading-snug">menos respondiendo consultas</p>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full" role="img" aria-label="Horas recuperadas acumuladas de lunes a viernes: entre 2,9 y 6,7 horas">
        {[0, 2, 4, 6].map((h) => (
          <g key={h}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(h)} y2={y(h)} stroke="var(--color-line)" />
            <text x={PAD.l - 10} y={y(h) + 4} textAnchor="end" fontSize="12" fill="var(--color-ink-3)">
              {h} h
            </text>
          </g>
        ))}
        {days.map((d, i) => (
          <text key={d} x={x(i + 1)} y={H - 12} textAnchor="middle" fontSize="12" fill="var(--color-ink-3)">
            {d}
          </text>
        ))}
        <motion.g style={{ clipPath: clip }}>
          <path d={band} fill="var(--color-teal)" opacity="0.18" />
          <line x1={x(0)} y1={y(0)} x2={x(5)} y2={y(HIGH * 5)} stroke="var(--color-teal)" strokeWidth="2" />
          <line x1={x(0)} y1={y(0)} x2={x(5)} y2={y(LOW * 5)} stroke="var(--color-teal)" strokeWidth="2" strokeOpacity="0.55" />
        </motion.g>
        <text x={x(5) - 4} y={y(HIGH * 5) - 8} textAnchor="end" fontSize="12" fontWeight="600" fill="var(--color-teal)">
          34% · 6,7 h
        </text>
        <text x={x(5) - 4} y={y(LOW * 5) + 18} textAnchor="end" fontSize="12" fontWeight="600" fill="var(--color-ink-2)">
          14% · 2,9 h
        </text>
      </svg>
      <p className="mt-auto pt-4 text-[0.88rem] text-ink-3">Las 4 h por día que hoy lleva responder, con la mejora medida por NBER: 14% en promedio y 34% en quienes recién empiezan.</p>
    </div>
  );
}
