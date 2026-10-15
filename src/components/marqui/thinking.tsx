import { Lightbulb, Search, StickyNote, Target, Users, ArrowRight } from "lucide-react";
import { FadeUp, Kicker, MarqLogo, Section } from "./primitives";
import { Lead } from "./story";
import { Steps } from "./reveal";
import { SKY } from "./sky";

/* ——— Clustering / Diagrama de afinidad ———
   The sticky-note data from the actual interview, grouped into the four
   clusters that emerged from the exercise. Each note is one idea, one card. */

type Cluster = {
  name: string;
  /** Tailwind colour classes: bg for the card header, text for the label. */
  bg: string;
  accent: string;
  border: string;
  notes: string[];
};

const clusters: Cluster[] = [
  {
    name: "Responder consultas",
    bg: "bg-[#fce4e4]",
    accent: "text-[#b91c1c]",
    border: "border-[#f5c6c6]",
    notes: [
      "Quizás tenés seis contactos hasta que concretás una venta.",
      "Se dio de baja el chatbot, mejores resultados de manera manual.",
      "Mucha gente pide rápido la información, y no escribe mucho.",
      "Hablar manualmente con el cliente es demasiado trabajo.",
      "Todavía no encuentran cómo clasificar quién es un cliente interesado, o más potencial que otros.",
      "Siempre todo por mensaje, las consultas.",
      "Ella quiere poder contactar y poder consultar con la persona para poder explicarle y saber su objetivo.",
      "A los clientes no les gustaba hablar con un chatbot.",
      "Es muy difícil reconocer la conversación con el cliente una vez que no le contestó.",
      "2 grandes clientes: consumidores finales e inversores.",
    ],
  },
  {
    name: "Reconocimiento de MarQ",
    bg: "bg-[#dce8f8]",
    accent: "text-[#1e40af]",
    border: "border-[#c0d4f0]",
    notes: [
      "¿Cómo llegar al público? Diario, redes?",
      "Pocos saben quién está detrás del proyecto.",
      "Cada proyecto tiene identidad propia.",
      "Quieren mejorar la comunicación con el cliente, mostrar la trayectoria de MARQ y generar confianza.",
      "Necesitan mayor visibilidad para generar confianza.",
    ],
  },
  {
    name: "Página Web",
    bg: "bg-[#d4f5e0]",
    accent: "text-[#166534]",
    border: "border-[#b0e6c6]",
    notes: [
      "Tienen que llamar a un proveedor externo y ese proceso es demasiado lento (el de su página web).",
      "No logramos enlazar la página, para que vos puedas señar, hacer una reserva, y demás.",
      "Página web: solamente puedo editar los precios y cargar una nueva unidad o dar de baja. Y cargar fotos, muy básico.",
      "No dependo para bajar o subir una propuesta del programador, pero para la landing y armar un proyecto nuevo, necesito de él.",
      "Le da mucha pereza tener que entrar al web, dar de alta y de baja nuevos proyectos, prefiere que sea fácil de enlazar.",
      "Y dijo que no conviene publicar todos los precios, por eso hay ciertas cosas que uno puede poner y otras que no.",
    ],
  },
  {
    name: "Procesos internos",
    bg: "bg-[#fef9c3]",
    accent: "text-[#854d0e]",
    border: "border-[#fde68a]",
    notes: [
      "Demoran en la etapa de la documentación.",
      "Utilizan Trello pero no todos quieren usarlo (silos de información).",
      "Es difícil que todo el equipo use un software determinado, hay personas que no quieren cargar más información (silos de información).",
      "Tienen un no sé qué donde todos los proyectos tienen mucha información pero no tienen datos rápidos.",
    ],
  },
];

/** One sticky note. */
function StickyNoteCard({ text, index }: { text: string; index: number }) {
  // Alternate between slight rotations for a natural, hand-placed feel.
  const rotations = ["-1.2deg", "0.8deg", "-0.5deg", "1.1deg", "-0.9deg", "0.4deg", "-1.5deg", "0.6deg"];
  const rotation = rotations[index % rotations.length];
  return (
    <div
      className="rounded-xl bg-[#fef08a] p-4 text-[clamp(0.92rem,1.1vw,1.15rem)] font-medium leading-snug text-[#422006] shadow-[2px_2px_8px_rgb(0_0_0/0.12)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[2px_4px_14px_rgb(0_0_0/0.18)]"
      style={{ transform: `rotate(${rotation})` }}
    >
      {text}
    </div>
  );
}

