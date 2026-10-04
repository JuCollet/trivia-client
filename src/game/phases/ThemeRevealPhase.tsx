import type { PlayerView } from '@jucollet/trivia-client/schema';

import { Spinner } from '@/components/ui';
import { useMessages } from '@/i18n/language';

export function ThemeRevealPhase({ view }: { view: PlayerView }) {
  const t = useMessages();
  const { round } = view.game;
  if (!round) {
    return null;
  }

  const title = round.isFinal ? t.themeReveal.finalRound : t.themeReveal.round(round.number, round.total);
  const subtitle = round.isFinal
    ? t.themeReveal.finalHint
    : view.me.master
      ? t.themeReveal.yourTheme
      : t.themeReveal.themeOf(round.masterName ?? '');

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm font-semibold tracking-widest text-muted uppercase">{title}</p>
      <p className="text-xl">{subtitle}</p>
      {round.ready && round.theme ? (
        <h1 className="text-4xl font-bold text-accent drop-shadow-lg">{round.theme}</h1>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-12" />
          <p className="text-muted">{t.themeReveal.preparing}</p>
        </div>
      )}
      {round.themeReplaced && <p className="text-sm text-muted">{t.themeReveal.themeReplaced}</p>}
      {view.me.master && !round.isFinal && (
        <p className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-muted">{t.themeReveal.masterRules}</p>
      )}
      <p className="mt-4 text-muted">📺 {t.themeReveal.lookAtTv}</p>
    </div>
  );
}
