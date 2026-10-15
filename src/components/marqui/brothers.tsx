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
            <MarquiLive who="marqador" pose={brotherPose} />
          </motion.div>
          <motion.div className="absolute bottom-0 left-0 w-[70%]" initial={reduce ? false : { opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease }}>
            <MarquiLive pose={pose} />
          </motion.div>
        </div>

        <div className="grid gap-6">
          {/* His name, painted with his own light: the orange of the brand moving through it. */}
          <h2 id="el-plus-title" className="display sky-type text-[clamp(3rem,7.5vw,9rem)] font-bold!">
            <span className="marqador-shine inline-block">MARQador</span>
          </h2>
          <div className="paper grid gap-5 rounded-[1.75rem] p-6 sm:p-8">
            <p className="text-[clamp(1.1rem,1.5vw,1.5rem)] leading-[1.4] text-ink">
              Es <b>un módulo de MARQui</b>, no otra solución: viene incluido, usa las mismas conversaciones y lo que MARQui ya aprendió, y no hay que instalar nada más.
            </p>
            <p className="text-[clamp(1.02rem,1.3vw,1.3rem)] leading-[1.45] text-ink-2">
              Es su tablero. Junta todas las charlas de las dos líneas y te muestra <b className="text-ink">qué pide el mercado</b>: qué anuncio trae gente que avanza, qué buscan, cómo piensan pagar y qué los frena.
            </p>
            <ul className="grid gap-2.5 text-[clamp(1.02rem,1.3vw,1.3rem)] text-ink-2">
              <li className="flex items-start gap-3">
                <span className="mt-[0.45em] size-2.5 shrink-0 rounded-full bg-teal" />
                <span>
                  <b className="text-ink">MARQui</b> ayuda en cada charla, una por una, y va armando la ficha de cada cliente.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[0.45em] size-2.5 shrink-0 rounded-full bg-orange" />
                <span>
                  <b className="text-ink">MARQador</b> mira todas esas fichas juntas y las convierte en números para decidir.
                </span>
              </li>
            </ul>
            <p className="rounded-xl bg-paper-2 px-4 py-3 text-[clamp(0.98rem,1.15vw,1.15rem)] text-ink-2">
              Se abre en una pestaña desde WhatsApp Web, y el resumen de la semana te llega por WhatsApp. Uno conversa, el otro observa: mismos datos, mismo WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
