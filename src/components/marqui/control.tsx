import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Ban, Check, Eye, Hand, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarquiMark } from "./marqui-mark";
import { LOGO, ease } from "./primitives";
import { Face } from "./wa-kit";

/* ——— De tu lado, bajo tu control ———
   Two promises, each one proven by a tiny scene that plays itself while on screen,
   in the same light-tile language as the results bento. */

/** Loops through `n` beats of `ms` each while the tile is on screen. Reduced motion holds the last beat. */
function useBeats(n: number, ms: number | number[]) {
  // A stable key, so a fresh array literal each render doesn't restart the loop.
  const key = Array.isArray(ms) ? ms.join(",") : String(ms);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const [beat, setBeat] = useState(reduce ? n - 1 : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const steps = key.split(",").map(Number);
    const len = (b: number) => steps[b] ?? steps[0]!;
    let b = 0;
    setBeat(0);
    let t = window.setTimeout(function next() {
      b = (b + 1) % n;
      setBeat(b);
      t = window.setTimeout(next, len(b));
    }, len(0));
    return () => clearTimeout(t);
  }, [inView, reduce, n, key]);
  return { ref, beat, reduce };
}

function Tile({ icon: Icon, title, text, children, delay = 0, stage }: { icon: typeof Hand; title: string; text: string; children: ReactNode; delay?: number; stage: React.RefObject<HTMLDivElement | null> }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, delay, ease }}
      className="flex flex-col overflow-hidden rounded-[2rem] bg-[#f7f7f5] text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)]"
    >
      {/* The stage: a soft well where the proof plays. */}
      <div ref={stage} className="relative m-2.5 grid h-[22.5rem] place-items-center overflow-hidden rounded-[1.6rem] bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#eef3f1_60%,#e3ebe8_100%)] px-5 ring-1 ring-black/[0.04]">
        {children}
      </div>
      <div className="px-7 pb-8 pt-4">
        <span className="flex items-start gap-2.5">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#19d3b4,#014645)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]">
            <Icon className="size-[1.05rem]" aria-hidden />
          </span>
          <h3 className="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold leading-tight tracking-[-0.02em]">{title}</h3>
        </span>
        <p className="mt-3 text-[clamp(1.05rem,1.2vw,1.25rem)] leading-snug text-ink-2">{text}</p>
      </div>
    </motion.article>
  );
}

const bubble = "rounded-[0.9rem] px-3 py-2 text-[0.84rem] leading-[1.35] shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]";

