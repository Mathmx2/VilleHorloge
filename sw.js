const C="grimoire-v11";
const F=["./","index.html","manifest.json","icon-192.png","icon-512.png",
  "img/baron.webp","img/bibliothecaire.webp","img/boucemissaire.webp","img/bureaucrate.webp","img/chef.webp","img/corbeaux.webp","img/croquemort.webp","img/diablotin.webp","img/ecarlate.webp","img/empathe.webp","img/empoisonneur.webp","img/enqueteur.webp","img/espion.webp","img/ivrogne.webp","img/lavandiere.webp","img/maire.webp","img/majordome.webp","img/mendiant.webp","img/moine.webp","img/pistolero.webp","img/pourfendeur.webp","img/reclus.webp","img/saint.webp","img/soldat.webp","img/vierge.webp","img/voleur.webp","img/voyante.webp"];
// seuls l'appli, les polices et PeerJS (cdnjs) passent par le cache ; la mise en relation de la table connectée va toujours au réseau
const CACHED=u=>u.origin===location.origin||/^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/.test(u.hostname);
// cache:"reload" : GitHub Pages sert avec max-age=600, sans ça une nouvelle version pourrait mettre en cache l'ancienne page
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:"reload"})))));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||!CACHED(u))return;
  const put=res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res};
  // la page : réseau d'abord pour voir les mises à jour tout de suite ; cache si hors ligne ou si le réseau traîne plus de 4 s
  if(r.mode==="navigate"){
    const net=fetch(u.href,{cache:"no-cache",credentials:"same-origin"}).then(put);
    const cached=()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match("./"));
    e.respondWith(Promise.race([net,new Promise(ok=>setTimeout(ok,4000))]).then(x=>x||cached().then(c=>c||net)).catch(()=>cached()));
    return;
  }
  // le reste (images, icônes, polices, PeerJS) : cache d'abord
  e.respondWith(caches.match(r).then(x=>x||fetch(r).then(put)));
});
