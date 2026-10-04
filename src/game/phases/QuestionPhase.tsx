import type { PlayerView } from '@jucollet/trivia-client/schema';

import { AnswerButton } from '@/components/AnswerButton';
import { selectMyChoice, useGameStore } from '@/game/gameStore';
import { useCountdown } from '@/hooks/useCountdown';
import { useMessages } from '@/i18n/language';
import { cx } from '@/lib/cx';

/**
 * The buzzer: 4 big colored buttons, in the same colors and order as on the TV.
 */
export function QuestionPhase({ view }: { view: PlayerView }) {
  const t = useMessages();
  const { question, round, players } = view.game;
  const myChoice = useGameStore(selectMyChoice);
  const answer = useGameStore((state) => state.answer);
  const { remainingSeconds, progress, expired } = useCountdown(question?.endsAt, question?.timerSeconds ?? 0);

  if (!question) {
    return null;
  }

  const locked = myChoice !== null || expired;
  const onPress = (choice: number) => {
    navigator.vibrate?.(30);
    answer(question.sequence, choice);
  };

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>{t.question.number(question.number, question.total)}</span>
        {question.multiplier > 1 && (
          <span className="rounded-full bg-accent px-2.5 py-0.5 font-bold text-night">{t.question.double}</span>
        )}
        <span>{t.question.answeredCount(question.answeredCount, players.filter((p) => p.connected).length)}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/15">
          <div
            className={cx('h-full rounded-full', progress > 0.25 ? 'bg-accent' : 'bg-danger')}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="w-8 text-right text-xl font-bold tabular-nums">{remainingSeconds}</span>
      </div>

      <p className="text-center text-lg leading-snug font-semibold">{question.text}</p>

      {view.me.master && !round?.isFinal && (
        <p className="rounded-xl bg-white/10 px-3 py-2 text-center text-sm text-muted">{t.question.masterNote}</p>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-4 gap-3 sm:grid-cols-2 sm:grid-rows-2">
        {question.choices.map((choice, index) => (
          <AnswerButton
            key={index}
            index={index}
            label={choice}
            disabled={locked}
            state={myChoice === null ? 'idle' : myChoice === index ? 'chosen' : 'faded'}
            onPress={() => onPress(index)}
          />
        ))}
      </div>

      <p className="h-6 text-center font-semibold" role="status">
        {myChoice !== null ? `✓ ${t.question.answered}` : expired ? t.question.tooLate : ''}
      </p>
    </div>
  );
}
