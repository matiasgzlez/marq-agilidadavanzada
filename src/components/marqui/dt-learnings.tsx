import { FadeUp, Section } from "./primitives";
import { BigList, PartTitle } from "./dt-kit";
import { SKY } from "./sky";

/* ——— ¿Qué aprendimos? ———
   One closing for the whole process instead of one per technique: a few
   short lines on screen; the explanation is said over them (it lives in the
   doc). Each technique adds its own as it's done. */

const LEARNINGS = ["La queja más concreta no siempre es el problema", "Contar notas no alcanza: hace falta un criterio", "Lo que no se elige, no se tira", "El mismo mensaje viene de personas muy distintas"];

export function Learnings() {
  return (
    <Section sky={SKY.noon} id="aprendizajes" className="py-28 sm:py-40" aria-labelledby="aprendizajes-title">
      <PartTitle id="aprendizajes-title">¿Qué aprendimos?</PartTitle>
      <FadeUp delay={0.1} className="mt-12 flex justify-center">
        <BigList items={LEARNINGS} />
      </FadeUp>
    </Section>
  );
}
