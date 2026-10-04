import { useLanguageStore } from '@/i18n/language';
import type { Language } from '@/i18n/messages';

import { cx } from '@/lib/cx';

const languages: { value: Language; label: string }[] = [
  { value: 'fr', label: 'FR' },
  { value: 'en', label: 'EN' },
];

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguageStore();
  return (
    <div className="inline-flex rounded-full bg-white/10 p-1 text-sm font-semibold">
      {languages.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-pressed={language === value}
          onClick={() => setLanguage(value)}
          className={cx('rounded-full px-3 py-1', language === value ? 'bg-white text-night' : 'text-muted')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