/** One cluster: a titled area with its sticky notes. */
function ClusterGroup({ cluster }: { cluster: Cluster }) {
  return (
    <div className={`rounded-2xl ${cluster.bg} p-5 ring-1 ${cluster.border} sm:p-6`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h4 className={`text-base font-bold uppercase tracking-wider ${cluster.accent}`}>
          {cluster.name}
        </h4>
        <span className={`rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-semibold ${cluster.accent}`}>
          {cluster.notes.length} notas
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cluster.notes.map((note, i) => (
          <StickyNoteCard key={i} text={note} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ——— Clustering: intro cards ——— */

const clusteringIntroCards = [
  {
    icon: Search,
    eyebrow: "Qué es",
    text: "Consiste en volcar toda la información obtenida en notas sueltas —una idea por nota— y agruparlas por parecido hasta que aparecen patrones. Después se le pone a cada grupo un nombre que resuma lo que dice.",
  },
  {
    icon: StickyNote,
    eyebrow: "Por qué la elegimos",
    text: "La entrevista duró una hora y tocó decenas de temas: servicios, clientes, fideicomisos, herramientas, obras, inmobiliarias, contexto económico. Sin un método para ordenar todo eso, elegir un problema habría sido arbitrario. Esta técnica fue la que nos permitió darnos cuenta de que el problema no estaba donde lo esperábamos.",
  },
];

/* ——— Personas ———
   Profiles representing the real users contacting MARQ. */

type PersonaSection = {
  label: string;
  text: string;
};

type Persona = {
  initial: string;
  name: string;
  age: number;
  subtitle: string;
  quote: string;
  sections: PersonaSection[];
};

const personas: Persona[] = [
  {
    initial: "R",
    name: "Roberto",
    age: 58,
    subtitle: "El inversor que ya confía",
    quote: '"Anotame, ya los conozco."',
    sections: [
      {
        label: "Quién es",
        text: "Invirtió con MARQ desde los primeros edificios. Busca resguardar ahorros en ladrillo.",
      },
      {
        label: "Qué le importa",
        text: "Rentabilidad, entrar primero a la preventa, elegir las mejores unidades.",
      },
      {
        label: "Qué le molesta",
        text: "Ser tratado como un desconocido que vio un anuncio.",
      },
      {
        label: "Qué necesita de MARQ",
        text: "Prioridad y trato directo.",
      },
    ],
  },
  {
    initial: "L",
    name: "Lucía",
    age: 41,
    subtitle: "La inversora que llega por primera vez",
    quote: '"¿Y si el edificio no se termina?"',
    sections: [
      {
        label: "Quién es",
        text: "Profesional con ahorros. Vio el anuncio. No conoce a MARQ.",
      },
      {
        label: "Qué le importa",
        text: "Rentabilidad, forma de pago y seriedad del desarrollador.",
      },
      {
        label: "Qué le molesta",
        text: "La mala fama del fideicomiso; que la presionen o que la olviden.",
      },
      {
        label: "Cómo decide",
        text: "Consulta al contador, piensa semanas, necesita varios contactos.",
      },
      {
        label: "Qué necesita de MARQ",
        text: "Pruebas de trayectoria y un seguimiento constante.",
      },
    ],
  },
  {
    initial: "M",
    name: "Marta",
    age: 63,
    subtitle: "La que compra para vivir",
    quote: '"Contame todo, desde acá hasta acá."',
    sections: [
      {
        label: "Quién es",
        text: "Persona mayor o familia que busca su vivienda. Prefiere el teléfono.",
      },
      {
        label: "Qué le importa",
        text: "Entender cada detalle: qué incluye, cómo es la unidad, cómo se paga.",
      },
      {
        label: "Qué le molesta",
        text: "Hablar con una máquina; sentirse apurada.",
      },
      {
        label: "Cómo decide",
        text: "En familia, con tiempo.",
      },
      {
        label: "Qué necesita de MARQ",
        text: "Una persona con nombre y paciencia para varias conversaciones.",
      },
    ],
  },
  {
    initial: "T",
    name: "Tomás",
    age: 29,
    subtitle: "El joven profesional que hoy no llega",
    quote: '"Me encanta, pero no me dan crédito."',
    sections: [
      {
        label: "Quién es",
        text: "Quiere dejar de alquilar. Consulta con entusiasmo.",
      },
      {
        label: "Qué le importa",
        text: "Una cuota accesible.",
      },
      {
        label: "Situación",
        text: "Interés real, capacidad de pago actual baja (caso Casas BDN: 500 consultas).",
      },
      {
        label: "Por qué importa",
        text: "Genera muchas consultas y pocas ventas hoy; sin clasificar, consume el tiempo que otros necesitan.",
      },
      {
        label: "Qué necesita de MARQ",
        text: "Honestidad temprana y quedar en contacto para el futuro.",
      },
    ],
  },
];

/* ——— Personas: intro cards ——— */

const personasIntroCards = [
  {
    icon: Users,
    eyebrow: "Qué es",
    text: "Es la construcción de perfiles ficticios pero representativos de los usuarios, con nombre, contexto, objetivos, frustraciones y forma de decidir. Sirve para dejar de hablar de «el cliente» en abstracto.",
  },
  {
    icon: Target,
    eyebrow: "Por qué la elegimos",
    text: "El núcleo del problema es que MARQ no puede distinguir entre quienes le escriben. Personas es exactamente la técnica que formaliza esas diferencias. Además tiene un valor práctico directo: los criterios que distinguen a cada Persona se convierten, casi sin cambios, en las reglas para clasificar las consultas en la propuesta final.",
  },
];

/** One Persona card rendered faithful to the team board. */
function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <div className="rounded-2xl bg-[#faf8f5] p-6 sm:p-7 border border-[#e2d7c7] shadow-[0_2px_12px_rgb(0_0_0/0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgb(0_0_0/0.08)] flex flex-col justify-between">
      <div>
        {/* Header: Avatar + Title + Quote */}
        <div className="flex items-start gap-4">
          <div className="grid size-12 sm:size-14 place-items-center rounded-full bg-[#272422] text-[#faf8f5] text-lg sm:text-xl font-bold shrink-0 shadow-sm">
            {persona.initial}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[clamp(1.12rem,1.3vw,1.32rem)] font-bold tracking-tight text-[#693e1b] leading-tight">
              {persona.name}, {persona.age} · {persona.subtitle}
            </h4>
            <p className="mt-1 text-[clamp(0.92rem,1.05vw,1.05rem)] italic text-[#4a3b32]">
              {persona.quote}
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="mt-6 space-y-4">
          {persona.sections.map((sec, idx) => (
            <div key={idx}>
              <span className="block font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[#8a5d2b]">
                {sec.label}
              </span>
              <p className="mt-0.5 text-[clamp(0.9rem,1.02vw,1.02rem)] leading-snug text-[#2b2725]">
                {sec.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ——— Main panel ——— */

export function ThinkingPanel({ onGoToSolution }: { onGoToSolution?: () => void }) {
  return (
    <div id="panel-thinking" role="tabpanel" aria-label="Design thinking">
      {/* ── Hero ── */}
      <Section sky={SKY.noon} id="dt-intro" className="pb-20 pt-32 sm:pb-28 sm:pt-40" aria-labelledby="dt-title">
        <Lead id="dt-title" title={["El proceso", <em key="e">detrás de MARQui.</em>]}>
          Las técnicas de Design Thinking que usamos para entender el problema antes de pensar en la solución.
        </Lead>
      </Section>

      {/* ── 1. Clustering section ── */}
      <Section sky={SKY.noon} id="clustering" className="pb-28 sm:pb-36" aria-labelledby="clustering-title">
        <div className="mx-auto max-w-[84rem]">
          {/* Section header: Clustering */}
          <div className="text-center">
            <Kicker n="1" className="justify-center">Técnica de Design Thinking</Kicker>
            <h2 id="clustering-title" className="display sky-type mt-4 text-[clamp(2.5rem,5.5vw,5rem)] text-white">
              Clustering
            </h2>
          </div>

          {/* 1. Cards: Qué es y Por qué la elegimos */}
          <Steps className="mx-auto mt-12 grid gap-6 md:grid-cols-2" gap={0.18}>
            {clusteringIntroCards.map((item) => (
              <article key={item.eyebrow} data-step className="paper rounded-[2rem] p-8 sm:p-10 flex flex-col justify-start">
                <div className="flex items-center gap-3.5">
                  <div className="grid size-12 place-items-center rounded-2xl bg-teal-soft text-teal">
                    <item.icon className="size-6" />
                  </div>
                  <span className="eyebrow text-blue text-sm tracking-widest">{item.eyebrow}</span>
                </div>
                <p className="mt-5 text-[clamp(1.15rem,1.4vw,1.45rem)] leading-relaxed text-ink-2">{item.text}</p>
              </article>
            ))}
          </Steps>

          {/* 2. La ejecución (el board con las notas agrupadas) */}
          <FadeUp delay={0.2}>
            <div className="mt-20">
              <div className="mb-8 text-center">
                <span className="eyebrow text-xs tracking-widest text-white/70 uppercase">Paso a paso</span>
                <h3 className="display sky-type mt-2 text-[clamp(2.2rem,4.2vw,3.8rem)] text-white">
                  La ejecución
                </h3>
              </div>
              <div className="paper overflow-hidden rounded-[2rem] p-6 sm:p-9 lg:p-11">
                {/* Highlight banner */}
                <div className="mb-8 flex items-start gap-3.5 rounded-2xl bg-teal-soft p-5 border border-teal/20">
                  <Lightbulb className="mt-0.5 size-6 shrink-0 text-teal" />
                  <p className="text-[clamp(1.05rem,1.25vw,1.3rem)] leading-relaxed text-ink-2">
                    <strong className="text-ink font-semibold">«Responder consultas»</strong> concentra la mayor cantidad de notas (10 notas) y las tensiones más críticas de la entrevista. Fue el cluster que definió el problema a resolver.
                  </p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  {clusters.map((cluster) => (
                    <ClusterGroup key={cluster.name} cluster={cluster} />
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* 3. Card de los resultados de la técnica */}
          <FadeUp delay={0.2}>
            <div className="mt-20">
              <div className="mb-8 text-center">
                <span className="eyebrow text-xs tracking-widest text-white/70 uppercase">Conclusión</span>
                <h3 className="display sky-type mt-2 text-[clamp(2.2rem,4.2vw,3.8rem)] text-white">
                  Los resultados
                </h3>
              </div>
              <article className="paper relative overflow-hidden rounded-[2rem] p-8 sm:p-12 border-2 border-teal/25">
                <div className="flex items-center gap-4 mb-8">
                  <div className="grid size-14 place-items-center rounded-2xl bg-teal-soft text-teal shrink-0">
                    <Lightbulb className="size-7" />
                  </div>
                  <div>
                    <span className="eyebrow text-blue text-xs sm:text-sm tracking-widest block font-semibold">Hallazgo clave</span>
                    <h4 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">Qué obtuvimos de la técnica</h4>
                  </div>
                </div>

                <p className="text-[clamp(1.15rem,1.45vw,1.45rem)] leading-relaxed text-ink-2">
                  Al agrupar las notas aparecieron cuatro clusters —<span className="font-semibold text-ink">Responder consultas</span>, <span className="font-semibold text-ink">Reconocimiento de MARQ</span>, <span className="font-semibold text-ink">Página Web</span> y <span className="font-semibold text-ink">Procesos internos</span>—, pero el hallazgo clave fue que el grupo más denso y con más tensiones era <strong className="text-ink font-semibold">«Responder consultas»</strong>: el equipo maneja todo por mensaje, hablar con cada cliente es demasiado trabajo, no logran distinguir quién está realmente interesado y cuando probaron un chatbot los clientes se dieron de baja.
                </p>
                <p className="mt-5 text-[clamp(1.15rem,1.45vw,1.45rem)] leading-relaxed text-ink-2">
                  El problema estaba en ese <strong className="text-ink font-semibold">cuello de botella diario</strong>: responder rápido, con información precisa, sin perder el trato humano y sin poder clasificar a los prospectos.
                </p>
              </article>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* ── 2. Personas section ── */}
      <Section sky={SKY.noon} id="personas" className="pb-28 sm:pb-36" aria-labelledby="personas-title">
        <div className="mx-auto max-w-[84rem]">
          {/* Section header: Personas */}
          <div className="text-center">
            <Kicker n="2" className="justify-center">Técnica de Design Thinking</Kicker>
            <h2 id="personas-title" className="display sky-type mt-4 text-[clamp(2.5rem,5.5vw,5rem)] text-white">
              Personas
            </h2>
          </div>

          {/* 1. Cards: Qué es y Por qué la elegimos */}
          <Steps className="mx-auto mt-12 grid gap-6 md:grid-cols-2" gap={0.18}>
            {personasIntroCards.map((item) => (
              <article key={item.eyebrow} data-step className="paper rounded-[2rem] p-8 sm:p-10 flex flex-col justify-start">
                <div className="flex items-center gap-3.5">
                  <div className="grid size-12 place-items-center rounded-2xl bg-teal-soft text-teal">
                    <item.icon className="size-6" />
                  </div>
                  <span className="eyebrow text-blue text-sm tracking-widest">{item.eyebrow}</span>
                </div>
                <p className="mt-5 text-[clamp(1.15rem,1.4vw,1.45rem)] leading-relaxed text-ink-2">{item.text}</p>
              </article>
            ))}
          </Steps>

          {/* 2. La ejecución (las 4 Personas del ejercicio) */}
          <FadeUp delay={0.2}>
            <div className="mt-20">
              <div className="mb-8 text-center">
                <span className="eyebrow text-xs tracking-widest text-white/70 uppercase">Paso a paso</span>
                <h3 className="display sky-type mt-2 text-[clamp(2.2rem,4.2vw,3.8rem)] text-white">
                  La ejecución
                </h3>
              </div>
              <div className="paper overflow-hidden rounded-[2rem] p-6 sm:p-9 lg:p-11">
                {/* Highlight banner */}
                <div className="mb-8 flex items-start gap-3.5 rounded-2xl bg-teal-soft p-5 border border-teal/20">
                  <Users className="mt-0.5 size-6 shrink-0 text-teal" />
                  <p className="text-[clamp(1.05rem,1.25vw,1.3rem)] leading-relaxed text-ink-2">
                    <strong className="text-ink font-semibold">«¿Cuánto sale?»</strong> Cuatro personas diferentes escriben exactamente la misma primera consulta, pero detrás de ese mensaje hay expectativas, temores y formas de decidir completamente opuestas.
                  </p>
                </div>

                {/* 2x2 grid of Personas */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {personas.map((persona) => (
                    <PersonaCard key={persona.name} persona={persona} />
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* 3. Card de los resultados de la técnica */}
          <FadeUp delay={0.2}>
            <div className="mt-20">
              <div className="mb-8 text-center">
                <span className="eyebrow text-xs tracking-widest text-white/70 uppercase">Conclusión</span>
                <h3 className="display sky-type mt-2 text-[clamp(2.2rem,4.2vw,3.8rem)] text-white">
                  Los resultados
                </h3>
              </div>
              <article className="paper relative overflow-hidden rounded-[2rem] p-8 sm:p-12 border-2 border-teal/25">
                <div className="flex items-center gap-4 mb-8">
                  <div className="grid size-14 place-items-center rounded-2xl bg-teal-soft text-teal shrink-0">
                    <Target className="size-7" />
                  </div>
                  <div>
                    <span className="eyebrow text-blue text-xs sm:text-sm tracking-widest block font-semibold">Hallazgo clave</span>
                    <h4 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mt-1">Qué obtuvimos de la técnica</h4>
                  </div>
                </div>

                <p className="text-[clamp(1.15rem,1.45vw,1.45rem)] leading-relaxed text-ink-2">
                  Construimos cuatro Personas representativas: <strong className="text-ink font-semibold">Roberto</strong>, el inversor que ya confía; <strong className="text-ink font-semibold">Lucía</strong>, la inversora que llega por primera vez; <strong className="text-ink font-semibold">Marta</strong>, que compra para vivir; y <strong className="text-ink font-semibold">Tomás</strong>, el joven profesional que hoy no llega.
                </p>
                <p className="mt-5 text-[clamp(1.15rem,1.45vw,1.45rem)] leading-relaxed text-ink-2">
                  El hallazgo más fuerte es que <strong className="text-ink font-semibold">los cuatro escriben el mismo primer mensaje —«¿cuánto sale?»— pero necesitan respuestas opuestas</strong>:
                </p>

                {/* Grid comparativo con las necesidades opuestas */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#faf8f5] p-5 border border-[#e2d7c7]/80">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-7 place-items-center rounded-full bg-[#272422] text-xs font-bold text-white">R</span>
                      <strong className="text-base font-bold text-[#693e1b]">Roberto</strong>
                    </div>
                    <p className="mt-2 text-[clamp(0.95rem,1.05vw,1.05rem)] text-ink-2 leading-relaxed">
                      Necesita <strong className="text-ink font-semibold">prioridad</strong> y trato directo. Entrar primero a la preventa y no ser tratado como un desconocido que vio un anuncio.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#faf8f5] p-5 border border-[#e2d7c7]/80">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-7 place-items-center rounded-full bg-[#272422] text-xs font-bold text-white">L</span>
                      <strong className="text-base font-bold text-[#693e1b]">Lucía</strong>
                    </div>
                    <p className="mt-2 text-[clamp(0.95rem,1.05vw,1.05rem)] text-ink-2 leading-relaxed">
                      Necesita <strong className="text-ink font-semibold">pruebas de que el edificio se va a terminar</strong>, demostración de seriedad y un seguimiento constante para vencer el temor al fideicomiso.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#faf8f5] p-5 border border-[#e2d7c7]/80">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-7 place-items-center rounded-full bg-[#272422] text-xs font-bold text-white">M</span>
                      <strong className="text-base font-bold text-[#693e1b]">Marta</strong>
                    </div>
                    <p className="mt-2 text-[clamp(0.95rem,1.05vw,1.05rem)] text-ink-2 leading-relaxed">
                      Necesita <strong className="text-ink font-semibold">tiempo y trato personal</strong>: una persona con nombre y paciencia para varias conversaciones, huyendo de máquinas y apuros.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#faf8f5] p-5 border border-[#e2d7c7]/80">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-7 place-items-center rounded-full bg-[#272422] text-xs font-bold text-white">T</span>
                      <strong className="text-base font-bold text-[#693e1b]">Tomás</strong>
                    </div>
                    <p className="mt-2 text-[clamp(0.95rem,1.05vw,1.05rem)] text-ink-2 leading-relaxed">
                      Necesita que le digan con <strong className="text-ink font-semibold">honestidad que hoy no es su momento</strong>, cuidando su entusiasmo y manteniéndolo en contacto para futuros proyectos accesibles.
                    </p>
                  </div>
                </div>

                {/* Practical value box */}
                <div className="mt-8 rounded-2xl bg-teal-soft/70 p-5 sm:p-6 border border-teal/20">
                  <p className="text-[clamp(1.05rem,1.25vw,1.3rem)] leading-relaxed text-ink-2">
                    <strong className="text-ink font-semibold">Valor práctico directo:</strong> Los criterios que distinguen a cada Persona se convierten, casi sin cambios, en las <strong className="text-ink font-semibold">reglas para clasificar las consultas</strong> en la propuesta final. MARQui utiliza estos perfiles para derivar, priorizar y calibrar el tono de cada respuesta comercial.
                  </p>
                </div>
              </article>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* ── Closing & Footer ── */}
      <footer className="relative -mx-4 flex flex-wrap items-center justify-between gap-3 bg-ink px-6 py-5 text-[0.95rem] text-white/75 sm:-mx-8 lg:-mx-12 lg:px-12">
        <MarqLogo className="h-7" />
        <span>Design Thinking · MARQui · Agilidad avanzada · 2026</span>
        {onGoToSolution ? (
          <button
            onClick={onGoToSolution}
            className="inline-flex items-center gap-1.5 font-medium text-white hover:text-teal-bright transition-colors cursor-pointer"
          >
            <span>Ver la solución: MARQui</span>
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <span>Casos y perfiles basados en entrevistas reales.</span>
        )}
      </footer>
    </div>
  );
}

