import type { PlayerView } from '@jucollet/trivia-client/schema';
import { type ReactNode, useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useParams } from 'react-router';

import { normalizeGameCode } from '@/api/games';
import { Button, Card, PlayerChip, Spinner } from '@/components/ui';
import { useGameStore } from '@/game/gameStore';
import { LobbyPhase } from '@/game/phases/LobbyPhase';
import { PodiumPhase } from '@/game/phases/PodiumPhase';
import { QuestionPhase } from '@/game/phases/QuestionPhase';
import { ResultPhase } from '@/game/phases/ResultPhase';
import { RoundEndPhase } from '@/game/phases/RoundEndPhase';
import { ThemeRevealPhase } from '@/game/phases/ThemeRevealPhase';
import { useGameConnection } from '@/game/useGameConnection';
import { useWakeLock } from '@/hooks/useWakeLock';
import { errorMessage } from '@/i18n/errors';
import { useMessages } from '@/i18n/language';
import { useSessionStore } from '@/session/sessionStore';
import { useLeaveGame } from '@/session/useLeaveGame';

/**
 * The game, from the lobby to the podium. One route for the whole game: the server owns the state machine, and the
 * screen is a function of the phase it pushes. Child routes (the rules) open on top without closing the connection.
 */
export function GamePage() {
  const code = normalizeGameCode(useParams().code ?? '');
  return <JoinedGuard key={code} code={code} />;
}

function JoinedGuard({ code }: { code: string }) {
  const playerId = useSessionStore((state) => state.playerId);
  // Checked on arrival only: leaving the game from this page must not bounce to the join form
  const [joined] = useState(() => useSessionStore.getState().gameCode === code);

  // Not joined from this phone (shared link, cleared storage): join first
  if (!joined) {
    return <Navigate to={`/join/${code}`} replace />;
  }
  return <ConnectedGame code={code} playerId={playerId} />;
}

function ConnectedGame({ code, playerId }: { code: string; playerId: string }) {
  useGameConnection(code, playerId);
  useWakeLock();
  const t = useMessages();
  const { status, view } = useGameStore();
  const leaveGame = useLeaveGame();

  if (status === 'refused') {
    return (
      <Centered>
        <Card className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg">{t.connection.gameGone}</p>
          <Button onClick={leaveGame}>{t.common.back}</Button>
        </Card>
      </Centered>
    );
  }

  if (!view) {
    return (
      <Centered>
        <Spinner />
        <p className="text-muted">{t.connection.connecting}</p>
      </Centered>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-md flex-col px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <TopBar view={view} />
      {status === 'reconnecting' && (
        <p role="status" className="mb-3 rounded-xl bg-danger/20 px-4 py-2 text-center text-sm">
          {t.connection.reconnecting}
        </p>
      )}
      <ActionError />
      <main className="flex min-h-0 flex-1 flex-col">
        <Phase view={view} />
      </main>
      <Outlet />
    </div>
  );
}

function Phase({ view }: { view: PlayerView }) {
  switch (view.game.phase) {
    case 'LOBBY':
      return <LobbyPhase view={view} />;
    case 'THEME_REVEAL':
      return <ThemeRevealPhase view={view} />;
    case 'QUESTION':
    case 'FINAL_QUESTION':
      return <QuestionPhase view={view} />;
    case 'QUESTION_RESULT':
      return <ResultPhase view={view} />;
    case 'ROUND_END':
      return <RoundEndPhase view={view} />;
    case 'PODIUM':
      return <PodiumPhase view={view} />;
  }
}

function TopBar({ view }: { view: PlayerView }) {
  const t = useMessages();
  return (
    <header className="mb-3 flex items-center justify-between gap-3">
      <PlayerChip name={view.me.name} color={view.me.color} />
      <div className="flex items-center gap-3">
        <span className="font-bold text-accent tabular-nums">{t.common.points(view.me.score)}</span>
        <Link
          to="rules"
          aria-label={t.common.rules}
          className="flex size-9 items-center justify-center rounded-full bg-white/10 text-lg font-bold"
        >
          ?
        </Link>
      </div>
    </header>
  );
}

/** Action refused by the server (late answer…), shown for a few seconds */
function ActionError() {
  const t = useMessages();
  const { error, clearError } = useGameStore();
  useEffect(() => {
    if (!error) {
      return;
    }
    const timer = setTimeout(clearError, 4_000);
    return () => clearTimeout(timer);
  }, [error, clearError]);

  if (!error) {
    return null;
  }
  return (
    <p role="alert" className="mb-3 rounded-xl bg-danger/20 px-4 py-2 text-center text-sm">
      {errorMessage(t, error)}
    </p>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return <div className="flex h-full flex-col items-center justify-center gap-4 px-4">{children}</div>;
}
