import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useMarquiLife, type Pose } from "./marqui-character";
import { MarquiLive } from "./marqui-live";
import { Section, ease } from "./primitives";
import { SKY } from "./sky";

/* ——— Te presentamos MARQui ———
   Like the dots page: the character first, centred and alive, then one big
   line, one plain sentence and two ways in. He jumps in, lands happy and
   says hi. */

export function Hero() {
  const reduce = useReducedMotion();
  const [reaction, setReaction] = useState<Pose | null>(reduce ? null : "salto");
  const [alive, setAlive] = useState(false);
  const pose = useMarquiLife({ active: alive, override: reaction });
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduce) {
      setAlive(true);
      return;
    }
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(900, () => setReaction("alegria"));
    at(2100, () => {
      setReaction(null);
      setAlive(true);
    });
    return () => timers.current.forEach(clearTimeout);
  }, [reduce]);

  const cheer = () => {
    if (reduce) return;
    setReaction("salto");
    timers.current.push(window.setTimeout(() => setReaction("alegria"), 420));
    timers.current.push(window.setTimeout(() => setReaction(null), 1700));
  };

  const enter = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease } });

  return (
    <Section sky={SKY.noon} id="inicio" className="grid min-h-[100svh] place-items-center pb-16 pt-28">
      <div className="mx-auto grid max-w-[64rem] justify-items-center text-center">
        <motion.button
          type="button"
          onClick={cheer}
          onPointerEnter={() => alive && setReaction((r) => r ?? "sorpresa")}
          onPointerLeave={() => setReaction((r) => (r === "sorpresa" ? null : r))}
          aria-label="Saludar a MARQui"
          className="cursor-pointer rounded-[3rem] outline-offset-8"
          initial={reduce ? false : { y: 140, scale: 0.6, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <MarquiLive pose={pose} className="w-[min(46vw,30svh,17rem)]" />
        </motion.button>

        <motion.h1 {...enter(0.5)} className="display sky-type mt-4 text-[clamp(2.8rem,7.4vw,8.4rem)]">
          Te presentamos MARQui
        </motion.h1>
        <motion.p {...enter(0.7)} className="sky-type mt-6 max-w-[46rem] text-balance text-[clamp(1.2rem,2vw,2.1rem)] font-medium leading-[1.3] text-white/85">
          Un compañero que trabaja con el equipo dentro del WhatsApp de MARQ: te sopla la respuesta, conoce a cada interesado y te cuenta qué pide el mercado. El cliente nunca lo ve.
        </motion.p>
        <motion.div {...enter(0.9)} className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#un-dia" className="inline-flex h-14 items-center rounded-full bg-ink px-7 text-[1.1rem] font-medium text-white transition-transform hover:-translate-y-0.5">
            Ver un día con MARQui
          </a>
          <a href="#marqador" className="inline-flex h-14 items-center rounded-full bg-white px-7 text-[1.1rem] font-medium text-ink transition-transform hover:-translate-y-0.5">
            Conocer MARQador
          </a>
        </motion.div>
      </div>
    </Section>
  );
}
