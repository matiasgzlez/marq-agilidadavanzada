# Marqui · contexto para definir el alcance

Documento de trabajo del equipo. Junta las dos propuestas ("Design Thinking MARQ" y "Propuesta Facu"), las reglas que no se negocian, los conflictos entre ideas y las decisiones que faltan tomar. La referencia de producto que se presenta sigue siendo [marqui-referencia.md](marqui-referencia.md); este archivo es el paso previo para corregirla.

Estado: **alcance definido** (2026-10-14), a la espera de que el equipo lo confirme. Cada decisión cerrada se marca con ✅ y la fecha.

---

## 1. Qué es Marqui, en una línea

Un asistente con IA para el **equipo** de MARQ que vive en WhatsApp: sugiere respuestas, arma la ficha de cada prospecto y, con su tablero **MARQador**, muestra qué pide el mercado. El cliente nunca se entera de que existe. Precios, señas, landings y avances de obra quedan como próximas integraciones.

> "Marqui es el compañero que te sopla la respuesta. El cliente nunca lo ve."

## 2. Reglas que no se negocian

| # | Regla | Qué descarta |
|---|---|---|
| R1 | **El equipo no aprende un sistema nuevo.** La única instalación aceptada es la extensión de Chrome, una sola vez por computadora (✅ D1, 2026-10-14). | Apps propias, logins nuevos, pantallas que haya que aprender. |
| R2 | **El prospecto nunca habla con un bot ni responde encuestas.** Ya pasó: se dan cuenta y dejan de contestar. | Respuestas automáticas, encuestas en WhatsApp, formularios a cambio del precio (✅ D2, D14). |
| R3 | **Todo, o casi todo, pasa por WhatsApp Web** (y el celular como respaldo). | Un dashboard como lugar de trabajo. MARQador se abre en otra pestaña, pero es para mirar, no para trabajar (✅ D3, D12). |
| R4 | **Lo que se pueda hacer, se hace chateando con Marqui**: texto, audio, fotos, archivos. | Pantallas de configuración para tareas del día a día. |
| R5 | **La presentación muestra el producto funcionando** (demo), no solo lo describe. | Diapositivas de texto. |

## 3. Dato técnico que cambia el planteo: coexistencia

