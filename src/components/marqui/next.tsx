import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, CreditCard, Globe, Lock, Sheet, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarquiMark } from "./marqui-mark";
import { FadeUp, Section, ease } from "./primitives";
import { Lead } from "./story";
import { SKY } from "./sky";
import { Face } from "./wa-kit";

/* ——— Lo que viene ———
   Three future integrations, each told the same way: what you'd ask MARQui in plain words
   (a chat on top) and what happens on the other side (the web, Mercado Pago, the list).
   They loop while on screen; a "Próximamente" ribbon makes clear none of it is in the first stage. */

/** Loops `n` beats while on screen; reduced motion holds the last one. */
function useBeats(n: number, ms: number[]) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const [beat, setBeat] = useState(reduce ? n - 1 : 0);
  const key = ms.join(",");
  useEffect(() => {
    if (!inView || reduce) return;
    const steps = key.split(",").map(Number);
    let b = 0;
    setBeat(0);
    let t = window.setTimeout(function next() {
      b = (b + 1) % n;
      setBeat(b);
      t = window.setTimeout(next, steps[b]);
    }, steps[0]);
    return () => clearTimeout(t);
  }, [inView, reduce, n, key]);
  return { ref, beat };
}

export function Next() {
  return (
    <Section sky={SKY.dawn} id="lo-que-viene" className="py-28 sm:py-40" aria-labelledby="lo-que-viene-title">
      <Lead id="lo-que-viene-title" title={["Lo que viene,", <em key="e">también por chat.</em>]}>
        Con MARQui y MARQador andando, el siguiente paso es conectarlo a la web y a los pagos. Lo que hoy depende del programador o se hace dos veces, se pide en una frase.
      </Lead>

      <div className="mx-auto mt-16 grid max-w-[84rem] gap-5 lg:grid-cols-3">
        <Card n={1} icon={Tags} title="Precios al día, en todos lados" text="Le decís el precio nuevo y MARQui lo cambia en la lista y en la web a la vez. Nadie lo carga dos veces." with={["Lista de precios", "Web"]} delay={0}>
          <PricesDemo />
        </Card>
        <Card n={2} icon={CreditCard} title="Señas con Mercado Pago" text="El cliente puede señar desde la web, o MARQui arma el link para mandarle por chat. Cuando se acredita, la unidad pasa sola a reservada." with={["Mercado Pago", "Web"]} delay={0.1}>
          <DepositDemo />
        </Card>
        <Card n={3} icon={Globe} title="La web, conectada a MARQui" text="Cargar un proyecto, publicarlo o dar de baja una unidad vendida, todo pidiéndoselo en lenguaje natural." with={["Web de MARQ"]} delay={0.2}>
          <WebDemo />
        </Card>
      </div>
    </Section>
  );
}

