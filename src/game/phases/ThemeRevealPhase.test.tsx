import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useLanguageStore } from '@/i18n/language';
import { playerView } from '@/test/fixtures';

import { ThemeRevealPhase } from './ThemeRevealPhase';

const round = {
  number: 1,
  total: 4,
  isFinal: false,
  masterId: 'p2',
  masterName: 'Bob',
  theme: 'Les fromages',
  themeReplaced: false,
  ready: true,
};

describe('ThemeRevealPhase', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'fr' });
  });

  it('shows the theme of the round and its master', () => {
    render(<ThemeRevealPhase view={playerView({ game: { phase: 'THEME_REVEAL', round } })} />);

    expect(screen.getByText('Manche 1/4')).toBeInTheDocument();
    expect(screen.getByText('Le thème de Bob')).toBeInTheDocument();
    expect(screen.getByText('Les fromages')).toBeInTheDocument();
  });

  it('sends the players to the TV while it reveals the mystery theme of the final question', () => {
    // The server hides the mystery theme from the phones until the final question
    const final = { ...round, number: 5, total: 5, isFinal: true, masterId: null, masterName: null, theme: null };
    render(<ThemeRevealPhase view={playerView({ game: { phase: 'THEME_REVEAL', round: final } })} />);

    expect(screen.getByText('Question finale mystère')).toBeInTheDocument();
    expect(screen.getByText('×2')).toBeInTheDocument();
    expect(screen.getByText(/Regarde la TV/)).toBeInTheDocument();
    expect(screen.queryByText(/Claude prépare/)).not.toBeInTheDocument();
  });
});
