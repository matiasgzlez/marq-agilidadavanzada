import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Marqador } from "./marqador";
import { MarquiLive } from "./marqui-live";
import { Phone } from "./phone";
import { Section, ease } from "./primitives";
import { SKY } from "./sky";
import { Lead } from "./story";
import { WhatsAppWeb } from "./whatsapp-web";

/* ——— Justo donde lo necesitás ———
   The dots "where" section: three tabs, each a realistic capture of the
   place MARQui shows up, with the character standing next to it and one
   line underneath. */

const places = [
  { id: "web", label: "WhatsApp Web", title: "En cada chat", text: "En la computadora, MARQui aparece dentro del chat que abrís: la tarjeta del interesado arriba y tres respuestas abajo. Probalo: tocá una y enviala." },
  { id: "cel", label: "Celular", title: "En el celular de la línea", text: "MARQui es un contacto más. Le reenviás un mensaje o le mandás un audio y te contesta al toque, también fuera de la oficina." },
  { id: "tab", label: "MARQador", title: "En una pestaña aparte", text: "Un botón en WhatsApp Web abre MARQador, su hermanito, con todo lo que pide el mercado. Como la app de Gasti: el chat para hacer, la pestaña para mirar." },
] as const;

type Place = (typeof places)[number]["id"];

export function Where() {
  const [tab, setTab] = useState<Place>("web");
  const p = places.find((x) => x.id === tab)!;
  return (
    <Section sky={SKY.noon} id="donde" className="py-28 sm:py-40" aria-labelledby="donde-title">
      <Lead id="donde-title" title={["Justo donde lo necesitás"]}>
        Escribile a MARQui desde la computadora o el celular de cada línea, o abrí MARQador en una pestaña. Cuando algo merece tu atención, te avisa.
      </Lead>

      <div role="tablist" aria-label="Dónde está MARQui" className="mx-auto mt-12 flex w-fit gap-1 rounded-full bg-ink/85 p-1.5">
        {places.map((x) => (
          <button key={x.id} role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)} className={cn("relative rounded-full px-5 py-2.5 text-[clamp(0.95rem,1.1vw,1.15rem)] font-medium transition-colors sm:px-7", tab === x.id ? "text-ink" : "text-white/75 hover:text-white")}>
            {tab === x.id && <motion.span layoutId="where-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className="relative">{x.label}</span>
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-10 max-w-[84rem]">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease }}>
            {tab === "web" && (
              <div className="relative">
                <WhatsAppWeb />
                <Character className="-left-6 -top-16 hidden w-[9rem] xl:block" pose="guino" />
              </div>
            )}
            {tab === "cel" && (
              <div className="relative mx-auto grid max-w-[46rem] place-items-center">
                <Phone
                  title="MARQui"
                  messages={[
                    { kind: "out", forwarded: true, time: "19:05", text: "Hola, ¿los lotes de Fontana tienen financiación?" },
                    { kind: "in", time: "19:05", text: <><b>1.</b> ¡Hola! Sí, financiamos hasta 36 cuotas. ¿Te paso el plano con los lotes disponibles?</> },
                    { kind: "in", time: "19:05", text: <><b>2.</b> ¡Sí! Anticipo del 30% y el resto en cuotas. ¿Lo pensás para construir o para invertir?</> },
                    { kind: "out", time: "19:06", text: "🎤 Audio · 0:08" },
                    { kind: "in", time: "19:06", text: "Listo, mandale la 2. Ya le anoté «Lotes Fontana» a su tarjeta." },
                  ]}
                  stagger={0.3}
                />
                <Character className="-right-2 bottom-10 w-[clamp(7rem,12vw,10rem)] sm:right-[4%]" pose="alegria" />
              </div>
            )}
            {tab === "tab" && (
              <div className="relative">
                <Marqador />
                <Character className="-right-6 -top-16 hidden w-[8.5rem] xl:block" pose="alegria" who="marqador" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }} className="mx-auto mt-10 grid max-w-[44rem] gap-2 text-center">
          <h3 className="display sky-type text-[clamp(1.6rem,2.4vw,2.6rem)]">{p.title}</h3>
          <p className="sky-type text-balance text-[clamp(1.05rem,1.35vw,1.4rem)] font-medium leading-[1.45] text-white/85">{p.text}</p>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

function Character({ className, pose, who }: { className?: string; pose: "guino" | "alegria"; who?: "marqador" }) {
  return (
    <motion.div className={cn("pointer-events-none absolute z-10", className)} initial={{ opacity: 0, scale: 0.6, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 }}>
      <MarquiLive pose={pose} who={who} follow />
    </motion.div>
  );
}
