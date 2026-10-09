import { revealContent } from './transitions.js';
const panel = document.querySelector('#marqui-conversation');
const tabs = [...document.querySelectorAll('[data-marqui-case]')];
let currentCase = 'consultas';
let mode = 'web';
const examples = {
  proyectos: {
    question: 'Cargá un proyecto nuevo: MARQ Collection.',
    answer: 'Empecemos por la ubicación, las tipologías y una descripción. Después podés mandarme fotos y planos.',
    detail: 'Vista previa · MARQ Collection',
    preview: 'La landing conserva las secciones y el estilo de MARQ. Revisás el contenido antes de publicarlo.',
    action: 'Simular aprobación de la landing',
    result: 'Aprobación simulada. La landing quedaría lista para publicar. En esta demo no se modifica ninguna web.'
  },
  precios: {
    question: 'Cambió el precio público del lote 12. ¿Lo actualizamos?',
    answer: 'Detecté el cambio en la lista. Puedo llevar ese mismo valor a la web. Los precios privados no se publican.',
    detail: 'Lote 12 · Precio público',
    preview: 'Lista de precios → Confirmación del equipo → Web actualizada',
    action: 'Simular actualización',
    result: 'Actualización simulada. El precio público quedaría sincronizado y el cambio registrado.'
  },
  reservas: {
    question: 'Prepará un link de seña de la unidad 2A para Juan.',
    answer: 'Primero confirmamos disponibilidad, importe y condiciones. Después se genera el link de Mercado Pago para compartir con Juan.',
    detail: 'Unidad 2A · Reserva',
    preview: 'El link no reserva la unidad por sí solo. La propuesta actualiza el estado cuando el pago se acredita y se valida.',
    action: 'Simular seña acreditada',
    result: 'Pago ficticio acreditado. La 2A pasaría a reservada en la lista y la web. No se generó un cobro real.'
  },
  obra: {
    question: 'Te paso una foto del avance de MARQ Collection.',
    answer: 'La preparo para la galería de avance de obra. Revisá el proyecto y el texto antes de aprobarla.',
    detail: 'Galería · Avance de obra',
    preview: 'Foto recibida · “Avance del tercer piso”. La publicación espera tu confirmación.',
    action: 'Simular publicación de la foto',
    result: 'Publicación simulada. La imagen se sumaría a la galería del proyecto con el texto aprobado.'
  },
  mercado: {
    question: '¿Qué está pidiendo la gente esta semana?',
    answer: 'En este ejemplo, la mayor demanda es de dos dormitorios. La financiación aparece como principal freno y las recomendaciones llegan más a reunión.',
    detail: 'MARQador · Datos ilustrativos',
    preview: 'Un resumen para orientar la oferta y la pauta. Los resultados reales dependerán de las conversaciones registradas.',
    action: 'Profundizar en financiación',
    result: 'Ejemplo: las consultas se concentran en el anticipo y la cantidad de cuotas. Una señal para revisar cómo se comunica la financiación.'
  },
  equipo: {
    question: 'Pasale la consulta de Juan a Majo.',
    answer: 'Preparo el contexto de la conversación para que Majo pueda continuar sin empezar de cero.',
    detail: 'Derivación · Equipo comercial',
    preview: 'Juan · Consulta por 2 dormitorios · Interés en financiación. Se comparte según los permisos del equipo.',
    action: 'Simular derivación',
    result: 'Derivación simulada a Majo. La acción quedaría registrada con responsable y fecha.'
  }
};
const replies = [
  '¡Hola, Juan! Gracias por escribirnos. ¿Buscás para vivir o para invertir? Así te paso las opciones que mejor encajan con vos.',
  '¡Hola, Juan! Soy del equipo de MARQ. Tenemos distintas tipologías y opciones de financiación. ¿Cuántos dormitorios estás buscando?',
  '¡Hola, Juan! Te ayudo con los valores y la disponibilidad. ¿Querés que coordinemos una charla para ver juntos las opciones?'
];
function bubble(text, type) {
  const p = document.createElement('p');
  p.className = `chat-bubble ${type}`;
  p.textContent = text;
  return p;
}
function render() {
  const isConsult = currentCase === 'consultas';
  document.querySelector('#marqui-mode-note').textContent = mode === 'mobile'
    ? 'Un contacto de WhatsApp al que le reenviás mensajes o le pedís una tarea.'
    : isConsult ? 'Dentro del chat con el cliente, en el navegador.' : 'Una conversación con MARQUI desde WhatsApp Web.';
  panel.replaceChildren();
  const date = document.createElement('span');
  date.className = 'chat-date'; date.textContent = 'Ejemplo de uso'; panel.append(date);
  if (isConsult) {
    panel.append(bubble(mode === 'web' ? 'Juan · Desde un anuncio\nHola, ¿precio?' : 'Reenviado de Juan\nHola, ¿precio?', 'outgoing'));
    panel.append(bubble('Te propongo tres formas de seguir. Elegí una y ajustala a tu manera.', 'incoming'));
    const options = document.createElement('div'); options.className = 'reply-options';
    replies.forEach((reply, index) => {
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = reply; button.setAttribute('aria-label', `Usar respuesta ${index + 1}: ${reply}`);
      button.addEventListener('click', () => {
        textarea.value = reply;
        options.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        send.disabled = false;
        status.textContent = 'Respuesta lista para editar. Todavía no se envió.';
      });
      button.setAttribute('aria-pressed', 'false'); options.append(button);
    });
    panel.append(options);
    const label = document.createElement('label'); label.htmlFor = 'marqui-draft'; label.textContent = 'Tu respuesta'; label.className = 'draft-label';
    const textarea = document.createElement('textarea'); textarea.id = 'marqui-draft'; textarea.rows = 3; textarea.placeholder = 'Elegí una sugerencia o escribí tu respuesta…'; textarea.maxLength = 2000;
    const send = document.createElement('button'); send.className = 'chat-action'; send.type = 'button'; send.textContent = 'Simular envío'; send.disabled = true;
    const status = document.createElement('p'); status.className = 'chat-status'; status.setAttribute('role', 'status');
    textarea.addEventListener('input', () => { send.disabled = !textarea.value.trim(); });
    send.addEventListener('click', () => {
      if (!textarea.value.trim()) return;
      status.textContent = 'Envío simulado. El cliente recibiría tu respuesta, con la identidad de MARQ. No se envió ningún mensaje real.';
      send.disabled = true;
    });
    panel.append(label, textarea, send, status);
  } else {
    const example = examples[currentCase];
    panel.append(bubble(example.question, 'outgoing'), bubble(example.answer, 'incoming'));
    const preview = document.createElement('div'); preview.className = 'chat-preview';
    const title = document.createElement('strong'); title.textContent = example.detail;
    const text = document.createElement('p'); text.textContent = example.preview;
    preview.append(title, text); panel.append(preview);
    const action = document.createElement('button'); action.className = 'chat-action'; action.type = 'button'; action.textContent = example.action;
    const status = document.createElement('p'); status.className = 'chat-status'; status.setAttribute('role', 'status');
    action.addEventListener('click', () => { status.textContent = example.result; action.disabled = true; });
    panel.append(action, status);
  }
  revealContent(panel, 0);
}
function selectCase(button) {
  currentCase = button.dataset.marquiCase;
  tabs.forEach(tab => { const active = tab === button; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  document.querySelector('#marqui-demo-panel').setAttribute('aria-labelledby', button.id);
  render();
}
tabs.forEach((button, index) => {
  button.addEventListener('click', () => selectCase(button));
  button.addEventListener('keydown', event => {
    const keys = { ArrowDown: (index + 1) % tabs.length, ArrowUp: (index - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault(); const next = tabs[keys[event.key]]; selectCase(next); next.focus();
  });
});
document.querySelectorAll('[data-marqui-mode]').forEach(button => button.addEventListener('click', () => {
  mode = button.dataset.marquiMode;
  document.querySelectorAll('[data-marqui-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  render();
}));
document.querySelector('#marqui-reset').addEventListener('click', render);
render();
