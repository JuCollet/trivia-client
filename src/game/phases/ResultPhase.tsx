import type { PlayerView } from '@jucollet/trivia-client/schema';

import { AnswerButton } from '@/components/AnswerButton';
import { Card } from '@/components/ui';
import { useMessages } from '@/i18n/language';
import { cx } from '@/lib/cx';

export function ResultPhase({ view }: { view: PlayerView }) {
  const t = useMessages();
  const { question, result } = view.game;
  if (!question || !result) {
    return null;
  }

  const mine = result.scores.find((score) => score.playerId === view.me.id);
  const answered = mine?.choice != null;
  const verdict = !answered ? t.result.noAnswer : mine.correct ? t.result.correct : t.result.wrong;

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto pb-2">
      <div className="flex flex-col items-center gap-1 py-2 text-center">
        <span className="text-5xl" aria-hidden>
          {!answered ? '😶' : mine.correct ? '🎉' : '😬'}
        </span>
        <h1 className={cx('text-3xl font-bold', answered && (mine.correct ? 'text-success' : 'text-danger'))}>
          {verdict}
        </h1>
        {mine?.counted && (
          <p className="text-4xl font-bold text-accent tabular-nums">
            {mine.points > 0 ? '+' : ''}
            {t.common.points(mine.points)}
          </p>
        )}
        {mine?.responseMillis != null && (
          <p className="text-sm text-muted">{t.result.responseTime(mine.responseMillis)}</p>
        )}
      </div>

      {mine && !mine.counted && (
        <p className="rounded-xl bg-white/10 px-4 py-3 text-center text-sm text-muted">{t.result.notCounted}</p>
      )}

      {mine?.counted && mine.correct && (
        <Card className="flex flex-col gap-1 text-sm">
          <Line label={t.result.basePoints} value={t.common.points(mine.basePoints)} />
          <Line label={t.result.speedBonus} value={t.common.points(mine.speedBonus)} />
        </Card>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">{t.result.goodAnswer}</p>
        <AnswerButton
          index={result.answerIndex}
          label={question.choices[result.answerIndex]}
          state="correct"
          disabled
        />
      </div>

      {result.explanation && <p className="leading-relaxed text-muted">{result.explanation}</p>}
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
