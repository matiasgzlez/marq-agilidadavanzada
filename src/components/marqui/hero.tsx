import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useMarquiLife, type Pose } from "./marqui-character";
import { IntroControls, IntroTitle, Typed } from "./intro-text";
import { INTRO_END, MarqIntro } from "./marq-intro";
import { Section, ease } from "./primitives";
import { SKY } from "./sky";

/* ——— Presentamos MARQui ———
   Opens like Pixar: the MARQ logo, MARQui hops in, crushes the Q and stays
   in its place. The title comes in while he is still the Q, the sentence
   types itself out and then the two ways in appear. */

const COPY =
  "Un asistente que trabaja con el equipo dentro del WhatsApp de MARQ: te propone tres respuestas para cada consulta, conoce cada conversación, le podés preguntar lo que necesites y te cuenta qué están pidiendo los clientes potenciales.";

export function Hero() {
  const reduce = useReducedMotion();
  const [play, setPlay] = useState(() => ({ id: 0, from: reduce ? INTRO_END : 0 }));
  const [step, setStep] = useState(0);
  const [reaction, setReaction] = useState<Pose | null>(null);
  const pose = useMarquiLife({ active: step === 3, override: reaction });
  // Skipped (or reduced motion): the text is simply there.
  const instant = play.from >= INTRO_END;
  const [typed, setTyped] = useState(false);
  const timers = useRef<number[]>([]);

  const cheer = () => {
    if (reduce) return;
    timers.current.forEach(clearTimeout);
    setReaction("salto");
    timers.current.push(window.setTimeout(() => setReaction("alegria"), 420));
    timers.current.push(window.setTimeout(() => setReaction(null), 1700));
  };
  const restart = (from: number) => {
    setReaction(null);
    setPlay((p) => ({ id: p.id + 1, from }));
  };

  const show = (on: boolean) => ({
    initial: false as const,
    animate: on ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: reduce || instant ? 0 : 0.8, ease },
  });

  return (
    <Section sky={SKY.noon} id="inicio" className="grid min-h-[100svh] place-items-center overflow-x-clip pb-16 pt-28">
      <div className="mx-auto grid w-full max-w-[64rem] justify-items-center text-center">
        <MarqIntro play={play} livePose={pose} onStep={setStep} onCharClick={cheer} className="w-[min(59vw,38rem,calc((100svh-17rem)*1.3))]" />

        <IntroTitle lead="Presentamos" name="MARQui" shine="marqui-shine" shown={step >= 1} instant={instant} className="mt-6" />
        <Typed key={play.id} text={COPY} start={step >= 2} instant={instant} onDone={setTyped} />
        <motion.div {...show(typed)} className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#un-dia" tabIndex={typed ? undefined : -1} className="inline-flex h-14 items-center rounded-full bg-ink px-7 text-[1.1rem] font-medium text-white transition-transform hover:-translate-y-0.5">
            Ver un día con MARQui
          </a>
          <a href="#marqador" tabIndex={typed ? undefined : -1} className="inline-flex h-14 items-center rounded-full bg-white px-7 text-[1.1rem] font-medium text-ink transition-transform hover:-translate-y-0.5">
            Conocer MARQador
          </a>
        </motion.div>
      </div>

      {!reduce && <IntroControls done={step === 3} onSkip={() => restart(INTRO_END)} onReplay={() => restart(0)} />}
    </Section>
  );
}

