(() => {
  const revealTargets = document.querySelectorAll(
    ".section-head, .approach-grid article, .method-list li, .client-card, .team-member, .metrics, .result-grid article, .faq details, .contact-panel"
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

  const orch = document.getElementById("orch");
  if (!orch) return;

  const stages = Array.from(orch.querySelectorAll(".orch-stage"));
  const stepEl = document.getElementById("orch-step");
  const taskText = document.getElementById("task-text");
  const codeEl = document.getElementById("orch-code");
  const handFromName = document.getElementById("hand-from-name");
  const handToName = document.getElementById("hand-to-name");
  const handFromMsg = document.getElementById("hand-from-msg");
  const handToMsg = document.getElementById("hand-to-msg");
  const handLog = document.getElementById("hand-log");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const taskFull = "Доработать расчёт суммы в документе «Заказ клиента»";
  const codeLines = [
    '<span class="cm">// Контекст из MCP · метаданные конфигурации</span>',
    '<span class="kw">Функция</span> <span class="fn">РассчитатьСуммуЗаказа</span>(Заказ) <span class="kw">Экспорт</span>',
    "",
    "    Сумма = 0;",
    '    <span class="kw">Для Каждого</span> Строка <span class="kw">Из</span> Заказ.Товары <span class="kw">Цикл</span>',
    "        Сумма = Сумма + Строка.Сумма;",
    '    <span class="kw">КонецЦикла</span>;',
    "",
    '    <span class="kw">Возврат</span> Сумма;',
    '<span class="kw">КонецФункции</span>',
  ];

  const handoffs = [
    {
      from: "Код BSL",
      to: "Сбор данных",
      fromMsg: "Модуль подготовлен",
      toMsg: "Нужны связанные объекты",
      log: "код → данные: запрос контекста конфигурации",
    },
    {
      from: "Сбор данных",
      to: "Код BSL",
      fromMsg: "Контекст собран через MCP",
      toMsg: "Уточнение модуля",
      log: "данные → код: метаданные и связи переданы",
    },
    {
      from: "Код BSL",
      to: "Тесты",
      fromMsg: "Версия модуля готова",
      toMsg: "Проверка сценариев",
      log: "код → тесты: передача на верификацию",
    },
  ];

  let stageIndex = 0;
  let typeTimer = null;
  let handTimer = null;

  const showStage = (index) => {
    stages.forEach((stage, i) => {
      stage.hidden = i !== index;
    });
    if (stepEl) stepEl.textContent = `${index + 1} / ${stages.length}`;
  };

  const typeTask = () =>
    new Promise((resolve) => {
      if (!taskText) return resolve();
      if (reduceMotion) {
        taskText.textContent = taskFull;
        return resolve();
      }
      taskText.textContent = "";
      let i = 0;
      const tick = () => {
        i += 1;
        taskText.textContent = taskFull.slice(0, i);
        if (i < taskFull.length) {
          setTimeout(tick, 28);
        } else {
          resolve();
        }
      };
      tick();
    });

  const typeCode = () =>
    new Promise((resolve) => {
      if (!codeEl) return resolve();
      clearTimeout(typeTimer);
      if (reduceMotion) {
        codeEl.innerHTML = codeLines.join("\n");
        return resolve();
      }

      let line = 0;
      let char = 0;
      let plain = "";
      codeEl.innerHTML = "";

      const tick = () => {
        if (line >= codeLines.length) {
          resolve();
          return;
        }
        const current = codeLines[line];
        if (!plain) {
          const temp = document.createElement("div");
          temp.innerHTML = current;
          plain = temp.textContent || "";
        }

        if (char < plain.length) {
          char += 1;
          const completed = codeLines.slice(0, line).join("\n");
          const prefix = completed ? `${completed}\n` : "";
          codeEl.innerHTML = `${prefix}${escapeHtml(plain.slice(0, char))}`;
          typeTimer = setTimeout(tick, 16);
          return;
        }

        codeEl.innerHTML = codeLines.slice(0, line + 1).join("\n");
        line += 1;
        char = 0;
        plain = "";
        typeTimer = setTimeout(tick, 180);
      };

      tick();
    });

  const runHandoffs = () =>
    new Promise((resolve) => {
      if (!handFromName || !handLog) return resolve();
      let i = 0;
      handLog.innerHTML = "";

      const show = () => {
        if (i >= handoffs.length) {
          resolve();
          return;
        }
        const item = handoffs[i];
        handFromName.textContent = item.from;
        handToName.textContent = item.to;
        handFromMsg.textContent = item.fromMsg;
        handToMsg.textContent = item.toMsg;
        const row = document.createElement("div");
        row.textContent = `> ${item.log}`;
        handLog.appendChild(row);
        i += 1;
        handTimer = setTimeout(show, reduceMotion ? 400 : 1400);
      };

      show();
    });

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, reduceMotion ? Math.min(ms, 400) : ms));

  const escapeHtml = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const activateAgents = () => {
    const cards = orch.querySelectorAll("[data-agent]");
    cards.forEach((card, index) => {
      card.classList.remove("is-active");
      setTimeout(() => card.classList.add("is-active"), 250 + index * 280);
    });
  };

  const loop = async () => {
    while (true) {
      stageIndex = 0;
      showStage(0);
      await typeTask();
      await wait(900);

      stageIndex = 1;
      showStage(1);
      activateAgents();
      await wait(2400);

      stageIndex = 2;
      showStage(2);
      await typeCode();
      await wait(1100);

      stageIndex = 3;
      showStage(3);
      await runHandoffs();
      await wait(700);

      stageIndex = 4;
      showStage(4);
      await wait(2800);
    }
  };

  showStage(0);
  loop();
})();
