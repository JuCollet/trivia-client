import type { ErrorPayload, PlayerView } from '@jucollet/trivia-client/schema';
import { create } from 'zustand';

export type ConnectionStatus =
  /** First connection, no state yet */
  | 'connecting'
  | 'open'
  /** Connection lost, a new attempt is scheduled: the last state stays on screen */
  | 'reconnecting'
  /** Connection refused by the server (unknown game or player): no retry */
  | 'refused';

interface PendingAnswer {
  sequence: number;
  choice: number;
}

interface GameState {
  status: ConnectionStatus;
  /** Last state pushed by the server. The screen is a function of `view.game.phase`. */
  view: PlayerView | null;
  /** Answer sent but not yet confirmed by a state, to light up the button at once */
  pendingAnswer: PendingAnswer | null;
  /** Last action refused by the server */
  error: ErrorPayload | null;
  closeCode: number | null;
  /** Sends an answer through the open connection; set by {@link useGameConnection}. */
  sendAnswer: (sequence: number, choice: number) => void;

  setStatus: (status: ConnectionStatus, closeCode?: number) => void;
  receiveState: (view: PlayerView) => void;
  receiveError: (error: ErrorPayload) => void;
  clearError: () => void;
  answer: (sequence: number, choice: number) => void;
  reset: () => void;
}

const initialState = {
  status: 'connecting' as ConnectionStatus,
  view: null,
  pendingAnswer: null,
  error: null,
  closeCode: null,
  sendAnswer: () => {},
};

export const useGameStore = create<GameState>()((set, get) => ({
  ...initialState,

  setStatus: (status, closeCode) => set({ status, closeCode: closeCode ?? null }),

  receiveState: (view) =>
    set((state) => ({
      view,
      status: 'open',
      // Forget the pending answer once the server confirmed it, or once the question changed
      pendingAnswer:
        state.pendingAnswer && view.me.answer === null && view.game.question?.sequence === state.pendingAnswer.sequence
          ? state.pendingAnswer
          : null,
    })),

  receiveError: (error) =>
    set((state) => ({
      error,
      // The answer was refused: let the player try again
      pendingAnswer: error.code === 'ANSWER_REJECTED' ? null : state.pendingAnswer,
    })),

  clearError: () => set({ error: null }),

  answer: (sequence, choice) => {
    const { pendingAnswer, view, sendAnswer } = get();
    if (pendingAnswer !== null || view?.me.answer != null) {
      return;
    }
    set({ pendingAnswer: { sequence, choice } });
    sendAnswer(sequence, choice);
  },

  reset: () => set(initialState),
}));

/**
 * Choice of this player for the open question: confirmed by the server, or just sent.
 */
export function selectMyChoice(state: GameState): number | null {
  return state.view?.me.answer ?? state.pendingAnswer?.choice ?? null;
}
