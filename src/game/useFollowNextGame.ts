import type { PlayerView } from '@jucollet/trivia-client/schema';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useJoinGame } from '@/api/games';
import { useSessionStore } from '@/session/sessionStore';

/**
 * When the host starts over, the state of the old game carries the code of the new one: the phone joins it with the
 * same id, name and color, without scanning the code again. Returns whether the phone is moving to the new game.
 */
export function useFollowNextGame(view: PlayerView | null): boolean {
  const nextCode = view?.game.nextCode ?? null;
  // me.id is the public id: joining again needs this phone's secret id, kept in the session
  const id = useSessionStore((state) => state.playerId);
  const { name, color } = view?.me ?? {};
  const navigate = useNavigate();
  const { mutate: join } = useJoinGame();
  const enterGame = useSessionStore((state) => state.enterGame);

  useEffect(() => {
    if (!nextCode || !name || !color) {
      return;
    }
    join(
      { code: nextCode, id, name, color },
      {
        onSuccess: (response) => {
          enterGame(response.code);
          void navigate(`/game/${response.code}`, { replace: true });
        },
        // Name taken or game full in the meantime: the join form explains it, with the code filled in
        onError: () => void navigate(`/join/${nextCode}`, { replace: true }),
      },
    );
  }, [nextCode, id, name, color, join, enterGame, navigate]);

  return nextCode !== null;
}
