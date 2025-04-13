import { NewsletterCard } from './NewsletterCard';
import { useNewsletters } from '@/lib/hooks/useNewsletters';
import type { Newsletter } from '@/lib/types';

interface Props {
  newsletters: Newsletter[];
}

export function NewsletterList({ newsletters }: Props) {
  const { deleteNewsletter, updateNewsletter } = useNewsletters();

  if (newsletters.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No newsletters yet
        </h3>
        <p className="text-gray-500">
          Newsletters will appear here once they are generated.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {newsletters.map((newsletter) => (
        <NewsletterCard 
          key={newsletter.id} 
          newsletter={newsletter} 
          onDelete={deleteNewsletter}
          onUpdate={(id, updates) => updateNewsletter({ id, newsletter: { ...newsletter, ...updates } })}
        />
      ))}
    </div>
  );
}