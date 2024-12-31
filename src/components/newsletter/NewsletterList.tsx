import { NewsletterCard } from './NewsletterCard';
import type { Newsletter } from '@/lib/types';

interface Props {
  newsletters: Newsletter[];
}

export function NewsletterList({ newsletters }: Props) {
  if (newsletters.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No newsletters yet
        </h3>
        <p className="text-gray-500">
          Create your first newsletter by clicking the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {newsletters.map((newsletter) => (
        <NewsletterCard key={newsletter.id} newsletter={newsletter} />
      ))}
    </div>
  );
}