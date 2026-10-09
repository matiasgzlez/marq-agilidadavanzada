const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const running = new WeakMap();

export function revealContent(element, distance = 10) {
  if (!element || element.hidden) return;
  running.get(element)?.cancel();
  if (reduced.matches) return;
  const animation = element.animate(
    [
      { opacity: 0.25, transform: `translateY(${distance}px)` },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 360, easing: "cubic-bezier(.22,1,.36,1)" },
  );
  running.set(element, animation);
}

// One moving selection surface rather than independent flashing buttons.
// Geometry is recalculated after font loading, resizing and hidden-panel changes.
export function installSlidingTabs(group) {
  const indicator = document.createElement("span");
  indicator.className = "tab-indicator";
  indicator.setAttribute("aria-hidden", "true");
  group.prepend(indicator);
  group.classList.add("sliding-tabs");
  let frame;
  function update() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const active = group.querySelector(
        'button[aria-selected="true"],button[aria-pressed="true"]',
      );
      if (!active || !group.offsetWidth) return;
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.height = `${active.offsetHeight}px`;
      indicator.style.transform = `translate(${active.offsetLeft}px,${active.offsetTop}px)`;
      indicator.classList.add("positioned");
    });
  }
  const resize = new ResizeObserver(update);
  resize.observe(group);
  group.querySelectorAll("button").forEach((button) => resize.observe(button));
  const state = new MutationObserver(update);
  state.observe(group, {
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-selected", "aria-pressed"],
  });
  document.fonts.ready.then(update);
  update();
  if (import.meta.hot)
    import.meta.hot.dispose(() => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      state.disconnect();
    });
}
