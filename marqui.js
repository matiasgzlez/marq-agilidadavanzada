import { revealContent } from './transitions.js';
const $ = selector => document.querySelector(selector);
const panel = $('#marqui-conversation');
const tabs = [...document.querySelectorAll('[data-marqui-case]')];
let currentCase = 'consultas';
let mode = 'web';
const examples = {
  consultas: {
    title: 'De “¿precio?” a una conversación que avanza.',
    description: 'MARQUI toma el contexto del proyecto y prepara tres respuestas. El equipo elige una, la ajusta y la envía. El cliente sigue hablando con una persona de MARQ.',
    steps: ['Abrís la consulta del cliente.', 'MARQUI propone tres respuestas.', 'Editás y enviás desde tu línea.']
  },
  proyectos: {
    title: 'Un proyecto nuevo, sin empezar una web de cero.',
    description: 'Le contás qué vas a lanzar y le compartís los materiales. MARQUI organiza la landing con el estilo de MARQ. Revisás la vista previa y decidís cuándo publicarla.',
    steps: ['Mandás ubicación, tipologías y archivos.', 'MARQUI prepara la landing.', 'Revisás y aprobás la publicación.'],
    messages: [['outgoing', 'Marqui, quiero cargar un proyecto nuevo: MARQ Collection.'], ['incoming', 'Dale. Pasame la ubicación, las tipologías y una descripción. Después sumamos las fotos y los planos.'], ['outgoing', 'Te comparto la ficha del proyecto y los materiales.'], ['incoming', 'Con eso preparo una vista previa. Mantengo el estilo de MARQ y dejo la publicación pendiente de tu OK.']],
    attachment: ['Ficha del proyecto.pdf', 'Planos y fotografías · Ejemplo'],
    previewTitle: 'MARQ Collection', previewLabel: 'VISTA PREVIA DE LANDING', preview: 'Presentación · Ubicación · Tipologías · Galería · Consulta', action: 'Aprobar esta vista previa', confirm: 'Publicar proyecto',
    review: 'La vista previa está aprobada. ¿Publicamos el proyecto con estos materiales?',
    result: 'Listo: el proyecto quedaría publicado con las secciones y materiales aprobados. Después podrías pedirme cambios de texto, fotos o galería.'
  },
  precios: {
    title: 'El precio cambia una vez. La información acompaña.',
    description: 'La lista que ya usa MARQ sería la fuente de referencia. Cuando cambia un precio público, MARQUI propone actualizar la web. Los valores privados nunca se publican.',
    steps: ['Se modifica la lista de precios.', 'MARQUI identifica el precio público.', 'Confirmás el cambio en la web.'],
    messages: [['incoming', 'Cambió el precio del lote 12 en la lista compartida. Ese precio es público. ¿Lo actualizo también en la web?'], ['outgoing', 'Mostrame qué cambiaría.'], ['incoming', 'Solo el precio público del lote 12. La información privada y el resto de las unidades se mantienen.']],
    previewTitle: 'Lote 12', previewLabel: 'CAMBIO PROPUESTO', preview: 'Fuente: lista de precios de MARQ\nDestino: precio público en la web\nEstado: pendiente de aprobación', action: 'Revisar actualización', confirm: 'Sí, actualizar en la web',
    review: 'Voy a usar el valor vigente de la lista. El cambio quedaría registrado con tu aprobación.',
    result: 'Listo: el precio público quedaría actualizado en la web. La lista y el proyecto mostrarían el mismo valor.'
  },
  reservas: {
    title: 'Del interés a una seña, con el estado al día.',
    description: 'Le pedís el link para una unidad y revisás sus condiciones. Cuando el pago se acredita y se valida, la reserva se refleja en la web y en la lista.',
    steps: ['Revisás unidad, importe y condiciones.', 'Compartís el link de Mercado Pago.', 'El pago validado actualiza la reserva.'],
    messages: [['outgoing', 'Prepará un link de seña de la unidad 2A para Juan.'], ['incoming', 'Primero revisamos disponibilidad, importe y condiciones de la seña. Con tu aprobación, preparo el link para compartir.']],
    previewTitle: 'Unidad 2A · Juan', previewLabel: 'SOLICITUD DE SEÑA', preview: 'Disponibilidad: a verificar\nImporte y condiciones: a confirmar\nMedio propuesto: Mercado Pago', action: 'Ver el siguiente paso', confirm: 'Simular pago validado',
    review: 'Con los datos confirmados, compartirías el link con Juan. La unidad pasa a reservada al acreditar y validar el pago, no al generar el link.',
    result: 'Pago ficticio validado. La unidad 2A quedaría reservada en la web y en la lista. No se creó un link de pago ni se cobró una seña real.'
  },
  obra: {
    title: 'La foto sale de la obra y llega a la web.',
    description: 'Mandás la foto con el nombre del proyecto. MARQUI prepara el texto y la ubicación en la galería. Vos revisás la publicación antes de que se vea en la web.',
    steps: ['Enviás una foto y el proyecto.', 'MARQUI prepara el avance de obra.', 'Confirmás y se actualiza la galería.'],
    messages: [['outgoing', 'Avance de MARQ Collection. Hoy terminamos la losa del tercer piso.'], ['incoming', 'Recibí la foto. La preparo para la galería de avance de MARQ Collection con este texto.']],
    attachment: ['avance-tercer-piso.jpg', 'Fotografía enviada desde la obra · Ejemplo'],
    previewTitle: 'Avance del tercer piso', previewLabel: 'BORRADOR DE PUBLICACIÓN', preview: 'Proyecto: MARQ Collection\nGalería: avance de obra\nTexto: “Finalizamos la losa del tercer piso”.', action: 'Revisar publicación', confirm: 'Sí, publicar el avance',
    review: 'La foto se sumaría a la galería de avance, con el proyecto y el texto que acabás de revisar.',
    result: 'Listo: el avance quedaría publicado. La próxima vez, alcanza con enviarme otra foto y decirme a qué proyecto corresponde.'
  },
  mercado: {
    title: 'Las consultas dejan de quedar solo en los chats.',
    description: 'MARQador reúne las señales de las conversaciones: qué buscan, qué frena la decisión y desde dónde llegan quienes avanzan. Un resumen para orientar proyectos y pauta.',
    steps: ['Se ordenan las consultas registradas.', 'Recibís un resumen semanal.', 'Preguntás para profundizar.'],
    messages: [['outgoing', '¿Qué está pidiendo la gente esta semana?'], ['incoming', 'Te comparto tres señales para revisar la oferta y la comunicación. Estos datos son ilustrativos.']],
    previewTitle: 'Tu semana en tres señales', previewLabel: 'MARQADOR · EJEMPLO', preview: 'Qué buscan → Dos dormitorios\nQué los frena → Financiación\nQuiénes avanzan → Recomendaciones', action: 'Preguntar por financiación', confirm: 'Ver una posible acción',
    review: 'En este ejemplo, las dudas se repiten en el anticipo y las cuotas. ¿Qué podríamos revisar en la comunicación?',
    result: 'Una posible acción: explicar el anticipo y las opciones de cuotas desde la primera respuesta. Después, comparar si más conversaciones avanzan a reunión.'
  }
};
const replies = [
  '¡Hola, Juan! Gracias por escribirnos. ¿Buscás para vivir o para invertir? Así te paso las opciones que mejor encajan con vos.',
  '¡Hola, Juan! Soy del equipo de MARQ. Tenemos distintas tipologías y opciones de financiación. ¿Cuántos dormitorios estás buscando?',
  '¡Hola, Juan! Te ayudo con los valores y la disponibilidad. ¿Querés que coordinemos una charla para ver juntos las opciones?'
];
function node(tag, className, text) {
  const element = document.createElement(tag); element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
function bubble(text, type) {
  const item = node('div', `chat-bubble ${type}`);
  item.append(node('p', '', text), node('span', 'bubble-time', type === 'outgoing' ? '10:32  ✓✓' : '10:31'));
  return item;
}
function renderConsultation() {
  panel.append(bubble(mode === 'web' ? 'Hola, ¿precio?' : 'Mensaje reenviado de Juan\nHola, ¿precio?', mode === 'web' ? 'incoming' : 'outgoing'));
  const assistant = node('section', 'wa-assistant');
  const heading = node('div', 'wa-assistant-heading');
  const avatar = node('img', ''); avatar.src = 'assets/marqui-mascot.png'; avatar.alt = '';
  heading.append(avatar, node('strong', '', 'MARQUI te da una mano'), node('small', '', 'Solo para el equipo'));
  assistant.append(heading, node('p', 'wa-assistant-intro', 'Tres maneras de seguir la conversación. Elegí una para llevarla al campo de respuesta.'));
  const options = node('div', 'reply-options');
  const editor = node('div', 'wa-composer');
  const textarea = node('textarea', ''); textarea.id = 'marqui-draft'; textarea.rows = 3; textarea.maxLength = 2000; textarea.placeholder = 'Elegí una sugerencia o escribí tu respuesta…';
  const label = node('label', 'draft-label', mode === 'web' ? 'Tu respuesta para Juan' : 'Borrador para enviarle a Juan'); label.htmlFor = textarea.id;
  const send = node('button', 'chat-action', 'Simular envío →'); send.type = 'button'; send.disabled = true;
  const status = node('p', 'chat-status'); status.setAttribute('role', 'status');
  replies.forEach((reply, index) => {
    const button = node('button', ''); button.type = 'button'; button.setAttribute('aria-label', `Usar respuesta ${index + 1}`); button.setAttribute('aria-pressed', 'false');
    button.append(node('span', 'reply-number', `0${index + 1}`), node('span', '', reply));
    button.addEventListener('click', () => {
      textarea.value = reply; options.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      send.disabled = false; status.textContent = 'Borrador preparado. Podés editarlo antes de simular el envío.';
    }); options.append(button);
  });
  assistant.append(options); panel.append(assistant);
  textarea.addEventListener('input', () => { send.disabled = !textarea.value.trim(); });
  send.addEventListener('click', () => {
    if (!textarea.value.trim()) return;
    panel.querySelector('.sent-preview')?.remove();
    const sent = bubble(textarea.value.trim(), 'outgoing'); sent.classList.add('sent-preview'); editor.before(sent);
    status.textContent = 'Así recibiría Juan tu respuesta. MARQUI no aparece como interlocutor del cliente. Envío simulado.'; send.disabled = true;
  });
  editor.append(label, textarea, send); panel.append(editor, status);
}
function renderWorkflow(example) {
  example.messages.forEach(([type, text], index) => {
    panel.append(bubble(text, type));
    if (example.attachment && index === 0) {
      const file = node('div', 'wa-file'); file.append(node('span', 'wa-file-icon', '▧'), node('strong', '', example.attachment[0]), node('small', '', example.attachment[1])); panel.append(file);
    }
  });
  const preview = node('div', 'chat-preview');
  preview.append(node('small', '', example.previewLabel), node('strong', '', example.previewTitle), node('p', '', example.preview)); panel.append(preview);
  const action = node('button', 'chat-action', example.action); action.type = 'button';
  const status = node('p', 'chat-status'); status.setAttribute('role', 'status');
  let step = 0;
  action.addEventListener('click', () => {
    if (step === 0) { status.textContent = example.review; action.textContent = example.confirm; step = 1; }
    else { status.textContent = example.result; action.textContent = 'Ejemplo completado ✓'; action.disabled = true; step = 2; }
  });
  panel.append(action, status);
}
function render() {
  const example = examples[currentCase];
  $('#marqui-case-select').value = currentCase;
  const clientChat = currentCase === 'consultas' && mode === 'web';
  $('#marqui-feature-title').textContent = example.title;
  $('#marqui-feature-description').textContent = example.description;
  $('#marqui-feature-steps').replaceChildren(...example.steps.map(text => node('li', '', text)));
  $('#marqui-demo-panel').classList.toggle('mobile-mode', mode === 'mobile');
  $('#wa-chat-name').textContent = clientChat ? 'Juan' : 'MARQUI';
  $('#wa-chat-subtitle').textContent = clientChat ? 'Consulta desde un anuncio · Línea de pauta' : 'Tu asistente de equipo';
  $('#wa-avatar').replaceChildren();
  if (clientChat) $('#wa-avatar').textContent = 'J';
  else { const image = node('img', ''); image.src = 'assets/marqui-mascot.png'; image.alt = ''; $('#wa-avatar').append(image); }
  $('.wa-contact-juan').classList.toggle('active', clientChat); $('.wa-contact-marqui').classList.toggle('active', !clientChat);
  $('#marqui-mode-note').textContent = mode === 'mobile' ? 'En el celular, MARQUI es un contacto. Le reenviás mensajes o le pedís una tarea.' : clientChat ? 'Las sugerencias son internas. Juan ve únicamente la respuesta que enviás.' : 'Le pedís la tarea a MARQUI en su chat y revisás lo que prepara.';
  panel.replaceChildren(node('span', 'chat-date', 'HOY · CONVERSACIÓN DE EJEMPLO'));
  if (currentCase === 'consultas') renderConsultation(); else renderWorkflow(example);
  revealContent(panel, 0);
}
function selectCase(button) {
  currentCase = button.dataset.marquiCase;
  tabs.forEach(tab => { const active = tab === button; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  $('#marqui-demo-panel').setAttribute('aria-labelledby', button.id); render();
}
tabs.forEach((button, index) => {
  button.addEventListener('click', () => selectCase(button));
  button.addEventListener('keydown', event => {
    const nextIndex = { ArrowDown: (index + 1) % tabs.length, ArrowRight: (index + 1) % tabs.length, ArrowUp: (index - 1 + tabs.length) % tabs.length, ArrowLeft: (index - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault(); const next = tabs[nextIndex]; selectCase(next); next.focus();
  });
});
document.querySelectorAll('[data-marqui-mode]').forEach(button => button.addEventListener('click', () => {
  mode = button.dataset.marquiMode;
  document.querySelectorAll('[data-marqui-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); render();
}));
$('#marqui-reset').addEventListener('click', render);
render();

// Keep the in-demo picker and the overview tabs on the same state.
function selectFromDemo(key) {
  const tab = tabs.find(button => button.dataset.marquiCase === key);
  if (!tab) return;
  selectCase(tab);
  $('#marqui-demo-panel').scrollIntoView({
    block: 'start',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  });
}
$('#marqui-case-select').addEventListener('change', event => selectFromDemo(event.target.value));
document.querySelectorAll('[data-case-step]').forEach(button => button.addEventListener('click', () => {
  const index = tabs.findIndex(tab => tab.dataset.marquiCase === currentCase);
  const next = (index + Number(button.dataset.caseStep) + tabs.length) % tabs.length;
  selectFromDemo(tabs[next].dataset.marquiCase);
}));
