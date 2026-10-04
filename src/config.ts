/**
 * Base URL of the game server. Empty in dev: the page and the API share the Vite origin, which proxies to the server.
 */
export const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || window.location.origin;
