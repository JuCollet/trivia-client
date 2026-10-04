import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGameStore } from '@/game/gameStore';
import { useLanguageStore } from '@/i18n/language';
import { playerView, questionView } from '@/test/fixtures';

import { QuestionPhase } from './QuestionPhase';

describe('QuestionPhase', () => {
  const sendAnswer = vi.fn();

  beforeEach(() => {
    useLanguageStore.setState({ language: 'fr' });
    useGameStore.getState().reset();
    useGameStore.setState({ sendAnswer });
    sendAnswer.mockReset();
  });

  it('sends the chosen answer with the sequence of the question, then locks the buttons', async () => {
    const view = playerView({ game: { phase: 'QUESTION', question: questionView({ sequence: 42 }) } });
    useGameStore.getState().receiveState(view);
    render(<QuestionPhase view={view} />);

    await userEvent.click(screen.getByRole('button', { name: /Le Comté/ }));

    expect(sendAnswer).toHaveBeenCalledExactlyOnceWith(42, 1);
    expect(screen.getByText(/Réponse envoyée/)).toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
  });

  it('locks the buttons once the time is up', () => {
    const view = playerView({
      game: { phase: 'QUESTION', question: questionView({ endsAt: new Date(Date.now() - 1_000).toISOString() }) },
    });
    render(<QuestionPhase view={view} />);

    expect(screen.getByText('Temps écoulé')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Le Herve/ })).toBeDisabled();
  });

  it('tells the master that their answers do not count', () => {
    const view = playerView({
      game: {
        phase: 'QUESTION',
        question: questionView(),
        round: {
          number: 1,
          total: 4,
          isFinal: false,
          masterId: 'p1',
          masterName: 'Alice',
          theme: 'Les fromages',
          themeReplaced: false,
          ready: true,
        },
      },
      me: { master: true },
    });
    render(<QuestionPhase view={view} />);

    expect(screen.getByText(/tes réponses ne comptent pas/)).toBeInTheDocument();
  });
});
