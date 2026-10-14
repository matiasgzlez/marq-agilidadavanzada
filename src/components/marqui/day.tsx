import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pose } from "./marqui-character";
import { MarquiLive } from "./marqui-live";
import { Section, ease } from "./primitives";
import { SKY } from "./sky";
import { Lead } from "./story";

/* ——— Un día con MARQui ———
   The dots timeline: a ruler of the working day, a pill on the current
   hour, MARQui saying what he did, and underneath the moment told as pain →
   solution. The sky follows the hour. Arrows (or ← →) move through the day. */

type Stop = { file?: string; h: number; time: string; sky: number; where: string; say: string; react: string; pose: Pose; title: string; text: string; brother?: boolean };

const stops: Stop[] = [
  {
    h: 9,
    time: "9:00",
    sky: SKY.dawn,
    where: "Al empezar el día",
    say: "Buen día. Ayer entraron 23 consultas y 4 quedaron sin responder. Marta volvió después de 40 días: yo arrancaría por ella.",
    react: "☕",
    file: "Resumen · lunes 13.pdf",
    pose: "alegria",
    title: "Arrancá sabiendo por dónde empezar",
    text: "Antes había que revisar los dos WhatsApp para ver qué quedó pendiente. Ahora MARQui te lo cuenta en un mensaje, con lo importante primero.",
  },
  {
    h: 10.5,
    time: "10:30",
    sky: SKY.noon,
    where: "En la línea de pauta",
    say: "Juan preguntó «precio?» desde el anuncio de Collection. Te dejé tres respuestas: la segunda le pregunta para qué lo busca.",
    react: "👍",
    pose: "guino",
    title: "Respondé en segundos, no en minutos",
    text: "Llegan diez «precio?» seguidos desde el anuncio. Elegís una respuesta, la ajustás y la mandás vos. Juan nunca supo que MARQui existía.",
  },
  {
    h: 12.25,
    time: "12:15",
    sky: SKY.noon,
    where: "Entre consulta y consulta",
    say: "Sofía llegó recomendada por Pablo Sosa, que ya invirtió con MARQ. Le respondería antes que al resto.",
    react: "⭐",
    pose: "sorpresa",
    title: "No se te pasa nadie importante",
    text: "Un referido se perdía entre cien mensajes. MARQui reconoce a clientes, referidos y a quien vuelve, y te avisa al instante.",
  },
  {
    h: 16,
    time: "16:00",
    sky: SKY.noon,
    where: "Preparando la reunión",
    say: "Esta semana, 41 de 112 consultas fueron por Collection. Casi la mitad piensa pagar con crédito.",
    react: "📊",
    pose: "pensando",
    title: "Preguntá como a un compañero",
    text: "Para saber un número había que leer chat por chat. Ahora le escribís a MARQui y te contesta con datos, o con la lista en Excel.",
  },
  {
    h: 18.5,
    time: "18:30",
    sky: SKY.dusk,
    where: "Al cerrar el día",
    say: "Ya está la semana en MARQador: las recomendaciones traen 6 veces más interesados que el anuncio de Instagram.",
    react: "🧡",
    pose: "derecha",
    title: "Mirá qué pide el mercado",
    text: "La pauta se decidía por cantidad de consultas. Su hermanito, MARQador, muestra cuáles avanzan, para poner la plata donde rinde.",
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

      {/* The moment: MARQui speaks. */}
      <div className="mx-auto mt-16 grid min-h-[20rem] max-w-[58rem] grid-cols-[auto_1fr] items-end gap-4 sm:gap-10">
        <div className="relative w-[clamp(6rem,13vw,11rem)]">
          <MarquiLive pose={s.pose} />
          <AnimatePresence>
            {s.brother && (
              <motion.div
                key="bro"
                initial={{ opacity: 0, scale: 0.4, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.4 }}
                className="absolute -right-[42%] bottom-[2%] w-[52%]"
              >
                <MarquiLive who="marqador" pose="alegria" shadow={false} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.5, ease }}
            className="relative mb-[clamp(5rem,9vw,8rem)] rounded-[2rem] rounded-bl-md bg-ink p-6 text-[clamp(1.1rem,1.6vw,1.6rem)] leading-[1.45] text-white shadow-[0_2rem_4rem_-1.5rem_rgb(0_0_0/0.45)] sm:p-8"
          >
            {s.say}
            {s.file && (
              <span className="mt-4 flex w-fit items-center gap-3 rounded-xl bg-white/10 px-3 py-2 text-[0.95rem]">
                <span className="grid size-8 place-items-center rounded-md bg-[#e5484d] text-[0.7rem] font-semibold">PDF</span>
                {s.file}
              </span>
            )}
            <span className="absolute -bottom-4 right-6 grid size-10 place-items-center rounded-full bg-night-2 text-[1.2rem] ring-4 ring-ink">{s.react}</span>
          </motion.div>
        </AnimatePresence>
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
          <span>Arrastrá la hora o usá ← →</span>
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
