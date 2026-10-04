import { Link, useNavigate } from 'react-router';

import { Button, Card } from '@/components/ui';
import { useMessages } from '@/i18n/language';

function RulesContent() {
  const t = useMessages();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{t.rules.title}</h1>
      <p className="leading-relaxed">{t.rules.intro}</p>
      {t.rules.sections.map((section) => (
        <Card key={section.title} className="p-4">
          <h2 className="mb-1 font-bold text-accent">{section.title}</h2>
          <p className="text-sm leading-relaxed text-white/90">{section.body}</p>
        </Card>
      ))}
    </div>
  );
}

/**
 * Rules as a page, from the home page.
 */
export function RulesPage() {
  const t = useMessages();
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Link to="/" className="self-start font-semibold text-muted">
        ← {t.common.back}
      </Link>
      <RulesContent />
    </main>
  );
}

/**
 * Rules on top of the game (`/game/ABCD/rules`): the game stays mounted, so the phone keeps its connection.
 */
export function RulesSheet() {
  const t = useMessages();
  const navigate = useNavigate();
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 overflow-y-auto bg-night/95 backdrop-blur">
      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Button variant="secondary" className="sticky top-2 z-10 self-end" onClick={() => navigate('..')}>
          ✕ {t.common.back}
        </Button>
        <RulesContent />
      </div>
    </div>
  );
}
