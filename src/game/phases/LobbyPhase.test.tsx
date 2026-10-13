import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/api/client';
import { useLanguageStore } from '@/i18n/language';
import { useSessionStore } from '@/session/sessionStore';
import { playerView } from '@/test/fixtures';

import { LobbyPhase } from './LobbyPhase';

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>;
}

describe('LobbyPhase', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'fr' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends the themes with the secret id of this phone, not the public id of the view', async () => {
    useSessionStore.setState({ playerId: 'secret-id' });
    const put = vi
      .spyOn(api, 'PUT')
      .mockResolvedValue({ data: undefined, response: new Response(null, { status: 204 }) } as never);
    render(<LobbyPhase view={playerView({ me: { id: 'public-id', themes: [], themesToEnter: 1 } })} />, { wrapper });

    await userEvent.type(screen.getByLabelText('Thème du tour 1'), 'Les volcans');
    await userEvent.click(screen.getByRole('button', { name: 'Valider mes thèmes' }));

    expect(put).toHaveBeenCalledWith(
      '/games/{code}/players/{playerId}/themes',
      expect.objectContaining({ params: { path: { code: 'KXWB', playerId: 'secret-id' } } }),
    );
  });

  it('asks for the missing theme after the host added a round, keeping the others', () => {
    const view = playerView({
      game: { settings: { ...playerView().game.settings, rounds: 3 } },
      me: { themes: ['Les fromages', 'Les volcans'], themesToEnter: 3, themeSubmissionsLeft: 0 },
    });
    render(<LobbyPhase view={view} />, { wrapper });

    expect(screen.getByText(/L’hôte est passé à 3 tours : ajoute 1 thème\./)).toBeInTheDocument();
    expect(screen.getByLabelText('Thème du tour 1')).toHaveValue('Les fromages');
    expect(screen.getByLabelText('Thème du tour 3')).toHaveValue('');
    expect(screen.getByText('Compléter tes thèmes ne compte pas comme une modification.')).toBeInTheDocument();
  });

  it('lets a player with no change left complete their themes, but not change them', async () => {
    const view = playerView({ me: { themes: ['Les fromages'], themesToEnter: 2, themeSubmissionsLeft: 0 } });
    render(<LobbyPhase view={view} />, { wrapper });
    const button = screen.getByRole('button', { name: 'Compléter mes thèmes' });

    await userEvent.type(screen.getByLabelText('Thème du tour 2'), 'Les volcans');
    expect(button).toBeEnabled();

    await userEvent.type(screen.getByLabelText('Thème du tour 1'), ' belges');
    expect(screen.getByRole('button', { name: 'Modifier mes thèmes' })).toBeDisabled();
  });

  it('follows a change of the number of rounds while the form is open', () => {
    const before = playerView({ me: { themes: [], themesToEnter: 2 } });
    const { rerender } = render(<LobbyPhase view={before} />, { wrapper });

    rerender(<LobbyPhase view={playerView({ me: { themes: [], themesToEnter: 3 } })} />);

    expect(screen.getByLabelText('Thème du tour 3')).toBeInTheDocument();
  });

  it('tells the player when their last theme was removed', () => {
    const before = playerView({ me: { themes: ['A', 'B'], themesToEnter: 2 } });
    const { rerender } = render(<LobbyPhase view={before} />, { wrapper });

    rerender(<LobbyPhase view={playerView({ me: { themes: ['A'], themesToEnter: 1 } })} />);

    expect(screen.getByText('L’hôte est passé à 1 tour : ton dernier thème a été retiré.')).toBeInTheDocument();
  });
});
