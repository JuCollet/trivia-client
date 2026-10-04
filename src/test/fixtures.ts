import type { PlayerView, TvView } from '@jucollet/trivia-client/schema';

const players: TvView['players'] = [
  { id: 'p1', name: 'Alice', color: '#FF6B6B', score: 0, connected: true, themesReady: true },
  { id: 'p2', name: 'Bob', color: '#54A0FF', score: 0, connected: true, themesReady: false },
];

export function playerView(overrides: { game?: Partial<TvView>; me?: Partial<PlayerView['me']> } = {}): PlayerView {
  return {
    game: {
      code: 'KXWB',
      phase: 'LOBBY',
      canStart: false,
      players,
      settings: {
        language: 'fr',
        questionsPerTheme: 3,
        rounds: 2,
        timerSeconds: 15,
        minPlayers: 4,
        maxPlayers: 10,
        maxThemeLength: 60,
      },
      round: null,
      question: null,
      result: null,
      roundEnd: null,
      podium: null,
      ...overrides.game,
    },
    me: {
      id: 'p1',
      name: 'Alice',
      color: '#FF6B6B',
      score: 0,
      themes: [],
      themesToEnter: 2,
      themeSubmissionsLeft: 3,
      master: false,
      answer: null,
      ...overrides.me,
    },
  };
}

export function questionView(
  overrides: Partial<NonNullable<TvView['question']>> = {},
): NonNullable<TvView['question']> {
  return {
    sequence: 7,
    number: 1,
    total: 3,
    text: 'Quel fromage est fabriqué à Herve ?',
    choices: ['Le Herve', 'Le Comté', 'Le Brie', 'La Mozzarella'],
    endsAt: new Date(Date.now() + 15_000).toISOString(),
    timerSeconds: 15,
    answeredCount: 0,
    multiplier: 1,
    ...overrides,
  };
}
