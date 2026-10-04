# trivia-client

Client téléphone de **Chacun son truc** (EN : _To Each Their Thing_) : la page web qui sert de buzzer aux joueurs.
L'écran est l'app TV (`../trivia-tv`), l'arbitre est le serveur (`../trivia-server`).

## Démarrer

```bash
npm install          # NODE_AUTH_TOKEN doit être défini (voir plus bas)
npm run dev          # http://localhost:5173, et http://<ip-du-mac>:5173 depuis les téléphones du réseau local
```

Le serveur de jeu doit tourner sur `http://localhost:8080` (`./mvnw spring-boot:run` dans `trivia-server`).
En dev, Vite relaie `/games` et `/ws` vers lui : les téléphones ne parlent qu'à Vite, sans souci de CORS.

## Commandes

```bash
npm run dev          # serveur de dev
npm test             # Vitest (jsdom + Testing Library)
npm run typecheck    # tsc
npm run lint         # oxlint
npm run format       # Prettier
npm run build        # build de production dans dist/
```

## Configuration

| Variable                  | Rôle                                                                         |
| ------------------------- | ---------------------------------------------------------------------------- |
| `VITE_API_URL`            | URL du serveur en production (`https://…`). Vide : même origine que la page. |
| `DEV_SERVER_PROXY_TARGET` | Dev uniquement : cible du proxy Vite (défaut `http://localhost:8080`).       |

## Client TypeScript du serveur

Les types, le client REST et les connexions WebSocket viennent de `@jucollet/trivia-client`, publié sur GitHub Packages
depuis `trivia-server/clients/typescript`. Le `.npmrc` du projet lit le token dans `NODE_AUTH_TOKEN`
(personal access token _classic_ avec le scope `read:packages`, exporté dans `~/.zshrc`, jamais dans le dépôt).

Après un changement d'API côté serveur : `npm install @jucollet/trivia-client@latest`.

npm 11 plante sur certaines résolutions de peer dependencies (Vitest) : utiliser `npx npm@12 install …` si besoin.

## Routes

| Route               | Écran                                                     |
| ------------------- | --------------------------------------------------------- |
| `/`                 | Rejoindre : code, pseudo, couleur                         |
| `/join/:code`       | Pareil, code prérempli : **cible du QR code de la TV**    |
| `/game/:code`       | La partie, de la saisie des thèmes au podium              |
| `/game/:code/rules` | Les règles par-dessus la partie, sans couper la connexion |
| `/rules`            | Les règles depuis l'accueil                               |

## Architecture

```
src/
├── app/          router, QueryClient
├── api/          client REST (openapi-fetch typé) + hooks React Query : résumé de partie, rejoindre, thèmes
├── game/         store Zustand de la partie, connexion WebSocket (reconnexion), un composant par phase
├── session/      identité du téléphone (playerId, pseudo, couleur, partie en cours), persistée en localStorage
├── i18n/         textes FR/EN typés, sans dépendance
├── components/   UI partagée (boutons de réponse, champs, cartes…)
├── hooks/        chrono, wake lock
└── pages/        une page par route
```

- **Le serveur fait autorité.** Le téléphone affiche le dernier état reçu (`PlayerView`) et envoie ses réponses. Une seule route pour toute la partie : l'écran est une fonction de `game.phase`, le routeur ne duplique pas la machine à états.
- **REST via React Query** pour la mise en place (rejoindre, thèmes). **WebSocket via Zustand** pour la partie : l'état poussé n'est pas du cache serveur qu'on refetch, c'est un flux.
- **Reconnexion** : le `playerId` est généré une fois par téléphone et gardé en `localStorage`. Le serveur renvoie l'état complet à chaque connexion, donc se reconnecter suffit (retour de veille, Wi-Fi → 4G, rechargement).
- **Langue** : celle du téléphone avant de rejoindre, puis celle de la partie.
- Couleurs et lettres des réponses identiques à la TV (`trivia-tv/src/theme`).