function Card({ n, icon: Icon, title, text, with: tags, delay, children }: { n: number; icon: typeof Tags; title: string; text: string; with: string[]; delay: number; children: ReactNode }) {
  return (
    <FadeUp delay={delay} className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-[#f7f7f5] text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)]">
        {children}
        <div className="flex flex-1 flex-col px-7 pb-8 pt-5">
          <span className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#19d3b4,#014645)] text-white">
              <Icon className="size-[1.05rem]" aria-hidden />
            </span>
            <span className="text-[0.8rem] font-semibold tabular-nums text-ink-3">0{n}</span>
            <span className="rounded-full bg-ink px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-white">Próximamente</span>
            <span className="ml-auto flex flex-wrap justify-end gap-1">
              {tags.map((t) => (
                <span key={t} className="rounded-full bg-white px-2.5 py-0.5 text-[0.72rem] font-medium text-ink-2 ring-1 ring-black/[0.06]">
                  + {t}
                </span>
              ))}
            </span>
          </span>
          <h3 className="mt-4 text-[clamp(1.35rem,1.75vw,1.8rem)] font-semibold leading-tight tracking-[-0.02em]">{title}</h3>
          <p className="mt-2.5 text-[clamp(1.02rem,1.15vw,1.2rem)] leading-snug text-ink-2">{text}</p>
        </div>
      </article>
    </FadeUp>
  );
}

/* ——— Shared pieces ——— */

function Stage({ stageRef, children }: { stageRef: React.RefObject<HTMLDivElement | null>; children: ReactNode }) {
  return (
    <div ref={stageRef} className="wa-font relative m-2.5 grid h-[19rem] grid-rows-[auto_1fr] gap-3 overflow-hidden rounded-[1.6rem] bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#eef3f1_60%,#e3ebe8_100%)] p-4 text-[#111b21] ring-1 ring-black/[0.04]">
      {children}
    </div>
  );
}

const bubble = "rounded-[0.8rem] px-3 py-1.5 text-[0.84rem] leading-snug shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]";
const pop = { initial: { opacity: 0, y: 8, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0 }, transition: { duration: 0.35, ease } };

/** Cande asks, MARQui confirms. */
function Chat({ ask, reply, beat, replyAt }: { ask: string; reply: ReactNode; beat: number; replyAt: number }) {
  return (
    <div className="grid content-start gap-1.5">
      <AnimatePresence initial={false}>
        {beat >= 1 && (
          <motion.span key={ask} {...pop} className="flex items-end gap-1.5 justify-self-start">
            <Face name="Cande" className="size-6" />
            <span className={cn(bubble, "rounded-bl-none bg-wa-bubble")}>{ask}</span>
          </motion.span>
        )}
        {beat >= replyAt && (
          <motion.span key={`r-${ask}`} {...pop} className="flex items-end gap-1.5 justify-self-start">
            <MarquiMark tone="teal" className="size-6 shrink-0" />
            <span className={cn(bubble, "rounded-bl-none bg-white")}>{reply}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ——— 1 · Prices: one sentence, two places updated ——— */

function PricesDemo() {
  const { ref, beat } = useBeats(4, [900, 1300, 1200, 3600]);
  const updated = beat >= 3;
  return (
    <Stage stageRef={ref}>
      <Chat ask="Subí la 2B a USD 92.000" reply={<>Listo ✓ Cambié la lista y la web.</>} beat={beat} replyAt={2} />
      <div className="grid grid-cols-2 items-end gap-3">
        {[
          { icon: Sheet, label: "Lista de precios", tint: "text-[#0f9d58]" },
          { icon: Globe, label: "Web de MARQ", tint: "text-[#014645]" },
        ].map((x, i) => (
          <div key={x.label} className="rounded-2xl bg-white p-3 shadow-[0_0.8rem_1.6rem_-1rem_rgb(1_30_27/0.35)] ring-1 ring-black/[0.05]">
            <span className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-ink-3">
              <x.icon className={cn("size-3.5", x.tint)} aria-hidden /> {x.label}
            </span>
            <span className="mt-2 flex items-baseline justify-between">
              <b className="text-[0.85rem]">Unidad 2B</b>
              {updated && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18, delay: i * 0.2 }} className="grid size-4 place-items-center rounded-full bg-[#008c7e] text-white">
                  <Check className="size-2.5" strokeWidth={4} />
                </motion.span>
              )}
            </span>
            {/* The number rolls, the same instant in both places. */}
            <span className="relative mt-1 block h-[1.6rem] overflow-hidden font-display text-[1.25rem] font-bold tracking-[-0.02em] tabular-nums">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span key={updated ? "n" : "o"} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.5, delay: i * 0.2, ease }} className={cn("block", updated && "text-[#008c7e]")}>
                  USD {updated ? "92.000" : "89.000"}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        ))}
      </div>
    </Stage>
  );
}

/* ——— 2 · Deposits: a link by chat, or from the web; paid → reserved ——— */

