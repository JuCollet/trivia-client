import { Link } from 'react-router';

import { Logo } from '@/components/ui';
import { useMessages } from '@/i18n/language';

export function NotFoundPage() {
  const t = useMessages();
  return (
    <main className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo className="max-w-56" />
      <p className="text-5xl font-bold">404</p>
      <Link to="/" className="font-semibold text-accent underline underline-offset-4">
        {t.common.back}
      </Link>
    </main>
  );
}
