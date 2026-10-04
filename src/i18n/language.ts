import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type Language, type Messages, messages } from './messages';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export function detectLanguage(): Language {
  return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function toLanguage(value: string | null | undefined): Language | null {
  return value === 'fr' || value === 'en' ? value : null;
}

/**
 * Language of the interface. Before joining, the phone's language or the player's choice; once in a game, the
 * language of the game, so that the phone speaks like the questions on the TV.
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: detectLanguage(),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'trivia-language' },
  ),
);

export function useMessages(): Messages {
  return messages[useLanguageStore((state) => state.language)];
}
