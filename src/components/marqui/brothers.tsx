import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { Pose } from "./marqui-character";
import { MarquiLive } from "./marqui-live";
import { ease, Section } from "./primitives";
import { SKY } from "./sky";

/* ——— The bridge ———
   Before MARQador takes the stage, MARQui shows him: the big brother in
   front, the little one peeking out from behind and hopping to his side.
   MARQador is not another product, it is something MARQui brings along. */

export function Brothers() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const reduce = useReducedMotion();
  const [pose, setPose] = useState<Pose>("reposo");
  const [brotherPose, setBrotherPose] = useState<Pose>("reposo");

  // MARQui glances back at his brother, then smiles at you.
  useEffect(() => {
    if (!inView || reduce) return;
    const t = [window.setTimeout(() => setBrotherPose("salto"), 1300), window.setTimeout(() => setBrotherPose("alegria"), 1800), window.setTimeout(() => setPose("derecha"), 1900), window.setTimeout(() => setPose("alegria"), 2700), window.setTimeout(() => { setPose("reposo"); setBrotherPose("izquierda"); }, 3800), window.setTimeout(() => setBrotherPose("reposo"), 5200)];
    return () => t.forEach(clearTimeout);
  }, [inView, reduce]);

  return (
    <Section ref={ref} sky={SKY.dusk} id="el-plus" data-brand="marqador" className="grid min-h-[100svh] place-items-center py-28" aria-labelledby="el-plus-title">
      <div className="mx-auto grid max-w-[90rem] items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative mx-auto h-[min(34rem,60vw)] w-[min(40rem,80vw)]">
          {/* The little brother, behind: he peeks out, then hops to MARQui's side. */}
          <motion.div
            className="absolute bottom-[6%] right-[2%] w-[38%]"
            initial={reduce ? false : { x: "-70%", y: "-10%", opacity: 0, rotate: -12 }}
            animate={inView ? { x: "0%", y: ["-10%", "-55%", "0%"], opacity: 1, rotate: [-12, 8, 0] } : undefined}
            transition={{ duration: 1.1, delay: 1.2, ease }}
          >
            <MarquiLive who="marqador" pose={brotherPose} follow />
          </motion.div>
          <motion.div className="absolute bottom-0 left-0 w-[70%]" initial={reduce ? false : { opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease }}>
            <MarquiLive pose={pose} follow />
          </motion.div>
        </div>

        <div className="grid gap-6">
          <h2 id="el-plus-title" className="display sky-type text-[clamp(2.2rem,5.8vw,7.4rem)]">
            <span className="block">Un módulo</span>
            <span className="block">
              <em>de MARQui.</em>
            </span>
          </h2>
          <div className="paper grid gap-4 rounded-[1.75rem] p-6 sm:p-8">
            <p className="text-[clamp(1.1rem,1.5vw,1.5rem)] leading-[1.4] text-ink">
              <b>MARQador</b> no es otra solución: es el hermanito de MARQui. Viene con él, usa lo mismo que él aprende y no hay que instalar nada más.
            </p>
            <ul className="grid gap-2.5 text-[clamp(1.02rem,1.3vw,1.3rem)] text-ink-2">
              <li className="flex items-start gap-3">
                <span className="mt-[0.45em] size-2.5 shrink-0 rounded-full bg-teal" />
                <span>
                  <b className="text-ink">MARQui</b> ayuda en cada charla, una por una.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[0.45em] size-2.5 shrink-0 rounded-full bg-orange" />
                <span>
                  <b className="text-ink">MARQador</b> mira todas las charlas juntas y te muestra qué pide el mercado.
                </span>
              </li>
            </ul>
            <p className="rounded-xl bg-paper-2 px-4 py-3 text-[clamp(0.98rem,1.15vw,1.15rem)] text-ink-2">Uno conversa, el otro observa. Mismos datos, mismo WhatsApp.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
