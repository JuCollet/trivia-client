import type { PlayerView } from '@jucollet/trivia-client/schema';

import { Card } from '@/components/ui';
import { useMessages } from '@/i18n/language';
import type { Messages } from '@/i18n/messages';

export function RoundEndPhase({ view }: { view: PlayerView }) {
  const t = useMessages();
  const { roundEnd } = view.game;
  if (!roundEnd) {
    return null;
  }

  const myAwards = roundEnd.awards.filter((award) => award.playerId === view.me.id);
  const isMaster = roundEnd.masterId === view.me.id;

  return (
    <div className="flex flex-1 flex-col justify-center gap-5 text-center">
      <h1 className="text-3xl font-bold">{t.roundEnd.title}</h1>

      {isMaster && <p className="text-muted">{t.roundEnd.masterAverage(roundEnd.masterAverage)}</p>}

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-muted">{t.roundEnd.yourAwards}</h2>
        {myAwards.length === 0 ? (
          <p>{t.roundEnd.noAward}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {myAwards.map((award) => (
              <li key={award.id} className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                <span className="font-semibold">🏅 {awardLabel(t, award.id)}</span>
                {award.points !== 0 && (
                  <span className={award.points > 0 ? 'font-bold text-success' : 'font-bold text-danger'}>
                    {award.points > 0 ? '+' : ''}
                    {t.common.points(award.points)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div>
        <p className="text-sm text-muted">{t.roundEnd.score}</p>
        <p className="text-4xl font-bold text-accent tabular-nums">{t.common.points(view.me.score)}</p>
      </div>
    </div>
  );
}

/** Award ids are the `AwardId` of trivia-tv; an unknown one (newer server) shows its raw id. */
function awardLabel(t: Messages, id: string): string {
  return id in t.awards ? t.awards[id as keyof Messages['awards']] : id;
}
