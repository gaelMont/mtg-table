# MTG Table

Table de jeu Magic: The Gathering de 2 à 4 joueurs, avec moteur de règles intégré (layers, déclencheurs, actions d'état, paiements). Une seule personne contrôle tous les joueurs.

## Installer sur Android

1. Ouvre la page **Releases** du dépôt sur ton téléphone.
2. Télécharge `mtg-table.apk` de la dernière version.
3. Ouvre le fichier ; la première fois, autorise ton navigateur à installer des applications.

Chaque envoi sur `main` compile automatiquement une nouvelle version (onglet **Actions**).

## Organisation

- `www/` : l'application (moteur, interface, base de cartes)
- `android/` : projet Android généré par Capacitor
- `.github/workflows/android.yml` : compilation et publication de l'APK
