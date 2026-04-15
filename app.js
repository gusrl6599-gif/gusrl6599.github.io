(function () {
  "use strict";

  var PILL_KEY = "cursorstudy_pillChoice";
  var MATRIX_AUDIO_SRC = "https://www.youtube.com/embed/gVtitA8RA2Y?autoplay=1&playsinline=1";
  var RED_ROUTE_CLIP_SRC =
    "https://www.youtube.com/embed/lJmcOWb3pU8?autoplay=1&playsinline=1&rel=0&modestbranding=1";

  function resetMainPillChoiceUI() {
    try {
      sessionStorage.removeItem(PILL_KEY);
    } catch (e) {
      /* ignore */
    }
    document.documentElement.classList.remove(
      "pill-already-chosen",
      "pill-choice-red",
      "pill-choice-blue"
    );
    var scene = document.getElementById("pill-scene");
    if (scene) {
      scene.removeAttribute("hidden");
      scene.classList.remove("is-leaving", "pill-scene--blue-route");
      scene.setAttribute("aria-hidden", "false");
    }
    var lw = document.getElementById("pill-liquid-warp");
    var hud = document.getElementById("pill-hud-overlay");
    var pb = document.getElementById("pill-blue");
    if (lw) lw.classList.remove("pill-scene__liquid-warp--active");
    if (hud) hud.classList.remove("pill-scene__hud--active");
    if (pb) pb.classList.remove("pill-3d--routing");
    document.documentElement.classList.add("pill-scene-open");
  }
  var PILL_ROUTES = {
    red: "red-pill.html",
    blue: "blue-pill.html",
    skip: "red-pill.html"
  };

  function initRedPrelude() {
    var prelude = document.getElementById("red-prelude");
    if (!prelude) return;
    var lines = prelude.querySelectorAll(".red-prelude__line");
    var glyphs = prelude.querySelector(".red-prelude__glyphs");
    var audioCtx = null;

    function initGlyphColumns() {
      if (!glyphs) return;
      var alphabet = "アカサタナハマヤラワ0123456789אבגדהוזחטיךכלםמןנסעףפץצקרשת";
      var cols = 28;

      function randomChunk(len) {
        var text = "";
        for (var i = 0; i < len; i++) {
          text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
          if ((i + 1) % 4 === 0) text += " ";
        }
        return text;
      }

      for (var c = 0; c < cols; c++) {
        var col = document.createElement("span");
        col.className = "red-prelude__glyph-col";
        var len = 28 + Math.floor(Math.random() * 18);
        col.textContent = randomChunk(len);
        col.style.left = (c * (100 / cols)).toFixed(2) + "%";
        col.style.animationDelay = (Math.random() * 1.2).toFixed(2) + "s";
        col.style.animationDuration = (4.2 + Math.random() * 2.8).toFixed(2) + "s";
        glyphs.appendChild(col);

        (function update(colEl, chunkLen) {
          window.setInterval(function () {
            var next = colEl.textContent || "";
            next = randomChunk(1) + next.slice(0, Math.max(0, next.length - 2));
            if (Math.random() < 0.22) next = randomChunk(chunkLen);
            colEl.textContent = next;
          }, 90 + Math.floor(Math.random() * 120));
        })(col, len);
      }
    }

    function getTypingDelay(current, index, speedMin, speedMax) {
      var ch = current.charAt(current.length - 1);
      var delay = speedMin + Math.floor(Math.random() * (speedMax - speedMin + 1));

      /* Human-ish hesitation: first chars and random mid-word pauses */
      if (index === 1) delay += 90 + Math.floor(Math.random() * 110);
      if (index === 2) delay += 40 + Math.floor(Math.random() * 130);
      if (Math.random() < 0.16) delay += 55 + Math.floor(Math.random() * 170);

      /* punctuation stalls a bit longer */
      if (ch === "." || ch === ",") {
        var punctuationDelay = speedMin < 30
          ? 90 + Math.floor(Math.random() * 120)
          : 140 + Math.floor(Math.random() * 210);
        delay += punctuationDelay;
      }
      return delay;
    }

    function playKnockSound() {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      try {
        if (!audioCtx) audioCtx = new Ctx();
        if (audioCtx.state === "suspended") audioCtx.resume();
        var now = audioCtx.currentTime;

        function knock(at) {
          var osc = audioCtx.createOscillator();
          var gain = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(170, at);
          osc.frequency.exponentialRampToValueAtTime(85, at + 0.08);
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(0.22, at + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.11);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(at);
          osc.stop(at + 0.12);
        }

        knock(now + 0.02);
        knock(now + 0.36);
      } catch (e) {
        /* ignore audio issues */
      }
    }

    function typeLine(el, speedMin, speedMax, done) {
      if (!el) {
        if (done) done();
        return;
      }
      var full = el.getAttribute("data-text") || "";
      var idx = 0;
      el.textContent = "";
      el.classList.add("is-visible", "is-typing");
      function tick() {
        idx += 1;
        var current = full.slice(0, idx);
        el.textContent = current;
        if (idx >= full.length) {
          el.classList.remove("is-typing");
          if (done) done();
          return;
        }
        var delay = getTypingDelay(current, idx, speedMin, speedMax);
        window.setTimeout(tick, delay);
      }
      tick();
    }

    initGlyphColumns();

    function clearLine(el, done) {
      el.classList.add("is-clearing");
      window.setTimeout(function () {
        el.textContent = "";
        el.classList.remove("is-visible", "is-typing", "is-clearing");
        if (done) done();
      }, 220);
    }

    function typeSequence(index) {
      if (index >= lines.length) return;
      var isLastLine = index === lines.length - 1;
      if (isLastLine) {
        window.setTimeout(function () {
          lines[index].textContent = lines[index].getAttribute("data-text") || "";
          lines[index].classList.add("is-visible");
          playKnockSound();
        }, 1000);
        return;
      }
      var isFastLine = index === 2;
      var speedMin = isFastLine ? 13 : 52;
      var speedMax = isFastLine ? 31 : 170;
      typeLine(lines[index], speedMin, speedMax, function () {
        var shouldClear = false;
        var pause = isFastLine ? 260 : 520;
        window.setTimeout(function () {
          if (shouldClear) {
            clearLine(lines[index], function () {
              typeSequence(index + 1);
            });
            return;
          }
          typeSequence(index + 1);
        }, pause);
      });
    }

    window.setTimeout(function () {
      typeSequence(0);
    }, 260);

    window.setTimeout(function () {
      prelude.classList.add("is-leaving");
    }, 15550);

    window.setTimeout(function () {
      /* Reveal main page only after prelude layer is removed (no spoiler during fade). */
      document.documentElement.classList.remove("red-prelude-pending");
      prelude.remove();
    }, 16120);
  }

  function initBlueReveal() {
    var reveal = document.getElementById("blue-reveal");
    if (!reveal) return;

    window.setTimeout(function () {
      reveal.classList.add("is-expanding");
    }, 40);

    /* Keep page hidden until overlay finishes fading out (avoid iris “spoiler”). */
    window.setTimeout(function () {
      reveal.classList.add("is-done");
    }, 2220);

    window.setTimeout(function () {
      document.documentElement.classList.remove("blue-reveal-pending");
      if (reveal.parentNode) reveal.remove();
    }, 3060);
  }

  function initRedRouteLightning() {
    var root = document.getElementById("red-route-lightning");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var svg = root.querySelector(".red-route-lightning__svg");
    var branchGroups = svg ? svg.querySelectorAll(".red-route-lightning__branch") : [];

    function clearBranches() {
      root.classList.remove("red-route-lightning--branched");
      for (var i = 0; i < branchGroups.length; i++) {
        branchGroups[i].setAttribute("opacity", "0");
      }
    }

    /** 2–3 angles (deg), spread so forks rarely sit on top of each other */
    function pickBranchAngles(count) {
      var angles = [];
      var tries = 0;
      while (angles.length < count && tries < 48) {
        tries += 1;
        var a = -82 + Math.random() * 164;
        var ok = true;
        for (var k = 0; k < angles.length; k++) {
          if (Math.abs(a - angles[k]) < 20) {
            ok = false;
            break;
          }
        }
        if (ok) angles.push(a);
      }
      while (angles.length < count) {
        angles.push(-70 + Math.random() * 140);
      }
      return angles;
    }

    function strike() {
      var x = 12 + Math.random() * 76;
      var rot = -24 + Math.random() * 48;
      var sc = 0.68 + Math.random() * 0.52;
      root.style.setProperty("--strike-x", x + "%");
      root.style.setProperty("--strike-rot", rot + "deg");
      root.style.setProperty("--strike-sc", String(sc));

      clearBranches();
      if (branchGroups.length && Math.random() < 0.2) {
        var n = Math.random() < 0.52 ? 2 : 3;
        var deg = pickBranchAngles(n);
        root.classList.add("red-route-lightning--branched");
        for (var b = 0; b < branchGroups.length; b++) {
          if (b < n) {
            branchGroups[b].setAttribute("transform", "rotate(" + deg[b] + ")");
            branchGroups[b].setAttribute("opacity", "1");
          }
        }
      }

      root.classList.remove("red-route-lightning--strike-soft");
      root.classList.add("red-route-lightning--strike");

      var flashMs = 52 + Math.floor(Math.random() * 110);
      window.setTimeout(function () {
        root.classList.remove("red-route-lightning--strike");
        clearBranches();
        if (Math.random() < 0.34) {
          window.setTimeout(function () {
            var x2 = Math.max(8, Math.min(92, x + (Math.random() * 18 - 9)));
            root.style.setProperty("--strike-x", x2 + "%");
            root.style.setProperty("--strike-rot", rot + (Math.random() * 14 - 7) + "deg");
            root.classList.add("red-route-lightning--strike-soft");
            window.setTimeout(function () {
              root.classList.remove("red-route-lightning--strike-soft");
            }, 38 + Math.floor(Math.random() * 85));
          }, 35 + Math.floor(Math.random() * 65));
        }

        var gap = 1700 + Math.random() * 1600;
        window.setTimeout(strike, gap);
      }, flashMs);
    }

    window.setTimeout(strike, 500 + Math.random() * 1200);
  }

  function initRedRouteClip() {
    var btn = document.getElementById("red-route-matrix-clip");
    var player = document.getElementById("red-route-matrix-player");
    if (!btn || !player) return;

    btn.addEventListener("click", function () {
      if (!player.getAttribute("src")) {
        player.setAttribute("src", RED_ROUTE_CLIP_SRC);
        btn.textContent = "Playing…";
        return;
      }
      player.setAttribute("src", "");
      btn.textContent = "▶ Matrix clip";
    });
  }

  /** Blue pill: full-viewport Matrix endless code rain (#blue-matrix-backdrop) */
  function initBlueMatrixEndless() {
    var wrap = document.getElementById("blue-matrix-backdrop");
    var canvas = document.getElementById("blue-matrix-endless");
    if (!wrap || !canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.classList.add("is-reduced-motion");
      return;
    }

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var columns = [];
    var lastTime = 0;
    var started = false;

    var CHARS = (
      "アァカサタナハマヤャラワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "ΞΣΛΩ∆<>[]{}+-=*/\\|#$%&@!?"
    ).split("");

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function createColumns() {
      if (width < 8 || height < 8) return;
      columns = [];
      var baseFont = width < 768 ? 14 : 18;
      var gap = width < 768 ? 14 : 16;
      var count = Math.ceil(width / gap);
      var i;
      var c;
      var charPool;
      for (i = 0; i < count; i++) {
        charPool = [];
        for (c = 0; c < 42; c++) charPool.push(pick(CHARS));
        columns.push({
          x: i * gap,
          y: random(-height, 0),
          speed: random(120, 420),
          fontSize: baseFont + Math.floor(Math.random() * 8),
          length: Math.floor(random(10, 34)),
          chars: charPool,
          changeRate: random(0.03, 0.12),
        });
      }
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = wrap.clientWidth;
      var h = wrap.clientHeight;
      width = Math.floor(w);
      height = Math.floor(h);
      if (width < 4 || height < 4) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createColumns();
      ctx.fillStyle = "#020406";
      ctx.fillRect(0, 0, width, height);
    }

    function drawBackgroundFade() {
      ctx.fillStyle = "rgba(2, 4, 6, 0.13)";
      ctx.fillRect(0, 0, width, height);
    }

    function drawColumn(column, delta) {
      column.y += column.speed * delta;
      var step = column.fontSize;
      var total = column.length;
      var i;
      var charY;
      var char;
      var alpha;
      for (i = 0; i < total; i++) {
        charY = column.y - i * step;
        if (charY < -step || charY > height + step) continue;
        if (Math.random() < column.changeRate) {
          column.chars[i % column.chars.length] = pick(CHARS);
        }
        char = column.chars[i % column.chars.length];
        alpha = Math.max(0, 1 - i / total);
        if (i === 0) {
          ctx.fillStyle = "rgba(220, 255, 235, " + 0.95 * alpha + ")";
          ctx.shadowColor = "rgba(180,255,220,0.95)";
          ctx.shadowBlur = 18;
        } else if (i < 4) {
          ctx.fillStyle = "rgba(130, 255, 180, " + 0.72 * alpha + ")";
          ctx.shadowColor = "rgba(102,255,153,0.5)";
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = "rgba(47, 208, 108, " + 0.55 * alpha + ")";
          ctx.shadowColor = "rgba(47,208,108,0.18)";
          ctx.shadowBlur = 6;
        }
        ctx.font = column.fontSize + "px Consolas, Monaco, \"Courier New\", monospace";
        ctx.fillText(char, column.x, charY);
      }
      ctx.shadowBlur = 0;

      if (column.y - column.length * step > height + random(20, 180)) {
        column.y = random(-height * 0.5, -20);
        column.speed = random(120, 420);
        column.length = Math.floor(random(10, 34));
        column.fontSize = (width < 768 ? 14 : 18) + Math.floor(Math.random() * 8);
      }
    }

    function drawFlash() {
      if (Math.random() < 0.008) {
        var y = random(0, height);
        var thickness = random(1, 3);
        var opacity = random(0.02, 0.06);
        ctx.fillStyle = "rgba(120, 255, 180, " + opacity + ")";
        ctx.fillRect(0, y, width, thickness);
      }
    }

    function animate(time) {
      if (!lastTime) lastTime = time;
      var delta = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      drawBackgroundFade();
      var idx;
      for (idx = 0; idx < columns.length; idx++) {
        drawColumn(columns[idx], delta);
      }
      drawFlash();
      window.requestAnimationFrame(animate);
    }

    function boot() {
      resize();
      if (width < 8 || !columns.length) return;
      if (!started) {
        started = true;
        lastTime = 0;
        window.requestAnimationFrame(animate);
      }
    }

    if (typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(function () {
        boot();
      });
      ro.observe(wrap);
    } else {
      window.addEventListener("resize", boot);
    }

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(boot);
    });
  }

  function initPillMatrixCanvas() {
    var canvas = document.getElementById("pill-matrix-canvas");
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var dpr = 1;
    var columns = [];
    var lastTime = 0;
    var running = true;

    var characters = (
      "アァカサタナハマヤャラワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZΞΣΛΩ∆<>[]{}+-=*/\\|#$%&@!?"
    ).split("");

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = [];
      var gap = width < 768 ? 14 : 16;
      var count = Math.ceil(width / gap);
      var i;
      for (i = 0; i < count; i++) {
        var fontSize = (width < 768 ? 14 : 18) + Math.floor(Math.random() * 8);
        columns.push({
          x: i * gap,
          y: random(-height, 0),
          speed: random(120, 390),
          fontSize: fontSize,
          length: Math.floor(random(10, 30)),
          chars: (function () {
            var a = [];
            var j;
            for (j = 0; j < 42; j++) a.push(pick(characters));
            return a;
          })(),
          changeRate: random(0.03, 0.12)
        });
      }
    }

    function drawBackgroundFade() {
      ctx.fillStyle = "rgba(2, 4, 6, 0.14)";
      ctx.fillRect(0, 0, width, height);
    }

    function drawColumn(column, delta) {
      column.y += column.speed * delta;
      var step = column.fontSize;
      var total = column.length;
      var i;
      for (i = 0; i < total; i++) {
        var charY = column.y - i * step;
        if (charY < -step || charY > height + step) continue;

        if (Math.random() < column.changeRate) {
          column.chars[i % column.chars.length] = pick(characters);
        }

        var char = column.chars[i % column.chars.length];
        var alpha = Math.max(0, 1 - i / total);

        if (i === 0) {
          ctx.fillStyle = "rgba(220,255,235," + 0.95 * alpha + ")";
          ctx.shadowColor = "rgba(180,255,220,0.95)";
          ctx.shadowBlur = 18;
        } else if (i < 4) {
          ctx.fillStyle = "rgba(130,255,180," + 0.72 * alpha + ")";
          ctx.shadowColor = "rgba(102,255,153,0.52)";
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = "rgba(47,208,108," + 0.55 * alpha + ")";
          ctx.shadowColor = "rgba(47,208,108,0.18)";
          ctx.shadowBlur = 6;
        }

        ctx.font = column.fontSize + "px Consolas, monospace";
        ctx.fillText(char, column.x, charY);
      }

      ctx.shadowBlur = 0;

      if (column.y - column.length * step > height + random(20, 180)) {
        column.y = random(-height * 0.5, -20);
        column.speed = random(120, 390);
        column.length = Math.floor(random(10, 30));
      }
    }

    function animate(time) {
      if (!running) return;
      if (!lastTime) lastTime = time;
      var delta = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      drawBackgroundFade();
      var c;
      for (c = 0; c < columns.length; c++) {
        drawColumn(columns[c], delta);
      }

      window.requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    ctx.fillStyle = "#020406";
    ctx.fillRect(0, 0, width, height);
    window.requestAnimationFrame(animate);

    return {
      stop: function () {
        running = false;
      }
    };
  }

  function initPillScene() {
    var scene = document.getElementById("pill-scene");
    if (!scene) return;

    var red = document.getElementById("pill-red");
    var blue = document.getElementById("pill-blue");
    var audioBtn = document.getElementById("play-matrix-audio");
    var audioPlayer = document.getElementById("matrix-audio-player");
    var liquidWarp = document.getElementById("pill-liquid-warp");
    var hudOverlay = document.getElementById("pill-hud-overlay");
    var moved = false;
    var blueRouteStarted = false;

    initPillMatrixCanvas();

    function go(choice) {
      if (moved) return;
      moved = true;
      var key = choice || "skip";
      var next = PILL_ROUTES[key] || PILL_ROUTES.skip;
      window.location.href = next;
    }

    function setBluePillPointerVars(ev) {
      if (!blue) return;
      var rect = blue.getBoundingClientRect();
      var x = ((ev.clientX - rect.left) / rect.width) * 100;
      var y = ((ev.clientY - rect.top) / rect.height) * 100;
      document.documentElement.style.setProperty("--pill-mx", x + "%");
      document.documentElement.style.setProperty("--pill-my", y + "%");
    }

    if (blue) {
      blue.addEventListener("mousemove", setBluePillPointerVars);
      blue.addEventListener(
        "mouseenter",
        function () {
          document.documentElement.style.setProperty("--pill-mx", "50%");
          document.documentElement.style.setProperty("--pill-my", "50%");
        },
        false
      );
    }

    function applySessionAndRouteClass(choice) {
      try {
        if (choice) sessionStorage.setItem(PILL_KEY, choice);
        else sessionStorage.setItem(PILL_KEY, "skip");
      } catch (e) {
        /* ignore */
      }
      document.documentElement.classList.remove("pill-scene-open");
      document.documentElement.classList.remove("pill-choice-red", "pill-choice-blue");
      if (choice === "red") document.documentElement.classList.add("pill-choice-red");
      if (choice === "blue") document.documentElement.classList.add("pill-choice-blue");
    }

    function beginLeaveOverlay(choice) {
      if (scene.classList.contains("is-leaving")) return;

      document.documentElement.classList.add("pill-route-transition");

      if (liquidWarp) {
        liquidWarp.classList.remove("pill-scene__liquid-warp--active");
      }
      if (hudOverlay) {
        hudOverlay.classList.remove("pill-scene__hud--active");
      }
      scene.classList.remove("pill-scene--blue-route");
      if (blue) blue.classList.remove("pill-3d--routing");

      scene.classList.add("is-leaving");

      var leaveDone = false;

      function finish() {
        if (leaveDone) return;
        leaveDone = true;
        scene.setAttribute("hidden", "");
        scene.setAttribute("aria-hidden", "true");
        scene.classList.remove("is-leaving");
        applySessionAndRouteClass(choice);
        document.documentElement.classList.remove("pill-route-transition");
        document.documentElement.classList.add("pill-already-chosen");
        go(choice);
      }

      scene.addEventListener("transitionend", function onEnd(ev) {
        if (ev.target !== scene) return;
        if (ev.propertyName !== "opacity") return;
        scene.removeEventListener("transitionend", onEnd);
        finish();
      });

      window.setTimeout(function () {
        if (scene.hasAttribute("hidden")) return;
        finish();
      }, 1300);
    }

    function dismiss(choice) {
      if (choice === "blue") {
        dismissBlue();
        return;
      }

      if (scene.classList.contains("is-leaving")) return;
      beginLeaveOverlay(choice);
    }

    function dismissBlue() {
      if (scene.classList.contains("is-leaving") || blueRouteStarted) return;
      blueRouteStarted = true;

      document.documentElement.classList.add("pill-route-transition");

      scene.classList.add("pill-scene--blue-route");
      if (blue) blue.classList.add("pill-3d--routing");
      if (liquidWarp) liquidWarp.classList.add("pill-scene__liquid-warp--active");
      if (hudOverlay) hudOverlay.classList.add("pill-scene__hud--active");

      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var syncMs = reduceMotion ? 120 : 1520;

      window.setTimeout(function () {
        beginLeaveOverlay("blue");
      }, syncMs);
    }

    scene.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("pill-scene-open");

    if (audioBtn && audioPlayer) {
      audioBtn.addEventListener("click", function () {
        if (!audioPlayer.getAttribute("src")) {
          audioPlayer.setAttribute("src", MATRIX_AUDIO_SRC);
          audioBtn.textContent = "Playing Matrix Audio...";
          return;
        }
        audioPlayer.setAttribute("src", "");
        audioBtn.textContent = "▶ Play Matrix Audio";
      });
    }

    if (red) red.addEventListener("click", function () { dismiss("red"); });
    if (blue) blue.addEventListener("click", function () { dismiss("blue"); });
  }

  function initNavScroll() {
    var links = document.querySelectorAll('.sidebar__nav a[href^="#"]');
    if (!links.length) return;

    var ids = [];
    for (var i = 0; i < links.length; i++) {
      var h = links[i].getAttribute("href");
      if (h && h.charAt(0) === "#") ids.push(h.slice(1));
    }

    var map = {};
    for (var j = 0; j < ids.length; j++) {
      var el = document.getElementById(ids[j]);
      if (el) map[ids[j]] = el;
    }

    function update() {
      var y = window.scrollY + 120;
      var active = ids[0];
      for (var k = 0; k < ids.length; k++) {
        var id = ids[k];
        var sec = map[id];
        if (sec && sec.offsetTop <= y) active = id;
      }
      for (var m = 0; m < links.length; m++) {
        var href = links[m].getAttribute("href");
        var hash = href ? href.slice(1) : "";
        links[m].classList.toggle("is-active", hash === active);
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function hideBrokenProfile() {
    var img = document.querySelector(".sidebar__photo img");
    var wrap = document.querySelector(".sidebar__photo");
    if (!img || !wrap) return;
    img.addEventListener("error", function () {
      wrap.classList.add("is-hidden");
    });
  }

  window.addEventListener("pageshow", function (ev) {
    if (!ev.persisted) return;
    if (!document.getElementById("pill-scene")) return;
    resetMainPillChoiceUI();
    window.scrollTo(0, 0);
  });

  document.addEventListener("DOMContentLoaded", function () {
    var params = new URLSearchParams(window.location.search);
    if (params.get("choose") === "1") {
      resetMainPillChoiceUI();
      if (window.history && window.history.replaceState) {
        var clean = window.location.pathname + window.location.hash;
        window.history.replaceState(null, "", clean);
      }
      window.scrollTo(0, 0);
    }

    initRedPrelude();
    initBlueReveal();
    initPillScene();
    initRedRouteClip();
    initRedRouteLightning();
    initBlueMatrixEndless();
    initNavScroll();
    hideBrokenProfile();
  });
})();
