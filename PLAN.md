# Simulateur MTG : ce qu'il reste à faire

État au 18 novembre 2026 : environ 71 % des règles applicables automatisées (étapes 1 et 2 terminées, deux points reportés) (audit de l'onglet Règles), 20 505 cartes sur 34 479 entièrement automatiques.

## Étape 1 : Commander

- [x] Désigner un commandant (attribut de la carte, pas une caractéristique : 903.3)
- [x] Zone de commandement par joueur, commandant lancé depuis la zone (903.6, 903.8)
- [x] Taxe de commandant : +{2} par lancement précédent depuis la zone de commandement (903.8)
- [x] Retour dans la zone de commandement : au choix depuis le cimetière ou l'exil, action basée sur un état (903.9a, 704.6d) ; à la place de la main ou de la bibliothèque, effet de remplacement (903.9b)
- [x] Blessures de commandant : 21 blessures de combat d'un même commandant font perdre la partie (903.10a, 704.6c)
- [x] Identité couleur affichée et vérifiée (903.4), partenaires (702.124)

## Étape 2 : règles de base encore simplifiées

- [x] Ordre des effets de remplacement choisi par le joueur concerné (616.1)
- [x] Mise hors phase (702.26)
- [x] Fin de tour forcée (724)
- [ ] Contrôle du tour d'un autre joueur (723) : reporté, voir note
- [x] Mana à usage restreint des permanents (106.6)
- [x] Réserve de mana par couleur et restriction, capacités de mana activables une par une (Signets, terrains filtres, Jeweled Lotus)
- [ ] Paiement automatique qui enchaîne les sources à coût (Signet payé par un terrain) : aujourd'hui à activer à la main
- [x] Changer les cibles (115.7), copier un sort avec de nouvelles cibles (707.10c)

## Étape 3 : familles de cartes encore manuelles

- [x] Exil « jusqu'à ce que » et cartes exilées par une carte précise (Oblivion Ring, Banisher Priest) (607.2a, 610.3)
- [x] Partage en deux piles, votes (701.38)
- [x] Effets répétés : « pour chaque… », « répète X fois », boucles interactives (Ad Nauseam, Eureka, Hypergenesis, Primal Surge, Tainted Pact) ; restent une cinquantaine de répétitions uniques
- [x] Échange de contrôle (701.12b)
- [x] Échanges de points de vie, de force et de textes (701.12) ; échange de zones (1 carte, ante) hors périmètre
- [x] Renfort / backup (702.165)
- [x] Mutation (702.140, 730) : copies complètes, commandant dans la pile, faces transformées/retournées/cachées, cartes suivies ensemble
- [x] Rejet (702.47), warp (702.185), lien d'âme (702.95)
- [x] Enrôlement (702.154) : choix et engagement à la déclaration des attaquants (508.1g)
- [x] Artisanat (702.167) : X matériaux, plusieurs types, cartes liées (702.167c) ; reste « deux qui partagent un type »
- [x] Tentation de l'Anneau (701.54) ; reste « si c'est ton porteur de l'Anneau » et « quand l'Anneau te tente, si tu as choisi… »
- [x] Donjons, Undercity, initiative complète (309, 701.49, 726)
- [x] Classes (716), prototypes (718)
- [x] Enquêtes (719), cartes à retourner (710)
- [x] Correction : propriétaire des jetons (« l'adversaire ciblé crée… », 111.2) et 526 cartes qui plantaient dans le traducteur

## Étape 4 : confort d'utilisation

- [ ] Plusieurs situations sauvegardées
- [ ] Partage d'une situation par lien
- [ ] Import d'une liste de deck
- [ ] Vue « pourquoi » pour chaque verdict
- [ ] Annuler la dernière action

## Étape 5 : fiabilité

- [ ] Batterie de tests sur des interactions connues, vérifiées à la source (règles complètes, rulings Gatherer)
- [ ] Relecture des cartes classées automatiques pour repérer les traductions fausses

## Hors périmètre

- Planechase, Archenemy, cartes Un-, ante
- Cartes Arena qui créent ou cherchent des cartes hors du jeu

## Revue systématique (en cours)

- [x] Audit des mots-clés calculé à partir des cartes (et plus d'une liste écrite à la main)
- [x] Paiement réel des coûts « sauf si » / « tu peux payer »
- [x] Choix de plusieurs cibles pour les capacités déclenchées, seconde cible
- [x] Lot 1 : exploitation, extorsion, renommée, mentor, fabrication, soif de sang, modulaire, transfert d'âme, arme vivante, émeute, intrépidité, « ne se dégage pas » des auras, « peut attaquer malgré défenseur », déclencheurs « au début de l'entretien du contrôleur de la créature enchantée »
- [x] Lot 2 : embaumement, éternisation, rappel, perturbation, conséquence, myriade, improvisation, sursaut, multikicker, réplique, effort, cadeau, progéniture, sacrifice, marchandage, escouade, selle, reconfiguration, ascension, rayonnement, convergence
- [x] Lot 3 : nommer une carte, choisir un joueur, marqueurs supplémentaires pour les autres créatures, convergence, nombre de kickers
- [x] Lot 3 restant : choix de mode, nombre, dé à l'arrivée
- [x] Bandes (702.22), stations (721), « commencer la partie avec » (103.6a) ; autocollants classés hors périmètre (cartes « acorn »)
- [x] Le sort reste sur la pile pendant une boucle ; coûts « sauf si » avec choix de cartes ; capacités déclenchées depuis le cimetière, l'exil, la zone de commandement
- [x] Révélations depuis la main de départ (Chancellors, Providence)
- [x] Répétitions : « pour chaque » sur cartes ciblées, détruites ou exilées ; Atraxa, Grist, Scalpelexis, Rally the Horde, Helm of Obedience
- [x] Les 33 répétitions uniques restantes (Maelstrom Archangel Avatar classé hors périmètre : Vanguard)
- [x] Chancellor of the Annex et Gemstone Caverns (le joueur de départ n'est pas suivi : à vérifier toi-même pour Gemstone Caverns)
- [x] Tale of Tamiyo IV, Dance with Calamity, Portent of Calamity : les copies et cartes se lancent pendant la résolution (608.2g), copies non lancées supprimées (707.12)

## Étape 6 : mode partie (de 2 à 4 joueurs, façon Arena)

Principe : une table de jeu complète où tu contrôles seul tous les joueurs. Le moteur actuel (verdicts, layers, déclencheurs, actions d'état, paiements, boucles) reste le seul arbitre ; le mode partie est une nouvelle vue posée dessus, plus le suivi de ce qu'une vraie partie demande en plus.

### 6.1 Decks
- [ ] Coller la liste exportée en texte depuis Archidekt ou Moxfield (format « 1 Nom (SET) 123 », sections Commander / Deck / Sideboard, lignes « *F* », « *CMDR* » et catégories ignorées proprement)
- [ ] Résolution des noms sur la base locale (cartes doubles « A // B », accents, noms Alchemy « A- »), liste des cartes non trouvées ou hors périmètre avant de valider
- [ ] Détection du commandant (section Commander, sinon choix manuel), contrôle d'identité couleur, singleton et 100 cartes (avertissement, pas blocage)
- [ ] Decks enregistrés et réutilisables (stockage persistant de la page)
- [ ] Le lien Archidekt ou Moxfield est gardé comme simple référence : la page ne peut pas lire ces sites (voir contraintes)

### 6.2 Mise en place
- [ ] 2, 3 ou 4 joueurs, nom et deck par place, 40 points de vie et zone de commandement en Commander (20 en duel classique)
- [ ] Mélange, joueur de départ (tirage au sort ou choix), main de départ
- [ ] Mulligan réel (103.5 : mulligan de Londres, premier mulligan gratuit en multijoueur), cartes « commencer la partie avec » déjà gérées
- [ ] Le joueur de départ ne pioche pas en duel (103.8) ; suivi du joueur de départ, ce qui complète Gemstone Caverns

### 6.3 Plateau
- [ ] Une place par joueur : champ de bataille rangé en terrains / créatures / autres, cimetière, exil, bibliothèque, zone de commandement, compteurs de vie, poison, énergie, dégâts de commandant
- [ ] Ta main en éventail en bas ; les mains des autres en dos de carte ou visibles (au choix)
- [ ] Pile au centre, lisible, avec la cible de chaque sort ou capacité
- [ ] Barre des phases et étapes, indicateur du joueur actif et de celui qui a la priorité
- [ ] Combat : attaquants et bloqueurs désignés au toucher, flèches vers le joueur ou le planeswalker attaqué, ordre des bloqueurs
- [ ] Ciblage en touchant la carte ou le joueur ; menu d'actions sur appui (lancer, activer, mana)
- [ ] Cartes dessinées par la page (cadre aux couleurs, nom, coût, type, texte, force et endurance modifiées par les layers en couleur), zoom au toucher
- [ ] Mise en page téléphone d'abord : la place du joueur qui a la priorité en grand, les autres en bandeaux repliables ; vue complète sur grand écran

### 6.4 Contrôle des joueurs
- [ ] « Passer la priorité » fait tourner la priorité dans l'ordre des tours (117), la pile se résout quand tout le monde a passé
- [ ] Bascule automatique de la vue vers le joueur qui doit agir ou choisir (blocages, défausses, choix pendant la résolution)
- [ ] Passage automatique optionnel pour les joueurs sans action possible
- [ ] Journal de la partie, verdict de chaque action consultable

### 6.5 Ce que la partie doit suivre en plus
- [ ] Fin de partie (104) : défaite à 0 point de vie, pioche dans une bibliothèque vide, 10 poisons, 21 dégâts d'un même commandant ; un joueur qui perd quitte la partie avec ses objets (800.4a)
- [ ] Taxe de commandant, renvoi en zone de commandement
- [ ] Multijoueur : « chaque adversaire », attaque de plusieurs joueurs, portée des effets

### 6.6 Ensuite
- [ ] Annuler la dernière action (instantané de l'état avant chaque action)
- [ ] Sauvegarde et reprise d'une partie
- [ ] Batterie de parties tests (étape 5)

### Contraintes vérifiées
- La page ne peut appeler aucun autre site : pas de lecture directe d'Archidekt, Moxfield ou Scryfall, et aucune image distante ne s'affiche. D'où le collage de liste et les cartes dessinées par la page.
- Le stockage persistant de la page existe (decks et parties enregistrés).
- Une option « salle » permettrait plus tard que chaque joueur joue depuis son propre appareil ; non prévue pour l'instant puisque tu gères seul la table.

## Revue des 5 decks Archidekt (Meeko, Nissa, Codie, Tom Bert et William, Chulane)

- [x] Cartes communes : Path to Exile et Assassin's Trophy (recherche du contrôleur de la cible), Exotic Orchard, Reflecting Pool, Fellwar Stone (106.7), Akroma's Will et Jeska's Will (deux modes si tu contrôles un commandant), Dawn's Truce, Teferi's Protection (mots-clés de joueur, PV figés, phasing, exil du sort), Reprieve et Bilbo's Gambit (retour en main sans contrer), Esper Sentinel (premier sort non-créature du tour)
- [x] Préparation (722) : sort préparé traduit ou copié d'une autre carte, « devient / arrive préparé », copie en exil lançable, Codie copie les sorts préparés
- [x] Statiques : Grand Abolisher, Seedborn Muse, Elesh Norn et Veyran (déclenchements supplémentaires ou empêchés), Sakashima (règle des légendes), Yasharn (sacrifice et PV comme coût), Darksteel Angel (marqueurs), Electro (mana conservé), Drannith Magistrate et Kellan (lieu de lancement), The One Ring (« si tu l'as lancé »)
- [x] Mots-clés de joueur : défense talismanique, linceul, protection (Leyline of Sanctity, Shalai, Crystal Barricade, Absolute Virtue)
- [x] Valeurs : main la plus grande d'un adversaire, créatures mortes ce tour, sorts lancés ce tour, vie gagnée ce tour, couleurs parmi tes permanents, plus grande endurance, valeurs mémorisées (Reanimate, Disciple of Bolas)
- [x] Déclencheurs : lancer ou copier, regard (scry) et surveillance, mana déclenché (Leyline of Abundance)
- [x] Bibliothèque : Ponder, Sensei's Divining Top, Scroll Rack
- [x] Copies avec exceptions : Spark Double, Sakashima, Cursed Mirror, Astral Dragon
- [x] Divers : Spelunking, Darksteel et Blightsteel Colossus, Command Beacon, Urza's Saga, Champion of Lambholt, Martial Coup
- [ ] Restent une cinquantaine de cas particuliers (liste dans la réponse du 18/11)

### Passe « tout selon les règles » (v0.4.0, 19/11/2026)
- Coûts des capacités déclenchées (« tu peux [coût]. Si tu le fais… », 118.12, et « Mandatory » quand le coût n'est pas optionnel) : mana, piocher, sacrifier (avec filtre : autre créature, jeton…), défausser, exiler la carte déclenchante du cimetière, flétrir N, butiner, remettre une carte exilée au cimetière, cimetière vers bibliothèque, dégager des créatures, engager la source. Les choix se font avec la même mécanique que les coûts des capacités activées.
- Résolution rejouable (608.2c) : quand un choix dépend de ce qui s'est passé plus tôt dans la même résolution (défausser après avoir pioché, choisir parmi les cartes qu'on vient d'exiler, regarder le dessus après une pioche, « chacun garde une créature »), la question est posée au bon moment avec les bonnes options, puis la résolution est rejouée avec les mêmes tirages au hasard. Avant, le choix se faisait sur la main d'avant la pioche.
- Lancer un sort de sa main sans payer son coût pendant la résolution (608.2g) : Kellan, Buster Sword et 42 autres cartes. X vaut 0 (107.3b). Kellan propose ensuite un terrain si aucun sort n'est lancé (305.4).
- Cartes des decks passées en automatique : Party Thrasher, Kellan, Buster Sword, Nissa et Ashling (« la Nième fois que cette capacité se résout ce tour-ci »), Nykthos (capacité de mana avec choix de couleur et dévotion, 700.5), The Ozolith (marqueurs en dernière information connue, déplacement 122.5), Divine Reckoning, Selvala, Halo Fountain, Zopandrel (doubler force et endurance, 701.10b), Stensian Sanguinist, Kogla (joueur défenseur), Reconnaissance (retirer du combat, 506.4).
- Corrigé au passage : une capacité de mana avec coût en mana et choix de couleur faisait payer deux fois ; les déclenchements qui déplacent la carte déclenchante ne la retrouvaient pas (événement allégé sans nom).
- Reste à faire dans les decks : Ancient Bronze Dragon, Ojer Kaslem, Radagast, Yasharn, Lavinia, Flickering Hound, Skycoach Conductor, Pigment Wrangler, Fortune Teller's Talent, Naktamun Lorespinner, Chromatic Orrery, Doc Aurlock, Yavimaya Bloomsage, Andúril, Mangara, Shadowspear, Noble Heritage, Éowyn, Forge Anew, Black Market Connections, Nahiri's Lithoforming, Hall of Echoes, Serra's Emissary, Terror of the Peaks, Valgavoth, Bolas's Citadel, Syr Konrad, Animate Dead, Colossal Grave-Reaver, Necromancy, Beseech the Mirror.

## Objectif : 100 % des cartes jouables automatisées (en cours, mis à jour le 19/11/2026)

### Suivi carte par carte
- Fichier `coverage.json` dans le dépôt mtg-table, régénéré par `python3 tools/coverage.py <forge/res> <sim/db> <date> coverage.json`.
- Une entrée par carte imprimée (99 709 au 19/11/2026) : nom, édition et son nom, date de sortie, numéro de collection, rareté, variante (sans bordure, vitrine, promo…), artiste, catégorie (papier, fantaisie, en ligne), coût, types, statut (`automatisee`, `partielle`, `manuelle`, `absente`) et la liste des manques de la carte.
- Les noms imprimés alternatifs (Universes Within) indiquent le nom de la carte dans le simulateur.
- Explorateur en ligne (artefact « Suivi des cartes ») : recherche, filtres par édition, statut, rareté et manque, camemberts, export CSV, et chargement d'un nouveau coverage.json.
- Le périmètre compte maintenant aussi les cartes papier listées seulement dans les sections annexes des éditions de Forge (cartes Jumpstart d'Avatar, decks de planeswalker, etc.).
- Vérifié contre MTGJSON AllPrintings du 18/11/2026 (`tools/mtgjson_extract.py`, puis 5e argument de `coverage.py`) : chaque impression porte un champ `mtgjson`. MTGJSON compte 32 666 cartes papier légales en tournoi ; il n'en manque aucune chez nous à part Wicker Picker (pas de script Forge), les 7 faces fusionnées des cartes Meld (couvertes par leurs paires) et 2 différences d'orthographe. Corrigé grâce à lui : noms Secret Lair comptés deux fois, cartes Shandalar et Arena classées en papier, cartes de test classées en papier, cartes légales d'Unfinity classées en fantaisie.
- Cartes de Forge pas encore sorties, classées « non sortie » et exclues du décompte : les 8 cartes Dune du Secret Lair « My Arrakis, My Superdrop » (sortie annoncée le 30/11/2026) et Borg Queen, One Who Is Many (prévue pour la Beginner Box Star Trek, annulée ; pas de n° 131 dans Star Trek Commander chez MTGJSON). Les 2 différences d'orthographe (Ratonhnhaké:ton, All Good Things...) sont réglées.

### Où on en est (v0.9.0)
- Papier (cartes légales en tournoi selon MTGJSON) : 26 191 automatisées sur 32 659 (80,2 %), 2 683 partielles, 3 784 à la main (v0.23.0). Les v0.19.0 à v0.23.0 ont retiré plus de 1 000 cartes comptées à tort comme automatisées (corrigées ou repassées en partielles).
- Fantaisie : 195 sur 407 (47,9 %). En ligne : 127 sur 677 (18,8 %).
- Extensions récentes : Star Trek 77,8 %, Star Trek Commander 82,5 %, Reality Fracture 78,9 %, The Hobbit 76,2 %, Marvel Super Heroes 76,2 %.
- Historique : 69,3 % au début de la passe, 72,1 % en v0.7.0, 72,6 % en v0.8.0, 73,7 % en v0.9.0.

### Pourquoi on n'est pas encore à 100 %
- Les 8 448 cartes restantes butent sur 2 997 manques différents. 2 457 de ces manques touchent trois cartes ou moins.
- 7 593 cartes n'ont qu'un seul manque. Traiter les 30 manques les plus fréquents en débloquerait environ 1 200, les 100 premiers environ 2 600. Au-delà, c'est du cas par cas.
- Certaines cartes comptées « automatisées » ne l'étaient pas vraiment : le traducteur ignorait un détail sans le signaler. Trois groupes trouvés et corrigés en v0.9.0 (restrictions d'activation, « ne peut attaquer que si le défenseur contrôle… », effets « jusqu'à ton prochain tour »). Il peut en rester d'autres.

### Fait en v0.8.0 et v0.9.0
- Maîtrise de la terre, de l'eau, de l'air et du feu (701.65 à 701.67, 702.189), Star Trek (téléportation, assimilation, renforcer Jace, faire face à un dilemme 700.17), ruse, grabuge, toile, harmonisation, équipe.
- Attacher (701.3), copies avec exceptions et durée (707.2, 707.9), phases supplémentaires (500.8).
- Mots-clés : palier, surenchère, déluge funèbre, démonstration, épopée, dissimulation, dragage, miracle, imminence, coût additionnel au choix.
- Restrictions d'activation (602.5b) : une fois par tour, une fois par partie, épuisement, pendant ton tour, phases précises, premier combat, sous condition, activable par un autre joueur.
- Déclencheurs : capacités d'état (603.8), « bloque ou est bloquée par une créature », « n'est pas bloquée », « se dégage », « tu actives une capacité », « devient la cible de » (sorts seulement, première fois du tour, par toi ou un adversaire).
- Coûts : retirer des marqueurs au choix parmi plusieurs permanents.
- Effets : sacrifier tout ce qui correspond, révéler des cartes de sa main, nombre de noms différents.

### Fait en v0.10.0
- Prévenir la prochaine blessure d'une source choisie (Circle of Protection, 615.7), branches conditionnelles plus variées, valeurs « si… alors N, sinon M ».
- Filtres : entré ce tour-ci, modifié (700.9), attaché à…, contrôlé par le joueur de l'événement ou de la cible.
- Joueurs et objets liés à l'événement : défenseur, contrôleur de l'attaquant, du bloqueur ou de la source, cible du déclencheur, attaquants.
- « Ne peut pas bloquer » accordé par un effet, terrains supplémentaires et taille de main dans les effets, mana pour un autre joueur et mana qui reste jusqu'à la fin du tour.
- Affrontement (701.30), déplacer des marqueurs, déclencheurs « se transforme » et « attaque un seul joueur », relancer une carte retenue en payant, sorts qui se mélangent dans la bibliothèque, éclipses (exiler puis renvoyer).
- Corrigé : 86 cartes perdaient la fin de leur effet quand Forge plaçait un « nettoyage » au milieu de la chaîne (par exemple, Blur ne faisait pas piocher).

### Fait en v0.11.0
- Statiques qui touchent l'objet auquel la source est attachée (Animate Artifact), filtre « contrôlé par le joueur en cours » (Typhoon), nombre de permanents entrés ce tour-ci.
- Défausse et sacrifice en quantité variable, marqueurs de joueur de tout type, traversée de terrain accordée par un effet.
- Choix proposés à un autre joueur (cycle des Torment), regarder le dessus : « autant que tu veux », reste sur le dessus, ordre aléatoire, carte mise engagée ou en bibliothèque.
- Corrigé : regarder le dessus avec « toutes les cartes X » prenait aussi les cartes qui ne correspondaient pas.
- Ignoré à raison : les indications pour l'IA de Forge, qui n'ont pas d'effet de jeu.

### Fait en v0.12.0
- Capacités de mana déclenchées « ajoute un mana du même type » (Mana Flare, Heartbeat of Spring) et déclencheurs « quand un terrain est engagé pour du mana » (Manabarbs).
- Manifester (701.40) : créature 2/2 face cachée, retournable pour son coût si c'est une carte de créature, ou pour son coût de mue ou de déguisement.
- Jetons créés attachés à une cible ou à un objet retenu (Auras et Équipements jetons).
- Corrigé : « toutes les créatures deviennent… » (AnimateAll) ignorait sans le dire les capacités, déclencheurs, couleurs, pertes de capacités et retraits de mots-clés. Tout est maintenant traduit ou signalé.

### Fait en v0.23.0 (troisième demande du suivi des cartes)
- Malédictions : « le joueur enchanté ne peut pas gagner de vie » (Grievous Wound), « ne peut pas lancer plus d'un sort par tour » (Curse of Exhaustion, et toute limite de sorts par tour), « les créatures qui attaquent le joueur enchanté » (Curse of Hospitality), « révèle jusqu'à une créature et la met sous ton contrôle » (Curse of Unbinding). 33 malédictions sur 46.
- Correction de défauts anciens, désormais appliqués ou signalés : le contrôle gagné lors d'une révélation (Telemin Performance, Thought Dissector…), le joueur qui reçoit un effet durable (EffectOwner, une trentaine de cartes), les restrictions des « lance gratuitement parmi ces cartes » (valeur de mana, lanceur, nombre de sorts), les « lance la carte du dessus » qui ne faisaient rien (7 cartes, maintenant signalées).
- Pas fait : préventions de blessures d'un sort ciblé, cibles en exil ou sur plusieurs zones, choix de carte ou de nombre, 41 variantes de l'effet Play, Mycosynth Lattice, miracle, prévoyance, folie, flash accordés, encore, scavenge, dredge, mayhem, propriétés de sort (Bargain, Kicked…).

### Fait en v0.22.0 (deuxième demande du suivi des cartes)
- Malédictions (Aura « Enchant player », 303.4) : l'Aura s'attache à un joueur et y reste, « le joueur enchanté » dans les déclencheurs, cibles, blessures, pioches et sorts lancés, « les adversaires qui l'attaquent ». 30 malédictions sur 46 sont automatisées.
- Correction d'un défaut ancien : les conditions « attaque toi / attaque un joueur / attaque un planeswalker » (Attacked, AttackedTarget) et « blessures infligées à tel joueur » étaient ignorées ; « quand des créatures t'attaquent » (Orim's Prayer…) se déclenchait sur tes propres attaques. Les valeurs non reconnues sont maintenant signalées au lieu d'être ignorées.
- Correction d'un défaut ancien : « le type choisi » et « la couleur choisie » (Xenograft, Wild Mongrel, Prismatic Lace…, une quarantaine de cartes) n'étaient jamais remplacés par le choix.
- Cibles sur la pile : laces (« le sort ou permanent ciblé devient … », la couleur reste si le sort devient un permanent), Parallectric Feedback, Disrupting Shoal (une seule cible désormais).
- Statiques dans toutes les zones : Painter's Servant, Leyline of Transformation, Conspiracy, Arcane Adaptation, Biotransference… changent aussi les cartes en main, au cimetière, en exil et les sorts.
- Mots-clés accordés depuis la main : ninjutsu, évocation, warp (Tannuk). Pile ou face avec cible (Goblin Archaeologist, Goblin Lyre…).
- « Perd la partie » marque maintenant le joueur comme éliminé.
- Pas fait : prévention de blessures d'un sort ciblé (Hallow, Reverberation, Dromoka's Command), cibles en exil ou sur plusieurs zones, 41 variantes de l'effet Play, miracle, prévoyance, folie et flash accordés, encore, scavenge, dredge, mayhem, propriétés de sort (Bargain, Kicked, Transformed…).

### Fait en v0.21.0 (demande envoyée depuis le suivi des cartes)
- Cibles hors du champ de bataille : « cible une carte de ton cimetière » (TargetOnly suivi d'un déplacement), effets durables qui ciblent une carte d'un cimetière ou de l'exil (Emry : « tu peux lancer cette carte ce tour-ci »).
- Mots-clés accordés aux cartes du cimetière (613.1f) : flashback (Lier, Return the Past, Snapcaster Mage, Past in Flames…), évasion (Underworld Breach), retrace, exhumation (Mishra, Sedris). Mots-clés accordés aux cartes de la main : cyclage et cyclage de type (Jo Grant, Homing Sliver…).
- Cibles déclarées : « le joueur ciblé perd la partie », « l'adversaire ciblé révèle le dessus de sa bibliothèque », « mets ses marqueurs sur la créature ciblée » (dernière information connue, 608.2h).
- Effet Play : Galvanoth ; capacités de planeswalker et conditions acceptées sur « lance un sort depuis … ».
- Filtres : historique, hors-la-loi, « attaché à cette carte », carte de permanent (exclut éphémères et rituels). Les propriétés inconnues ne sont plus prises pour des sous-types : environ 60 cartes repassent honnêtement en partielles (Bargain, Transformed, Damaged…).
- Reste de la demande : cibles sur la pile (Lifelace, Parallectric Feedback…), sorts « lance une copie » aux variantes rares (41 cartes Play), statiques qui changent types et couleurs dans toutes les zones (Painter's Servant, Mycosynth Lattice…), miracle, prévoyance, ninjutsu accordés depuis la main.

### Fait en v0.20.0 (deuxième passe de contrôle)
- Outils de contrôle (`tools/audit/`) : banc enrichi (couleurs, sous-types, marqueurs, auras attachées, bibliothèques réelles, deux façons de répondre aux questions) ; pilotage réel des 10 904 cartes à capacités déclenchées : l'événement est provoqué dans le moteur (mort, attaque, blessures, sort lancé, étape, gain de vie, cyclage, défausse, engagement…), avec un objet fabriqué pour satisfaire le filtre du déclencheur, puis la capacité est mise sur la pile et résolue comme en partie.
- Corrigé (cartes comptées à tort) : « l'aura / l'équipement fait … à la créature enchantée » ne faisait rien du tout (122 cartes) ; « quand ~ meurt, il inflige des blessures égales à sa force » infligeait 0 (dernière information connue perdue entre le déclenchement et la résolution) ; conditions « si ~ est monstrueux / est un enchantement / … » ignorées (environ 130 cartes) ; durée « permanente » des effets de capacités déclenchées ramenée à la fin du tour ; déclencheurs « quand ~ est mis dans un cimetière depuis le champ de bataille » des non-créatures qui ne se déclenchaient jamais (69 cartes) ; deux sous-effets ciblant avec le même filtre fusionnés en une seule cible (Leeching Bite, Common Bond…) ; mélange oublié après un déplacement vers la bibliothèque (Alabaster Dragon…) ; propriétaire confondu avec le contrôleur (Brand…) ; filtres de zone évalués pour le mauvais joueur (Rally the Ancestors…) ; « choisis une créature que tu contrôles » appliqué au sort lui-même (Kayla's Command, Populate, Devout Invocation…) ; Jinxed Idol ; cibles dans une autre zone ignorées (repassées en partielles).
- Choix d'objet à la résolution (608.2c) pour mettre des marqueurs, copier, engager, détruire ; l'effet « il gagne … » s'applique ensuite à l'objet choisi.
- Contraintes de ciblage vérifiées aussi au moment de lancer et lors du choix automatique des cibles des capacités déclenchées (il n'y a pas d'IA : une seule personne joue tous les joueurs).
- Répartition des blessures par défaut quand aucune n'est annoncée (601.2d) ; messages plus clairs (effet appliqué, permanent déjà engagé, coûts Forge traduits).
- Pas encore piloté : chapitres de saga, déplacements de zone génériques, déclencheurs d'état, mutation, crimes, etc. (822 capacités) ; environ 1 000 capacités restent sans effet observable sur le banc, examinées par échantillons (contexte du banc : pas de cible, compteur à 0, condition non remplie).

### Fait en v0.19.0 (contrôle des cartes « automatisées »)
- Contrôle statique (`tools/audit/audit.py`) et dynamique (`tools/audit/dyn.js` : chaque capacité de chaque carte automatisée est résolue sur un plateau type, à la recherche d'erreurs, d'actions inconnues, de journaux « undefined » et de résolutions sans effet), plus un contrôle de cohérence des cibles intégré au traducteur : une action qui vise une cible que l'unité ne déclare pas, ou qui traite un joueur ciblé comme un objet, rend la carte partielle.
- 608.2h : chaque action d'une résolution relit l'état courant ; ce qui a quitté le champ de bataille garde sa dernière information connue (113.7a).
- Corrigé (cartes comptées à tort) : « renvoie ~ dans la main » et assimilés sans cible (environ cent cartes) ; Pyroblast / Hydroblast et autres « si c'est un sort … » ; filtres dont le « sous-type » était en réalité une référence (Remembered, Targeted, Player…), dont les malédictions (aura sur joueur pas encore gérée, repassées en partielles) ; effets « tous les … que contrôle le joueur ciblé » qui touchaient tout le monde (Gulf Squid, Seismic Wave…) ; unités ciblées dont l'ensemble « tous les … » était ignoré (Orzhov Charm, Hubris…) ; X dans les filtres « force inférieure ou égale à X » ; Krosan Reclamation (mélange, cartes du joueur ciblé) ; Past in Flames et capacités accordées hors du champ de bataille (repassées en partielles) ; Graveyard Shovel ; Blim ; propriétaire et contrôleur confondus.
- Source des blessures désignée (120.3) : « la créature ciblée inflige des blessures égales à sa force » (Rabid Bite, Giantfall…), contact mortel et lien de vie compris ; aucune blessure si la créature n'est plus là.
- Contraintes de ciblage (115.3, 601.2c) appliquées au choix des cibles : cibles différentes, même contrôleur, contrôleurs différents (une par joueur), cartes du joueur ciblé, type de carte en commun, contrôleur lié au déclencheur.
- Gain de contrôle : nouveau contrôleur désigné (joueur ciblé, joueur du déclencheur…), sans cible (Defined) ou sur tout un ensemble, durées « tant que ~ reste sur le champ de bataille / tant que tu le contrôles » (611.2b) ; échange de contrôle entre deux cibles (Legerdemain).
- Filtres « même nom que la cible / l'objet retenu / l'objet du déclencheur » (Maelstrom Pulse, Izzet Staticaster, Bile Blight…), « la cible elle-même », « attaché à la cible », face cachée, « qui bloque cette créature », « que tu ne possèdes pas ».
- Effets dont la source est la carte (Wall of Wonder…), Groupe (700.8), cartes piochées ce tour-ci, déclencheurs de blessures infligées à toi, recherche dans la zone d'un joueur ciblé choisie par toi ou par lui.
- Pas encore vérifié en conditions réelles : les contraintes de ciblage ne s'appliquent qu'aux choix faits à la main (le choix automatique des cibles des capacités déclenchées ne les vérifiait pas : corrigé en v0.20.0).

### Fait en v0.18.0
- Fusion (702.102) : les deux moitiés d'une carte scindée lancées ensemble depuis la main, coût additionné, deux groupes de cibles (Wear // Tear, Far // Away…).
- Blessures de combat égales à l'endurance (Doran…) ou aucune blessure de combat ; « ne peut pas être régénéré » (Incinerate, Flamebreak…).
- Déclencheurs de perte de vie, y compris « pour la première fois de chaque tour » ; sacrifices imposés au joueur concerné par le déclencheur ou aux autres joueurs.
- Corrigé : la référence « source de l'effet » dans les effets durables.

### Fait en v0.17.0
- Épuiser en attaquant (701.43) : case à cocher à la déclaration, pas de dégagement au prochain dégagement, capacité réflexe « quand tu le fais » (avec cible possible).
- Capacités déclenchées à plusieurs modes (700.2) : cases à cocher, une cible par mode, mode sans cible légale non choisissable.
- Capacités différées « quand cette créature meurt / quitte le champ de bataille [ce tour-ci] » et « quand tu lanceras ton prochain sort de … ce tour-ci » (603.7c).
- Exigences de blocage (509.1c) : « doit bloquer cette créature si possible », « bloque à chaque combat si possible ».
- « Ne peut pas être la cible de » (115.4) ; « ne peut ni attaquer, ni bloquer, ni activer ses capacités » (Arrest et assimilés).
- Chaque créature inflige des blessures égales à sa force (Band Together…), redirections « les prochaines N blessures / toutes les blessures de combat » sans choix de source (en-Kor, Mirror Strike, Vassal's Duty…).
- Commettre un crime (700.13) et ses déclencheurs ; manifester l'effroi (701.62) ; déclencheurs « quand une créature est retournée face visible ».
- Choix entre plusieurs effets fait par l'adversaire ciblé ou pour une cible ; branches sur le coût alternatif payé (Mastery) ou avec effet continu.
- Force / endurance comparée à X variable dans les filtres ; « créature blessée par cette source ce tour-ci » (Sengir Vampire) ; peut attaquer malgré le défenseur (général).
- Copies jetons avec célérité et sacrifice / exil à la fin du tour (Kiki-Jiki…), copie avec types de créature imposés ; conditions Délire, Métallurgie, Heure fatidique… sur les capacités statiques ; marqueurs d'arrivée selon évasion, raid, morbidité, révolte ou lancement depuis la main.
- Honnêteté : une carte contenant encore une action « à la main » n'est plus jamais comptée comme automatisée (11 cartes corrigées) ; corrigé une branche qui ne détruisait rien (Kirtar's Wrath).

### Fait en v0.16.0
- Dernières cartes « source de ton choix » : couleur du mana dépensé (Protective Sphere), couleur partagée avec la carte exilée (Mourner's Shield), créature enchantée par l'aura sacrifiée (Kithkin Armor), pile ou face doublant ou prévenant la prochaine blessure (Desperate Gambit). Les couleurs de mana dépensées sont maintenant retenues aussi pour les capacités activées.
- Marqueurs étourdissement (122.1d) : ils existaient sur des centaines de cartes sans aucun effet ; un permanent qui devrait se dégager perd un marqueur à la place (étape de dégagement et effets de dégagement).
- Renforcement (701.39a), plusieurs marqueurs de sortes différentes à la fois, marqueurs de force et d'endurance quelconques (+1/+0, +2/+2, -0/-1…), « retire tous les marqueurs ».
- Arrivée avec des marqueurs (si kické, ou au choix parmi plusieurs sortes, éventuellement différentes).
- « Ne peut pas t'attaquer, ni tes planeswalkers » ; taille maximale de main augmentée ou réduite ; interdiction de chercher dans sa bibliothèque.
- Capacité au choix parmi plusieurs (vigilance, lien de vie ou célérité…) ; oublis internes de Forge sans effet de jeu.

### Fait en v0.15.0
- Boucliers « source de ton choix » complétés : les N prochaines blessures (Harm's Way, Shining Shoal avec X, Healing Grace, Refraction Trap), la moitié arrondie à l'inférieur (Dark Sphere), redirection vers le contrôleur de la source (Reflect Damage), suites exil du dessus de la bibliothèque (Bone Mask), pioche (New Way Forward), gain de vie selon la couleur de la source (Samite Ministration, Shadowbane), protection de toi et tes créatures.
- Wizard's Spellbook : copie lancée en payant {1} au lieu de son coût (résultat 10 à 19).
- Liesa : la taxe de commandant se paie en points de vie.
- Torgaar : sacrifice d'un nombre X de créatures en coût additionnel, réduction de {2} par créature ; sorts de permanent avec coût additionnel en général ; valeur « points de vie de départ ».
- Break Out : condition sur la carte choisie, « tu peux la mettre sur le champ de bataille », célérité à la carte mise ainsi, le reste au-dessous de la bibliothèque dans un ordre aléatoire (aussi corrigé pour toutes les cartes « le reste au-dessous dans un ordre aléatoire »).
- Correction : une carte exilée par une capacité depuis la main ou un cimetière n'était pas marquée « exilée avec » sa source (Isochron Scepter ne trouvait pas sa carte).

### Fait en v0.14.0
- « Une source de ton choix » (609.7a, 615.7, 614.9) : prévention ou redirection, la prochaine fois ou pour tout le tour, vers toi, ta source ou une cible ; protection de toi, d'une cible, de toi et tes permanents ; suites « tu gagnes autant de PV » et « inflige autant au contrôleur de la source » (Beacon of Destiny, Kor Chant, Eye for an Eye, Honorable Passage, Circle of Protection: Artifacts…). Correction d'un bogue : la prévention « prochaine fois » n'était jamais appliquée aux blessures.
- Lancer une copie d'une carte exilée (707.12), gratuite ou payée ; les copies non lancées cessent d'exister (Isochron Scepter, Panoptic Mirror, Jacob Frye, Nashi…).
- Modifications de coût en symboles de mana ({B} de plus, {W}{B} de moins, {1}{U} de moins), réduction de mana coloré absent reportée sur le générique (118.7d) sauf « seulement le mana coloré » ; réduction selon le nombre de cibles (Hinata) ; capacités d'épuisement et de recyclage ; condition « s'il cible un sort ».
- Choisir parmi les cartes déplacées avec un filtre, ou parmi les cartes exilées avec la source, puis déplacer la carte choisie.
- Déclencheurs internes de Forge (oubli d'une carte imprégnée) ignorés au lieu de bloquer la carte.

### Fait en v0.13.0
- Coûts pour attaquer payés à la déclaration (Propaganda, Ghostly Prison : 508.1g, 508.1h), en mana générique ou coloré.
- Nombre de cibles variable pour les cartes hors du champ de bataille et selon le nombre de joueurs, valeurs selon le cadeau promis ou le marchandage.
- Jour et nuit : « il fait jour quand ce permanent arrive » et le déclencheur « quand le jour devient la nuit ».
- « S'il devait mourir, exile-le (ou renvoie-le en main) à la place », et la victoire de Laboratory Maniac.

### Prochaines étapes, par nombre de cartes débloquées
1. Choisir une source (64 cartes), choix d'une carte hors du champ de bataille (54), choix parmi des options (49), branches conditionnelles (45).
2. Nombre de cibles variable (54 + 54), déclencheurs créés par un effet durable (65), « jouer » des cartes dans les cas restants (63).
3. Statiques sans effet traduit (70), modifications de coût particulières (61), mots-clés paramétrés (52).
4. Références au joueur lié à un événement (joueur ciblé, défenseur, contrôleur de la carte déclenchante : environ 200 cartes en tout).
5. Valeurs liées à la carte déclenchante (force, endurance, valeur de mana du bloqueur ou de l'attaquant), marqueurs de type inconnu, déplacer des marqueurs, affrontement (clash), manifester.
6. Audit du traducteur : pour chaque type de capacité, vérifier que tous les paramètres Forge rencontrés sont soit traduits, soit signalés, pour ne plus avoir de fausses « automatisées ».
7. Puis la longue traîne, extension par extension en partant des plus récentes, avec `coverage.json` comme liste de contrôle.

### Pas encore vérifié en partie
- Démonstration, épopée, « bloquée par une créature », « devient la cible de » (nouveaux cas), capacité activable par un autre joueur (elle utilise le sélecteur « Pour »).
- Ruse, toile, harmonisation, équipe, renforcer Jace.
