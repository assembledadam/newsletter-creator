import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNewsletters } from '@/lib/hooks/useNewsletters';
import { NewsletterList } from '@/components/newsletter/NewsletterList';
import { PlusCircle, Settings, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { newsletters, isLoading } = useNewsletters();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Your Newsletters</h2>
        <div className="space-x-4">
          <Link to="/settings">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Link to="/new">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              New Newsletter
            </Button>
          </Link>
        </div>
      </div>

      <NewsletterList newsletters={newsletters} />
    </div>
  );
}