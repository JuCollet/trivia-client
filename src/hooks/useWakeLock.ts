import { useEffect } from 'react';

/**
 * Keeps the screen on while mounted: a buzzer that falls asleep between two questions loses its connection.
 * Only available in secure contexts (https or localhost); silently ignored elsewhere.
 */
export function useWakeLock(): void {
  useEffect(() => {
    if (!('wakeLock' in navigator)) {
      return;
    }
    let sentinel: WakeLockSentinel | null = null;
    let released = false;

    const request = async () => {
      try {
        sentinel = await navigator.wakeLock.request('screen');
        if (released) {
          await sentinel.release();
        }
      } catch {
        // Refused (battery saver, insecure context…): the game works without it
      }
    };

    // The lock is lost when the page is hidden: take it again when coming back
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void request();
      }
    };

    void request();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      released = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      void sentinel?.release();
    };
  }, []);
}
