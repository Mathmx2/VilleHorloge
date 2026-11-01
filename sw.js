const C="grimoire-v13";
const F=["./","index.html","manifest.json","icon-192.png","icon-512.png",
  "img/apprenti.webp","img/artiste.webp","img/assassin.webp","img/aubergiste.webp","img/avocatdiable.webp","img/barbier.webp","img/barista.webp","img/baron.webp","img/bibliothecaire.webp","img/boucemissaire.webp","img/boucher.webp","img/bouffon.webp","img/bricoleur.webp","img/bureaucrate.webp","img/cerenovus.webp","img/cerveau.webp","img/charmeur.webp","img/chef.webp","img/cherie.webp","img/collecteur.webp","img/commere.webp","img/corbeaux.webp","img/courtisan.webp","img/couturiere.webp","img/crieur.webp","img/croquemort.webp","img/dameduthe.webp","img/deviant.webp","img/diablotin.webp","img/ecarlate.webp","img/empathe.webp","img/empoisonneur.webp","img/enfantlune.webp","img/enqueteur.webp","img/espion.webp","img/eveque.webp","img/exorciste.webp","img/fanggu.webp","img/femmechambre.webp","img/fleuriste.webp","img/grandmere.webp","img/grosbras.webp","img/horloger.webp","img/ivrogne.webp","img/jongleur.webp","img/juge.webp","img/jumeau.webp","img/lavandiere.webp","img/lunatique.webp","img/maire.webp","img/majordome.webp","img/maladroit.webp","img/marin.webp","img/mathematicien.webp","img/matrone.webp","img/megere.webp","img/mendiant.webp","img/menestrel.webp","img/moine.webp","img/mutant.webp","img/nodashii.webp","img/oracle.webp","img/pacifiste.webp","img/parieur.webp","img/parrain.webp","img/philosophe.webp","img/pistolero.webp","img/po.webp","img/pourfendeur.webp","img/professeur.webp","img/pukka.webp","img/reclus.webp","img/reveur.webp","img/sage.webp","img/saint.webp","img/savant.webp","img/seductrice.webp","img/shabaloth.webp","img/soldat.webp","img/sorciere.webp","img/vaudou.webp","img/vierge.webp","img/vigormortis.webp","img/voleur.webp","img/vortox.webp","img/voyante.webp","img/zombuul.webp"];
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
