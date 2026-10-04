# trivia-client

Client téléphone (navigateur) de **Chacun son truc**. Voir @README.md pour les commandes, les routes et l'architecture.

- Spécification du jeu : page Notion « Chacun son truc : mécanique de jeu et MVP ».
- Contrat d'API et règles du serveur : `../trivia-server/docs/architecture.md`.

## Règles

- Le serveur fait autorité : aucun calcul de score ni de règle côté téléphone, on affiche `PlayerView`.
- Les types de l'API viennent **uniquement** de `@jucollet/trivia-client/schema`, jamais redéfinis à la main.
- Tout texte affiché passe par `src/i18n/messages.ts`, en français **et** en anglais.
- Mobile d'abord : cibles tactiles larges, safe areas (`env(safe-area-inset-*)`), pas de scroll horizontal.
- React Router 8 : `RouterProvider` s'importe de `react-router/dom`, tout le reste de `react-router`.
- Avant de déclarer une tâche finie : `npm run typecheck && npm run lint && npm test`.
- Langue des échanges : français. Code, commentaires et commits : anglais.
