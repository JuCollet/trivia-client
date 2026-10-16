// Cloudflare Pages Function: https://trivia.julco.dev/tv/* serves the browser version of the TV screen,
// built and deployed by trivia-tv on its own Pages project. The TV and the phones thus share one address.
// The TV build expects to live under /tv (experiments.baseUrl): the prefix is stripped before forwarding.
const TV_ORIGIN = 'https://trivia-tv.pages.dev';

export function onRequest({ request }) {
  const url = new URL(request.url);
  const target = new URL(url.pathname.replace(/^\/tv/, '') || '/', TV_ORIGIN);
  target.search = url.search;
  return fetch(new Request(target, request));
}
