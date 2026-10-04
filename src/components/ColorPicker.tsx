import { playerColors } from '@/session/playerColors';

import { cx } from '@/lib/cx';

interface Props {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: Props) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 text-sm font-medium text-muted">{label}</legend>
      <div className="grid grid-cols-5 gap-3">
        {playerColors.map((color) => {
          const selected = color.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              aria-label={color}
              aria-pressed={selected}
              onClick={() => onChange(color)}
              className={cx(
                'aspect-square rounded-full transition active:scale-90',
                selected ? 'scale-110 ring-4 ring-white' : 'ring-2 ring-white/20',
              )}
              style={{ backgroundColor: color }}
            />
          );
        })}
      </div>
    </fieldset>
  );
}
