import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { playerColors } from './playerColors';

interface SessionState {
  /** Identity of this phone, kept forever: joining again with the same id is a reconnection. */
  playerId: string;
  name: string;
  color: string;
  /** Code of the game this phone joined, to come back to it after a reload or a closed tab. */
  gameCode: string | null;
  setProfile: (profile: { name: string; color: string }) => void;
  enterGame: (code: string) => void;
  leaveGame: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      playerId: randomUuid(),
      name: '',
      color: playerColors[Math.floor(Math.random() * playerColors.length)],
      gameCode: null,
      setProfile: ({ name, color }) => set({ name, color }),
      enterGame: (code) => set({ gameCode: code.toUpperCase() }),
      leaveGame: () => set({ gameCode: null }),
    }),
    { name: 'trivia-session', version: 1 },
  ),
);

/**
 * `crypto.randomUUID()` only exists in secure contexts (https or localhost), but in dev the phones open the page over
 * plain http on the local network. `crypto.getRandomValues()` is available everywhere.
 */
export function randomUuid(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 9562 variant
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
