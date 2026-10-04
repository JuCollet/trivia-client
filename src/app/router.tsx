import { createBrowserRouter } from 'react-router';

import { GamePage } from '@/pages/GamePage';
import { JoinPage } from '@/pages/JoinPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RulesPage, RulesSheet } from '@/pages/RulesPage';

/**
 * - `/` : join a game by typing its code
 * - `/join/:code` : target of the TV's QR code, code already filled in
 * - `/game/:code` : the game, whatever its phase; `/game/:code/rules` opens the rules on top of it
 * - `/rules` : the rules, from the home page
 */
export const router = createBrowserRouter([
  { path: '/', element: <JoinPage /> },
  { path: '/join/:code', element: <JoinPage /> },
  {
    path: '/game/:code',
    element: <GamePage />,
    children: [{ path: 'rules', element: <RulesSheet /> }],
  },
  { path: '/rules', element: <RulesPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
