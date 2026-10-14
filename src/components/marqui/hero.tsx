import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Pose } from "./marqui-character";
import { ArrowDown } from "lucide-react";
import { Section, ease } from "./primitives";
import { MarquiLive } from "./marqui-live";
import { SKY } from "./sky";
import { WhatsAppWeb } from "./whatsapp-web";

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease } });

  return (
    <Section sky={SKY.noon} id="inicio" className="pb-24 pt-32 sm:pt-40">
      <div className="relative mx-auto max-w-[90rem]">
        <motion.p {...enter(0.25)} className="eyebrow mb-8 flex w-fit items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-white">
          <span className="size-2 rounded-full bg-orange shadow-[0_0_0.75rem_#e96f2d]" /> Agilidad avanzada · La solución para MARQ
        </motion.p>

        <h1 className="display sky-type text-[clamp(2.2rem,6.6vw,9.4rem)]">
          {[
            <>MARQui te sopla</>,
            <>la respuesta.</>,
            <>
              <em>El cliente nunca lo ve.</em>
            </>,
          ].map((line, i) => (
            <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <motion.span className="block" initial={reduce ? false : { y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.3, delay: 0.4 + i * 0.12, ease }}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div {...enter(0.9)} className="mt-10 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="grid gap-5">
            <p className="paper max-w-[46rem] rounded-[1.5rem] px-6 py-5 text-[clamp(1.15rem,1.6vw,1.6rem)] leading-[1.4] text-ink sm:px-8 sm:py-6">
              Un asistente con IA para el equipo de MARQ, <b>dentro del WhatsApp que ya usan.</b> Propone respuestas, conoce a cada interesado y muestra qué pide el mercado.
            </p>
            <a href="#demo-hero" className="group inline-flex h-16 w-fit items-center gap-3 rounded-full bg-white px-8 text-[1.1rem] font-semibold text-ink shadow-[0_1rem_3rem_-1rem_rgb(1_30_27/0.5)] transition-transform duration-300 hover:-translate-y-0.5">
              Verlo en acción <ArrowDown className="size-5 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
          {/* MARQui himself, whispering: the idea of the product in one picture. */}
          <motion.div
            aria-hidden
            initial={reduce ? false : { opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, delay: 1, ease }}
            className="pointer-events-none hidden lg:block"
          >
            <motion.div animate={reduce ? undefined : { y: [0, -14, 0], rotate: [0, -2, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-end gap-3">
              <span className="paper whitespace-nowrap rounded-[1.4rem] rounded-br-md px-5 py-3.5 text-[clamp(1rem,1.3vw,1.35rem)] font-semibold text-ink">Psst… mandale la segunda 😉</span>
              <HeroMarqui />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div id="demo-hero" initial={reduce ? false : { opacity: 0, y: 120 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.8, ease }} className="mt-20 scroll-mt-24">
          <WhatsAppWeb />
          <p className="mx-auto mt-5 w-fit rounded-full bg-ink px-5 py-2.5 text-center text-[0.95rem] text-white">
            Probalo: tocá una sugerencia, cambiala y enviala. <span className="text-white/60">Simulación con datos ilustrativos.</span>
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

/** MARQui winking next to the whisper; he blinks back to rest now and then. */
function HeroMarqui() {
  const [pose, setPose] = useState<Pose>("guino");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seq: [Pose, number][] = [["guino", 2600], ["reposo", 1400], ["parpadeo", 140], ["reposo", 900], ["derecha", 1100], ["reposo", 700]];
    let i = 0;
    let t = 0;
    const next = () => {
      const [p, ms] = seq[i % seq.length]!;
      setPose(p);
      i++;
      t = window.setTimeout(next, ms);
    };
    next();
    return () => clearTimeout(t);
  }, []);
  return <MarquiLive pose={pose} follow title="MARQui guiñando" className="mr-[4%] w-[clamp(11rem,15vw,21rem)] drop-shadow-[0_1.5rem_3rem_rgb(1_30_27/0.35)]" />;
}
