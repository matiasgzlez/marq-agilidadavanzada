import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BookOpen, FileSpreadsheet, MessagesSquare, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pose } from "./marqui-character";
import { MarquiLive } from "./marqui-live";
import { FadeUp, MarquiAvatar, Section, ease } from "./primitives";
import { Lead } from "./story";
import { Phone } from "./phone";
import { SKY } from "./sky";
import { ProspectCard } from "./whatsapp-web";

type Feature = { pain: string; title: string; text: string; visual: ReactNode; tint: string; pose: Pose };

/* Soft brand gradients for the cards, like the coloured panels on the dots page. */
const TINTS = {
  teal: "bg-[linear-gradient(140deg,#d8f5ee_0%,#8ad8c8_55%,#3fae9c_100%)]",
  peach: "bg-[linear-gradient(140deg,#fff0e2_0%,#fbc9a3_60%,#f19463_100%)]",
  mint: "bg-[linear-gradient(140deg,#eefaf6_0%,#bfe9df_55%,#86d1c1_100%)]",
  sand: "bg-[linear-gradient(140deg,#fff7e8_0%,#f8deb4_55%,#efb57a_100%)]",
  sea: "bg-[linear-gradient(140deg,#e3f6fb_0%,#a9dfe6_55%,#5fbcc4_100%)]",
  coral: "bg-[linear-gradient(140deg,#ffe9df_0%,#f9b493_55%,#e8784a_100%)]",
};

const features: Feature[] = [
  {
    pain: "Hoy: cada respuesta se escribe de cero.",
    title: "Te sopla la respuesta",
    text: "Abrís el chat de un interesado y MARQui ya lo leyó. Te deja tres respuestas con el tono de MARQ: tocás una, la ajustás si querés y la mandás vos, con tu nombre.",
    visual: <RepliesVisual />,
    tint: TINTS.teal,
    pose: "guino",
  },
  {
    pain: "Hoy: lo que busca cada persona se pierde en el chat.",
    title: "Conoce a cada interesado",
    text: "Mientras charlan, MARQui anota qué proyecto le interesa, qué busca, cómo piensa pagar y en qué etapa está. Si falta un dato, lo pregunta dentro de una respuesta. Nunca una encuesta.",
    visual: <CardVisual />,
    tint: TINTS.peach,
    pose: "pensando",
  },
  {
    pain: "Hoy: un cliente que vuelve puede pasar desapercibido.",
    title: "Te avisa solo lo importante",
    text: "Un resumen cada mañana y un aviso al instante cuando vuelve un cliente, reaparece alguien después de un mes o llega un referido. Nada de una notificación por consulta.",
    visual: (
      <Phone
        messages={[
          { kind: "day", text: "Hoy" },
          { kind: "in", time: "9:00", text: <><b>☀️ Buen día. Ayer:</b><br />23 consultas · 4 sin responder<br />2 nuevos interesados</> },
          { kind: "in", time: "11:14", text: <><b>🔁 Reaparece:</b> Marta Ríos volvió a escribir después de 40 días. Pregunta por la 3B.</> },
          { kind: "in", time: "12:02", text: <><b>⭐ Cliente:</b> Pablo Sosa, que invirtió en Torre Natalini, consulta por lotes.</> },
        ]}
      />
    ),
    tint: TINTS.mint,
    pose: "sorpresa",
  },
  {
    pain: "Hoy: para saber un número hay que revisar chat por chat.",
    title: "Le preguntás lo que necesites",
    text: "«¿Cuántas consultas trajo Collection esta semana?». «Pasame los que buscan invertir». Le escribís como a un compañero y te contesta con datos, o con la lista lista en Excel.",
    visual: (
      <Phone
        messages={[
          { kind: "out", time: "17:40", text: "¿Cuántas consultas hubo por MARQ Collection esta semana?" },
          { kind: "in", time: "17:40", text: <><b>41 de 112</b> (37%). 9 ya son interesados y 2 reservaron.</> },
          { kind: "out", time: "17:41", text: "Pasame los interesados que buscan invertir" },
          { kind: "file", from: "in", name: "Interesados · Collection.xlsx", meta: "9 contactos · Excel", type: "xlsx", time: "17:41" },
        ]}
      />
    ),
    tint: TINTS.sand,
    pose: "alegria",
  },
  {
    pain: "Hoy: lo que sabe el equipo vive en la cabeza de cada uno.",
    title: "Aprende cómo trabaja MARQ",
    text: "MARQui aprende de las charlas, de los documentos que ya tienen y de lo que le contás. Nadie tiene que cargar nada en otro sistema.",
    visual: <LearnVisual />,
    tint: TINTS.sea,
    pose: "derecha",
  },
  {
    pain: "Hoy: fuera de la oficina, la consulta espera.",
    title: "También en el celular",
    text: "MARQui es un contacto más de WhatsApp. Le reenviás el mensaje de un cliente desde el celular de la línea y te devuelve las tres respuestas.",
    visual: (
      <Phone
        messages={[
          { kind: "out", forwarded: true, time: "19:05", text: "Hola, ¿los lotes de Fontana tienen financiación?" },
          { kind: "in", time: "19:05", text: <><b>1.</b> ¡Hola! Sí, financiamos hasta 36 cuotas en pesos. ¿Te paso el plano con los lotes disponibles?</> },
          { kind: "in", time: "19:05", text: <><b>2.</b> ¡Sí! Anticipo del 30% y el resto en cuotas. ¿Lo pensás para construir ya o como inversión?</> },
          { kind: "in", time: "19:05", text: <><b>3.</b> Sí, tenemos financiación propia. ¿Te llamo mañana y lo vemos?</> },
        ]}
        stagger={0.35}
      />
    ),
    tint: TINTS.coral,
    pose: "inclinado",
  },
];

