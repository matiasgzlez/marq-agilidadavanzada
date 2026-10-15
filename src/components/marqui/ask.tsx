import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { FileSpreadsheet, ListChecks, MessageCircle, Mic, Play, SendHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarquiAvatar, ease } from "./primitives";
import { BUBBLE, ChatHeader, ChatWindow, Composer, Cursor, Face, Tail, Time } from "./wa-kit";

const QUESTION = "Pasame los interesados que buscan invertir";

/* 0 idle · 1 recording · 2 audio sent · 3 MARQui typing · 4 the numbers · 5 you type · 6 sent · 7 typing · 8 the list · 9 the Excel */
const LAST = 9;

/**
 * Asking MARQui, in his WhatsApp Web chat. First by voice (it's how the team talks),
 * then by text. He answers with numbers you can read at a glance, and with a list
 * where every name opens its chat, plus the Excel.
 */
export function AskVisual() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.5 });
  const [step, setStep] = useState(reduce ? LAST : 0);
  const [aim, setAim] = useState<"mic" | "send" | null>(null);
  const [draft, setDraft] = useState("");
  const [secs, setSecs] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    setStep(0);
    setDraft("");
    setSecs(0);
    const ids: number[] = [];
    const at = (ms: number, fn: () => void) => ids.push(window.setTimeout(fn, ms));
    // You hold the mic and ask out loud.
    at(700, () => setAim("mic"));
    at(2050, () => {
      setAim(null);
      setStep(1);
    });
    [1, 2, 3, 4].forEach((n) => at(2050 + n * 520, () => setSecs(n)));
    at(4400, () => setStep(2));
    at(5300, () => setStep(3));
    at(6400, () => setStep(4));
    // Then you type the next one.
    for (let i = 0; i <= QUESTION.length; i += 2) at(9200 + i * 24, () => setDraft(QUESTION.slice(0, i)));
    at(9200 + QUESTION.length * 24 + 30, () => {
      setDraft(QUESTION);
      setStep(5);
    });
    at(10500, () => setAim("send"));
    at(11850, () => {
      setAim(null);
      setDraft("");
      setStep(6);
    });
    at(12300, () => setStep(7));
    at(13400, () => setStep(8));
    at(14300, () => setStep(9));
    at(21000, () => setRun((r) => r + 1));
    return () => ids.forEach(clearTimeout);
  }, [inView, reduce, run]);

  const pop = reduce ? {} : { initial: { opacity: 0, y: 12, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.42, ease } };
  const typing = (
    <motion.span {...pop} exit={{ opacity: 0 }} className={cn("relative flex w-fit gap-1 rounded-[0.55rem] rounded-tl-none bg-white px-3 py-2.5", BUBBLE)} aria-label="MARQui está escribiendo">
      <Tail />
      {[0, 1, 2].map((d) => (
        <motion.i key={d} className="size-1.5 rounded-full bg-black/35" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
      ))}
    </motion.span>
  );

  return (
    <div ref={root} className="wa-font relative w-full max-w-[31rem] text-[#111b21]">
      <ChatWindow>
        <ChatHeader
          name="MARQui"
          avatar={<MarquiAvatar className="size-9 shrink-0" />}
          actions={
            <span className="mr-1 inline-flex h-8 items-center gap-1.5 rounded-full bg-white pl-2.5 pr-1.5 text-[0.76rem] font-semibold text-[#00705f] shadow-[0_0_0_1px_rgb(0_140_126/0.25)]">
              <ListChecks className="size-4" aria-hidden />
              <span className="max-sm:sr-only">Reglas</span>
              <span className="grid size-5 place-items-center rounded-full bg-[#008c7e] text-[0.66rem] tabular-nums text-white">3</span>
            </span>
          }
        >
          {step === 3 || step === 7 ? <span className="text-[#00a884]">escribiendo…</span> : "Asistente de MARQ"}
        </ChatHeader>

        <div className="flex h-[33rem] flex-col">
          <div className="wa-paper flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-3.5 pb-3 pt-3">
            <span className={cn("mx-auto rounded-md bg-white px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wide text-[#54656f]", BUBBLE)}>Hoy</span>
            {/* What was already in his chat by the afternoon: the morning brief. */}
            <div className={cn("relative w-fit max-w-[80%] rounded-[0.55rem] rounded-tl-none bg-white px-2.5 py-1.5 text-[0.82rem] leading-[1.35]", BUBBLE)}>
              <Tail />
              <b className="font-semibold">☀️ Buen día, Cande.</b> Ayer entraron 23 consultas: 2 interesados nuevos y 4 sin responder.
              <Time>9:00</Time>
            </div>

            {step >= 2 && <VoiceNote key={`voice-${run}`} pop={pop} />}
            <AnimatePresence mode="popLayout">{step === 3 && <motion.div key={`t1-${run}`}>{typing}</motion.div>}</AnimatePresence>
            {step >= 4 && <Numbers key={`numbers-${run}`} play={!reduce} pop={pop} />}

            {step >= 6 && (
              <motion.div key={`q-${run}`} {...pop} className={cn("relative ml-auto w-fit max-w-[80%] rounded-[0.55rem] rounded-tr-none bg-wa-bubble px-2.5 py-1.5 text-[0.84rem] leading-[1.35]", BUBBLE)}>
                <Tail out />
                {QUESTION}
                <Time read>17:41</Time>
              </motion.div>
            )}
            <AnimatePresence mode="popLayout">{step === 7 && <motion.div key={`t2-${run}`}>{typing}</motion.div>}</AnimatePresence>
            {step >= 8 && <List key={`list-${run}`} pop={pop} />}
            {step >= 9 && (
              <motion.div key={`xlsx-${run}`} {...pop} className={cn("relative w-[72%] rounded-[0.55rem] bg-white p-1", BUBBLE)}>
                <span className="flex items-center gap-2.5 rounded-[0.4rem] bg-[#f5f6f6] p-2">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#1d8f4e] text-white">
                    <FileSpreadsheet className="size-[1.1rem]" aria-hidden />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <b className="block truncate text-[0.8rem] font-semibold">Inversores · Collection.xlsx</b>
                    <span className="text-[0.68rem] text-[#667781]">9 contactos · Excel</span>
                  </span>
                </span>
                <span className="block px-1.5 pb-0.5 text-right text-[0.64rem] text-[#667781]">17:41</span>
              </motion.div>
            )}
          </div>

          {step === 1 ? (
            <Recording secs={secs} />
          ) : (
            <Composer
              draft={draft}
              typing={!!draft && step < 5}
              cursor={aim && <Cursor key={aim} play delay={0} />}
            />
          )}
        </div>
      </ChatWindow>
      <p className="sky-type mt-4 flex items-center justify-center gap-2 text-[0.9rem] font-medium text-white/85">
        <Mic className="size-4" /> Por escrito o con un audio, como a un compañero.
      </p>
    </div>
  );
}

