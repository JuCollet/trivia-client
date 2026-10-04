import { describe, expect, it } from 'vitest';

import { normalizeGameCode } from '@/api/games';
import { messages } from '@/i18n/messages';
import { randomUuid } from '@/session/sessionStore';

describe('normalizeGameCode', () => {
  it('keeps 4 uppercase letters', () => {
    expect(normalizeGameCode(' kx-wb9z ')).toBe('KXWB');
  });
});

describe('randomUuid', () => {
  it('builds a v4 UUID without crypto.randomUUID (plain http on the local network)', () => {
    const original = crypto.randomUUID;
    Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true });
    try {
      expect(randomUuid()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    } finally {
      Object.defineProperty(crypto, 'randomUUID', { value: original, configurable: true });
    }
  });
});

describe('messages', () => {
  it('has the same rules sections in every language', () => {
    expect(messages.en.rules.sections).toHaveLength(messages.fr.rules.sections.length);
  });
});
