(function () {
  "use strict";

  var SW_URL = "sw.js";
  var VAPID_PUBLIC_KEY = "";

  function isSecureContextPage() {
    return window.isSecureContext === true || window.location.hostname === "localhost";
  }

  function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    var raw = window.atob(base64);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return Promise.resolve(null);
    return navigator.serviceWorker
      .register(SW_URL, { scope: "./" })
      .then(function (reg) {
        return reg;
      })
      .catch(function () {
        return null;
      });
  }

  function showPwaBar() {
    if (document.getElementById("pwa-bar")) return;
    var bar = document.createElement("div");
    bar.id = "pwa-bar";
    bar.className = "pwa-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "앱 설치 및 알림");
    bar.innerHTML =
      '<div class="pwa-bar__inner">' +
      '<p class="pwa-bar__text">홈 화면에 추가하고 알림을 켤 수 있습니다.</p>' +
      '<div class="pwa-bar__actions">' +
      '<button type="button" class="pwa-bar__btn pwa-bar__btn--install" id="pwa-btn-install">앱으로 추가</button>' +
      '<button type="button" class="pwa-bar__btn pwa-bar__btn--notify" id="pwa-btn-notify">알림 허용</button>' +
      '<button type="button" class="pwa-bar__btn pwa-bar__btn--test" id="pwa-btn-test">테스트 알림</button>' +
      '<button type="button" class="pwa-bar__btn pwa-bar__btn--dismiss" id="pwa-btn-dismiss" aria-label="닫기">닫기</button>' +
      "</div>" +
      '<p class="pwa-bar__hint" id="pwa-status"></p>' +
      "</div>";

    document.body.appendChild(bar);

    var deferredPrompt = null;
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
    });

    var installBtn = document.getElementById("pwa-btn-install");
    var notifyBtn = document.getElementById("pwa-btn-notify");
    var testBtn = document.getElementById("pwa-btn-test");
    var dismissBtn = document.getElementById("pwa-btn-dismiss");
    var statusEl = document.getElementById("pwa-status");

    function setStatus(msg) {
      if (statusEl) statusEl.textContent = msg || "";
    }

    if (installBtn) {
      installBtn.addEventListener("click", function () {
        if (!deferredPrompt) {
          setStatus("브라우저 메뉴에서 «홈 화면에 추가»를 선택해 주세요.");
          return;
        }
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
        });
      });
    }

    if (notifyBtn) {
      notifyBtn.addEventListener("click", function () {
        if (!("Notification" in window)) {
          setStatus("이 브라우저는 알림을 지원하지 않습니다.");
          return;
        }
        Notification.requestPermission().then(function (perm) {
          if (perm === "granted") {
            setStatus("알림이 허용되었습니다.");
            return subscribePushIfConfigured();
          }
          setStatus("알림이 거부되었습니다. 설정에서 허용할 수 있습니다.");
        });
      });
    }

    function subscribePushIfConfigured() {
      if (!VAPID_PUBLIC_KEY || !("PushManager" in window)) {
        return Promise.resolve();
      }
      return navigator.serviceWorker.ready.then(function (reg) {
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        }).then(function (sub) {
          try {
            localStorage.setItem("cursorstudy_push_subscription", JSON.stringify(sub.toJSON()));
          } catch (e) { /* ignore */ }
          setStatus("푸시 구독이 저장되었습니다. 서버에서 전송하면 알림을 받습니다.");
        }).catch(function () {
          setStatus("푸시 구독에 실패했습니다. VAPID 공개키를 확인하세요.");
        });
      });
    }

    if (testBtn) {
      testBtn.addEventListener("click", function () {
        if (!("Notification" in window)) {
          setStatus("알림 API를 지원하지 않습니다.");
          return;
        }
        if (Notification.permission !== "granted") {
          setStatus("먼저 «알림 허용»을 눌러 주세요.");
          return;
        }
        navigator.serviceWorker.ready.then(function (reg) {
          if (reg.active) {
            reg.active.postMessage({
              type: "SHOW_TEST_NOTIFICATION",
              title: "choose",
              body: "테스트 알림입니다. 푸시가 정상입니다."
            });
            setStatus("테스트 알림을 보냈습니다.");
          }
        });
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener("click", function () {
        bar.remove();
        try {
          sessionStorage.setItem("cursorstudy_pwa_bar_dismissed", "1");
        } catch (e) { /* ignore */ }
      });
    }
  }

  function shouldShowBar() {
    try {
      if (sessionStorage.getItem("cursorstudy_pwa_bar_dismissed") === "1") return false;
    } catch (e) { /* ignore */ }
    if (!isSecureContextPage()) return false;
    var mq = window.matchMedia("(max-width: 900px)");
    return mq.matches;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!isSecureContextPage()) return;

    var metaVapid = document.querySelector('meta[name="push-vapid-public"]');
    if (metaVapid && metaVapid.getAttribute("content")) {
      VAPID_PUBLIC_KEY = metaVapid.getAttribute("content").trim();
    }

    registerServiceWorker().then(function () {
      if (shouldShowBar()) showPwaBar();
    });
  });

  window.__CHOOSE_PWA__ = {
    registerServiceWorker: registerServiceWorker,
    setVapidPublicKey: function (key) {
      VAPID_PUBLIC_KEY = key || "";
    }
  };
})();
