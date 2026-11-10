import { avatars, avatarUrl } from '@/session/avatars';

import { cx } from '@/lib/cx';

interface Props {
  label: string;
  value: string;
  /** Avatars of the other players of the game, that cannot be picked. */
  taken: readonly string[];
  onChange: (avatar: string) => void;
}

export function AvatarPicker({ label, value, taken, onChange }: Props) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 text-sm font-medium text-muted">{label}</legend>
      <div className="flex justify-center">
        <img src={avatarUrl(value)} alt="" className="size-24 rounded-full bg-night ring-4 ring-accent" />
      </div>
      {/* 81 avatars: a scrolling box keeps the form short */}
      <div className="grid max-h-60 grid-cols-5 gap-2 overflow-y-auto rounded-xl bg-white/5 p-2">
        {avatars.map((avatar) => {
          const selected = avatar === value;
          const unavailable = !selected && taken.includes(avatar);
          return (
            <button
              key={avatar}
              type="button"
              aria-label={avatar}
              aria-pressed={selected}
              disabled={unavailable}
              onClick={() => onChange(avatar)}
              className={cx(
                'aspect-square rounded-full bg-night transition active:scale-90',
                selected ? 'ring-4 ring-accent' : 'ring-1 ring-white/10',
                unavailable && 'opacity-25 grayscale',
              )}
            >
              <img src={avatarUrl(avatar)} alt="" loading="lazy" className="size-full rounded-full" />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
