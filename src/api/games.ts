import type { JoinRequest } from '@jucollet/trivia-client/schema';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { api, ApiError, unwrap } from './client';

export const GAME_CODE_LENGTH = 4;

export function normalizeGameCode(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, GAME_CODE_LENGTH);
}

export const gameKeys = {
  all: ['games'] as const,
  summary: (code: string) => [...gameKeys.all, code, 'summary'] as const,
};

export const gameSummaryQuery = (code: string) =>
  queryOptions({
    queryKey: gameKeys.summary(code),
    queryFn: ({ signal }) => unwrap(api.GET('/games/{code}', { params: { path: { code } }, signal })),
    staleTime: 5_000,
  });

/**
 * Public summary of a game, to check a code and show its language before joining. Only fetched for a full code.
 */
export function useGameSummary(code: string) {
  return useQuery({ ...gameSummaryQuery(code), enabled: code.length === GAME_CODE_LENGTH });
}

export function useJoinGame() {
  return useMutation({
    mutationFn: ({ code, ...body }: JoinRequest & { code: string }) =>
      unwrap(api.POST('/games/{code}/players', { params: { path: { code } }, body })),
  });
}

/**
 * Sends the themes of the player, one per round. The new state comes back through the WebSocket, so there is nothing
 * to invalidate. A `THEME_CONFLICT` error carries the index of the refused theme.
 */
export function useSubmitThemes(code: string, playerId: string) {
  return useMutation({
    mutationFn: (themes: string[]) =>
      unwrap(
        api.PUT('/games/{code}/players/{playerId}/themes', {
          params: { path: { code, playerId } },
          body: { themes },
        }),
      ),
  });
}

export function isApiError(error: unknown, code?: string): error is ApiError {
  return error instanceof ApiError && (code === undefined || error.code === code);
}
