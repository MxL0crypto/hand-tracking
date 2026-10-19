// Eigene Dateien: Netz zuerst (Updates kommen sofort an), offline aus dem Cache.
// CDN-Dateien (Skript, WASM, Modell): Cache zuerst, spart die ~8 MB bei jedem Start.
const CACHE = "hands-v2";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const own = new URL(e.request.url).origin === location.origin;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(e.request);
    if (hit && !own) return hit;
    try {
      const res = await fetch(e.request);
      if (res.ok) c.put(e.request, res.clone());
      return res;
    } catch (err) {
      if (hit) return hit;
      throw err;
    }
  }));
});
