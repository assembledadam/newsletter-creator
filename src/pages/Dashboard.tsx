import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNewsletters } from '@/lib/hooks/useNewsletters';
import { NewsletterList } from '@/components/newsletter/NewsletterList';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { newsletters, isLoading } = useNewsletters();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Sort newsletters by updated_at (or created_at if updated_at doesn't exist)
  const sortedNewsletters = [...newsletters].sort((a, b) => {
    const dateA = a.updated_at || a.created_at;
    const dateB = b.updated_at || b.created_at;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Your Newsletters</h2>
        <Link to="/new">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Newsletter
          </Button>
        </Link>
      </div>

      <NewsletterList newsletters={sortedNewsletters} />
    </div>
  );
}