function DepositDemo() {
  const { ref, beat } = useBeats(5, [900, 1300, 1700, 1300, 3400]);
  const paid = beat >= 4;
  return (
    <Stage stageRef={ref}>
      <Chat
        ask="Generá un link de seña de la 2A para Juan"
        reply={
          <span className="grid gap-1.5">
            Acá está, mandáselo 👇
            <span className="flex items-center gap-2 rounded-lg bg-[#f1f8fd] px-2 py-1.5 ring-1 ring-[#009ee3]/25">
              <span className="grid size-7 place-items-center rounded-md bg-[#009ee3] text-white">
                <CreditCard className="size-4" aria-hidden />
              </span>
              <span className="leading-tight">
                <b className="block text-[0.76rem]">Seña · Unidad 2A</b>
                <span className="text-[0.68rem] text-ink-3">USD 2.000 · Mercado Pago</span>
              </span>
            </span>
          </span>
        }
        beat={beat}
        replyAt={2}
      />
      {/* The unit, as the web shows it. */}
      <div className="flex items-center gap-3 self-end rounded-2xl bg-white p-3 shadow-[0_0.8rem_1.6rem_-1rem_rgb(1_30_27/0.35)] ring-1 ring-black/[0.05]">
        <Face name="Juan" className="size-9" />
        <span className="min-w-0 flex-1 leading-tight">
          <b className="block text-[0.86rem]">Unidad 2A · MARQ Collection</b>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={beat >= 3 ? (paid ? "r" : "p") : "w"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[0.74rem] text-ink-3">
              {paid ? "Seña acreditada · hace 1 min" : beat >= 3 ? "Juan está pagando…" : "Disponible en la web"}
            </motion.span>
          </AnimatePresence>
        </span>
        <motion.span
          layout
          className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.74rem] font-semibold transition-colors duration-500", paid ? "bg-[#ffecc7] text-[#7a4a00]" : "bg-[#e7f6f2] text-[#00705f]")}
        >
          {paid && <Lock className="size-3" aria-hidden />}
          {paid ? "Reservada" : "Disponible"}
        </motion.span>
      </div>
    </Stage>
  );
}

/* ——— 3 · The web: publish a project, take down a sold unit ——— */

function WebDemo() {
  const { ref, beat } = useBeats(5, [900, 1300, 1800, 1300, 3400]);
  const published = beat >= 2;
  const second = beat >= 3;
  const sold = beat >= 4;
  return (
    <Stage stageRef={ref}>
      <Chat
        ask={second ? "Y dá de baja la 3B, se vendió" : "Publicá Fontana II: 40 lotes desde USD 25.000"}
        reply={second ? <>Hecho ✓ La 3B ya figura vendida.</> : <>Listo ✓ Fontana II ya está en la web.</>}
        beat={second ? (sold ? 2 : 1) : beat}
        replyAt={2}
      />
      {/* A tiny marq.com.ar */}
      <div className="self-end overflow-hidden rounded-2xl bg-white shadow-[0_0.8rem_1.6rem_-1rem_rgb(1_30_27/0.35)] ring-1 ring-black/[0.05]">
        <span className="flex items-center gap-1.5 border-b border-black/[0.05] bg-[#f4f5f7] px-3 py-1.5">
          <i className="size-1.5 rounded-full bg-[#ff5f57]" />
          <i className="size-1.5 rounded-full bg-[#febc2e]" />
          <i className="size-1.5 rounded-full bg-[#28c840]" />
          <span className="mx-auto text-[0.66rem] text-ink-3">marq.com.ar/proyectos</span>
        </span>
        <span className="grid grid-cols-3 gap-2 p-2.5">
          {[
            { name: "Collection", sub: "3B", tone: "from-[#8ad8c8] to-[#008c7e]", unit: true },
            { name: "Fontana", sub: "Lotes", tone: "from-[#f6c58b] to-[#e08a3c]" },
          ].map((x) => (
            <span key={x.name} className="relative overflow-hidden rounded-lg bg-[#f7f7f5]">
              <span className={cn("block h-10 bg-gradient-to-br", x.tone)} />
              <b className="block px-1.5 pt-1 text-[0.68rem] leading-tight">{x.name}</b>
              <span className="block px-1.5 pb-1.5 text-[0.6rem] text-ink-3">{x.sub}</span>
              {x.unit && sold && (
                <motion.span initial={{ scale: 1.6, opacity: 0, rotate: -14 }} animate={{ scale: 1, opacity: 1, rotate: -10 }} transition={{ type: "spring", stiffness: 420, damping: 16 }} className="absolute left-1/2 top-3 -translate-x-1/2 rounded border-2 border-[#e5484d] bg-white/80 px-1 text-[0.6rem] font-black uppercase tracking-wide text-[#e5484d]">
                  Vendida
                </motion.span>
              )}
            </span>
          ))}
          {/* The new project, building itself in. */}
          <span className="relative overflow-hidden rounded-lg border border-dashed border-black/15">
            {published && (
              <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="absolute inset-0 bg-[#f7f7f5]">
                <motion.span initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: 0.15, ease }} className="block h-10 origin-top bg-gradient-to-br from-[#ffd58a] to-[#f4661a]" />
                <b className="block px-1.5 pt-1 text-[0.68rem] leading-tight">Fontana II</b>
                <span className="block px-1.5 pb-1.5 text-[0.6rem] text-ink-3">40 lotes</span>
                <span className="absolute right-1 top-1 rounded-full bg-[#008c7e] px-1.5 text-[0.55rem] font-bold text-white">Nuevo</span>
              </motion.span>
            )}
          </span>
        </span>
      </div>
    </Stage>
  );
}
