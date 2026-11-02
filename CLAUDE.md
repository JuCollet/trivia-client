# trivia-client

Phone (browser) client of **Chacun son truc**. See @README.md for commands, routes and architecture.

- Game specification: Notion page "Chacun son truc : mécanique de jeu et MVP".
- API contract and server rules: `../trivia-server/docs/architecture.md`.

## Rules

- The server is authoritative: no score or rule computation on the phone, it renders `PlayerView`.
- API types come **only** from `@jucollet/trivia-client/schema`, never redefined by hand.
- Every displayed text goes through `src/i18n/messages.ts`, in French **and** English.
- Mobile first: large touch targets, safe areas (`env(safe-area-inset-*)`), no horizontal scroll.
- React Router 8: `RouterProvider` is imported from `react-router/dom`, everything else from `react-router`.
- Before declaring a task done: `npm run typecheck && npm run lint && npm test`.
- Chat with the user in French. Code, comments, docs, commits and pull requests: English.