export function Functions() {
  return (
    <Section sky={SKY.noon} id="funciones" className="py-28 sm:py-40" aria-labelledby="funciones-title">
      <Lead id="funciones-title" title={["Empezá con MARQui"]}>
        Pensá en MARQui como un compañero que trabaja al lado tuyo en WhatsApp. Lee cada consulta, conoce los proyectos de MARQ y te deja todo listo para que vos decidas.
      </Lead>

      <Whisper />

      <div className="mx-auto mt-24 grid max-w-[84rem] gap-24 sm:gap-32">
        {features.map((f, i) => (
          <article key={f.title} className="grid items-center gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-16">
            <FadeUp className={cn(i % 2 === 1 && "lg:order-2")}>
              <div className={cn("relative grid min-h-[30rem] place-items-center overflow-hidden rounded-[2.5rem] p-6 sm:p-12", f.tint)}>
                {f.visual}
                {/* MARQui lives in the corner of each card, reacting to what it shows. */}
                <div className={cn("pointer-events-none absolute bottom-5 w-[clamp(4.5rem,8vw,7.5rem)]", i % 2 === 1 ? "right-6" : "left-6")}>
                  <MarquiLive pose={f.pose} shadow={false} className="drop-shadow-[0_1rem_1.5rem_rgb(1_30_27/0.25)]" />
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.1} className={cn("grid gap-4", i % 2 === 1 && "lg:order-1")}>
              <p className="w-fit rounded-full bg-ink/85 px-4 py-1.5 text-[clamp(0.92rem,1.05vw,1.05rem)] text-white/85">{f.pain}</p>
              <h3 className="display sky-type text-[clamp(2rem,3.4vw,3.6rem)]">{f.title}</h3>
              <p className="sky-type text-[clamp(1.1rem,1.45vw,1.5rem)] font-medium leading-[1.45] text-white/90">{f.text}</p>
            </FadeUp>
          </article>
        ))}
      </div>
    </Section>
  );
}

/** «Psst… mandale la segunda»: MARQui on the left, whispering; what he is, on the right. */
function Whisper() {
  const [pose, setPose] = useState<Pose>("guino");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seq: [Pose, number][] = [["guino", 2600], ["reposo", 1400], ["parpadeo", 140], ["reposo", 900], ["derecha", 1100], ["reposo", 700]];
    let i = 0;
    let t = 0;
    const next = () => {
      const [p, ms] = seq[i++ % seq.length]!;
      setPose(p);
      t = window.setTimeout(next, ms);
    };
    next();
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="mx-auto mt-16 grid max-w-[78rem] items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
      <FadeUp className="relative mx-auto w-full max-w-[28rem]">
        <div className="relative pt-[22%]">
          <MarquiLive pose={pose} follow className="w-[66%]" />
          <span className="paper absolute left-[42%] top-[6%] whitespace-nowrap rounded-[1.4rem] rounded-bl-md max-sm:max-w-[58%] max-sm:whitespace-normal px-5 py-3.5 text-[clamp(1.05rem,1.4vw,1.45rem)] font-medium text-ink shadow-[0_1rem_2rem_-1rem_rgb(1_30_27/0.4)]">
            Psst… mandale la segunda 😉
          </span>
        </div>
      </FadeUp>
      <FadeUp delay={0.15} className="paper grid gap-5 rounded-[2rem] p-8 sm:p-10">
        <h3 className="text-[clamp(1.6rem,2.4vw,2.6rem)] font-medium leading-tight tracking-[-0.025em]">¿Qué es MARQui?</h3>
        <p className="text-[clamp(1.1rem,1.4vw,1.45rem)] leading-[1.45] text-ink-2">
          Un asistente con inteligencia artificial para el equipo de MARQ. Vive en el WhatsApp que ya usan: lee las consultas de las dos líneas y le sopla la respuesta a quien atiende.
        </p>
        <p className="text-[clamp(1.1rem,1.4vw,1.45rem)] leading-[1.45] text-ink-2">
          No le habla al cliente. No hace encuestas. <b className="text-ink">El que responde siempre es una persona.</b>
        </p>
      </FadeUp>
    </div>
  );
}

/* ——— Visuals ——— */

