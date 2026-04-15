/**
 * Red pill route — canvas rain + splashes + pointer aura (background layer).
 */
(function () {
  "use strict";

  var SPEED_MUL = 0.8;

  var rainCanvas = document.getElementById("redStormRainCanvas");
  var fxCanvas = document.getElementById("redStormFxCanvas");
  if (!rainCanvas || !fxCanvas) return;

  var rainCtx = rainCanvas.getContext("2d");
  var fxCtx = fxCanvas.getContext("2d");
  var pointerAura = document.getElementById("redStormPointerAura");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var state = {
    width: 0,
    height: 0,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    raindrops: [],
    splashes: [],
    pointer: {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.55,
      radius: 120,
      active: false,
    },
  };

  var rafId = 0;

  function resizeCanvas() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    [rainCanvas, fxCanvas].forEach(function (canvas) {
      canvas.width = state.width * state.dpr;
      canvas.height = state.height * state.dpr;
      canvas.style.width = state.width + "px";
      canvas.style.height = state.height + "px";
    });
    rainCtx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    fxCtx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    createRain();
  }

  function Raindrop() {
    this.reset(true);
  }

  /**
   * Near-vertical streaks: random spawn x, slight random tilt, fall top → bottom.
   */
  Raindrop.prototype.reset = function (initial) {
    this.depth = Math.random();
    this.x = Math.random() * (state.width + 80) - 40;
    this.y = initial ? Math.random() * state.height : -20 - Math.random() * 220;
    this.length = (12 + this.depth * 26 + Math.random() * 20) * (0.9 + Math.random() * 0.25);
    this.vy = (5.5 + this.depth * 8.5 + Math.random() * 7) * SPEED_MUL;
    this.tilt = (Math.random() - 0.5) * 0.55;
    this.wobble = (Math.random() - 0.5) * 0.18;
    this.width = 0.55 + this.depth * 1.1;
    this.opacity = 0.1 + this.depth * 0.46;
  };

  Raindrop.prototype.update = function () {
    var p = state.pointer;
    var dx = this.x - p.x;
    var dy = this.y - p.y;
    var dist = Math.hypot(dx, dy);
    var bendX = 0;
    var bendY = 0;

    if (dist < p.radius) {
      var force = 1 - dist / p.radius;
      var angle = Math.atan2(dy, dx);
      bendX = Math.cos(angle) * force * (4 + this.depth * 8);
      bendY = Math.sin(angle) * force * 1.2;

      if (Math.random() < 0.018 * force) {
        state.splashes.push({
          x: this.x,
          y: this.y,
          vx: (Math.random() - 0.5) * 1.4 + bendX * 0.06,
          vy: -0.7 - Math.random() * 1.3,
          life: 16 + Math.random() * 10,
          size: 0.7 + Math.random() * 1.6,
          alpha: 0.16 + Math.random() * 0.38,
        });
      }
    }

    var drift = this.tilt * 0.4 + Math.sin(this.y * 0.011 + this.wobble * 12) * 0.14;
    this.x += drift + bendX * 0.45;
    this.y += this.vy + bendY * 0.35;

    if (this.y > state.height + this.length || this.x < -60 || this.x > state.width + 60) {
      this.reset();
    }
  };

  Raindrop.prototype.draw = function (ctx) {
    var dx = this.tilt * this.length * 0.42;
    ctx.beginPath();
    ctx.lineWidth = this.width;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(200, 220, 245, " + this.opacity + ")";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + dx, this.y + this.length);
    ctx.stroke();
  };

  function createRain() {
    var count = state.width < 768 ? 150 : 280;
    if (reduceMotion) count = Math.floor(count * 0.35);
    state.raindrops = [];
    for (var i = 0; i < count; i++) {
      state.raindrops.push(new Raindrop());
    }
    state.splashes = [];
  }

  function drawRain() {
    rainCtx.clearRect(0, 0, state.width, state.height);
    for (var i = 0; i < state.raindrops.length; i++) {
      state.raindrops[i].update();
      state.raindrops[i].draw(rainCtx);
    }
  }

  function drawSplashes() {
    fxCtx.clearRect(0, 0, state.width, state.height);
    for (var i = state.splashes.length - 1; i >= 0; i--) {
      var s = state.splashes[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.042;
      s.life -= 1;
      fxCtx.beginPath();
      fxCtx.fillStyle =
        "rgba(215, 232, 255, " + Math.max(0, (s.life / 28) * s.alpha) + ")";
      fxCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      fxCtx.fill();
      if (s.life <= 0) {
        state.splashes.splice(i, 1);
      }
    }
  }

  function tick() {
    if (reduceMotion) {
      rainCtx.clearRect(0, 0, state.width, state.height);
      fxCtx.clearRect(0, 0, state.width, state.height);
      rafId = requestAnimationFrame(tick);
      return;
    }
    if (document.hidden) {
      rafId = requestAnimationFrame(tick);
      return;
    }
    drawRain();
    drawSplashes();
    rafId = requestAnimationFrame(tick);
  }

  function setPointer(x, y) {
    state.pointer.x = x;
    state.pointer.y = y;
    if (pointerAura) {
      pointerAura.style.setProperty("--rs-mx", (x / state.width) * 100 + "%");
      pointerAura.style.setProperty("--rs-my", (y / state.height) * 100 + "%");
    }
  }

  window.addEventListener(
    "mousemove",
    function (e) {
      setPointer(e.clientX, e.clientY);
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    function (e) {
      var t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    },
    { passive: true }
  );
  window.addEventListener(
    "touchstart",
    function (e) {
      var t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    },
    { passive: true }
  );

  window.addEventListener(
    "resize",
    function () {
      resizeCanvas();
    },
    { passive: true }
  );

  resizeCanvas();
  rafId = requestAnimationFrame(tick);
  setPointer(window.innerWidth * 0.5, window.innerHeight * 0.55);

  window.addEventListener(
    "beforeunload",
    function () {
      cancelAnimationFrame(rafId);
    },
    { passive: true }
  );
})();
