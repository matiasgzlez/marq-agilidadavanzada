import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BookOpen, FileSpreadsheet, MessagesSquare, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeUp, Kicker, MarquiAvatar, RiseLines, Section, ease } from "./primitives";
import { Steps } from "./reveal";
import { Phone } from "./phone";
import { SKY } from "./sky";
import { ProspectCard } from "./whatsapp-web";

type Feature = { n: string; title: ReactNode; text: ReactNode; points: string[]; visual: ReactNode };

const features: Feature[] = [
  {
    n: "1",
    title: "Te propone tres respuestas.",
    text: "Abrís el chat de un interesado y MARQui ya leyó lo que escribió. Te ofrece tres respuestas con el tono de MARQ.",
    points: ["Tocás una y se escribe sola", "La corregís si querés", "La enviás vos, con tu nombre"],
    visual: <RepliesVisual />,
  },
  {
    n: "2",
    title: "Arma la tarjeta de cada interesado.",
    text: "Mientras charlan, MARQui anota qué proyecto le interesa, qué busca, cómo piensa pagar y en qué etapa está. Sin encuestas.",
    points: ["Si falta un dato, lo pregunta dentro de una respuesta", "Marca a clientes, referidos y a quien vuelve", "Tres etapas: Consultó, Interesado, Reservó"],
    visual: <CardVisual />,
  },
  {
    n: "3",
    title: "Te avisa solo lo importante.",
    text: "Nada de una notificación por consulta. Un resumen cada mañana y un aviso al instante solo cuando vale la pena.",
    points: ["Un cliente que ya invirtió vuelve a consultar", "Alguien reaparece después de 30 días", "Llega un referido de un cliente"],
    visual: (
      <Phone
        messages={[
          { kind: "day", text: "Hoy" },
          { kind: "in", time: "9:00", text: <><b>☀️ Buen día. Ayer:</b><br />23 consultas · 4 sin responder<br />2 nuevos interesados</> },
          { kind: "in", time: "11:14", text: <><b>🔁 Reaparece:</b> Marta Ríos volvió a escribir después de 40 días. Pregunta por la 3B de MARQ Collection.</> },
          { kind: "in", time: "12:02", text: <><b>⭐ Cliente:</b> Pablo Sosa, que invirtió en Torre Natalini, consulta por lotes.</> },
        ]}
      />
    ),
  },
  {
    n: "4",
    title: "Le preguntás lo que necesites.",
    text: "¿Cuántas consultas trajo un proyecto? ¿A quién invitar a un evento? Le escribís como a un compañero y te responde con datos.",
    points: ["Números al instante", "Listas listas para difundir, en Excel", "Reportes semanales y mensuales en PDF"],
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
  },
  {
    n: "5",
    title: "Aprende cómo trabaja MARQ.",
    text: "MARQui aprende de tres fuentes y se mantiene al día. El equipo no tiene que cargar nada en otro sistema.",
    points: ["Si algo nuevo contradice lo que sabía, pregunta antes", "Aprende de cada respuesta que elegís o corregís"],
    visual: <LearnVisual />,
  },
  {
    n: "6",
    title: "También en el celular.",
    text: "MARQui es un contacto más de WhatsApp. Le reenviás el mensaje de un cliente y te devuelve las tres respuestas.",
    points: ["Funciona desde el celular de cada línea", "Le podés hablar con texto o audio"],
    visual: (
      <Phone
        messages={[
          { kind: "out", forwarded: true, time: "19:05", text: "Hola, ¿los lotes de Fontana tienen financiación?" },
          { kind: "in", time: "19:05", text: <><b>1.</b> ¡Hola! Sí, financiamos hasta 36 cuotas en pesos. ¿Te paso el plano con los lotes disponibles?</> },
          { kind: "in", time: "19:05", text: <><b>2.</b> ¡Sí! Anticipo del 30% y el resto en cuotas. ¿Lo pensás para construir ya o como inversión?</> },
          { kind: "in", time: "19:05", text: <><b>3.</b> Sí, tenemos financiación propia. ¿Te queda bien que te llame mañana y lo vemos?</> },
        ]}
        stagger={0.35}
      />
    ),
  },
];

export function Functions() {
  return (
    <Section sky={SKY.noon} id="funciones" className="py-28 sm:py-40" aria-labelledby="funciones-title">
      <div className="mx-auto max-w-[90rem]">
        <Kicker n="02">Qué hace</Kicker>
        <RiseLines id="funciones-title" lines={["Seis cosas que hace", <em key="e">por el equipo.</em>]} className="display sky-type mt-6 text-[clamp(2.2rem,5.8vw,7.4rem)]" />

        <div className="mt-16 grid gap-6 sm:gap-8">
          {features.map((f, i) => (
            <FadeUp key={f.n}>
              <article className="paper grid overflow-hidden rounded-[2rem] lg:grid-cols-[1fr_1.05fr]">
                <div className={cn("flex flex-col justify-center p-7 sm:p-12 xl:p-16", i % 2 === 1 && "lg:order-2")}>
                  <span className="font-display text-[clamp(2.4rem,4vw,4.4rem)] font-bold leading-none tracking-[-0.03em] text-blue">{f.n}</span>
                  <h3 className="mt-5 font-display text-[clamp(1.45rem,2.5vw,2.7rem)] font-bold leading-[1.02] tracking-[-0.03em] text-balance">{f.title}</h3>
                  <p className="mt-5 max-w-[34rem] text-[clamp(1.1rem,1.45vw,1.45rem)] leading-[1.45] text-ink-2">{f.text}</p>
                  <Steps as="ul" className="mt-7 grid gap-3" gap={0.18}>
                    {f.points.map((p) => (
                      <li data-step key={p} className="flex items-start gap-3 text-[clamp(1.02rem,1.25vw,1.25rem)] font-medium text-ink">
                        <span className="mt-[0.55em] size-2 shrink-0 rounded-full bg-teal" />
                        {p}
                      </li>
                    ))}
                  </Steps>
                </div>
                <div className="relative grid min-h-[26rem] place-items-center overflow-hidden bg-[linear-gradient(160deg,#e3f4ef,#fbe2d0)] p-6 sm:p-10">{f.visual}</div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </Section>
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
