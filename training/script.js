(() => {
  const revealTargets = document.querySelectorAll(
    ".section-head, .signal-list li, .deliver-list li, .steps li, .multiplier, .effect-note, .contact-panel"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  const items = Array.from(document.querySelectorAll("#pack-list li"));
  const stepEl = document.getElementById("pack-step");
  const statusEl = document.getElementById("pack-status");
  if (!items.length || !stepEl || !statusEl) return;

  const statuses = [
    "Готовим контур для вашей команды…",
    "Подключаем роли агентов…",
    "Фиксируем регламент review…",
    "Открываем доступ к метаданным…",
    "Собираем типовые сценарии…",
    "Пакет правил готов к передаче",
  ];

  let index = 0;

  const tick = () => {
    items.forEach((item, i) => item.classList.toggle("is-on", i === index));
    stepEl.textContent = String(index + 1).padStart(2, "0");
    statusEl.textContent = statuses[index] || statuses[statuses.length - 1];
    index = (index + 1) % items.length;
  };

  tick();
  window.setInterval(tick, 2200);
})();