function RepliesVisual() {
  const reduce = useReducedMotion();
  const replies = [
    "¡Hola Juan! En MARQ Collection hay de 1, 2 y 3 dormitorios desde USD 68.000. ¿Cuántos dormitorios buscás?",
    "¡Hola Juan! Los valores arrancan en USD 68.000, con anticipo y cuotas. ¿Lo pensás para vivir o para invertir?",
    "¡Hola Juan! Te paso la lista con valores y disponibilidad. ¿Te viene bien una llamada corta hoy?",
  ];
  return (
    <div className="w-full max-w-[34rem] overflow-hidden rounded-[1.25rem] bg-white shadow-[0_2rem_4rem_-1.5rem_rgb(1_30_27/0.35)]">
      <div className="wa-paper px-5 py-6">
        <div className="w-fit rounded-[0.6rem] rounded-tl-none bg-white px-3 py-2 text-[1rem] shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">
          precio? <span className="ml-2 text-[0.7rem] text-black/45">10:30</span>
        </div>
      </div>
      <div className="grid gap-2 bg-teal-soft p-3">
        <span className="flex items-center gap-2 px-1 text-[0.85rem] font-semibold text-ink">
          <MarquiAvatar className="size-6" /> MARQui sugiere
        </span>
        {replies.map((r, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease }}
            className={cn("rounded-xl border-2 bg-white p-3 text-[0.92rem] leading-snug text-ink-2", i === 1 ? "border-teal shadow-[0_0_0_4px_rgb(0_140_126/0.16)]" : "border-transparent shadow-[0_1px_3px_rgb(6_35_31/0.12)]")}
          >
            {r}
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-wa-panel px-3 py-2.5 text-[0.85rem] text-ink-3">
        <PenLine className="size-4" /> Se escribe en tu cuadro de texto · la enviás vos
      </div>
    </div>
  );
}

function CardVisual() {
  const reduce = useReducedMotion();
  const steps = ["Consultó", "Interesado", "Reservó"];
  return (
    <div className="grid w-full max-w-[34rem] gap-5">
      <div className="overflow-hidden rounded-[1.25rem] bg-white shadow-[0_2rem_4rem_-1.5rem_rgb(1_30_27/0.35)]">
        <div className="flex items-center gap-3 border-b border-black/[0.07] bg-wa-panel px-4 py-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#c7d3e6] to-[#9fb3d4] font-semibold text-white">M</span>
          <b className="text-[1rem]">Marta Ríos</b>
        </div>
        <ProspectCard card={{ proyecto: "MARQ Collection", busca: "3 dorm · vivir", etapa: "Interesado", marca: "Reaparece · 40 días" }} className="py-3" />
        <div className="wa-paper grid gap-2 px-5 py-5">
          <div className="ml-auto w-fit max-w-[88%] rounded-[0.6rem] rounded-tr-none bg-wa-bubble px-3 py-2 text-[0.92rem] leading-snug shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">
            ¡Qué bueno que volviste, Marta! La 3B sigue disponible. <mark className="rounded bg-sun/60 px-0.5 text-ink">¿La pensás con crédito o de contado?</mark>
          </div>
          <p className="ml-auto text-right text-[0.8rem] font-medium text-ink-3">Falta un dato: va dentro de la respuesta, como una pregunta normal.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2" aria-label="Etapas">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease }}
            className={cn("flex items-center justify-center gap-2 rounded-full px-3 py-3 text-[0.95rem] font-semibold", i === 1 ? "bg-ink text-white" : "bg-white text-ink-2")}
          >
            {s}
            {i < 2 && <ArrowRight className="size-4 opacity-50 max-sm:hidden" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LearnVisual() {
  const reduce = useReducedMotion();
  const sources = [
    { icon: MessagesSquare, title: "Las conversaciones", text: "Los últimos 180 días de chats de las dos líneas" },
    { icon: FileSpreadsheet, title: "Los documentos", text: "Lista de precios, folletos y la web" },
    { icon: BookOpen, title: "Lo que le contás", text: "«Collection ahora financia en 36 cuotas»" },
  ];
  return (
    <div className="grid w-full max-w-[34rem] gap-3">
      {sources.map((s, i) => (
        <motion.div
          key={s.title}
          initial={reduce ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease }}
          className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_1rem_2rem_-1rem_rgb(1_30_27/0.3)]"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-soft text-blue">
            <s.icon className="size-6" />
          </span>
          <span className="leading-snug">
            <b className="block text-[1.1rem] text-ink">{s.title}</b>
            <span className="text-[0.95rem] text-ink-3">{s.text}</span>
          </span>
        </motion.div>
      ))}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.75, ease }}
        className="flex items-start gap-3 rounded-2xl bg-ink p-4 text-white"
      >
        <MarquiAvatar tone="light" className="size-10" />
        <p className="text-[1rem] leading-snug">
          Anotado. Antes decía <b>24 cuotas</b>. ¿Reemplazo el dato por <b>36 cuotas</b>?
        </p>
      </motion.div>
    </div>
  );
}