/* 1 · Two sides of the same chat. The client only ever sees a person. */
function NotABot() {
  const { ref, beat, reduce } = useBeats(2, 3400);
  const yours = beat === 1;
  return (
    <Tile stage={ref} icon={Hand} title="No es un chatbot" text="Al cliente siempre le responde una persona de MARQ. MARQui sugiere; vos revisás, ajustás y enviás. No reemplaza al vendedor.">
      <div className="wa-font w-full max-w-[19rem] text-[#111b21]">
        {/* Whose screen is this? */}
        <div className="relative mx-auto mb-3 grid w-fit grid-cols-2 rounded-full bg-black/[0.06] p-1 text-[0.72rem] font-semibold">
          <motion.span layout transition={{ type: "spring", stiffness: 420, damping: 34 }} className={cn("absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm", yours ? "right-1" : "left-1")} />
          <span className={cn("relative flex items-center justify-center gap-1 px-3 py-1 transition-colors", !yours ? "text-ink" : "text-ink-3")}>
            <UserRound className="size-3.5" aria-hidden /> El cliente ve
          </span>
          <span className={cn("relative flex items-center justify-center gap-1 px-3 py-1 transition-colors", yours ? "text-ink" : "text-ink-3")}>
            <Eye className="size-3.5" aria-hidden /> Vos ves
          </span>
        </div>

        <div className="relative flex h-[17.5rem] flex-col overflow-hidden rounded-[1.1rem] bg-white shadow-[0_1rem_2rem_-1rem_rgb(1_30_27/0.35)] ring-1 ring-black/[0.06]">
          <div className="flex h-11 shrink-0 items-center gap-2 border-b border-black/[0.06] bg-[#f0f2f5] px-3">
            <AnimatePresence mode="wait" initial={false}>
              {yours ? (
                <motion.span key="y" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-2">
                  <Face name="Juan" className="size-7" />
                  <b className="text-[0.82rem] font-medium">Juan</b>
                </motion.span>
              ) : (
                <motion.span key="c" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-ink"><img src={LOGO} alt="" className="w-[78%] brightness-0 invert" /></span>
                  <b className="text-[0.82rem] font-medium">MARQ Desarrollos</b>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="wa-paper flex flex-1 flex-col justify-start gap-1.5 px-3 py-2.5">
            <span className={cn(bubble, "w-fit max-w-[82%]", yours ? "bg-white" : "ml-auto bg-wa-bubble")}>¿Tienen de 2 dormitorios?</span>
            <span className={cn(bubble, "w-fit max-w-[86%]", yours ? "ml-auto bg-wa-bubble" : "bg-white")}>
              {!yours && <b className="block text-[0.7rem] font-semibold text-[#c4511b]">Cande · MARQ</b>}
              ¡Sí! Desde USD 74.000. ¿Para vivir o invertir?
            </span>
          </div>
          {/* MARQui's tray exists only on your side. */}
          <motion.div
            initial={false}
            animate={{ y: yours ? 0 : "100%", opacity: yours ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease }}
            className="absolute inset-x-0 bottom-0 border-t border-black/[0.06] bg-white shadow-[0_-0.6rem_1.2rem_-0.8rem_rgb(1_30_27/0.25)]"
          >
            <div className="grid gap-1 px-3 py-2">
              <span className="flex items-center gap-1.5 text-[0.7rem]">
                <MarquiMark tone="teal" className="size-3.5" />
                <b className="font-semibold">MARQui</b>
                <span className="text-[#667781]">sugiere · solo lo ves vos</span>
              </span>
              {["78%", "92%", "64%"].map((w, i) => (
                <span key={i} className={cn("flex h-4 items-center rounded-md px-2", i === 1 ? "bg-[#008c7e]" : "bg-[#f3f5f6]")}>
                  <i className={cn("h-1.5 rounded-full", i === 1 ? "bg-white/75" : "bg-[#d5dadd]")} style={{ width: w }} />
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Tile>
  );
}

/* 2 · The survey that never gets sent: it folds into one natural question. */
function NoSurveys() {
  const { ref, beat } = useBeats(3, [2200, 1100, 3600]);
  return (
    <Tile stage={ref} icon={Ban} title="No es una encuesta" text="El cliente no tiene que completar un cuestionario. MARQui toma los datos de la charla y, si falta algo, te sugiere cómo preguntarlo de forma natural." delay={0.08}>
      {/* One fixed chat window: only what's inside it changes. */}
      <div className="wa-font flex h-[15.5rem] w-full max-w-[19rem] flex-col overflow-hidden rounded-[1.1rem] bg-white text-[#111b21] shadow-[0_1rem_2rem_-1rem_rgb(1_30_27/0.35)] ring-1 ring-black/[0.06]">
        <div className="flex h-11 shrink-0 items-center gap-2 border-b border-black/[0.06] bg-[#f0f2f5] px-3">
          <Face name="Juan" className="size-7" />
          <b className="text-[0.82rem] font-medium">Juan</b>
        </div>
        <div className="wa-paper relative min-h-0 flex-1">
          <AnimatePresence initial={false}>
            {beat < 2 ? (
              <motion.div key="survey" className="absolute inset-0 flex flex-col justify-end gap-1.5 px-3 py-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(4px)" }} transition={{ duration: 0.4, ease }}>
                {/* The survey a bot would send. */}
                <div className={cn(bubble, "relative ml-auto w-[88%] bg-wa-bubble")}>
                  <b className="text-[0.76rem] font-semibold">Respondé esta encuesta 📋</b>
                  {["¿Edad?", "¿Para vivir o invertir?", "¿Forma de pago?"].map((q, i) => (
                    <span key={q} className="mt-1.5 flex items-center gap-2 text-[0.72rem] text-[#3b4a54]">
                      <span className="grid size-4 shrink-0 place-items-center rounded-full border-2 border-[#9fb9a4] text-[0.5rem]">{i + 1}</span>
                      {q}
                    </span>
                  ))}
                  {/* Struck out: a client who gets a survey stops answering. */}
                  <motion.span
                    initial={false}
                    animate={{ scale: beat === 1 ? 1 : 0, opacity: beat === 1 ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 18 }}
                    className="absolute inset-0 grid place-items-center rounded-[0.9rem] bg-white/65 backdrop-blur-[1px]"
                  >
                    <span className="flex items-center gap-1.5 rounded-full bg-[#e5484d] px-3 py-1.5 text-[0.75rem] font-semibold text-white shadow-lg">
                      <Ban className="size-3.5" aria-hidden /> No se manda
                    </span>
                  </motion.span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="chat" className="absolute inset-0 flex flex-col justify-end gap-1.5 px-3 py-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}>
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }} className={cn(bubble, "ml-auto w-fit max-w-[92%] bg-wa-bubble")}>
                  ¡Hola Juan! Hay de 2 dorm desde USD 74.000.{" "}
                  <motion.mark initial={{ backgroundColor: "rgba(0,140,126,0)" }} animate={{ backgroundColor: "rgba(0,140,126,0.16)" }} transition={{ delay: 0.5, duration: 0.6 }} className="rounded px-0.5 font-medium text-[#00594f]">
                    ¿Lo pensás para vivir o invertir?
                  </motion.mark>
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.4, ease }} className={cn(bubble, "w-fit bg-white")}>
                  Para invertir 👍
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
          {/* And the card fills itself: a tag that lands on top, without moving anything. */}
          <motion.span
            initial={false}
            animate={{ opacity: beat === 2 ? 1 : 0, scale: beat === 2 ? 1 : 0.6 }}
            transition={beat === 2 ? { delay: 1.8, type: "spring", stiffness: 420, damping: 18 } : { duration: 0.2 }}
            className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#008c7e] px-3 py-1.5 text-[0.74rem] text-white shadow-[0_0.6rem_1.2rem_-0.5rem_rgb(0_140_126/0.7)]"
          >
            <MarquiMark tone="light" className="size-3.5" />
            <span className="text-white/75">Busca</span> <b className="font-semibold">Invertir</b>
            <Check className="size-3.5" strokeWidth={3} aria-hidden />
          </motion.span>
        </div>
      </div>
    </Tile>
  );
}

export function ControlCards() {
  return (
    <div className="mx-auto mt-16 grid max-w-[58rem] gap-4 md:grid-cols-2">
      <NotABot />
      <NoSurveys />
    </div>
  );
}
