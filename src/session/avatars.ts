/**
 * Avatars a player can pick: images in `public/images/avatars`, with the same ids as in the TV app. The server only
 * checks that two players of a game do not share one.
 */
export const AVATAR_COUNT = 81;

export const avatars: readonly string[] = Array.from(
  { length: AVATAR_COUNT },
  (_, i) => `a${String(i + 1).padStart(2, '0')}`,
);

export function avatarUrl(avatar: string): string {
  return `/images/avatars/${avatar}.webp`;
}

export function randomAvatar(excluded: readonly string[] = []): string {
  const free = avatars.filter((avatar) => !excluded.includes(avatar));
  const pool = free.length > 0 ? free : avatars;
  return pool[Math.floor(Math.random() * pool.length)];
}
