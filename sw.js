// Cache-first: nach dem ersten Laden (inkl. CDN-Skript, WASM, Modell) läuft alles offline.
// shortcut: kein Versions-Busting, bei Änderungen CACHE-Namen hochzählen.
const CACHE = "hands-v1";
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(e.request);
    if (hit) return hit;
    const res = await fetch(e.request);
    if (res.ok) c.put(e.request, res.clone());
    return res;
  }));
});
