import { useParams, useNavigate } from 'react-router-dom';
import { useNewsletters } from '@/lib/hooks/useNewsletters';
import { NewsletterEditor } from '@/components/newsletter/NewsletterEditor';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditNewsletter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { newsletters, updateNewsletter, isLoading } = useNewsletters();
  
  const newsletter = newsletters.find(n => n.id === id);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Newsletter not found</h2>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    updateNewsletter({ id: newsletter.id, newsletter });
    navigate('/');
  };

  const handleContentChange = (content: string) => {
    updateNewsletter({
      id: newsletter.id,
      newsletter: { ...newsletter, content }
    });
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      <NewsletterEditor
        content={newsletter.content}
        onChange={handleContentChange}
        onSave={handleSave}
      />
    </div>
  );
}