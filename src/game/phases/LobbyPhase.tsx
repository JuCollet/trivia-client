import type { PlayerView } from '@jucollet/trivia-client/schema';
import { type FormEvent, useState } from 'react';

import { isApiError, useSubmitThemes } from '@/api/games';
import { Button, Card, PlayerChip, TextField } from '@/components/ui';
import { errorMessage } from '@/i18n/errors';
import { useMessages } from '@/i18n/language';

export function LobbyPhase({ view }: { view: PlayerView }) {
  const { me, game } = view;
  const hasThemes = me.themes.length === me.themesToEnter;
  const [editing, setEditing] = useState(!hasThemes);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto pb-2">
      {editing || !hasThemes ? (
        <ThemesForm view={view} onSubmitted={() => setEditing(false)} />
      ) : (
        <ThemesSent view={view} onEdit={() => setEditing(true)} />
      )}
      <LobbyStatus view={view} />
      <Card>
        <ul className="flex flex-wrap gap-2">
          {game.players.map((player) => (
            <li key={player.id}>
              <PlayerChip
                name={player.themesReady ? `${player.name} ✓` : player.name}
                color={player.color}
                dimmed={!player.connected}
              />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function ThemesForm({ view, onSubmitted }: { view: PlayerView; onSubmitted: () => void }) {
  const t = useMessages();
  const { me, game } = view;
  const [themes, setThemes] = useState(() =>
    Array.from({ length: me.themesToEnter }, (_, index) => me.themes[index] ?? ''),
  );
  const submit = useSubmitThemes(game.code, me.id);

  const conflictIndex =
    isApiError(submit.error, 'THEME_CONFLICT') && submit.error.problem?.themeIndex != null
      ? submit.error.problem.themeIndex
      : null;
  const canSubmit =
    themes.every((theme) => theme.trim().length > 0) && me.themeSubmissionsLeft > 0 && !submit.isPending;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (canSubmit) {
      submit.mutate(
        themes.map((theme) => theme.trim()),
        { onSuccess: onSubmitted },
      );
    }
  };

  return (
    <Card>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <h1 className="text-2xl font-bold">{t.lobby.themesTitle}</h1>
        <p className="rounded-xl bg-accent/15 px-4 py-3 text-sm text-accent">💡 {t.lobby.themesTip}</p>
        {themes.map((theme, index) => (
          <TextField
            key={index}
            name={`theme-${index}`}
            label={t.lobby.themeLabel(index)}
            value={theme}
            placeholder={t.lobby.themePlaceholder}
            maxLength={game.settings.maxThemeLength}
            autoComplete="off"
            enterKeyHint={index === themes.length - 1 ? 'send' : 'next'}
            onChange={(event) => {
              const next = [...themes];
              next[index] = event.target.value;
              setThemes(next);
            }}
            error={conflictIndex === index ? t.lobby.themeConflict : undefined}
          />
        ))}
        {submit.isError && conflictIndex === null && (
          <p role="alert" className="text-sm text-danger">
            {errorMessage(t, submit.error)}
          </p>
        )}
        <p className="text-sm text-muted">{t.lobby.submissionsLeft(me.themeSubmissionsLeft)}</p>
        <Button type="submit" disabled={!canSubmit}>
          {submit.isPending ? t.lobby.submitting : me.themes.length > 0 ? t.lobby.update : t.lobby.submit}
        </Button>
      </form>
    </Card>
  );
}

function ThemesSent({ view, onEdit }: { view: PlayerView; onEdit: () => void }) {
  const t = useMessages();
  const { me } = view;
  return (
    <Card className="flex flex-col gap-3">
      <h1 className="text-xl font-bold">🤫 {t.lobby.themesSent}</h1>
      <ol className="flex flex-col gap-1.5">
        {me.themes.map((theme, index) => (
          <li key={index} className="rounded-xl bg-white/10 px-4 py-2">
            <span className="text-sm text-muted">{t.lobby.themeLabel(index)} · </span>
            {theme}
          </li>
        ))}
      </ol>
      {me.themeSubmissionsLeft > 0 && (
        <button
          type="button"
          onClick={onEdit}
          className="self-start font-semibold text-accent underline underline-offset-4"
        >
          {t.lobby.edit}
        </button>
      )}
    </Card>
  );
}

function LobbyStatus({ view }: { view: PlayerView }) {
  const t = useMessages();
  const { game } = view;
  const message = game.canStart
    ? t.lobby.waitingForHost
    : game.players.length < game.settings.minPlayers
      ? t.lobby.waitingForPlayers(game.settings.minPlayers)
      : t.lobby.waitingForThemes;
  return <p className="animate-pulse text-center text-muted">{message}</p>;
}
