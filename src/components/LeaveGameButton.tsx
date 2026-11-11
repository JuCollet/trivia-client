import { useState } from 'react';

import { Button } from '@/components/ui';
import { useMessages } from '@/i18n/language';
import { useLeaveGame } from '@/session/useLeaveGame';

/**
 * Exit icon for the top bar. Leaving is final, so it asks for a confirmation first.
 */
export function LeaveGameButton() {
  const t = useMessages();
  const leaveGame = useLeaveGame();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={t.leave.button}
        onClick={() => setConfirming(true)}
        className="flex size-9 items-center justify-center rounded-full bg-white/10 text-lg"
      >
        <span aria-hidden>⎋</span>
      </button>
      {confirming && (
        <div
          role="alertdialog"
          aria-modal
          aria-labelledby="leave-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-night/90 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur sm:items-center"
        >
          <div className="flex w-full max-w-md flex-col gap-4 rounded-3xl bg-surface p-5 ring-1 ring-white/10">
            <h2 id="leave-title" className="text-xl font-bold">
              {t.leave.title}
            </h2>
            <p className="leading-relaxed text-muted">{t.leave.body}</p>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" onClick={leaveGame}>
                {t.leave.confirm}
              </Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                {t.leave.stay}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
