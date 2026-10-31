# Grimoire de poche

Appli compagnon du conteur pour **Blood on the Clocktower** (script Trouble Brewing), en présentiel. Le conteur tient le téléphone ; chaque joueur peut recevoir son rôle sur son propre téléphone via un lien ou un QR code (aucune installation, aucun serveur). Interface en français.

## Stack
- PWA statique, zéro build : tout est dans `index.html` (HTML + CSS + JS vanilla). Seule dépendance : PeerJS, chargé à la demande pour la table connectée.
- `sw.js` : service worker. La page passe par le réseau d'abord (cache seulement hors ligne), le reste par le cache d'abord ; l'installation ignore le cache HTTP (GitHub Pages sert en max-age=600). À chaque modif, incrémenter `C` ("grimoire-vN") ET `APP_V` dans index.html (affiché en bas de l'onglet Partie).
- `manifest.json` + `icon-192.png` / `icon-512.png` : installation sur l'écran d'accueil.

## Architecture de index.html
- Sac de rôles : `S.bag` (rôles choisis par le conteur, sans Voyageurs) édité par `vBag` ; `randomBag()` propose une composition au hasard, `expected(bag)` donne la composition attendue (Baron compris), `deal(bag)` distribue au hasard. `draw()` = `deal(randomBag())`. « Changer les rôles » remet les rôles distribués dans le sac.
- Données : `ROLES` (nom, type town/out/min/dem, capacité courte), `DETAIL` (texte long + conseil conteur), `RULES`, `SCRIPT`, `COMP` (compo par nombre de joueurs), `FIRST` / `OTHER` (ordre de nuit), `HINT`.
- État : objet `S` sauvegardé dans `localStorage` (clé `botc-grimoire-v1`). `timer` et `vote` sont volatils.
- Rendu : `render()` reconstruit `#app` via les vues `vSetup`, `vGrim`, `vNight`, `vDay`, `vGuide`. Événements délégués sur `document` via `data-*`.
- Écran de révélation : `#veil`, fonction `reveal(i, stage)`.
- Distribution par lien (`S.dist==="link"`) : `linkFor(p)` met `[1, rôle affiché, nom, minute du tirage]` en JSON, brouillé (`xorB`) et en base64url dans le fragment `#j=…` (jamais envoyé au serveur). L'Ivrogne reçoit son faux rôle. `readLink` décode. Changer ce format casse les liens déjà envoyés : incrémenter la version (1er élément).
- Vue joueur : si l'URL commence par `#j=`, `bootPlayer()` affiche `vPlayer` sans appeler `render()` ni toucher à `S`/localStorage.
- Table connectée (`#t=<salle>`) : le téléphone du conteur héberge, les joueurs s'y connectent en WebRTC via PeerJS (chargé à la demande depuis cdnjs avec SRI ; le serveur public PeerJS ne sert qu'à la mise en relation, id `gdp-<salle>`). Conteur : `openTable`, `hostMsg`, `sendState` (diffusé par `save()` → `broadcast()`), `S.room` / `S.host` / `S.claims` (jeton du téléphone par place). Joueur : `joinTable`, `vTablePlayer`, mémoire `localStorage` `botc-table-<salle>`.
- Règle de conception : l'appli ne transmet aux joueurs QUE leur rôle (faux rôle pour l'Ivrogne) et l'info publique (noms, morts, vote fantôme, jour/nuit). Jamais d'info de nuit, d'alliés ni de bluffs : le conteur les donne en personne. Les morts de la nuit n'apparaissent qu'à l'aube (`S.pubAlive` figé au crépuscule, `S.phase`).
- Voyageurs (`t:"trav"` : boucemissaire, pistolero, mendiant, bureaucrate, voleur) : joueurs avec `trav:true`, `align` ("good"/"evil", choisi par le conteur) et `told` (nuit où un Voyageur maléfique apprend le Démon, étape `_trav`). Ils sont insérés dans `S.players` à leur place du cercle via `insertSeat` / `removeSeat` (qui décalent aussi `S.claims` et `S.pubAlive`). `S.count` ne compte que les autres joueurs (`base()`), pour la composition. Camp réel d'un joueur : `pEvil(p)`. Un Voyageur s'exile (seuil : moitié de toute la ville, morts compris) au lieu d'être exécuté. Côté joueurs, le rôle des Voyageurs est public (`trav` dans l'état), leur camp n'est envoyé qu'à eux.
- Jetons de rôle : `img/<id>.webp` (320 px), illustrations originales générées avec ComfyUI (Flux), affichées en rond via `tokImg(r, "s"|"l")`, liseré bleu (Bien) ou rouge (Mal). Toutes précachées dans `sw.js`. Ne pas utiliser les illustrations officielles du jeu (droits de The Pandemonium Institute, dépôt et site publics).
- QR code : encodeur maison `qrMatrix` / `qrSVG` (mode octet, correction M, versions 1 à 15), vérifié avec le décodeur jsQR.

## Conventions
- Toujours échapper les noms joueurs avec `esc()`.
- Couleurs uniquement via les variables CSS de `:root`.
- Mobile d'abord : cibles tactiles ≥ 44px, safe-area insets respectés.

## Lancer en local
`npx serve .` puis ouvrir l'URL affichée (le service worker exige http(s), pas file://).

## Idées de suite
- Autres scripts (Bad Moon Rising, Sects & Violets) : ajouter un sélecteur de script et des tables ROLES/ordre de nuit par script.
- Vue « cercle » du Grimoire (jetons disposés en rond).
- Packaging Android via Capacitor (voir README).
