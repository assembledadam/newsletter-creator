import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatRelativeTime, formatDateTime } from '@/lib/utils/date';
import type { Newsletter } from '@/lib/types';

interface Props {
  newsletter: Newsletter;
  onDelete: (id: string) => void;
}

export function NewsletterCard({ newsletter, onDelete }: Props) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this newsletter?')) {
      onDelete(newsletter.id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <Link to={`/edit/${newsletter.id}`} className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {newsletter.title}
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            {newsletter.updated_at && newsletter.updated_at !== newsletter.created_at ? (
              <>
                Updated <span title={formatDateTime(newsletter.updated_at)}>
                  {formatRelativeTime(newsletter.updated_at)}
                </span>
                {' · '}
              </>
            ) : null}
            Created <span title={formatDateTime(newsletter.created_at)}>
              {formatRelativeTime(newsletter.created_at)}
            </span>
          </p>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}