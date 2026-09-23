(() => {
  const revealTargets = document.querySelectorAll(
    ".section-head, .method-list li, .result-grid article, .truth-panel, .faq details, .contact-panel"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

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
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  const codeEl = document.getElementById("typed-code");
  if (!codeEl) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lines = [
    { html: '<span class="cm">// Демо-база · без боевых данных</span>', delay: 28 },
    { html: '<span class="kw">Функция</span> <span class="fn">РассчитатьСуммуЗаказа</span>(Заказ) <span class="kw">Экспорт</span>', delay: 18 },
    { html: "", delay: 40 },
    { html: '    Сумма = 0;', delay: 16 },
    { html: '    <span class="kw">Для Каждого</span> Строка <span class="kw">Из</span> Заказ.Товары <span class="kw">Цикл</span>', delay: 14 },
    { html: '        Сумма = Сумма + Строка.Сумма;', delay: 14 },
    { html: '    <span class="kw">КонецЦикла</span>;', delay: 18 },
    { html: "", delay: 35 },
    { html: '    <span class="kw">Возврат</span> Сумма;', delay: 16 },
    { html: '<span class="kw">КонецФункции</span>', delay: 20 },
  ];

  if (reduceMotion) {
    codeEl.innerHTML = lines.map((line) => line.html).join("\n");
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let buffer = "";
  let plain = "";

  const typeNext = () => {
    if (lineIndex >= lines.length) {
      setTimeout(restart, 2600);
      return;
    }

    const current = lines[lineIndex];
    if (!plain) {
      const temp = document.createElement("div");
      temp.innerHTML = current.html;
      plain = temp.textContent || "";
    }

    if (charIndex < plain.length) {
      charIndex += 1;
      const partial = plain.slice(0, charIndex);
      // Show plain progressive text for current line, keep completed lines styled
      const completed = lines
        .slice(0, lineIndex)
        .map((line) => line.html)
        .join("\n");
      const prefix = completed ? `${completed}\n` : "";
      codeEl.innerHTML = `${prefix}${escapeHtml(partial)}`;
      setTimeout(typeNext, current.delay);
      return;
    }

    // Replace plain current line with styled version
    buffer = lines
      .slice(0, lineIndex + 1)
      .map((line) => line.html)
      .join("\n");
    codeEl.innerHTML = buffer;
    lineIndex += 1;
    charIndex = 0;
    plain = "";
    setTimeout(typeNext, 220);
  };

  const restart = () => {
    lineIndex = 0;
    charIndex = 0;
    plain = "";
    buffer = "";
    codeEl.innerHTML = "";
    setTimeout(typeNext, 400);
  };

  const escapeHtml = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  setTimeout(typeNext, 500);

  // Stagger the last agent turning on
  const testAgent = document.querySelector(".ide-agents .agent:last-child");
  if (testAgent) {
    setTimeout(() => testAgent.classList.add("on"), 4200);
  }
})();
