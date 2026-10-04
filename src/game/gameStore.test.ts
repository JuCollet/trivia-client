import type { Me } from '@jucollet/trivia-client/schema';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { playerView, questionView } from '@/test/fixtures';

import { selectMyChoice, useGameStore } from './gameStore';

const questionState = (me: Partial<Me> = {}, sequence = 7) =>
  playerView({ game: { phase: 'QUESTION', question: questionView({ sequence }) }, me });

describe('gameStore', () => {
  const sendAnswer = vi.fn();

  beforeEach(() => {
    useGameStore.getState().reset();
    sendAnswer.mockReset();
    useGameStore.setState({ sendAnswer });
  });

  it('sends an answer once and shows it at once', () => {
    useGameStore.getState().receiveState(questionState());

    useGameStore.getState().answer(7, 2);
    useGameStore.getState().answer(7, 3);

    expect(sendAnswer).toHaveBeenCalledExactlyOnceWith(7, 2);
    expect(selectMyChoice(useGameStore.getState())).toBe(2);
  });

  it('keeps the pending answer until the server confirms it', () => {
    useGameStore.getState().receiveState(questionState());
    useGameStore.getState().answer(7, 1);

    // Another player answered: the server does not know our answer yet
    useGameStore.getState().receiveState(questionState());
    expect(useGameStore.getState().pendingAnswer).toEqual({ sequence: 7, choice: 1 });

    useGameStore.getState().receiveState(questionState({ answer: 1 }));
    expect(useGameStore.getState().pendingAnswer).toBeNull();
    expect(selectMyChoice(useGameStore.getState())).toBe(1);
  });

  it('forgets the pending answer when the question changes', () => {
    useGameStore.getState().receiveState(questionState());
    useGameStore.getState().answer(7, 1);

    useGameStore.getState().receiveState(questionState({}, 8));

    expect(selectMyChoice(useGameStore.getState())).toBeNull();
  });

  it('lets the player answer again when the answer is rejected', () => {
    useGameStore.getState().receiveState(questionState());
    useGameStore.getState().answer(7, 1);

    useGameStore.getState().receiveError({ code: 'ANSWER_REJECTED', message: 'Too late' });

    expect(selectMyChoice(useGameStore.getState())).toBeNull();
    expect(useGameStore.getState().error?.code).toBe('ANSWER_REJECTED');
  });
});
