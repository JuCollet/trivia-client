# trivia-client

Phone client of **Chacun son truc** (EN: _To Each Their Thing_): the web page players use as their buzzer.
The screen is the TV app (`../trivia-tv`), the referee is the server (`../trivia-server`).

## Getting started

```bash
npm install          # NODE_AUTH_TOKEN must be set (see below)
npm run dev          # http://localhost:5173, and http://<mac-ip>:5173 from phones on the local network
```

The game server must run on `http://localhost:8080` (`./mvnw spring-boot:run` in `trivia-server`).
In dev, Vite proxies `/games` and `/ws` to it: phones only talk to Vite, so there are no CORS issues.

## Commands

```bash
npm run dev          # dev server
npm test             # Vitest (jsdom + Testing Library)
npm run typecheck    # tsc
npm run lint         # oxlint
npm run format       # Prettier
npm run build        # production build in dist/
```

## Configuration

| Variable                  | Purpose                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| `VITE_API_URL`            | Server URL in production (`https://…`). Empty: same origin as the page. |
| `DEV_SERVER_PROXY_TARGET` | Dev only: target of the Vite proxy (default `http://localhost:8080`).   |

## Server TypeScript client

Types, the REST client and the WebSocket connections come from `@jucollet/trivia-client`, published on GitHub Packages
from `trivia-server/clients/typescript`. The project's `.npmrc` reads the token from `NODE_AUTH_TOKEN`
(_classic_ personal access token with the `read:packages` scope, exported in `~/.zshrc`, never in the repository).

After an API change on the server: `npm install @jucollet/trivia-client@latest`.

npm 11 crashes on some peer dependency resolutions (Vitest): use `npx npm@12 install …` if needed.

## Deployment

CI (`.github/workflows/ci.yml`) checks every PR (types, lint, tests, build). On every push to `master`, it publishes
`dist/` to Cloudflare Pages, project `trivia-client`, served at `https://trivia.julco.dev`. The Pages project and the
DNS records are created by [trivia-infra](https://github.com/JuCollet/trivia-infra).

To configure in _Settings → Secrets and variables → Actions_:

| Name                    | Type     | Value                                                               |
| ----------------------- | -------- | ------------------------------------------------------------------- |
| `API_URL`               | variable | `https://trivia-api.julco.dev`, read at build time (`VITE_API_URL`) |
| `CLOUDFLARE_ACCOUNT_ID` | variable | Cloudflare account ID                                               |
| `CLOUDFLARE_API_TOKEN`  | secret   | Cloudflare token with the _Cloudflare Pages: Edit_ permission only  |

The `@jucollet/trivia-client` package must also grant access to this repository: _Packages → trivia-client → Package
settings → Manage Actions access_, otherwise `npm ci` fails with a 403.

## Routes

| Route               | Screen                                                            |
| ------------------- | ----------------------------------------------------------------- |
| `/`                 | Join: code, nickname, color                                       |
| `/join/:code`       | Same, with the code prefilled: **target of the TV QR code**       |
| `/game/:code`       | The game, from theme entry to the podium                          |
| `/game/:code/rules` | The rules on top of the game, without dropping the connection     |
| `/rules`            | The rules from the home page                                      |
| `/tv`               | The TV screen in a browser, proxied to trivia-tv (`functions/tv`) |

## Architecture

```
src/
├── app/          router, QueryClient
├── api/          REST client (typed openapi-fetch) + React Query hooks: game summary, join, themes
├── game/         Zustand game store, WebSocket connection (reconnection), one component per phase
├── session/      phone identity (playerId, nickname, color, current game), persisted in localStorage
├── i18n/         typed FR/EN texts, no dependency
├── components/   shared UI (answer buttons, fields, cards…)
├── hooks/        timer, wake lock
└── pages/        one page per route
```

- **The server is authoritative.** The phone renders the last state received (`PlayerView`) and sends its answers. A single route covers the whole game: the screen is a function of `game.phase`, the router does not duplicate the state machine.
- **REST via React Query** for setup (join, themes). **WebSocket via Zustand** for the game: pushed state is not server cache to refetch, it is a stream.
- **Reconnection**: the `playerId` is generated once per phone and kept in `localStorage`. The server sends the full state on every connection, so reconnecting is enough (wake from sleep, Wi-Fi → 4G, reload).
- **Language**: the phone's language before joining, then the game's language.
- Answer colors and letters match the TV (`trivia-tv/src/theme`).