Meta permite conectar un número que ya usa **WhatsApp Business app** a la API oficial (Cloud API) **sin perder la app**, algo que llama "coexistencia". Según la documentación de proveedores ([360dialog](https://docs.360dialog.com/docs/resources/phone-numbers/coexistence), [EngageLab](https://www.engagelab.com/docs/whatsapp/quick-access/whatsapp-business-app-coexistence)):

- El número sigue funcionando en el celular y Marqui recibe **por servidor** cada mensaje entrante y cada mensaje que manda el equipo.
- Al conectarlo se desvinculan los dispositivos y hay que volver a vincularlos (hasta 4). Según la [documentación de Meta](https://developers.facebook.com/docs/whatsapp/embedded-signup/custom-flows/onboarding-business-app-users), "todos los clientes acompañantes son compatibles, excepto WhatsApp para Windows y WhatsApp para WearOS". **WhatsApp Web queda soportado** (✅ V1). No lo nombra explícitamente, pero tampoco lo excluye.
- **Al conectar, Meta comparte los últimos 180 días de chats** (sin grupos). Con eso Marqui arranca con historia real para aprender el tono y MARQador para tener datos desde el día uno (resuelve gran parte de V5). Hay 24 h para hacer la sincronización y se hace una sola vez.
- No se sincronizan grupos, se desactivan las listas de difusión (quedan de solo lectura), los mensajes temporales y los de "ver una vez". **Hay que avisarle al equipo si hoy usan listas de difusión.**
- Sin tilde azul de cuenta oficial. Si el celular principal queda 14 días sin usarse, se desconectan los demás dispositivos.
- Los mensajes que manda el equipo desde la app siguen siendo gratis.

**Consecuencia:** como Marqui recibe los mensajes por la vía oficial, la extensión **no necesita leer la pantalla de WhatsApp Web** para saber qué dijo el cliente: solo muestra la tarjeta y las sugerencias, y escribe en el cuadro de texto. Leer las conversaciones, armar la ficha, calcular etapas, mandar reportes y alertas **no necesita ninguna instalación**. Lo único que exige instalar algo es **ver las sugerencias dentro del chat** en WhatsApp Web, porque eso solo se logra con una extensión de Chrome. Esta es la tensión central (D1).

Requisito: las dos líneas tienen que ser **WhatsApp Business app** (no WhatsApp personal). Pendiente V2.

## 4. Las dos propuestas lado a lado

| Función | Design Thinking | Propuesta Facu | Choque con reglas |
|---|---|---|---|
| Sugerir 3 respuestas | Dentro del chat (extensión) o reenviando al contacto Marqui | Dentro de una app web interna que reemplaza el chat | Extensión → R1. App web → R1 y R3. |
| % de éxito por sugerencia | "% de parecidas que terminaron en reserva, llamada…" | "64% avanzó (38 casos)", con "avanzar" = subir de etapa | Ninguno. Falta definir etapas y qué mostrar sin historial (D6). |
| Ficha del prospecto | Encuesta corta en WhatsApp o preguntas en la web (en la referencia actual) | 3 respuestas + datos extra + datos automáticos | **Encuesta → R2.** Hay que sacarla de la conversación (D2). |
| Clasificación en 4 arquetipos y derivación | — | Ya confía / nuevo con intención / en evaluación / hoy no puede | Ninguno. |
| Escalera de compromiso | — | Detecta pasos ("pidió visita") y actualiza la etapa | Ninguno. |
| Landing de proyectos | Se arma conversando con Marqui | — | Depende de con qué está hecha la web (V3). |
| Precios web ↔ lista | Marqui pregunta y actualiza | "Actualiza precio automáticamente" | Ninguno. Depende de V3 y V4. |
| Señas con Mercado Pago | Link de seña y reserva automática | — | Ninguno. Fuera de la ventana de 24 h requiere plantilla aprobada. |
| Avance de obra | Foto por WhatsApp → galería | — | Ninguno. |
| Reportes | MARQador: resumen semanal en PDF y preguntas libres | Niveles 1 a 4: semanal, mensual, ad hoc, embudo, alertas | Ninguno, si llegan por WhatsApp. |
| Alertas | "No te manda avisos por cada consulta" | 5 alertas confirmadas y 5 en duda | Se contradicen entre sí (D4). |
| Dashboard | Power BI (en la referencia actual) | 5 secciones | **R3**, si es el lugar principal (D3). |
| Base de conocimiento | — | Obsidian para fichas, FAQ y tono | R1, si el equipo tiene que usar Obsidian (D8). |
| Equipo y permisos | Permisos por número y registro de cambios | Derivación al integrante que corresponde | Ninguno. |

## 5. Conflictos y recomendación

> Análisis inicial. Lo que se decidió está en la sección 7 y manda sobre esta.

1. **Sugerencias dentro del chat contra "no instalar nada" (D1).** Recomendación: el núcleo funciona sin instalar nada (contacto Marqui y procesos en el servidor). La extensión queda como un **acelerador opcional**, instalado una sola vez por quien administra cada computadora, y se presenta con esa honestidad. Facu propone una app web que reemplaza el chat: se descarta, porque rompe R1 y R3.
2. **La ficha sin encuesta (D2).** Recomendación: Marqui **deduce** la ficha (objetivo, tipología, forma de pago) de lo que el prospecto ya dijo. Cuando falta un dato, la sugerencia de respuesta **incluye una pregunta natural**, como "¿lo pensás para vivir o para invertir?", y la manda una persona. El indicador "% de fichas completas" pasa a medir **cuánto pudo deducir Marqui**, no cuántos contestaron. Hay que sacar de la referencia la encuesta en WhatsApp.
3. **Alertas contra "no molestar" (D4).** Recomendación: un **resumen diario** a la mañana, por WhatsApp, más un aviso inmediato **solo** para cliente recurrente, prospecto que reaparece y referido de un cliente. El resto va en el semanal.
4. **Dashboard (D3).** Recomendación: nada de dashboard en la primera etapa. Los reportes semanal y mensual llegan como PDF por WhatsApp; las preguntas libres se le hacen a Marqui ("¿cuántos de crédito pidieron 2 dormitorios?"); las listas para difusión vuelven como Excel. Un tablero web de solo lectura puede sumarse después, si dirección lo pide.
5. **Dos sentidos de "avance".** "Avance de obra" (fotos) y "el prospecto avanzó" (subió de etapa) se pisan. Propuesta: **avance** solo para la obra y **subir de etapa** para el prospecto.
6. **"Persona" tiene dos sentidos.** Facu usa las "cuatro Personas" (arquetipos) y en todo el documento "persona" también es alguien del equipo. Propuesta: **arquetipo**.

## 6. Lenguaje (glosario propuesto, a confirmar)

- **Prospecto**: alguien que consultó y todavía no compró. _Evitar_: lead, interesado, cliente.
- **Cliente**: alguien que ya compró o invirtió con MARQ. _Evitar_: inversor, como sinónimo.
- **Integrante**: una persona del equipo de MARQ que usa Marqui. _Evitar_: usuario, operador, persona.
- **Línea**: uno de los dos WhatsApp de MARQ, la línea de pauta (consultas desde anuncios) o la línea de clientes. Las dos las atiende todo el equipo. _Evitar_: canal, número.
- **Canal**: por dónde llegó el prospecto (anuncio, recomendación, inmobiliaria, web). _Evitar_: línea, fuente.
- **Consulta**: el primer contacto de un prospecto sobre un proyecto. _Evitar_: lead, mensaje.
- **Ficha**: objetivo, tipología y forma de pago de un prospecto, deducidos de la conversación. _Evitar_: encuesta, formulario, perfil.
- **Tarjeta**: las 5 etiquetas de un prospecto que se ven arriba de su chat: proyecto, busca, paga, etapa y marca. _Evitar_: perfil, arquetipo, Persona.
- **Marca**: una señal especial de un prospecto: cliente, reaparece o referido. _Evitar_: alerta, flag.
- **Etapa**: el escalón del prospecto: Consultó, Interesado o Reservó. _Evitar_: estado, avance, escalón.
- **Sugerencia**: una de las tres respuestas que Marqui propone y que una persona elige, corrige y envía. _Evitar_: respuesta automática, recomendación.
- **Aviso**: un mensaje que Marqui manda sin que se lo pidan: el resumen diario o un aviso urgente. _Evitar_: alerta, notificación.
- **Unidad**: un departamento, lote o casa con precio propio. **Precio público** es el que puede ir a la web y **precio reservado** el que nunca pasa a la web.
- **Seña**: un pago por Mercado Pago que pasa una unidad a reservada.
- **Avance de obra**: una foto de la obra publicada en la galería del proyecto.
- **MARQui**: el asistente. Se escribe con MARQ en mayúsculas, igual que MARQador: comparten apellido. _Evitar_: Marqui, MARQUI.
- **MARQador**: el módulo de MARQui (su "hermanito"), no otra solución. Es el tablero de MARQui que muestra, con datos de todas las conversaciones, qué pide el mercado. _Evitar_: dashboard, reportes, Power BI.

## 7. Decisiones tomadas

- ✅ **D1 · Extensión como estándar** (2026-10-14). En la computadora, las 3 sugerencias aparecen dentro del chat de WhatsApp Web mediante una extensión de Chrome que se instala una vez. En el celular, el contacto Marqui. Se acepta el riesgo de que WhatsApp cambie su página y haya que actualizar la extensión. Como la extensión ya está instalada, puede sumar otras piezas dentro de WhatsApp Web (ver D3).
- ✅ **D2 · Deducir + pregunta natural** (2026-10-14). Marqui deduce la ficha del chat y, cuando falta un dato, lo incluye como pregunta conversacional en una sugerencia que envía una persona. Nunca hay encuesta.
- ✅ **D4 · Resumen diario + 3 avisos urgentes** (2026-10-14). Un resumen a la mañana y aviso inmediato solo para cliente recurrente, prospecto que reaparece y referido de un cliente. El resto va al semanal.
- ✅ **D5 · La solución es Marqui + MARQador** (2026-10-14). Marqui es el producto y MARQador es un módulo de Marqui. Quedan como **próximas integraciones**: precios lista → web, señas con Mercado Pago, landing de proyectos y avance de obra. Se remarcan en la presentación y tienen una sección propia en la web.
- ℹ️ **Hecho: las líneas son compartidas** (2026-10-14). Todo el equipo atiende desde las mismas dos líneas. No existe "derivar a otro integrante": quien abre el chat lo atiende. Esto cambia D7 y D10.

- ✅ **D3 · MARQador es el dashboard** (2026-10-14). MARQador es el nombre del tablero con las métricas de lo que se consulta, en vivo. Se abre desde un botón de Marqui en WhatsApp Web; si es mucha información, en una pestaña nueva. Para algo puntual ("de las 100 consultas, ¿cuántas son por MARQ Collection?") se le pregunta a Marqui por chat y Marqui responde con los mismos datos.
- ✅ **D6 · Sin tasa de éxito ni etiquetas** (2026-10-14). Las sugerencias son 3 opciones de respuesta, sin porcentajes ni etiquetas de intención. Tampoco se presenta como función futura.
- ✅ **D7 · Tarjeta del prospecto, sin arquetipos** (2026-10-14). No se usan las 4 "Personas" de Facu. Arriba del chat se ven 5 etiquetas: **Proyecto · Busca · Paga · Etapa · Marca**. Por ejemplo: "MARQ Collection" · "2 dorm, para invertir" · "Crédito" · "Interesado" · "Reaparece (40 días)". Un dato que falta se ve como "¿Paga?", y la marca (cliente, reaparece, referido) solo aparece si corresponde. Son datos, no conclusiones de la IA, y cada uno se mide en MARQador.
- ✅ **D9 · Tres etapas** (2026-10-14). **Consultó → Interesado → Reservó.** Un prospecto pasa a **Interesado** cuando pide algo concreto: visita, reunión o llamada, o pregunta por formas de pago o por una unidad puntual. Marqui lo detecta en el chat y también se le puede decir.
- ✅ **D8 · Conocimiento: chats + documentos + lo que se le cuenta** (2026-10-14). Marqui aprende de tres fuentes: las conversaciones, los documentos que ya tiene MARQ (lista de precios, brochures, web) y lo que el equipo le dice por chat ("MARQ Collection ahora financia en 36 cuotas"). Todo se guarda en una base de conocimiento en Obsidian que **el equipo nunca ve ni edita**: es el contexto interno del asistente. Cuando lo aprendido de un chat contradice algo ya guardado (por ejemplo, un precio), Marqui pregunta antes de reemplazarlo.
- ✅ **D10 · MARQador lo abre todo el equipo** (2026-10-14). MARQ tiene **dos WhatsApp: el de pauta publicitaria y el de clientes**. Los maneja todo el equipo y en los dos está integrado Marqui + MARQador. No hay permisos por persona.
- ✅ **D15 · Las 5 pantallas de MARQador** (2026-10-14): Pauta, Demanda, Contactos, Frenos y Semana. Semana incluye el tiempo de respuesta y el tiempo ahorrado con Marqui.
- ✅ **D16 · Orden de la presentación** (2026-10-14). El objetivo es que las funciones se entiendan de forma sencilla e intuitiva. El orden es: (1) qué es Marqui y en qué se diferencia de un bot; (2) todas las funciones de Marqui y MARQador; (3) la demo "Un día con Marqui"; (4) las próximas integraciones, en cuatro tarjetas.
- ✅ **D17 · Próximas integraciones: cuatro tarjetas cortas** (2026-10-14): precios lista → web, señas con Mercado Pago, landing de proyectos y avance de obra.
- ✅ **D14 · El formulario de la web entra a Marqui** (2026-10-14). Cada consulta del formulario se suma como prospecto, con su teléfono, sin pedir datos extra. Quien atiende le escribe por la línea con una sugerencia de Marqui.
- ✅ **D12 · MARQador se abre en una pestaña nueva, como Gasti** (2026-10-14). El botón de Marqui en WhatsApp Web abre MARQador en una pestaña nueva del navegador (no encima de WhatsApp Web). Además, MARQador llega por chat (resumen diario, avisos, PDF y respuestas) y por link en el celular.
- ✅ **D13 · Reportes por WhatsApp y en MARQador** (2026-10-14). El semanal y el mensual llegan como PDF por WhatsApp y quedan guardados en MARQador.
- ✅ **D11 · En el celular, desde el teléfono de la línea** (2026-10-14). El contacto Marqui se agenda en los celulares de las líneas compartidas. Marqui no distingue qué integrante le escribe, porque no hace falta: las líneas son compartidas.

### Marqui y MARQador: qué hace cada uno

La frontera: **Marqui es el asistente con el que se habla; MARQador es el tablero que se mira.** Los dos usan la misma base de datos: Marqui escribe la ficha y la etapa de cada prospecto mientras ayuda a responder, y MARQador las muestra agregadas.

**Marqui (asistente, por chat):**

1. Lee la conversación del prospecto y sabe por qué proyecto pregunta.
2. Propone 3 sugerencias de respuesta, que la persona elige, corrige y envía.
3. Deduce la ficha (objetivo, tipología, forma de pago) y, si falta un dato, lo pregunta de forma natural dentro de una sugerencia.
4. Detecta la etapa del prospecto ("pidió visita", "preguntó por la escritura").
5. Reconoce a quien ya es cliente, a quien reaparece después de 30 días o más y a quien viene referido.
6. Muestra la tarjeta del prospecto arriba del chat (D7).
7. Aprende el tono de MARQ con cada sugerencia que se elige o se corrige.
8. Manda el resumen diario y los 3 avisos urgentes (D4).
9. Responde preguntas sobre los datos ("¿cuántas consultas por MARQ Collection esta semana?") y devuelve listas para difusión en Excel.
10. En el celular funciona como contacto: le reenviás el mensaje y te devuelve las 3 opciones.

**MARQador (dashboard, pestaña aparte).** Se organiza por **la decisión que ayuda a tomar**, no por tipo de gráfico. La pregunta para cada pantalla es: ¿qué hace distinto MARQ después de verla?

1. **Pauta: ¿dónde pongo la plata?** Por anuncio y canal: consultas, cuántas llegan a Interesado y cuántas a Reservó. Si se cargan los montos invertidos, también el costo por interesado. Es la más valiosa: hoy se mide por cantidad de consultas, no por calidad.
2. **Demanda: ¿qué construyo y qué ofrezco?** Por proyecto: qué tipologías se piden, para vivir o invertir, y cómo piensan pagar. Responde el dolor de las "500 consultas sin saber cuántos podían pagar" y valida, por ejemplo, un producto apto crédito.
3. **Contactos: ¿a quién llamo o invito?** Filtros libres (proyecto, busca, paga, etapa, marca) y exportación de la lista para una difusión o un evento.
4. **Semana: ¿cómo venimos?** Cuatro números (consultas, interesados nuevos, reservas, chats sin responder), comparados con la semana anterior, y el archivo de reportes en PDF.

5. **Frenos: ¿por qué no avanzan?** Por proyecto, en qué tema se corta la conversación de quienes no llegan a Interesado: financiación, precio, fecha de entrega, ubicación o tamaño. Debajo, las preguntas que Marqui no supo responder, que sirven para completar lo que sabe.

**Dentro de Semana, dos números de eficiencia:**

- **Tiempo de respuesta:** cuánto se tarda en contestar la primera vez, por línea y por franja horaria.
- **Tiempo ahorrado con Marqui:** compara cuánto se tarda en responder eligiendo y corrigiendo una sugerencia contra escribir desde cero (buscar el dato, armar la respuesta). Se mide así:
  1. **Línea de base:** durante las primeras 2 semanas, la extensión solo mide, sin mostrar sugerencias, cuánto pasa entre que se abre un chat con un mensaje nuevo y se envía la respuesta.
  2. **Con Marqui:** se mide lo mismo, y cada respuesta queda marcada como "elegida tal cual", "corregida" o "escrita de cero".
  3. **Resultado:** "Esta semana Marqui ahorró ≈ 9 h: con sugerencia se tarda 40 s por respuesta; escribiendo de cero, 3 min 10 s".

  Limitaciones a decir en voz alta: es un promedio por respuesta, incluye el tiempo de leer, y las respuestas escritas de cero suelen ser las más difíciles, así que la comparación justa es contra la línea de base y no contra esas.

**Lo que no mostraría:**

- **Edad, cómo nos conoció y si acepta novedades** como métricas: sin preguntarlas (R2), van a estar casi siempre vacías. Solo se cuentan si el prospecto lo dijo solo.
- **Ciudad**, salvo deducida del código de área del teléfono (362 Resistencia, 379 Corrientes). Así sale gratis y sin preguntar.
- **% de fichas completas** como métrica de negocio: mide cuánto pudo deducir Marqui, no a los prospectos. Va como dato chico, no como indicador principal.
- **Comparar dos semanas lado a lado:** el reporte semanal ya trae la comparación.

## 8. Referentes: Grok y Gasti

- **Grok en X:** no tiene pantalla propia dentro de la conversación. Se lo invoca mencionándolo (@grok) en el hilo donde ya estás, responde ahí mismo y no interrumpe si no lo llamás. **Marqui toma esto:** aparece en el chat del cliente cuando lo abrís, sin notificaciones por consulta.
- **Gasti** ([gasti.pro](https://gasti.pro), [A24](https://www.a24.com/trends/la-herramienta-whatsapp-que-simplifica-el-control-tus-gastos-como-usar-esta-ia-cuidar-tu-dinero-n1398678), [Product Hunt](https://www.producthunt.com/products/gasti/launches/gasti-2)): **no es todo dentro de WhatsApp**, es un modelo híbrido:
  - **En WhatsApp:** se arranca con un mensaje ("Hola Gasti, quiero empezar"), se cargan gastos con texto, audio o foto, se le piden cosas chateando ("hacé todo chateando desde WhatsApp") y llegan avisos: resumen semanal en texto, presupuesto por llegar al límite, cobros recurrentes por vencer.
  - **En su app y web (app.gasti.pro):** se organizan presupuestos, metas y reglas, y se ven los gráficos (barras de presupuesto, avance de metas). También tiene app de iPhone y exporta a Notion y Google Sheets, además de conectarse con Claude y ChatGPT.
  - **Patrón:** WhatsApp para hacer y para que te avisen; una vista aparte para mirar y ordenar. **Marqui toma exactamente esto:** el día a día es por chat y MARQador es la vista para mirar.
- **Diferencia clave:** Grok y Gasti le hablan al usuario final. Marqui le habla **solo al equipo**: el prospecto nunca lo ve (R2).

## 9. Referencias visuales para comunicar

Productos que ya resolvieron partes de lo que queremos mostrar, y qué tomar de cada uno:

| Referencia | Qué es | Qué tomar para Marqui |
|---|---|---|
| **Gmail Smart Reply** ([PhoneArena](https://www.phonearena.com/news/Smart-Reply-now-gives-you-three-quick-responses-on-Gmail_id94178)) | Tres respuestas cortas como botones arriba del cuadro de texto. Tocás una, se completa y la podés editar. Aprende de lo que elegís. | **La forma de las 3 sugerencias.** Es el patrón que todos ya conocen: no hay que explicarlo. |
| **Intercom Fin AI Copilot** ([Intercom](https://intercom.com/support-for-agents/ai-copilot)) | Asistente dentro de la bandeja del agente: lee la pregunta, busca en el conocimiento de la empresa y redacta una respuesta que el agente revisa y envía. Usa conversaciones pasadas. | **El mensaje "ayuda al que atiende, nunca contesta solo".** Es la referencia más cercana a Marqui, pero en un sistema aparte. Marqui lo hace dentro de WhatsApp. |
| **Zendesk suggested first replies** ([Zendesk](https://support.zendesk.com/hc/en-us/articles/7041677653914)) | Un borrador de primera respuesta en el cuadro de texto, que se acepta, edita o descarta. | **Los tres gestos: elegir, corregir, enviar.** |
| **Eazybe / Cooby** ([Eazybe](https://chrome.google.com/webstore/detail/eazybe-best-whatsapp-web/clgficggccelgifppbcaepjdkklfcefd), [Cooby](https://www.cooby.co/en/post/kommo-alternative)) | Extensiones de Chrome que agregan datos del contacto y CRM encima de WhatsApp Web. | **La tarjeta del prospecto dentro de WhatsApp Web.** Prueba que la integración existe y se usa. |
| **Zapia** ([A24](https://www.a24.com/trends/si-usas-whatsapp-este-asistente-ia-te-puede-facilitar-la-vida-programa-mensajes-y-transcribe-audios-n1413704)), **Gasti**, **Grok** | Asistentes que son un contacto más: se agregan, se les reenvía un audio o un mensaje y responden. | **El modo celular y las preguntas a Marqui.** "Es como Zapia, pero sabe todo de MARQ." |
| **Darwin AI** ([iProUP](https://www.iproup.com/startups/46205-argentinos-unen-whatsapp-y-chatgpt-inversion), [ITSitio](https://www.itsitio.com/ar/inteligencia-artificial/startup-argentina-que-crea-trabajadores-de-ia-levanta-una-ronda-de-45-millones-de-dolares-en-silicon-valley/)) | Contra-referencia. "Trabajadores virtuales" que le hablan directamente al cliente y califican leads, también en inmobiliarias. | **Lo que Marqui NO es.** Sirve para el contraste: "un bot reemplaza al vendedor; Marqui lo ayuda, y el cliente siempre habla con una persona de MARQ". |

**Cómo comunicarlo de forma sencilla (propuesta para D16):**

1. **Una frase de posicionamiento:** "Marqui es el compañero que te sopla la respuesta. El cliente nunca lo ve."
2. **Un día con Marqui, en 3 momentos**, cada uno con una sola pantalla:
   - **9:00 · Resumen diario.** Llega al contacto Marqui: "Ayer entraron 23 consultas, 4 sin responder. Ojo: Marta reaparece después de 40 días."
   - **10:30 · Juan escribe "precio?"** desde un anuncio. Abrís su chat en WhatsApp Web y ves la tarjeta (MARQ Collection · ¿Busca? · ¿Paga? · Consultó) y 3 sugerencias como en Gmail. Tocás una, la ajustás y la mandás vos. La tarjeta se completa sola a medida que Juan responde.
   - **18:00 · Abrís MARQador** y ves que el anuncio de Instagram trae mucho volumen y pocos interesados.
3. **Una comparación en dos columnas, bot contra Marqui:** quién le escribe al cliente, si el cliente lo nota, quién decide.
4. **"Lo que viene":** cuatro tarjetas cortas (D17).

**Orden decidido (D16):** frase y comparación con un bot → funciones de Marqui y MARQador → demo "Un día con Marqui" (los 3 momentos de arriba) → próximas integraciones.

## 10. Decisiones pendientes

Ninguna: D1 a D17 están cerradas. Lo que falta son verificaciones de hechos (sección 11), que no cambian el alcance pero sí cómo se construye.

## 11. Verificaciones pendientes (hechos, no decisiones)

- ✅ **V1** · WhatsApp Web funciona con coexistencia (ver sección 3).
- ✅ **V2** · Supuesto: las dos líneas (pauta y clientes) son WhatsApp Business app.
- 🟦 **V3** · Supuesto (caso hipotético): la web de MARQ tiene un panel de administración con API para leer y editar proyectos, unidades, precios y galerías. Solo afecta a las próximas integraciones.
- 🟦 **V4** · Supuesto (caso hipotético): la lista de precios es una planilla de Google Sheets compartida con las inmobiliarias, con una columna que indica si cada precio es público. Solo afecta a las próximas integraciones.
- ✅ **V5** · Historial: Meta comparte 180 días al conectar (ver sección 3).
- ⚠️ **V6** · Riesgo de la extensión. No hay una prohibición explícita para extensiones que solo agregan elementos a WhatsApp Web, y existen productos comerciales que lo hacen (Eazybe, Cooby). Pero **el riesgo existe y crece**:
  - En septiembre de 2026, WhatsApp empezó a probar un aviso contra "clientes web no oficiales" y recomienda "no instalar extensiones sospechosas que modifiquen el cliente" ([WABetaInfo](https://wabetainfo.com/whatsapp-is-testing-a-safety-warning-for-unofficial-web-clients/)). El aviso apunta a interfaces que envuelven WhatsApp Web, no a extensiones sobre la página oficial, pero no está claro.
  - Lo que más se castiga es **automatizar envíos** con herramientas no oficiales. Marqui no lo hace: la persona siempre toca "enviar".
  - **Cómo se reduce el riesgo:** (1) los mensajes llegan por la API oficial, así que la extensión no lee la página ni envía nada; (2) la extensión es solo una capa visual: si WhatsApp la rompe o la bloquea, **Marqui sigue funcionando por el contacto** (reenviar el mensaje y recibir las 3 sugerencias) y MARQador no se ve afectado; (3) probarla primero en una sola computadora durante el piloto.
  - **Política de IA de Meta (enero 2026):** prohíbe distribuir asistentes de IA de uso general (como ChatGPT) por la API de WhatsApp Business. No afecta a empresas que usan IA para su propio negocio ([TechCrunch vía Yahoo](https://tech.yahoo.com/ai/meta-ai/articles/whatssapp-changes-terms-bar-general-141214399.html)). Marqui es un asistente interno de MARQ, así que no entra en la prohibición.

## 12. Qué hay que corregir en la referencia actual

- Sacar la **encuesta en WhatsApp** del perfil del prospecto, porque choca con R2.
- Reemplazar **Power BI** como destino principal por reportes y preguntas por WhatsApp (D3).
- Aclarar que la extensión es **la única instalación** y que es opcional (según D1).
- Unificar el vocabulario según la sección 6.
- Completar la sección 3 de la referencia: el "Por ejemplo" está cortado y mezclado con la sección 5.
