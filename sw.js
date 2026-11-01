// VectorCraft local launcher service worker.
// Serves only files the user unzipped locally into Cache Storage.
// Nothing of VectorCraft is hosted by this page itself.
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // app/ is the virtual path for the unzipped build.
  if (url.pathname.includes("/app/")) {
    e.respondWith((async () => {
      const cache = await caches.open("vectorcraft-local");
      // Cache keys are stored as "app/<relative path>".
      const idx = url.pathname.indexOf("/app/");
      const key = url.pathname.slice(idx + 1) + url.search;
      const hit = await cache.match(key) || await cache.match(url.pathname.slice(idx + 1));
      if (hit) return hit;
      return new Response("not found in local cache", { status: 404 });
    })());
  }
});
