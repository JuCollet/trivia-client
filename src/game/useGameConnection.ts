import { connectPlayer, CloseCode, type PlayerConnection } from '@jucollet/trivia-client/ws';
import { useEffect } from 'react';

import { apiBaseUrl } from '@/config';
import { toLanguage, useLanguageStore } from '@/i18n/language';

import { useGameStore } from './gameStore';

const RETRY_DELAYS_MS = [500, 1_000, 2_000, 4_000, 8_000];
const NAP_MS = 5_000;

/**
 * Keeps the phone connected to its game while the component is mounted, and feeds {@link useGameStore}.
 *
 * Phones lose the connection all the time (screen locked, app switched, Wi-Fi to 4G): the server sends the whole
 * state on every connection, so reconnecting is enough to catch up. A connection refused on opening (unknown game or
 * player) is final.
 */
export function useGameConnection(code: string, playerId: string): void {
  useEffect(() => {
    useGameStore.getState().reset();

    let connection: PlayerConnection | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;
    let generation = 0;
    let disposed = false;

    const connect = () => {
      clearTimeout(retryTimer);
      // Events of a replaced connection are ignored, including the close it receives right below
      const current = ++generation;
      const isCurrent = () => !disposed && current === generation;
      connection?.close();
      connection = connectPlayer({
        baseUrl: apiBaseUrl,
        code,
        playerId,
        onOpen: () => {
          attempt = 0;
        },
        onState: (view) => {
          if (!isCurrent()) {
            return;
          }
          useGameStore.getState().receiveState(view);
          const language = toLanguage(view.game.settings.language);
          if (language) {
            useLanguageStore.getState().setLanguage(language);
          }
        },
        onError: (error) => {
          if (isCurrent()) {
            useGameStore.getState().receiveError(error);
          }
        },
        onClose: ({ code: closeCode }) => {
          if (!isCurrent()) {
            return;
          }
          if (closeCode === CloseCode.NOT_FOUND || closeCode === CloseCode.INVALID_REQUEST) {
            useGameStore.getState().setStatus('refused', closeCode);
            return;
          }
          scheduleRetry();
        },
      });
      useGameStore.setState({ sendAnswer: connection.answer });
    };

    const scheduleRetry = () => {
      const state = useGameStore.getState();
      state.setStatus(state.view ? 'reconnecting' : 'connecting');
      const delay = RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];
      attempt += 1;
      retryTimer = setTimeout(connect, delay);
    };

    const reconnectNow = () => {
      attempt = 0;
      connect();
    };

    // Back from a locked screen, the socket may look open but be dead: after a nap, reconnect without waiting
    let hiddenAt: number | null = null;
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now();
        return;
      }
      const napped = hiddenAt !== null && Date.now() - hiddenAt > NAP_MS;
      hiddenAt = null;
      const { status } = useGameStore.getState();
      if (status !== 'refused' && (napped || status === 'reconnecting')) {
        reconnectNow();
      }
    };
    const onOnline = () => {
      if (useGameStore.getState().status !== 'refused') {
        reconnectNow();
      }
    };

    connect();
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('online', onOnline);

    return () => {
      disposed = true;
      clearTimeout(retryTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('online', onOnline);
      connection?.close();
    };
  }, [code, playerId]);
}