type Pop = Record<string, unknown>;

/* WhatsApp's own bar while you hold the mic: a red dot, the clock and your voice. */
function Recording({ secs }: { secs: number }) {
  return (
    <div className="flex items-center gap-3 bg-[#f0f2f5] px-3 py-2">
      <Trash2 className="size-5 shrink-0 text-[#54656f]" aria-hidden />
      <motion.i className="size-2.5 shrink-0 rounded-full bg-[#ea0038]" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
      <span className="w-8 shrink-0 text-[0.84rem] tabular-nums text-[#54656f]">0:0{secs}</span>
      <span className="flex h-10 flex-1 items-center gap-[3px] overflow-hidden" aria-label="Grabando un audio">
        {Array.from({ length: 34 }, (_, i) => (
          <motion.i
            key={i}
            className="w-[3px] shrink-0 rounded-full bg-[#54656f]"
            initial={{ height: 3 }}
            animate={{ height: [3, 6 + ((i * 7) % 17), 4, 8 + ((i * 5) % 13), 3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.04 }}
          />
        ))}
      </span>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#00a884] text-white">
        <SendHorizontal className="size-[1.15rem]" aria-hidden />
      </span>
    </div>
  );
}

/* Your voice note, with WhatsApp's transcript under it. */
function VoiceNote({ pop }: { pop: Pop }) {
  const bars = [6, 10, 14, 9, 16, 12, 7, 15, 18, 11, 8, 13, 17, 10, 6, 12, 15, 9, 14, 7, 11, 16, 8, 5, 9, 13, 6];
  return (
    <motion.div {...pop} className={cn("relative ml-auto w-[76%] rounded-[0.55rem] rounded-tr-none bg-wa-bubble px-2 pb-1.5 pt-2", BUBBLE)}>
      <Tail out />
      <div className="flex items-center gap-2.5">
        <span className="relative shrink-0">
          <Face name="Cande" className="size-10" />
          <Mic className="absolute -bottom-0.5 -right-1 size-4 rounded-full bg-wa-bubble p-px text-[#53bdeb]" aria-hidden />
        </span>
        <Play className="size-5 shrink-0 fill-[#54656f] text-[#54656f]" aria-hidden />
        <span className="flex h-6 flex-1 items-center gap-[2px]" aria-hidden>
          {bars.map((h, i) => (
            <i key={i} className={cn("w-[3px] rounded-full", i < 3 ? "bg-[#53bdeb]" : "bg-[#8aa79a]")} style={{ height: h }} />
          ))}
        </span>
      </div>
      <span className="mt-0.5 flex items-center justify-between pl-[3.25rem] text-[0.64rem] text-[#667781]">
        0:04
        <Time read>17:40</Time>
      </span>
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.45, delay: 0.5, ease }}
        className="mt-1 overflow-hidden border-t border-black/[0.07] pt-1.5 text-[0.78rem] italic leading-snug text-[#3b4a54]"
      >
        «¿Cuántas consultas trajo Collection esta semana?»
      </motion.p>
    </motion.div>
  );
}

