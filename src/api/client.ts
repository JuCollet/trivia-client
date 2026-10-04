import { createRestClient } from '@jucollet/trivia-client/rest';
import type { ApiProblem } from '@jucollet/trivia-client/schema';

import { apiBaseUrl } from '@/config';

export const api = createRestClient({ baseUrl: apiBaseUrl });

/**
 * Error thrown by the API calls, so that React Query sees failures. `code` is the stable code of the problem detail
 * (`GAME_NOT_FOUND`, `THEME_CONFLICT`…), or `NETWORK` when the server could not be reached.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly problem: ApiProblem | null;

  constructor(problem: ApiProblem | null, status: number) {
    super(problem?.detail ?? problem?.title ?? `HTTP ${status}`);
    this.name = 'ApiError';
    this.problem = problem;
    this.status = status;
    this.code = problem?.code ?? (status === 0 ? 'NETWORK' : 'UNKNOWN');
  }
}

/**
 * Unwraps an openapi-fetch result: returns the data, or throws an {@link ApiError}.
 */
export async function unwrap<T>(call: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  let result: Awaited<typeof call>;
  try {
    result = await call;
  } catch {
    throw new ApiError(null, 0);
  }
  if (result.error !== undefined || !result.response.ok) {
    throw new ApiError(isProblem(result.error) ? result.error : null, result.response.status);
  }
  return result.data as T;
}

function isProblem(value: unknown): value is ApiProblem {
  return typeof value === 'object' && value !== null && 'code' in value;
}
