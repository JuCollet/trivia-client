import { ApiError } from '@/api/client';

import type { Messages } from './messages';

type ErrorCode = Exclude<keyof Messages['errors'], 'generic' | 'network'>;

/**
 * Text to show for a failed API call or a refused WebSocket action, from its stable error code.
 */
export function errorMessage(t: Messages, error: unknown): string {
  const code = error instanceof ApiError ? error.code : (error as { code?: string } | null)?.code;
  if (code === 'NETWORK') {
    return t.errors.network;
  }
  return code && code in t.errors ? t.errors[code as ErrorCode] : t.errors.generic;
}
