/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { createLogger, defineConfig, loadEnv } from 'vite';

// Phones drop their WebSocket all the time (screen locked, tab reloaded, network switch): when the game server pushes a
// state at that moment, the proxy writes to a dead socket and Vite logs the EPIPE/ECONNRESET with a full stack trace.
// The phone reconnects on its own, so these are noise; any other proxy error is still logged.
const DROPPED_SOCKET_CODES = new Set(['EPIPE', 'ECONNRESET']);
const logger = createLogger();
const logError = logger.error.bind(logger);
logger.error = (message, options) => {
  const code = (options?.error as NodeJS.ErrnoException | null | undefined)?.code;
  if (message.includes('ws proxy') && code && DROPPED_SOCKET_CODES.has(code)) {
    return;
  }
  logError(message, options);
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // In dev, the phone talks to Vite, which forwards the API to the game server: same origin, no CORS, and phones on
  // the local network only need the address of this machine.
  const serverUrl = env.DEV_SERVER_PROXY_TARGET || 'http://localhost:8080';

  return {
    customLogger: logger,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      host: true,
      proxy: {
        '/games': serverUrl,
        '/ws': { target: serverUrl, ws: true },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  };
});
