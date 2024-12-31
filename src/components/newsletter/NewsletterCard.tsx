import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import type { Newsletter } from '@/lib/types';

interface Props {
  newsletter: Newsletter;
}

export function NewsletterCard({ newsletter }: Props) {
  const formattedDate = newsletter.created_at 
    ? format(parseISO(newsletter.created_at), 'PPP')
    : 'Date not available';

  return (
    <Link
      to={`/edit/${newsletter.id}`}
      className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {newsletter.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Created {formattedDate}
          </p>
        </div>
      </div>
    </Link>
  );
}