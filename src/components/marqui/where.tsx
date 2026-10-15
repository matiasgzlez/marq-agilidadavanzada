import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
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
  { id: "web", label: "WhatsApp Web", title: "En cada chat", text: "Donde el equipo trabaja el 80% del tiempo. MARQui aparece dentro de cada chat: la ficha del cliente arriba, tres respuestas abajo y la estrella para seguirlo. Probalo: tocá una respuesta y enviala." },
  { id: "cel", label: "Celular", title: "En el celular de la línea", text: "MARQui es un contacto más. Te llegan el resumen y los avisos, y le preguntás lo que necesites, también fuera de la oficina." },
] as const;

type Place = (typeof places)[number]["id"];

export function Where() {
  const [tab, setTab] = useState<Place>("web");
  const p = places.find((x) => x.id === tab)!;
  return (
    <Section sky={SKY.noon} id="donde" className="py-28 sm:py-40" aria-labelledby="donde-title">
      <Lead id="donde-title" title={["Justo donde lo necesitás"]}>
        En la computadora, dentro de cada chat. En el celular, como un contacto más. Cuando algo merece tu atención, te avisa.
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
              </div>
            )}
            {tab === "cel" && (
              <div className="relative mx-auto grid max-w-[46rem] place-items-center">
                <Phone
                  title="MARQui"
                  messages={[
                    { kind: "day", text: "Hoy" },
                    { kind: "in", time: "9:00", text: <><b>☀️ Buen día, Cande.</b> Ayer entraron 23 consultas y 4 quedaron sin responder.</> },
                    { kind: "file", from: "in", name: "Resumen · viernes 17.pdf", meta: "2 páginas · PDF", type: "pdf", time: "9:00" },
                    { kind: "in", time: "16:20", text: <><b>⭐ Laura Gómez, que seguís, te escribió:</b> «¿El sábado se puede ir a ver la 2A?»</> },
                    { kind: "out", time: "16:21", text: "¿Qué horario tenemos el sábado?" },
                    { kind: "in", time: "16:21", text: <>De 10 a 13. Podés contestarle: <i>«¡Hola Laura! El sábado abrimos de 10 a 13. ¿Les reservo a las 11?»</i></> },
                  ]}
                  stagger={0.35}
                />
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
