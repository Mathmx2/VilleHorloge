const C="grimoire-v6";
const F=["./","index.html","manifest.json","icon-192.png","icon-512.png"];
// seuls l'appli, les polices et PeerJS (cdnjs) passent par le cache ; la mise en relation de la table connectée va toujours au réseau
const CACHED=u=>u.origin===location.origin||/^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/.test(u.hostname);
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||!CACHED(new URL(e.request.url)))return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res})));
});