/* The answer to a number question: the number first, then what it means. */
function Numbers({ play, pop }: { play: boolean; pop: Pop }) {
  const days = [
    { d: "L", n: 4 },
    { d: "M", n: 7 },
    { d: "M", n: 5 },
    { d: "J", n: 9 },
    { d: "V", n: 6 },
    { d: "S", n: 8 },
    { d: "D", n: 2 },
  ];
  return (
    <motion.div {...pop} className={cn("relative w-[86%] rounded-[0.6rem] rounded-tl-none bg-white px-3 pb-1.5 pt-2.5 text-[0.82rem] leading-[1.35]", BUBBLE)}>
      <Tail />
      <span className="flex items-end justify-between gap-3">
        <span>
          <b className="block text-[1.9rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">41</b>
          <span className="mt-1 block text-[0.74rem] text-[#667781]">consultas por Collection esta semana · 37% del total</span>
        </span>
        {/* Day by day, so a busy Thursday is visible without asking. */}
        <span className="flex h-12 shrink-0 items-end gap-1" aria-label="Consultas por día">
          {days.map((x, i) => (
            <span key={i} className="flex flex-col items-center gap-0.5">
              <motion.i
                className={cn("block w-2 origin-bottom rounded-[2px]", x.n === 9 ? "bg-[#008c7e]" : "bg-[#b9e3da]")}
                style={{ height: x.n * 4 }}
                initial={play ? { scaleY: 0 } : false}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.06, ease }}
              />
              <span className="text-[0.5rem] leading-none text-[#8696a0]">{x.d}</span>
            </span>
          ))}
        </span>
      </span>
      <span className="mt-2.5 grid grid-cols-3 gap-1.5">
        {[
          ["9", "interesados"],
          ["2", "reservaron"],
          ["+8", "vs. la semana pasada"],
        ].map(([n, l]) => (
          <span key={l} className="rounded-[0.5rem] bg-[#f3f5f6] px-2 py-1.5 leading-tight">
            <b className={cn("block text-[0.95rem] font-semibold tabular-nums", n.startsWith("+") && "text-[#008069]")}>{n}</b>
            <span className="text-[0.64rem] text-[#667781]">{l}</span>
          </span>
        ))}
      </span>
      <span className="mt-2 block text-[0.76rem] text-[#3b4a54]">
        El jueves fue el pico: salió el anuncio nuevo de Instagram.
        <Time>17:40</Time>
      </span>
    </motion.div>
  );
}

/* A list is people, not rows: each one opens its chat. The full list comes as Excel. */
function List({ pop }: { pop: Pop }) {
  const people = [
    { name: "Valeria Paz", detail: "2 dorm · contado · consultó el jueves" },
    { name: "Martín Duarte", detail: "1 dorm · para alquilar · hoy" },
    { name: "Graciela Benítez", detail: "2 unidades · en pozo · el lunes" },
  ];
  return (
    <motion.div {...pop} className={cn("relative w-[90%] rounded-[0.6rem] rounded-tl-none bg-white px-3 pb-1.5 pt-2.5 text-[0.82rem] leading-[1.35]", BUBBLE)}>
      <Tail />
      <b className="font-semibold">9 interesados buscan invertir</b> en Collection. Los más recientes:
      <ul className="mt-1.5 divide-y divide-black/[0.06]">
        {people.map((p) => (
          <li key={p.name} className="flex items-center gap-2.5 py-1.5">
            <Face name={p.name} className="size-8" />
            <span className="min-w-0 flex-1 leading-tight">
              <b className="block text-[0.8rem] font-semibold">{p.name}</b>
              <span className="text-[0.7rem] text-[#667781]">{p.detail}</span>
            </span>
            <span className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-[#e7f6f2] px-2.5 text-[0.7rem] font-semibold text-[#00705f]">
              <MessageCircle className="size-3.5" aria-hidden /> Abrir chat
            </span>
          </li>
        ))}
      </ul>
      <span className="block pt-1 text-[0.74rem] text-[#667781]">
        Los 9, en el Excel de abajo.
        <Time>17:41</Time>
      </span>
    </motion.div>
  );
}
