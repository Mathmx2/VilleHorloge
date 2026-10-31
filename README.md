# Grimoire de poche

Appli conteur pour Blood on the Clocktower (Trouble Brewing), installable sur téléphone et utilisable hors ligne.

## Installer sur ton téléphone (gratuit, 5 min)
1. Le code est sur `github.com/Mathmx2/VilleHorloge` : chaque `git push` sur `main` met le site à jour (penser à incrémenter `grimoire-vN` dans `sw.js`).
2. (Une seule fois) Settings → Pages → Source : « Deploy from a branch », `main` / `/ (root)` → Save.
3. Ouvre `https://mathmx2.github.io/VilleHorloge/` sur le téléphone.
4. Android (Chrome) : menu ⋮ → « Installer l'application ». iPhone (Safari) : Partager → « Sur l'écran d'accueil ».

L'appli a alors son icône, s'ouvre en plein écran et marche sans réseau.

## Donner les rôles sur le téléphone des joueurs
**Table connectée (recommandé)** : onglet Partie → « Ouvrir la table », puis « QR d'invitation ». Tout le monde scanne le même QR code et choisit son nom. Chacun voit son rôle, sa description, les rôles du script et les règles, mis à jour en direct (morts à l'aube, changement de rôle). Ton téléphone héberge la partie : garde l'appli ouverte. Il faut du réseau (4G ou wifi) ; le plus fiable est que tout le monde soit sur le même wifi ou sur ton partage de connexion.

**Lien individuel (secours, sans connexion)** : Distribution → « Lien ou QR code », un lien par joueur.

Dans les deux cas, les infos de nuit (Empathe, Chef, alliés maléfiques…) restent données par le conteur, en personne. L'appli doit être en ligne (GitHub Pages ci-dessus) : un lien `localhost` ne s'ouvre pas sur un autre téléphone.

## En faire un APK Android (optionnel)
Avec Node et Android Studio installés :
```
npm init -y && npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init Grimoire fr.grimoire.app --web-dir .
npx cap add android && npx cap open android
```
Puis Build → Build APK(s) dans Android Studio.

Note : la police vient de Google Fonts ; hors ligne, une police de secours prend le relais.
