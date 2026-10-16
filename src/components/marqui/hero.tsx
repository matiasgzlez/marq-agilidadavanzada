import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play, Volume2 } from "lucide-react";
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

/* The intro's sound. Drop the file at public/assets/audio/intro.mp3 (it's git-ignored);
   without it the intro simply plays silent. */
const INTRO_AUDIO = "/assets/audio/intro.mp3";

export function Hero() {
  const reduce = useReducedMotion();
  // Browsers only allow sound after a click, so the film waits for «Empezar».
  const [started, setStarted] = useState(!!reduce);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audio.current = new Audio(INTRO_AUDIO);
    audio.current.preload = "auto";
    return () => audio.current?.pause();
  }, []);
  const sound = (on: boolean) => {
    const a = audio.current;
    if (!a) return Promise.resolve();
    a.pause();
    a.currentTime = 0;
    // Resolves once sound is actually coming out (or right away if there is none).
    return on ? a.play().catch(() => {}) : Promise.resolve();
  };
  /** The intro's master clock while the soundtrack plays. */
  const clock = () => {
    const a = audio.current;
    return a && !a.paused && a.readyState >= 2 && a.currentTime > 0 ? a.currentTime : null;
  };
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
    // The film waits for the sound to really start, so the first frame and the first note line up.
    void sound(from === 0).then(() => setPlay((p) => ({ id: p.id + 1, from })));
  };

  const show = (on: boolean) => ({
    initial: false as const,
    animate: on ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: reduce || instant ? 0 : 0.8, ease },
  });

  return (
    <Section sky={SKY.noon} id="inicio" className="grid min-h-[100svh] place-items-center overflow-x-clip pb-16 pt-28">
      <div className="mx-auto grid w-full max-w-[64rem] justify-items-center text-center">
        {started ? (
          <MarqIntro play={play} clock={clock} livePose={pose} onStep={setStep} onCharClick={cheer} className="w-[min(59vw,38rem,calc((100svh-17rem)*1.3))]" />
        ) : (
          <div className="aspect-[1.3] w-[min(59vw,38rem,calc((100svh-17rem)*1.3))]" aria-hidden />
        )}

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

      {!reduce && started && <IntroControls done={step === 3} onSkip={() => restart(INTRO_END)} onReplay={() => restart(0)} />}

      {/* The gate: a quiet glass button in the middle of the sky. One click starts the film, with sound. */}
      <AnimatePresence>
        {!started && (
          <motion.div className="absolute inset-0 z-10 grid place-items-center" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <motion.button
              type="button"
              onClick={() => {
                // Mount the film only once the sound is playing, so both start on the same frame.
                void sound(true).then(() => {
                  setPlay((p) => ({ id: p.id + 1, from: 0 }));
                  setStarted(true);
                });
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease }}
              className="group relative inline-flex h-14 cursor-pointer items-center gap-3 rounded-full bg-white/12 pl-2 pr-6 text-[1.05rem] font-medium text-white ring-1 ring-white/30 backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <motion.i className="absolute inset-0 rounded-full" animate={{ boxShadow: ["0 0 0 0 rgb(255 255 255 / 0.35)", "0 0 0 1.2rem rgb(255 255 255 / 0)"] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }} aria-hidden />
              <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition-transform group-hover:scale-105">
                <Play className="ml-0.5 size-4 fill-current" aria-hidden />
              </span>
              Empezar
              <Volume2 className="size-4 text-white/60" aria-label="con sonido" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

