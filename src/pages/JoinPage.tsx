import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { GAME_CODE_LENGTH, normalizeGameCode, useGameSummary, useJoinGame } from '@/api/games';
import { ColorPicker } from '@/components/ColorPicker';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { Button, Card, Logo, TextField } from '@/components/ui';
import { errorMessage } from '@/i18n/errors';
import { toLanguage, useLanguageStore, useMessages } from '@/i18n/language';
import { useSessionStore } from '@/session/sessionStore';

/** Same limit as the server (Player.MAX_NAME_LENGTH) */
const NAME_MAX_LENGTH = 20;

/**
 * Home page, and target of the TV's QR code (`/join/ABCD`): game code, nickname and color.
 */
export function JoinPage() {
  const t = useMessages();
  const navigate = useNavigate();
  const params = useParams();
  const session = useSessionStore();
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const [code, setCode] = useState(() => normalizeGameCode(params.code ?? ''));
  const [name, setName] = useState(session.name);
  const [color, setColor] = useState(session.color);

  const summary = useGameSummary(code);
  const join = useJoinGame();

  // Speak the language of the game as soon as it is known
  const gameLanguage = toLanguage(summary.data?.language);
  useEffect(() => {
    if (gameLanguage) {
      setLanguage(gameLanguage);
    }
  }, [gameLanguage, setLanguage]);

  const isMyGame = session.gameCode === code;
  const codeStatus = (() => {
    if (summary.isError) {
      return { error: errorMessage(t, summary.error) };
    }
    if (summary.data && !summary.data.joinable && !isMyGame) {
      return {
        error: summary.data.playerCount >= summary.data.maxPlayers ? t.join.gameFull : t.join.gameStarted,
      };
    }
    if (summary.data) {
      return { hint: t.join.playersCount(summary.data.playerCount, summary.data.maxPlayers) };
    }
    return { hint: t.join.codeHint };
  })();

  const canSubmit = code.length === GAME_CODE_LENGTH && name.trim().length > 0 && !codeStatus.error && !join.isPending;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    const profile = { name: name.trim(), color };
    join.mutate(
      { code, id: session.playerId, ...profile },
      {
        onSuccess: (response) => {
          session.setProfile(profile);
          session.enterGame(response.code);
          navigate(`/game/${response.code}`);
        },
      },
    );
  };

  const resumableGame = session.gameCode && session.gameCode !== code ? session.gameCode : null;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-6 px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between">
        <LanguageSwitch />
        <Link to="/rules" className="text-sm font-semibold text-muted underline-offset-4 hover:underline">
          {t.common.rules}
        </Link>
      </header>

      <Logo />

      {resumableGame && (
        <Button variant="secondary" onClick={() => navigate(`/game/${resumableGame}`)}>
          {t.join.resume(resumableGame)}
        </Button>
      )}

      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <h1 className="text-2xl font-bold">{t.join.title}</h1>
          <TextField
            label={t.join.code}
            name="code"
            value={code}
            onChange={(event) => setCode(normalizeGameCode(event.target.value))}
            placeholder={t.join.codePlaceholder}
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            enterKeyHint="next"
            className="text-center font-bold tracking-[0.5em] uppercase"
            hint={codeStatus.hint}
            error={codeStatus.error}
          />
          <TextField
            label={t.join.name}
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t.join.namePlaceholder}
            maxLength={NAME_MAX_LENGTH}
            autoComplete="nickname"
            enterKeyHint="go"
          />
          <ColorPicker label={t.join.color} value={color} onChange={setColor} />
          {join.isError && (
            <p role="alert" className="rounded-xl bg-danger/15 px-4 py-3 text-danger">
              {errorMessage(t, join.error)}
            </p>
          )}
          <Button type="submit" disabled={!canSubmit}>
            {join.isPending ? t.join.submitting : t.join.submit}
          </Button>
        </form>
      </Card>
    </main>
  );
}
