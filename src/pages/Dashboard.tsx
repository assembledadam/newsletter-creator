import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNewsletters } from '@/lib/hooks/useNewsletters';
import { format } from 'date-fns';
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

      <div className="grid gap-4">
        {newsletters.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No newsletters yet
            </h3>
            <p className="text-gray-500">
              Create your first newsletter by clicking the button above.
            </p>
          </div>
        ) : (
          newsletters.map((newsletter) => (
            <Link
              key={newsletter.id}
              to={`/edit/${newsletter.id}`}
              className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {newsletter.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created {format(new Date(newsletter.createdAt), 'PPP')}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}