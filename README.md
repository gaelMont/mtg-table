# MTG Table

Table de jeu Magic: The Gathering de 2 à 4 joueurs, avec moteur de règles intégré (layers, déclencheurs, actions d'état, paiements). Une seule personne contrôle tous les joueurs.

## Installer sur Android

1. Ouvre la page **Releases** du dépôt sur ton téléphone.
2. Télécharge `mtg-table.apk` de la dernière version.
3. Ouvre le fichier ; la première fois, autorise ton navigateur à installer des applications.

Chaque envoi sur `main` compile automatiquement une nouvelle version (onglet **Actions**).

## Utilisation

- **Mes decks** : colle la liste exportée en texte depuis Archidekt, Moxfield, Arena ou MTGO, ou essaie l'import par lien. Vérifie, choisis le commandant si besoin, enregistre.
- **Nouvelle partie** : 2 à 4 joueurs, Commander (40 PV) ou duel (20 PV). Mélange, joueur de départ au hasard, mulligan de Londres.
- **Table** : touche une carte pour la jouer ou l'activer. « Passer » donne la priorité au joueur suivant ; « Tout le monde passe » résout le dessus de la pile ou avance d'une étape.
- **Laboratoire** : la même partie vue dans l'outil de vérification des règles (layers, effets en cours).

## Organisation

- `www/index.html` : généré par `tools/sync_lab.py` (moteur du labo + mode partie)
- `www/game.js`, `www/game.css` : le mode partie (source à modifier)
- `www/db/`, `www/rules.json` : base de cartes et règles
- `android/` : projet Android généré par Capacitor
- `.github/workflows/android.yml` : compilation et publication de l'APK
