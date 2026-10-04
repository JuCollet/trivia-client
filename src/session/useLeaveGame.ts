import { useNavigate } from 'react-router';

import { useSessionStore } from './sessionStore';

/**
 * Leaves the game and goes back home.
 */
export function useLeaveGame(): () => void {
  const navigate = useNavigate();
  const leaveGame = useSessionStore((state) => state.leaveGame);
  return () => {
    leaveGame();
    void navigate('/', { replace: true });
  };
}
