(function () {
  "use strict";

  var CHAR_DATA = {
    neo: {
      ko: "네오",
      en: "Neo",
      cardRole: "The One Who Awoke",
      kicker: "Awakening / Fracture",
      keywords: "각성 / 선택 / 균열 / 구원",
      name: "네오 (Neo)",
      desc: "가짜 평온의 틈을 가장 먼저 의심하고, 선택으로 자신을 증명한 존재.",
      quoteKo: "“나는 예언이 만든 존재가 아니다. 내가 선택한 길이 곧 나다.”",
      quoteEn: "“I am not what prophecy made me. I am what I chose to become.”"
    },
    trinity: {
      ko: "트리니티",
      en: "Trinity",
      cardRole: "The Devoted Warrior",
      kicker: "Speed / Devotion",
      keywords: "속도 / 헌신 / 사랑 / 신념",
      name: "트리니티 (Trinity)",
      desc: "위험 속에서도 끝까지 곁을 지키며, 선택의 무게를 함께 견디는 의지.",
      quoteKo: "“희망은 말로 증명되지 않아. 끝까지 곁에 남는 것으로 증명되는 거야.”",
      quoteEn: "“Hope is not proven by words. It is proven by who stays until the end.”"
    },
    morpheus: {
      ko: "모피어스",
      en: "Morpheus",
      cardRole: "The Guide to Reality",
      kicker: "Choice / Truth",
      keywords: "선택 / 진실 / 인도 / 믿음",
      name: "모피어스 (Morpheus)",
      desc: "답 대신 문을 보여 주고, 잠든 존재에게 선택의 순간을 건네는 인도자.",
      quoteKo: "“나는 답을 주지 않는다. 다만 네가 진실을 보게 만들 뿐이다.”",
      quoteEn: "“I do not give answers. I only lead you to see the truth.”"
    },
    smith: {
      ko: "스미스",
      en: "Agent Smith",
      cardRole: "The Agent of Control",
      kicker: "Replication / Fear",
      keywords: "복제 / 공포 / 혐오 / 폭주",
      name: "에이전트 스미스 (Agent Smith)",
      desc: "시스템의 집행자에서 시스템 자체를 잠식하는 공포로 변한 복제의 화신.",
      quoteKo: "“자유란 오류다. 인간은 결국 같은 공포와 같은 욕망으로 되돌아간다.”",
      quoteEn: "“Freedom is an error. Humans always return to the same fear and the same desire.”"
    },
    oracle: {
      ko: "오라클",
      en: "Oracle",
      cardRole: "The Prophet of Choice",
      kicker: "Warm Prophecy / Suggestion",
      keywords: "예언 / 암시 / 선택 / 온기",
      name: "오라클 (Oracle)",
      desc: "정답을 강요하지 않고 스스로 감당할 선택을 비추는 따뜻한 안내자.",
      quoteKo: "“미래는 정해진 답이 아니란다. 네가 감당할 선택의 이름일 뿐이지.”",
      quoteEn: "“The future is not a fixed answer. It is only the name of the choice you can bear.”"
    },
    architect: {
      ko: "아키텍트",
      en: "The Architect",
      cardRole: "The Designer of the System",
      kicker: "Cold Design / Repetition",
      keywords: "설계 / 통제 / 계산 / 반복",
      name: "아키텍트 (The Architect)",
      desc: "감정을 배제한 계산으로 질서와 반복을 설계하는 차가운 구조의 창조자.",
      quoteKo: "“완벽한 질서란 감정을 제거한 순간부터 시작된다.”",
      quoteEn: "“Perfect order begins the moment emotion is removed.”"
    },
    merovingian: {
      ko: "메로빈지언",
      en: "The Merovingian",
      cardRole: "The Dealer of Desire",
      kicker: "Desire / Transaction",
      keywords: "욕망 / 거래 / 인과 / 권력",
      name: "메로빈지언 (The Merovingian)",
      desc: "욕망과 대가를 거래하며 균열 속에서 이득을 챙기는 구세계의 권력자.",
      quoteKo: "“세상은 선택으로 움직이지 않아. 욕망과 대가, 그 거래로 굴러갈 뿐이지.”",
      quoteEn: "“The world does not move by choice. It moves by desire, price, and transaction.”"
    },
    deus: {
      ko: "데우스 엑스 마키나",
      en: "Deus Ex Machina",
      cardRole: "The Machine Overlord",
      kicker: "Absolute Machine Order",
      keywords: "절대성 / 기계 질서 / 존속 / 통제",
      name: "데우스 엑스 마키나 (Deus Ex Machina)",
      desc: "기계 문명의 존속만을 우선하는 절대적 관리자이자 질서의 최종 심판자.",
      quoteKo: "“평화도 전쟁도 중요하지 않다. 중요한 것은 오직 시스템의 존속이다.”",
      quoteEn: "“Neither peace nor war matters. Only the survival of the system does.”"
    }
  };
  var GROUPS = {
    red: ["neo", "trinity", "morpheus", "oracle"],
    blue: ["smith", "architect", "merovingian", "deus"]
  };
  var NEO_PAGE_BG_IMAGE = "file:///C:/Users/USER/.cursor/projects/c-Users-USER-Desktop/assets/c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_30a625b2b0bf7c94c66d8dae01dd52b0_images______-704ff38b-2dbe-4d10-a2e3-ca9cf7162e42.png";
  var MORPHEUS_PAGE_BG_IMAGE = "file:///C:/Users/USER/.cursor/projects/c-Users-USER-Desktop/assets/c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_30a625b2b0bf7c94c66d8dae01dd52b0_images________-7718ddf3-cf3c-46a7-8a5f-09c8553bed36.png";
  var TRINITY_PAGE_BG_IMAGE = "file:///C:/Users/USER/.cursor/projects/c-Users-USER-Desktop/assets/c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_30a625b2b0bf7c94c66d8dae01dd52b0_images________-706e8d3b-99ce-4f3d-b90b-0afc08da8834.png";
  var ORACLE_PAGE_BG_IMAGE = "file:///C:/Users/USER/.cursor/projects/c-Users-USER-Desktop/assets/c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_30a625b2b0bf7c94c66d8dae01dd52b0_images_______-f131f1e1-2604-4ea6-ba0b-a405078b94a9.png";
  var ARCHITECT_PAGE_BG_IMAGE = "file:///C:/Users/USER/.cursor/projects/c-Users-USER-Desktop/assets/c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_30a625b2b0bf7c94c66d8dae01dd52b0_images________-f8923c83-f7b7-481e-8c5a-e0b3aeb63b34.png";
  var DEUS_PAGE_BG_IMAGE = "file:///C:/Users/USER/.cursor/projects/c-Users-USER-Desktop/assets/c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_30a625b2b0bf7c94c66d8dae01dd52b0_images______________-d280594e-3a34-43c2-8429-34007b9a682f.png";

  function smoothScrollTo(selector) {
    var target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function redPill() {
    document.body.style.filter = "hue-rotate(-20deg)";
    document.body.style.transition = "0.6s";
    window.setTimeout(function () {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }, 500);
    window.setTimeout(function () {
      document.body.style.filter = "";
    }, 1100);
  }

  function bluePill() {
    /* Keep blue route readable: use subtle tint, not heavy blur. */
    document.body.style.filter = "saturate(1.08) brightness(1.02)";
    document.body.style.transition = "0.6s";
    window.setTimeout(function () {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }, 500);
    window.setTimeout(function () {
      document.body.style.filter = "";
    }, 1100);
  }

  window.redPill = redPill;
  window.bluePill = bluePill;

  function revealMainSections() {
    var html = document.documentElement;
    var scene = document.getElementById("pill-scene");
    if (scene) {
      scene.setAttribute("hidden", "");
      scene.setAttribute("aria-hidden", "true");
      scene.classList.remove("is-leaving", "pill-scene--blue-route");
    }
    /* Critical: unlock page scroll after leaving pill scene. */
    html.classList.remove("pill-scene-open");
    html.classList.add("pill-already-chosen");
    html.classList.remove("pill-route-transition", "pill-choice-red", "pill-choice-blue");
    document.body.style.filter = "";
    document.body.style.transition = "";
    try {
      sessionStorage.setItem("cursorstudy_pillChoice", "skip");
    } catch (e) {
      /* ignore */
    }
  }

  function bindHeroCtaScroll(panelController) {
    var map = [
      { id: "pill-red-cta", target: "#character-grid" },
      { id: "pill-blue-cta", target: "#character-grid" }
    ];

    map.forEach(function (item) {
      var el = document.getElementById(item.id);
      if (!el) return;
      el.addEventListener(
        "click",
        function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();
          if (item.id.indexOf("red") !== -1) redPill();
          if (item.id.indexOf("blue") !== -1) bluePill();
          revealMainSections();
          if (panelController && typeof panelController.applyGroup === "function") {
            if (item.id.indexOf("red") !== -1) panelController.applyGroup("red");
            if (item.id.indexOf("blue") !== -1) panelController.applyGroup("blue");
          }
          smoothScrollTo(item.target);
        },
        true
      );
    });
  }

  function syncThemePanels(groupName) {
    var redPanel = document.querySelector(".matrix-home-audio[aria-label='Matrix theme player']");
    var bluePanel = document.getElementById("index-machine-theme-panel");
    if (!redPanel || !bluePanel) return;
    var isBlue = groupName === "blue";
    redPanel.classList.toggle("is-hidden", isBlue);
    bluePanel.classList.toggle("is-hidden", !isBlue);
  }

  function syncCharacterGroupPanels(groupName) {
    var truthGroup = document.querySelector(".matrix-home-group--truth");
    var systemGroup = document.querySelector(".matrix-home-group--system");
    if (!truthGroup || !systemGroup) return;
    if (groupName === "blue") {
      truthGroup.classList.add("is-hidden");
      systemGroup.classList.remove("is-hidden");
      return;
    }
    if (groupName === "red") {
      systemGroup.classList.add("is-hidden");
      truthGroup.classList.remove("is-hidden");
      return;
    }
    truthGroup.classList.remove("is-hidden");
    systemGroup.classList.remove("is-hidden");
  }

  function initCharacterPanel() {
    var grids = Array.prototype.slice.call(document.querySelectorAll(".matrix-home-char-grid"));
    if (!grids.length) return;

    var kicker = document.getElementById("matrix-home-detail-kicker");
    var name = document.getElementById("matrix-home-detail-name");
    var keywords = document.getElementById("matrix-home-detail-keywords");
    var desc = document.getElementById("matrix-home-detail-desc");
    var quoteKo = document.getElementById("matrix-home-detail-quote-ko");
    var quoteEn = document.getElementById("matrix-home-detail-quote-en");
    var thumb = document.getElementById("matrix-home-detail-thumb");
    var pageBg = document.querySelector(".page-bg");
    if (!kicker || !name || !keywords || !desc || !quoteKo || !quoteEn || !thumb) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll(".matrix-home-char-card"));

    function syncPageBackground(charKey) {
      if (!pageBg) return;
      if (charKey === "neo") {
        pageBg.style.setProperty("--page-bg-char", "url(\"" + NEO_PAGE_BG_IMAGE + "\")");
        pageBg.style.setProperty("--page-bg-pos", "center center");
      } else if (charKey === "morpheus") {
        pageBg.style.setProperty("--page-bg-char", "url(\"" + MORPHEUS_PAGE_BG_IMAGE + "\")");
        pageBg.style.setProperty("--page-bg-pos", "center center");
      } else if (charKey === "trinity") {
        pageBg.style.setProperty("--page-bg-char", "url(\"" + TRINITY_PAGE_BG_IMAGE + "\")");
        pageBg.style.setProperty("--page-bg-pos", "center center");
      } else if (charKey === "oracle") {
        pageBg.style.setProperty("--page-bg-char", "url(\"" + ORACLE_PAGE_BG_IMAGE + "\")");
        pageBg.style.setProperty("--page-bg-pos", "center center");
      } else if (charKey === "architect") {
        pageBg.style.setProperty("--page-bg-char", "url(\"" + ARCHITECT_PAGE_BG_IMAGE + "\")");
        pageBg.style.setProperty("--page-bg-pos", "center center");
      } else if (charKey === "deus") {
        pageBg.style.setProperty("--page-bg-char", "url(\"" + DEUS_PAGE_BG_IMAGE + "\")");
        pageBg.style.setProperty("--page-bg-pos", "center center");
      } else {
        pageBg.style.removeProperty("--page-bg-char");
        pageBg.style.removeProperty("--page-bg-pos");
      }
    }

    function renderCardContent() {
      cards.forEach(function (btn) {
        var key = btn.getAttribute("data-char");
        var data = CHAR_DATA[key];
        if (!data) return;
        btn.setAttribute("aria-label", data.name);
        btn.innerHTML =
          "<span class=\"matrix-home-char-card__thumb is-" + key + "\" aria-hidden=\"true\"></span>" +
          "<span class=\"matrix-home-char-card__name-main\" lang=\"en\">" + data.en + "</span>" +
          "<span class=\"matrix-home-char-card__name-sub\" lang=\"en\">" + data.cardRole + "</span>";
      });
    }

    function render(charKey) {
      var data = CHAR_DATA[charKey];
      if (!data) return;
      kicker.textContent = data.kicker;
      name.textContent = data.name;
      keywords.textContent = "핵심 키워드: " + data.keywords;
      desc.textContent = data.desc;
      quoteKo.textContent = data.quoteKo;
      quoteEn.textContent = data.quoteEn;
      thumb.className = "matrix-home-detail-panel__thumb is-" + charKey;
      syncPageBackground(charKey);
    }

    function setActiveButton(btn) {
      cards.forEach(function (el) {
        el.classList.toggle("is-active", el === btn);
      });
    }

    function applyGroup(groupName) {
      var allowed = GROUPS[groupName];
      if (!allowed) return;
      syncThemePanels(groupName);
      syncCharacterGroupPanels(groupName);

      cards.forEach(function (btn) {
        var key = btn.getAttribute("data-char");
        var isAllowed = allowed.indexOf(key) !== -1;
        btn.classList.toggle("is-hidden", !isAllowed);
        btn.setAttribute("aria-hidden", isAllowed ? "false" : "true");
        btn.disabled = !isAllowed;
      });

      var current = document.querySelector(".matrix-home-char-card.is-active:not(.is-hidden)");
      var next = current || document.querySelector(".matrix-home-char-card:not(.is-hidden)");
      if (!next) return;
      setActiveButton(next);
      render(next.getAttribute("data-char"));
    }

    grids.forEach(function (grid) {
      grid.addEventListener("click", function (ev) {
        var btn = ev.target.closest(".matrix-home-char-card");
        if (!btn) return;
        var key = btn.getAttribute("data-char");
        if (!key || !CHAR_DATA[key]) return;
        if (btn.classList.contains("is-hidden")) return;
        setActiveButton(btn);
        render(key);
        smoothScrollTo("#character-detail");
      });
    });

    renderCardContent();
    return { applyGroup: applyGroup };
  }

  function injectCtaButtons() {
    var redCta = document.querySelector(".pill-column--red .pill-path__cta");
    var blueCta = document.querySelector(".pill-column--blue .pill-path__cta");

    if (redCta && redCta.tagName !== "BUTTON") {
      redCta.outerHTML = "<button id=\"pill-red-cta\" type=\"button\" class=\"pill-path__cta pill-path__cta-btn\">TAKE THE RED PILL</button>";
    }
    if (blueCta && blueCta.tagName !== "BUTTON") {
      blueCta.outerHTML = "<button id=\"pill-blue-cta\" type=\"button\" class=\"pill-path__cta pill-path__cta-btn\">TAKE THE BLUE PILL</button>";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectCtaButtons();
    var panelController = initCharacterPanel();
    bindHeroCtaScroll(panelController);
  });
})();
