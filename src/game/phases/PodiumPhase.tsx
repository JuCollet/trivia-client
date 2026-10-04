import type { PlayerView } from '@jucollet/trivia-client/schema';

import { Button, Card } from '@/components/ui';
import { useMessages } from '@/i18n/language';
import { cx } from '@/lib/cx';
import { useLeaveGame } from '@/session/useLeaveGame';

const medals = ['🥇', '🥈', '🥉'];

export function PodiumPhase({ view }: { view: PlayerView }) {
  const t = useMessages();
  const leaveGame = useLeaveGame();
  const podium = view.game.podium ?? [];
  const mine = podium.find((entry) => entry.playerId === view.me.id);

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto pb-2">
      <div className="flex flex-col items-center gap-1 pt-4 text-center">
        <p className="text-sm font-semibold tracking-widest text-muted uppercase">{t.podium.title}</p>
        {mine && (
          <>
            <span className="text-6xl" aria-hidden>
              {medals[mine.rank - 1] ?? '👏'}
            </span>
            <h1 className="text-3xl font-bold">{t.podium.yourRank(mine.rank)}</h1>
          </>
        )}
      </div>

      <Card>
        <ol className="flex flex-col gap-2">
          {podium.map((entry) => (
            <li
              key={entry.playerId}
              className={cx(
                'flex items-center gap-3 rounded-xl px-3 py-2',
                entry.playerId === view.me.id ? 'bg-white/20' : 'bg-white/5',
              )}
            >
              <span className="w-8 text-center text-lg font-bold">{medals[entry.rank - 1] ?? entry.rank}</span>
              <span className="size-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="flex-1">
                <span className="font-semibold">{entry.name}</span>
                <span className="block text-xs text-muted">{t.podium.correctAnswers(entry.correctAnswers)}</span>
              </span>
              <span className="font-bold tabular-nums">{t.common.points(entry.score)}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Button onClick={leaveGame}>{t.podium.newGame}</Button>
    </div>
  );
}
