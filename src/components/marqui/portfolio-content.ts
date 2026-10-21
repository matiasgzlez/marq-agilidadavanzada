/* ——— Portfolio: the text ———
   The written report for MARQ, one document per proposal. Sources: the team's
   proposal doc ("Entrega 23/10"), the presentation, the Design Thinking work
   and the decisions taken reviewing them. Blocks are kept as data so the
   copy can be edited without touching the layout. */

export type Block =
  | { p: string }
  | { list: string[]; ordered?: boolean }
  | { table: { head: string[]; rows: string[][] } }
  | { note: string; tone?: "info" | "warn" }
  | { figure: string; alt: string; caption: string }
  | { quote: string; who: string };

export type Section = { title: string; blocks: Block[] };
export type DocId = "marqui" | "marqador" | "alloy";

export const PORTFOLIO: Record<DocId, Section[]> = {
  marqui: [
    {
      title: "Resumen",
      blocks: [
        { p: "MARQ es un estudio que hace todo el ciclo del desarrollo inmobiliario: analiza qué se puede construir en un terreno, diseña el edificio, lo vende, dirige la obra y, una vez entregado, administra el consorcio. Es un equipo de unas quince personas que trabaja por proyecto." },
        { p: "Su principal desafío comercial es atender y seguir a muchos interesados sin perder el trato personal que esos mismos interesados le piden. Las consultas llegan por WhatsApp y por la pauta en redes, se responden una por una y la decisión de compra puede tardar semanas o meses." },
        { p: "MARQui es un asistente con inteligencia artificial para el equipo comercial que vive dentro del WhatsApp que ya usan. Lee cada consulta, prepara la respuesta y avisa lo importante, pero nunca le habla al cliente: la máquina propone y la persona decide. Su módulo MARQador junta todas esas conversaciones y muestra qué está pidiendo el mercado." },
        { note: "Al cliente siempre le responde una persona de MARQ. MARQui sugiere, pero nunca envía nada por su cuenta." },
      ],
    },
    {
      title: "El problema",
      blocks: [
        { p: "MARQ recibe más consultas de las que puede atender con el trato personal que sus clientes esperan, y no tiene forma de saber cuáles de esas consultas, visitas o anuncios terminan en una venta. La evidencia surge de la entrevista con el equipo comercial." },
        {
          table: {
            head: ["Problema", "Evidencia", "Consecuencia"],
            rows: [
              ["Responder consultas consume la jornada", "Con pauta activa llegan unas 100 consultas por día y se dedican cerca de 4 horas diarias a responderlas. No encontraron cómo distinguir a un prospecto real.", "Todas las consultas reciben la misma atención, tengan o no intención de compra, y ese tiempo no va a la venta."],
              ["La venta se pierde en el silencio", "Hasta seis contactos por venta. La persona lo consulta con su familia o su contador y a veces desaparece semanas.", "Nadie la vuelve a contactar a tiempo y, si vuelve, la conversación empieza de cero."],
              ["Pauta a ciegas", "La pauta se mide por cantidad de consultas, no por su calidad. No se registra de qué anuncio viene cada persona ni si llega a reunión.", "MARQ invierte sin saber qué anuncio trae compradores y no puede mover el presupuesto a lo que rinde."],
              ["La automatización ya probada alejó a los clientes", "Probaron respuestas automáticas y encuestas por WhatsApp. La gente notaba que era un bot y dejaba de responder. Lo dieron de baja.", "Volvieron a responder todo a mano, lo que agrava el primer problema, y descartan cualquier solución que reemplace a la persona."],
            ],
          },
        },
        { p: "Además, el equipo no quiere aprender un sistema nuevo: trabaja en WhatsApp Web y ahí tiene que estar la solución." },
      ],
    },
    {
      title: "Qué hace MARQui",
      blocks: [
        { p: "Cada función responde a un hallazgo de la consultoría. En la columna de la derecha está la técnica de Design Thinking de la que salió." },
        {
          table: {
            head: ["Función", "Qué hace", "De dónde sale"],
            rows: [
              ["Respuestas inteligentes", "En cada chat propone tres respuestas con el tono de MARQ (breve, detallada e invitación a reunión). El vendedor elige una, la corrige si quiere y la envía con su nombre. Cada tanto incluye una variante nueva para descubrir respuestas mejores.", "¿Cómo podríamos responder en la primera hora sin pasar cuatro horas escribiendo?"],
              ["Ficha automática", "Mientras charlan, arma la ficha del cliente: proyecto, qué busca, cómo paga y en qué etapa está, con una etiqueta para encontrarlo rápido. Si falta un dato, lo pregunta de forma natural dentro de una respuesta, sin encuestas.", "Personas: tres preguntas alcanzan para distinguir a quién escribe"],
              ["Resumen diario", "A las 9 llega lo que pasó ayer y lo que no puede esperar hoy, con un botón para abrir cada chat. Durante el día solo avisa si vuelve un cliente, reaparece alguien o llega un referido.", "Customer Journey: «se enfría» en la espera"],
              ["Clientes destacados y reglas", "Marcás a un cliente con una estrella y MARQui te avisa apenas escribe. También le pedís tareas que se repiten («todos los días a las 18 pasame…»), que quedan a la vista en sus Reglas.", "Personas: Roberto, el inversor que ya confía"],
              ["Derivación de potenciales", "Cuando detecta intención real (pide una reunión o pregunta formas de pago), marca al interesado como potencial y lo deriva a quien corresponde. Si se acuerda una reunión, propone agendarla en el calendario de la empresa, con tu confirmación.", "Clustering: no saben quién va a comprar"],
              ["Re-contactos", "Recuerda a quién volver a escribir y sugiere un motivo real, como una foto de avance de obra o una unidad que se reservó.", "Customer Journey: «se pierde» cuando desaparece"],
              ["Resumen de contexto", "Si alguien reaparece después de meses, resume en una oración de qué se habló.", "Customer Journey: «empieza de cero» cuando vuelve"],
              ["Preguntá lo que necesites", "Le escribís o le mandás un audio, como a un compañero, y te contesta con números o con la lista en Excel. Si hay un evento, te dice a quién avisarle y te prepara el mensaje.", "Clustering: la información está, pero no hay datos rápidos"],
              ["Aprendizaje continuo", "Aprende de los chats, los audios, los Excel de precios, los documentos de Drive y la web. Si algo nuevo contradice lo que sabía, como un precio, pregunta antes de reemplazarlo.", "Restricción: sin sistemas nuevos"],
              ["MARQui móvil", "En el celular es un contacto más: le preguntás, le mandás un audio o le reenviás el mensaje de un cliente y te devuelve tres respuestas para copiar.", "Fuera de la oficina el servidor no está disponible"],
            ],
          },
        },
      ],
    },
    {
      title: "Cómo se usa",
      blocks: [
        { p: "MARQui aparece en tres lugares, todos dentro de lo que el equipo ya usa:" },
        {
          table: {
            head: ["Dónde", "Cómo"],
            rows: [
              ["WhatsApp Web", "Una extensión de Chrome, la única instalación. Dentro de cada chat se ve la ficha del cliente arriba, las tres respuestas abajo y la estrella para seguirlo."],
              ["Celular", "MARQui es un contacto más de WhatsApp. Ahí llegan el resumen y los avisos, y se le pregunta lo que haga falta."],
              ["MARQador", "Se abre en una pestaña desde WhatsApp Web."],
            ],
          },
        },
        { p: "Un día típico: a las 9 llega el resumen; Cande abre los chats pendientes y responde eligiendo una sugerencia; a la tarde MARQui le avisa que escribió una clienta que sigue; y antes de irse le pregunta a MARQui a quién conviene invitar a la visita del sábado." },
        { note: "Si la extensión dejara de funcionar, MARQui sigue disponible por el contacto del celular. Las dos líneas de WhatsApp siguen igual que hoy." },
      ],
    },
    {
      title: "Tecnología",
      blocks: [
        {
          table: {
            head: ["Pieza", "Qué es"],
            rows: [
              ["Conexión con WhatsApp", "WhatsApp Business Platform (Cloud API), la API oficial de Meta, en modo coexistencia: los números siguen en el celular de siempre."],
              ["Extensión de Chrome", "Muestra MARQui dentro de WhatsApp Web. Solo sugiere y escribe en el cuadro de texto: el envío lo hace siempre una persona."],
              ["Servidor", "Recibe los mensajes, arma el contexto de cada cliente y coordina todo."],
              ["Inteligencia artificial", "Un modelo de lenguaje por API para entender las consultas y redactar las sugerencias, y un servicio de transcripción para los audios."],
              ["Base de datos", "PostgreSQL para fichas, conversaciones e historial, con búsqueda por similitud (pgvector) para encontrar casos parecidos que el equipo ya respondió y aprobó."],
              ["Conocimiento", "MARQui toma lo que sabe de Drive, los Excel y los chats. Por detrás, la consultora mantiene una base en Obsidian con las fichas de los proyectos, los precios de referencia, las preguntas frecuentes y el tono de MARQ. Ni el equipo ni los clientes la usan."],
            ],
          },
        },
        { p: "Restricciones a tener en cuenta:" },
        {
          list: [
            "Política de WhatsApp: pasadas 24 horas desde el último mensaje del cliente, los re-contactos tienen que salir con plantillas aprobadas por Meta.",
            "Datos personales: las conversaciones se anonimizan cuando corresponde y se tratan según la Ley 25.326, con acceso restringido.",
            "La integración en WhatsApp Web no es una herramienta oficial: WhatsApp puede cambiar su página y obligar a actualizarla. Por eso nunca envía mensajes sola.",
          ],
        },
      ],
    },
    {
      title: "Alcance",
      blocks: [
        { p: "La primera etapa desarrolla MARQui como herramienta interna de asistencia comercial y lo valida en uso real. Incluye todas las funciones de la sección 3 y el módulo MARQador." },
        { p: "No incluye, y queda para la Fase 4 o etapas posteriores:" },
        {
          list: [
            "Integración con la web y la lista de precios: MARQui no actualiza precios publicados ni modifica la web.",
            "Gestión de contenidos: publicar proyectos nuevos o cargar avances de obra.",
            "Links de pago de Mercado Pago y transacciones online.",
            "Automatizar la venta: MARQui no reemplaza a la persona en las decisiones comerciales.",
            "Otras integraciones con sistemas internos no definidas en este documento.",
          ],
        },
      ],
    },
    {
      title: "Roadmap",
      blocks: [
        {
          table: {
            head: ["Fase", "Cuándo", "Qué hacemos", "Hito"],
            rows: [
              ["1 · Conexión y aprendizaje silencioso", "Semanas 1 a 4", "Servidores, conexión con la API de WhatsApp y la base de datos. MARQui observa las conversaciones para aprender cómo responde MARQ, sin intervenir.", "El equipo trabaja igual que siempre mientras MARQui arma su memoria."],
              ["2 · Piloto en WhatsApp Web", "Meses 2 y 3", "Primera versión para un grupo reducido de vendedores, con la extensión: ficha del cliente, etapas y tres respuestas por chat.", "Primeras devoluciones del equipo para ajustar sugerencias y clasificación."],
              ["3 · Todo el equipo y MARQador", "Meses 4 a 6", "MARQui para todo el equipo comercial con los ajustes del piloto. Se activa MARQador, el resumen semanal en PDF por WhatsApp y las alertas de contactos sin seguimiento.", "Primeros indicadores y reportes para la gerencia."],
              ["4 · Web y Mercado Pago", "Mes 7", "Conexión con la lista de precios y la web: actualizar precios, cargar avances de obra y publicar proyectos. Links de seña de Mercado Pago, empezando por los lotes como prueba controlada.", "El equipo gestiona la web desde sus chats."],
            ],
          },
        },
      ],
    },
    {
      title: "Cómo lo medimos",
      blocks: [
        { p: "Antes de activar las sugerencias medimos dos semanas sin MARQui como línea de base, y después comparamos con los mismos indicadores:" },
        {
          table: {
            head: ["Indicador", "Hoy", "Lo que esperamos"],
            rows: [
              ["Tiempo para responder cada consulta", "Unos 3 min 10 s escribiendo de cero", "Unos 40 s eligiendo una sugerencia (5× más rápido)"],
              ["Horas por semana respondiendo", "4 h por día, la mitad son preguntas repetidas", "8 h por semana por persona que vuelven a la venta"],
              ["Consultas respondidas en la primera hora", "Sin medir", "La mayoría; responder en la primera hora multiplica por 7 las chances de avanzar (HBR, 2011)"],
              ["Consultas que llegan a reunión y reuniones que terminan en reserva", "Sin medir", "Primer dato real para comparar campañas"],
            ],
          },
        },
        { note: "El 5× y las 8 h son un caso estimado para MARQ. Los vamos a confirmar con la línea de base. Además, un estudio con asistentes de IA en atención al cliente encontró un 34 % más de consultas resueltas por hora en quienes recién empiezan (NBER, 2023).", tone: "warn" },
      ],
    },
    {
      title: "Próximos pasos",
      blocks: [
        { p: "Para empezar le pedimos a MARQ tres decisiones:" },
        {
          list: [
            "Aprobar la propuesta, con el alcance, el roadmap de siete meses y las exclusiones descritas.",
            "Autorizar la conexión del WhatsApp comercial y el uso del historial de conversaciones, con anonimización y según la ley de datos personales.",
            "Designar un referente del equipo comercial que valide los entregables y definir qué vendedores participan del piloto.",
          ],
          ordered: true,
        },
        { p: "Dos semanas antes de la Fase 1:" },
        {
          table: {
            head: ["Semana", "Acción", "Responsable"],
            rows: [
              ["1", "Reunión de presentación y aprobación de la propuesta", "Dirección de MARQ y consultora"],
              ["1", "Empezar a firmar las respuestas con el nombre de quien atiende y a hacer las tres preguntas de orientación (vivir o invertir, si ya compró con MARQ, cómo piensa pagar)", "Equipo comercial"],
              ["1 y 2", "Línea de base: horas respondiendo, consultas que llegan a reunión y reuniones que terminan en reserva", "Equipo comercial, con la consultora"],
              ["1 y 2", "Confirmar la integración con el software de gestión", "Consultora"],
              ["1 y 2", "Entrevistar a dos o tres compradores para validar las Personas", "Consultora"],
              ["2", "Presentar el prototipo de MARQui al equipo comercial", "Consultora y referente"],
              ["2", "Reunión de inicio de la Fase 1", "Consultora y referente"],
            ],
          },
        },
      ],
    },
  ],

  marqador: [
    {
      title: "Resumen",
      blocks: [
        { p: "MARQador es el módulo de datos de MARQui, no otra herramienta: viene incluido y usa las mismas conversaciones, sin carga manual. MARQui ayuda en cada charla, una por una; MARQador junta todas las fichas y muestra qué pide el mercado." },
        { p: "Responde a dos dolores de la consultoría: no saber quién va a comprar y decidir la pauta por cantidad de consultas, no por su calidad. En un lanzamiento llegaron 500 consultas y no hubo forma de saber cuántas personas podían pagar sin leer los chats uno por uno." },
      ],
    },
    {
      title: "Las cinco pantallas",
      blocks: [
        { p: "Se abre en una pestaña desde WhatsApp Web. Cada pantalla responde una pregunta del negocio:" },
        {
          table: {
            head: ["Pantalla", "Pregunta", "Qué muestra"],
            rows: [
              ["Pauta", "¿Dónde conviene poner la plata?", "De qué anuncio o canal viene cada consulta y cuántas llegan a reunión o visita. Compara campañas con recomendaciones."],
              ["Demanda", "¿Qué piden y cómo piensan pagar?", "Qué tipologías se piden más y menos, para vivir o para invertir, y cómo piensan pagar. Incluye las preguntas sin respuesta: lo que la gente pregunta y no está en el folleto."],
              ["Contactos", "¿A quién llamo o invito?", "La lista filtrada por proyecto, intención y forma de pago, con cada nombre listo para abrir su chat."],
              ["Frenos", "¿Por qué no avanzan?", "Qué proporción quedó como «hoy no puede» y por qué: financiación, precio, ubicación, momento."],
              ["Semana", "¿Cómo venimos?", "Consultas, nuevos interesados, reservas y consultas sin responder, contra la semana anterior."],
            ],
          },
        },
      ],
    },
    {
      title: "De dónde salen los datos",
      blocks: [
        { p: "Cada vez que MARQui completa una ficha, ese dato queda disponible para MARQador. Nadie carga nada en otro sistema: los datos salen de las conversaciones que el equipo ya tiene." },
        {
          list: [
            "La ficha automática: proyecto, qué busca, cómo paga y etapa.",
            "El origen: el anuncio o canal por el que llegó la consulta.",
            "El avance: si pidió reunión, si visitó o si reservó.",
            "Las tres preguntas de orientación, que MARQui hace de forma natural dentro de una respuesta.",
          ],
        },
        { note: "Fuera de MARQ solo podrían compartirse informes agregados y anónimos, nunca los datos de una persona." },
      ],
    },
    {
      title: "Reportes",
      blocks: [
        {
          list: [
            "Resumen semanal en PDF, que llega por WhatsApp.",
            "La lista en Excel cuando se le pide a MARQui.",
            "Un resumen para las reuniones quincenales o mensuales que el equipo ya hace.",
            "Alertas tempranas de contactos sin seguimiento y de clientes que vuelven.",
          ],
        },
      ],
    },
    {
      title: "Cómo lo medimos",
      blocks: [
        { p: "MARQador se pone en marcha en la Fase 3, cuando ya hay fichas de varios meses. Lo evaluamos con dos preguntas: si la pauta se empieza a decidir por consultas que avanzan y no por cantidad, y si el equipo usa las listas de Contactos para invitar a eventos y re-contactar." },
      ],
    },
  ],

  alloy: [
    {
      title: "Resumen",
      blocks: [
        { p: "MARQ Alloy es nuestra segunda propuesta. Alloy significa aleación: la iniciativa une arquitectura, arte regional y comunidad para que en Resistencia se sepa quién está detrás de cada edificio." },
        { p: "Sale del grupo «Reconocimiento de MARQ» del clustering. No lo elegimos como problema principal porque se construye a largo plazo, pero tampoco lo descartamos." },
      ],
    },
    {
      title: "El problema",
      blocks: [
        { p: "En la entrevista apareció que pocos saben quién está detrás de cada proyecto, que cada proyecto tiene identidad propia y que MARQ quiere mostrar su trayectoria para generar confianza. En la preventa eso pesa: se compra algo que todavía no existe." },
        { quote: "Muy pocos conocen quiénes están detrás del proyecto.", who: "Anotaciones de la entrevista" },
      ],
    },
    {
      title: "La propuesta",
      blocks: [
        { p: "Convertir cada desarrollo en un posible hito cultural de la ciudad con una escultura de identidad propia. Cada intervención contempla:" },
        {
          list: [
            "Una obra de un artista regional, por encargo o convocatoria remunerada. Como alternativa, un concurso estudiantil con un convenio a explorar con la FADyCC–UNNE.",
            "Un basamento de hormigón con el nombre de MARQ y del artista, respetando la autoría.",
            "Iluminación cálida y conservación planificada.",
            "Una ficha digital por QR con la historia de la obra, el artista y el proyecto.",
            "Una inauguración abierta del edificio y su obra.",
          ],
        },
        { p: "La escultura cambia en cada proyecto; la firma, el cuidado y la iluminación le dan continuidad al programa." },
      ],
    },
    {
      title: "Caso demostrativo",
      blocks: [
        { figure: "/assets/alloy/alloy-concept.jpg", alt: "Visualización conceptual con IA: escultura iluminada sobre una base de hormigón frente a Torre Natalini", caption: "Visualización generada con IA a partir de una foto publicada por MARQ. Es una exploración de forma, luz y emplazamiento: no es un proyecto técnico ni una obra seleccionada." },
        { p: "Usamos la Torre Natalini (Formosa 485, esquina Rivadavia), ya terminada, como referencia visual. La idea es integrar el arte desde el comienzo de cada nuevo desarrollo e inaugurar juntos el edificio y su obra. La elección del piloto sigue abierta: el próximo desarrollo junto a Carrefour requiere confirmar nombre, ubicación y etapa con MARQ." },
      ],
    },
    {
      title: "Implementación",
      blocks: [
        {
          list: [
            "MARQ define el lugar, un responsable y el límite de inversión.",
            "Se relevan circulación, accesibilidad, dominio del terreno y autorización del consorcio.",
            "Se consulta al municipio qué requisitos aplican al emplazamiento.",
            "Se define el encargo o la convocatoria, con derechos de autor, créditos, instalación y conservación.",
            "Se presupuesta obra, cálculo e instalación, base, iluminación, seguros, comunicación y mantenimiento.",
            "Se inauguran el edificio y su escultura en un mismo evento abierto.",
            "Se evalúa el piloto antes de replicarlo.",
          ],
          ordered: true,
        },
      ],
    },
    {
      title: "Financiamiento y cuidado",
      blocks: [
        { p: "Como opción inicial, el presupuesto sale de la identidad de cada proyecto, con patrocinio complementario posible bajo reglas de marca y autoría. No indicamos montos sin cotizaciones." },
        { p: "Hay que asignar un responsable de limpieza, revisión eléctrica y conservación. El presupuesto debe cubrir toda la vida de la obra, no solo su compra." },
      ],
    },
    {
      title: "Cómo lo medimos",
      blocks: [
        {
          list: [
            "Encuesta de reconocimiento de MARQ antes del piloto y a los 90 días, con muestras comparables.",
            "Notas publicadas en medios: cuál, cuándo y si nombran a MARQ.",
            "Visitas a la ficha QR.",
            "Menciones orgánicas en redes, separando contenido propio de cobertura independiente.",
            "Costo total y necesidades de mantenimiento.",
          ],
        },
        { note: "Son criterios propuestos. No prometemos porcentajes de crecimiento ni repercusión en medios.", tone: "warn" },
      ],
    },
  ],
};
