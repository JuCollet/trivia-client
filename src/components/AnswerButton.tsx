import { cx } from '@/lib/cx';

const answerLetters = ['A', 'B', 'C', 'D'] as const;

// Same colors and letters as the TV tiles (trivia-tv AnswerTile): the letter helps color-blind players.
const answerColors = ['bg-answer-a', 'bg-answer-b', 'bg-answer-c', 'bg-answer-d'] as const;

interface Props {
  index: number;
  label: string;
  state?: 'idle' | 'chosen' | 'faded' | 'correct' | 'wrong';
  disabled?: boolean;
  onPress?: () => void;
}

export function AnswerButton({ index, label, state = 'idle', disabled, onPress }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPress}
      aria-pressed={state === 'chosen'}
      className={cx(
        'flex min-h-0 items-center gap-3 rounded-3xl p-4 text-left text-white shadow-[inset_0_-6px_0_rgb(0_0_0/0.25)] transition',
        answerColors[index],
        !disabled && 'active:translate-y-1 active:shadow-none',
        state === 'chosen' && 'ring-4 ring-white',
        state === 'faded' && 'opacity-30',
        state === 'correct' && 'ring-4 ring-success',
        state === 'wrong' && 'opacity-40',
        disabled && state === 'idle' && 'opacity-60',
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black/25 text-2xl font-bold">
        {answerLetters[index]}
      </span>
      <span className="line-clamp-3 text-lg leading-tight font-semibold [text-shadow:0_1px_2px_rgb(0_0_0/0.35)]">
        {label}
      </span>
    </button>
  );
}
