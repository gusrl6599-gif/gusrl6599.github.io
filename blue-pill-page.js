/**
 * Blue pill route — ambient layers, rotating lines, dream overlay.
 * 모바일·터치에서는 별·파티클 수·애니메이션·idle 펄스를 줄여 끊김을 완화합니다.
 */
(function () {
  "use strict";

  const lines = [
    "You woke up in the same world.",
    "Nothing changed. Everything is fine.",
    "The morning light remembers you.",
    "Same room. Same light. Same life.",
    "Stay where it feels warm and familiar.",
    "Some truths are easier left untouched.",
  ];

  const root = document.querySelector(".blue-dream");
  if (!root) return;

  const rotatingLine = document.getElementById("blueDreamRotatingLine");
  const changeLineBtn = document.getElementById("blueDreamChangeLineBtn");
  const dreamBtn = document.getElementById("blueDreamDreamBtn");
  const glowBtn = document.getElementById("blueDreamGlowBtn");
  const sleepOverlay = document.getElementById("blueDreamSleepOverlay");
  const cursorGlow = document.getElementById("blueDreamCursorGlow");
  const flash = document.getElementById("blueDreamFlash");
  const starsHost = document.getElementById("blueDreamStars");
  const particlesHost = document.getElementById("blueDreamParticles");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isLiteMode() {
    if (reduceMotion) return true;
    if (window.innerWidth <= 768) return true;
    if (window.matchMedia("(pointer: coarse)").matches) return true;
    return false;
  }

  let liteMode = isLiteMode();

  let lineIndex = 0;
  let rotateTimerId = 0;
  let idleTimerId = 0;
  let rafId = 0;
  let scrollClassTid = 0;
  let pendingMx = 50;
  let pendingMy = 50;

  function setLine(nextIndex) {
    if (!rotatingLine) return;
    if (reduceMotion || liteMode) {
      rotatingLine.textContent = lines[nextIndex];
      return;
    }
    rotatingLine.animate(
      [
        { opacity: 1, transform: "translateY(0px)" },
        { opacity: 0, transform: "translateY(8px)" },
      ],
      { duration: 220, easing: "ease-out" }
    );

    window.setTimeout(() => {
      rotatingLine.textContent = lines[nextIndex];
      rotatingLine.animate(
        [
          { opacity: 0, transform: "translateY(-8px)" },
          { opacity: 1, transform: "translateY(0px)" },
        ],
        { duration: 420, easing: "ease-out" }
      );
    }, 180);
  }

  function startRotateTimer() {
    if (reduceMotion) return;
    clearInterval(rotateTimerId);
    const interval = liteMode ? 9000 : 5000;
    rotateTimerId = window.setInterval(() => {
      if (document.hidden) return;
      lineIndex = (lineIndex + 1) % lines.length;
      setLine(lineIndex);
    }, interval);
  }

  if (changeLineBtn) {
    changeLineBtn.addEventListener("click", () => {
      lineIndex = (lineIndex + 1) % lines.length;
      setLine(lineIndex);
    });
  }

  if (dreamBtn && sleepOverlay) {
    dreamBtn.addEventListener("click", () => {
      sleepOverlay.classList.add("blue-dream__sleep--show");
      window.setTimeout(() => {
        sleepOverlay.classList.remove("blue-dream__sleep--show");
      }, 2200);
    });
  }

  if (glowBtn && flash) {
    glowBtn.addEventListener("click", () => {
      if (reduceMotion || liteMode) return;
      flash.animate(
        [
          { opacity: 0 },
          { opacity: 0.14, offset: 0.2 },
          { opacity: 0.05, offset: 0.55 },
          { opacity: 0 },
        ],
        { duration: 1100, easing: "ease-out" }
      );
    });
  }

  function scheduleCursorFlush() {
    if (reduceMotion || liteMode || !cursorGlow) return;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      cursorGlow.style.setProperty("--bd-mx", `${pendingMx}%`);
      cursorGlow.style.setProperty("--bd-my", `${pendingMy}%`);
    });
  }

  if (cursorGlow && !reduceMotion && !liteMode) {
    window.addEventListener(
      "mousemove",
      (e) => {
        pendingMx = (e.clientX / window.innerWidth) * 100;
        pendingMy = (e.clientY / window.innerHeight) * 100;
        scheduleCursorFlush();
      },
      { passive: true }
    );
  }

  function starCount() {
    if (liteMode) return 5;
    return window.innerWidth < 1100 ? 22 : 30;
  }

  function particleCount() {
    if (liteMode) return 0;
    return window.innerWidth < 1100 ? 20 : 32;
  }

  function createStars() {
    if (!starsHost) return;
    starsHost.textContent = "";
    const count = starCount();
    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      star.className = "blue-dream__star";
      star.setAttribute("aria-hidden", "true");
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 40}%`;
      star.style.opacity = String(0.15 + Math.random() * 0.5);
      if (!liteMode) {
        star.style.setProperty("--bd-twinkle", `${4 + Math.random() * 7}s`);
      } else {
        star.style.setProperty("--bd-twinkle", "0s");
      }
      starsHost.appendChild(star);
    }
  }

  function createParticles() {
    if (!particlesHost) return;
    particlesHost.textContent = "";
    const count = particleCount();
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "blue-dream__particle";
      p.setAttribute("aria-hidden", "true");
      const size = 2 + Math.random() * 6;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `${-10 - Math.random() * 20}%`;
      p.style.animationDuration = `${10 + Math.random() * 18}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      p.style.setProperty("--bd-tx", `${-6 + Math.random() * 12}vw`);
      particlesHost.appendChild(p);
    }
  }

  function subtleAutoPulse() {
    if (reduceMotion || liteMode || !flash) return;
    flash.animate(
      [
        { opacity: 0 },
        { opacity: 0.05, offset: 0.3 },
        { opacity: 0 },
      ],
      { duration: 2400, easing: "ease-in-out" }
    );
  }

  function resetIdle() {
    if (liteMode) return;
    clearTimeout(idleTimerId);
    idleTimerId = window.setTimeout(subtleAutoPulse, 7000);
  }

  if (!liteMode) {
    ["mousemove", "click", "touchstart", "keydown"].forEach((evt) => {
      window.addEventListener(evt, resetIdle, { passive: true });
    });
  }

  /* 모바일 스크롤 시 합성 부담이 큰 레이어를 잠깐 낮춰 끊김 완화 */
  function markScrolling() {
    if (!root) return;
    root.classList.add("blue-dream--scrolling");
    clearTimeout(scrollClassTid);
    scrollClassTid = window.setTimeout(() => {
      root.classList.remove("blue-dream--scrolling");
    }, 140);
  }

  window.addEventListener("scroll", markScrolling, { passive: true });
  window.addEventListener("touchmove", markScrolling, { passive: true });
  window.addEventListener("wheel", markScrolling, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(rotateTimerId);
      rotateTimerId = 0;
    } else {
      startRotateTimer();
    }
  });

  let resizeTid = 0;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTid);
      resizeTid = window.setTimeout(() => {
        const next = isLiteMode();
        if (next !== liteMode) {
          liteMode = next;
          root.classList.toggle("blue-dream--lite", liteMode);
          clearInterval(rotateTimerId);
          startRotateTimer();
          if (!liteMode) resetIdle();
        }
        createStars();
        createParticles();
      }, 200);
    },
    { passive: true }
  );

  root.classList.toggle("blue-dream--lite", liteMode);

  createStars();
  createParticles();
  startRotateTimer();
  if (!liteMode) resetIdle();
})();
