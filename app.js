import "./background.js";
import "./marqui.js";
import { revealContent, installSlidingTabs } from "./transitions.js";
("use strict");
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const header = $(".header");
let currentSolution = "alloy";
let currentPanel = "soluciones";
const alloyHero = { title: $(".hero h1").innerHTML, description: $(".hero-description").innerHTML, actions: $(".hero .actions").innerHTML, caption: $(".hero-caption").innerHTML };
function updateSolutionIdentity() {
  const marqui = currentSolution === "marqui";
  document.body.classList.toggle("show-marqui", marqui);
  $(".brand .alloy").textContent = marqui ? "MARQUI" : "Alloy";
  $(".brand").setAttribute("aria-label", marqui ? "MARQUI, inicio" : "MARQ Alloy, inicio");
  $(".hero h1").innerHTML = marqui ? 'Menos pendientes.<br />Más tiempo para <em>hacer MARQ.</em>' : alloyHero.title;
  $(".hero-description").innerHTML = marqui ? 'Tu equipo, con una mano más.<br />Consultas, proyectos y decisiones. Todo MARQ, desde WhatsApp.' : alloyHero.description;
  $(".hero .actions").innerHTML = marqui ? '<a class="button primary" href="#marqui-demo">Conocé a MARQUI <span>↓</span></a><a class="button translucent" href="#marqui-demo">Probá la demo <span>↗</span></a>' : alloyHero.actions;
  $(".hero-caption").innerHTML = marqui ? '<span class="tiny-dot"></span> Tu asistente de equipo <span class="caption-place">Propuesta conceptual</span>' : alloyHero.caption;
  $(".header-link").href = marqui ? "#marqui-demo" : "#futuro";
  $(".header-link").innerHTML = marqui ? 'Probar MARQUI <span>↗</span>' : 'Explorar el futuro <span>↗</span>';
}
function selectPanel(name) {
  const changed = currentPanel !== name;
  currentPanel = name;
  $$("[data-panel]").forEach((button) => {
    const active = button.dataset.panel === name;
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
    document.getElementById(button.getAttribute("aria-controls")).hidden =
      !active;
  });
  $(".header-link").hidden =
    name !== "soluciones";
  if (changed) revealContent(document.getElementById(name), 0);
}
function selectSolution(name) {
  const changed = currentSolution !== name;
  currentSolution = name;
  $$("[data-solution]").forEach((button) => {
    const active = button.dataset.solution === name;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $("#alloy-content").hidden = name !== "alloy";
  $("#marqui-content").hidden = name !== "marqui";
  updateSolutionIdentity();
  selectPanel("soluciones");
  if (changed)
    revealContent($("#" + (name === "alloy" ? "alloy-content" : "marqui-content")), 0);
}
$$(".brand,.footer-bottom a").forEach((link) =>
  link.addEventListener("click", () => {
    selectPanel("soluciones");
  }),
);
$$("[data-panel]").forEach((button) =>
  button.addEventListener("click", () => {
    selectPanel(button.dataset.panel);
    window.scrollTo({ top: 0, behavior: "instant" });
  }),
);
$$("[data-solution]").forEach((button) =>
  button.addEventListener("click", () => {
    selectSolution(button.dataset.solution);
    const url = new URL(window.location.href);
    url.searchParams.set("solution", currentSolution);
    url.hash = "";
    history.replaceState(null, "", url);
  }),
);
$$("[data-return]").forEach((button) =>
  button.addEventListener("click", () => {
    selectSolution("alloy");
    window.scrollTo({ top: 0, behavior: "instant" });
  }),
);
function tabKeys(buttons) {
  buttons.forEach((button, index) =>
    button.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft")
        next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        buttons[next].click();
        buttons[next].focus();
      }
    }),
  );
}
tabKeys($$("[data-panel]"));
const image = $("#project-image");
let mapFrame;
const viewDescriptions = {
  concept:
    "Dos formas se encuentran. La arquitectura continúa en el espacio público.",
  real: "Fotografía de referencia publicada por Estudio MARQ. La escultura no existe en esta imagen.",
  map: "Ubicación real de referencia. El mapa no representa un emplazamiento aprobado.",
};
$$("[data-view]").forEach((button) =>
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    if (button.getAttribute("aria-pressed") === "true") return;
    $$("[data-view]").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    const isMap = view === "map";
    image.hidden = isMap;
    if (isMap && !mapFrame) {
      mapFrame = document.createElement("iframe");
      mapFrame.title = "Google Maps: Torre Natalini, Formosa 485, Resistencia";
      mapFrame.src =
        "https://maps.google.com/maps?q=Torre%20Natalini%20Formosa%20485%20Resistencia%20Chaco&output=embed";
      mapFrame.referrerPolicy = "no-referrer-when-downgrade";
      mapFrame.allowFullscreen = true;
      $("#viewer-stage").append(mapFrame);
    }
    if (mapFrame) mapFrame.hidden = !isMap;
    if (!isMap) {
      image.src =
        view === "concept"
          ? "assets/alloy-concept.png"
          : "assets/natalini-front.webp";
      image.alt =
        view === "concept"
          ? "Visualización conceptual con IA: escultura de bronce frente a Torre Natalini"
          : "Fotografía actual de referencia del frente de Torre Natalini, publicada por MARQ";
      $("#expand-image").href = image.src;
    }
    $("#expand-image").hidden = isMap;
    $("#view-note").hidden = isMap;
    $("#view-note").textContent =
      view === "real"
        ? "FOTOGRAFÍA DE REFERENCIA / ESTUDIO MARQ"
        : "VISUALIZACIÓN CONCEPTUAL · IA";
    $("#viewer-description").textContent = viewDescriptions[view];
    revealContent($("#viewer-stage"), 0);
  }),
);
const stories = {
  "norte": {
    "title": "Natalini abre sus puertas con una escultura que suma arte al paisaje de Resistencia",
    "paragraphs": [
      "MARQ presentó el edificio y una obra de autor regional en una misma inauguración. La propuesta Alloy integra arquitectura y arte desde el comienzo de cada desarrollo.",
      "En esta inauguración imaginada, vecinos, residentes y artistas descubren el edificio y su escultura en el mismo encuentro. La obra forma parte de la identidad del proyecto desde el primer día y ofrece un nuevo punto de referencia en la ciudad.",
      "La base de hormigón incorpora el nombre de MARQ junto a la autoría de la pieza. Por la noche, una iluminación cálida destaca sus formas y prolonga su presencia en la esquina.",
      "La idea de MARQ Alloy es incorporar una escultura propia a cada nuevo desarrollo y presentarlos juntos. Arquitectura y arte comparten así una inauguración, una historia para comunicar y una presencia que continúa después del evento."
    ]
  },
  "chaco": {
    "title": "MARQ inauguró Torre Natalini junto con una escultura de un artista regional",
    "paragraphs": [
      "El edificio y la obra se presentaron en un mismo acto. Con Alloy, la desarrolladora propone que cada nuevo proyecto nazca con una identidad artística propia.",
      "En esta inauguración imaginada, vecinos, residentes y artistas descubren el edificio y su escultura en el mismo encuentro. La obra forma parte de la identidad del proyecto desde el primer día y ofrece un nuevo punto de referencia en la ciudad.",
      "La base de hormigón incorpora el nombre de MARQ junto a la autoría de la pieza. Por la noche, una iluminación cálida destaca sus formas y prolonga su presencia en la esquina.",
      "La idea de MARQ Alloy es incorporar una escultura propia a cada nuevo desarrollo y presentarlos juntos. Arquitectura y arte comparten así una inauguración, una historia para comunicar y una presencia que continúa después del evento."
    ]
  },
  "tag": {
    "title": "Natalini abrió sus puertas: así es la escultura que se presentó junto al edificio",
    "paragraphs": [
      "La inauguración reunió arquitectura y arte regional en una misma celebración. La pieza forma parte de MARQ Alloy y acompaña al proyecto desde su apertura.",
      "En esta inauguración imaginada, vecinos, residentes y artistas descubren el edificio y su escultura en el mismo encuentro. La obra forma parte de la identidad del proyecto desde el primer día y ofrece un nuevo punto de referencia en la ciudad.",
      "La base de hormigón incorpora el nombre de MARQ junto a la autoría de la pieza. Por la noche, una iluminación cálida destaca sus formas y prolonga su presencia en la esquina.",
      "La idea de MARQ Alloy es incorporar una escultura propia a cada nuevo desarrollo y presentarlos juntos. Arquitectura y arte comparten así una inauguración, una historia para comunicar y una presencia que continúa después del evento."
    ]
  },
  "data": {
    "title": "MARQ inauguró Natalini y presentó la escultura que le da identidad al proyecto",
    "paragraphs": [
      "El edificio abrió sus puertas junto con una obra de autor regional. La presentación conjunta marca el inicio de Alloy, la propuesta de MARQ para unir arte y arquitectura.",
      "En esta inauguración imaginada, vecinos, residentes y artistas descubren el edificio y su escultura en el mismo encuentro. La obra forma parte de la identidad del proyecto desde el primer día y ofrece un nuevo punto de referencia en la ciudad.",
      "La base de hormigón incorpora el nombre de MARQ junto a la autoría de la pieza. Por la noche, una iluminación cálida destaca sus formas y prolonga su presencia en la esquina.",
      "La idea de MARQ Alloy es incorporar una escultura propia a cada nuevo desarrollo y presentarlos juntos. Arquitectura y arte comparten así una inauguración, una historia para comunicar y una presencia que continúa después del evento."
    ]
  }
};
const dialog = $("#article-dialog");
$$("[data-story]").forEach((button) => button.addEventListener("click", () => {
  const story = stories[button.dataset.story];
  $("#article-title").textContent = story.title;
  $("#article-body").replaceChildren(
    ...story.paragraphs.map((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      return p;
    }),
  );
  dialog.showModal();
  revealContent(dialog, 16);
}));
$$(".dialog-close,.dialog-done").forEach((button) =>
  button.addEventListener("click", () => dialog.close()),
);
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.close();
});
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  $$(".reveal").forEach((element) => {
    element.classList.add("js-reveal");
    observer.observe(element);
  });
}

$$(".switch,.mini-switch").forEach(installSlidingTabs);

// Local spotlight, without moving the cards or changing their hit targets.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  $$(".alloy-card,.solution-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    });
  });
}

if (new URLSearchParams(window.location.search).get("solution") === "marqui") selectSolution("marqui");
