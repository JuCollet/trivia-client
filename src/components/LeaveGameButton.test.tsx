import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { useLanguageStore } from '@/i18n/language';
import { useSessionStore } from '@/session/sessionStore';

import { LeaveGameButton } from './LeaveGameButton';

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <p>home</p> },
      { path: '/game/:code', element: <LeaveGameButton /> },
    ],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('LeaveGameButton', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'fr' });
    useSessionStore.setState({ gameCode: 'KXWB' });
  });

  it('asks for a confirmation and stays in the game when cancelled', async () => {
    const router = renderAt('/game/KXWB');
    await userEvent.click(screen.getByRole('button', { name: 'Quitter la partie' }));
    await userEvent.click(screen.getByRole('button', { name: 'Rester' }));

    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(useSessionStore.getState().gameCode).toBe('KXWB');
    expect(router.state.location.pathname).toBe('/game/KXWB');
  });

  it('forgets the game and goes home once confirmed, keeping the identity of the phone', async () => {
    const { playerId } = useSessionStore.getState();
    const router = renderAt('/game/KXWB');
    await userEvent.click(screen.getByRole('button', { name: 'Quitter la partie' }));
    await userEvent.click(screen.getByRole('button', { name: 'Quitter' }));

    expect(useSessionStore.getState().gameCode).toBeNull();
    expect(useSessionStore.getState().playerId).toBe(playerId);
    expect(router.state.location.pathname).toBe('/');
  });
});
