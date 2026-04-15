/* global self, clients */
(function () {
  "use strict";

  var CACHE = "choose-v1";
  var CORE = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./images/pwa-icon.svg",
    "./manifest.webmanifest"
  ];

  self.addEventListener("install", function (event) {
    event.waitUntil(
      caches.open(CACHE).then(function (cache) {
        return cache.addAll(CORE).catch(function () {
          return Promise.resolve();
        });
      }).then(function () {
        return self.skipWaiting();
      })
    );
  });

  self.addEventListener("activate", function (event) {
    event.waitUntil(
      caches.keys().then(function (keys) {
        return Promise.all(
          keys.map(function (k) {
            if (k !== CACHE) return caches.delete(k);
          })
        );
      }).then(function () {
        return self.clients.claim();
      })
    );
  });

  self.addEventListener("fetch", function (event) {
    var req = event.request;
    if (req.method !== "GET") return;
    var url = req.url;
    if (url.indexOf("youtube.com") !== -1 || url.indexOf("googlevideo") !== -1) return;

    event.respondWith(
      fetch(req)
        .then(function (res) {
          if (res && res.status === 200 && res.type === "basic") {
            var path = new URL(url).pathname;
            if (/\.(css|js|svg|png|webp|woff2?|html|json|webmanifest)$/i.test(path)) {
              var copy = res.clone();
              caches.open(CACHE).then(function (cache) {
                cache.put(req, copy);
              });
            }
          }
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            if (hit) return hit;
            if (req.mode === "navigate") return caches.match("./index.html");
            return Promise.reject(new Error("offline"));
          });
        })
    );
  });

  self.addEventListener("push", function (event) {
    var data = {};
    if (event.data) {
      try {
        data = event.data.json();
      } catch (e) {
        data = { title: "choose", body: event.data.text() || "알림" };
      }
    } else {
      data = { title: "choose", body: "새 알림" };
    }
    var title = data.title || "choose";
    var options = {
      body: data.body || "",
      icon: "./images/pwa-icon.svg",
      badge: "./images/pwa-icon.svg",
      data: data.url ? { url: data.url } : {},
      tag: data.tag || "choose-push",
      renotify: true
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });

  self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    var url = (event.notification.data && event.notification.data.url) || "./index.html";
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
        for (var i = 0; i < list.length; i++) {
          var c = list[i];
          if (c.url.indexOf(self.location.origin) !== -1 && "focus" in c) {
            c.navigate(url);
            return c.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
    );
  });

  self.addEventListener("message", function (event) {
    if (!event.data || !event.data.type) return;
    if (event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
    if (event.data.type === "SHOW_TEST_NOTIFICATION") {
      var t = event.data.title || "choose";
      var b = event.data.body || "테스트 알림";
      event.waitUntil(
        self.registration.showNotification(t, {
          body: b,
          icon: "./images/pwa-icon.svg",
          badge: "./images/pwa-icon.svg"
        })
      );
    }
  });
})();
