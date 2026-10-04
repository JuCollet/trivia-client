import { useEffect, useState } from 'react';

/**
 * Time left until `endsAt`, refreshed every animation frame while it runs.
 *
 * The phone's clock may differ from the server's: the time left never exceeds the question's duration, so a phone
 * late by a few seconds does not show a longer timer than the TV. The server decides anyway.
 */
export function useCountdown(endsAt: string | null | undefined, durationSeconds: number) {
  const end = endsAt ? Date.parse(endsAt) : null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (end === null) {
      return;
    }
    let frame = 0;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current < end) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end]);

  const durationMs = durationSeconds * 1000;
  const remainingMs = end === null ? 0 : Math.max(0, Math.min(durationMs, end - now));
  return {
    remainingMs,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    /** From 1 when the question opens to 0 when the time is up */
    progress: durationMs > 0 ? remainingMs / durationMs : 0,
    expired: end !== null && remainingMs === 0,
  };
}
