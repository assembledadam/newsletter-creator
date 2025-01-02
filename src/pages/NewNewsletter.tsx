import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewsletters } from '@/lib/hooks/useNewsletters';
import { fetchNewsItems, generateNewsletterContent } from '@/lib/api';
import { NewsItemList } from '@/components/newsletter/NewsItemList';
import { NewsletterEditor } from '@/components/newsletter/NewsletterEditor';
import { SheetUrlInput } from '@/components/newsletter/SheetUrlInput';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import type { NewsItem } from '@/lib/types';

export default function NewNewsletter() {
  const navigate = useNavigate();
  const { createNewsletter } = useNewsletters();
  const { settings } = useStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [content, setContent] = useState('');
  const [step, setStep] = useState<'url' | 'select' | 'edit'>('url');
  const [error, setError] = useState<string | null>(null);

  const handleFetchItems = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const newsItems = await fetchNewsItems(url);
      setItems(newsItems.map(item => ({ ...item, selected: false })));
      setStep('select');
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setError('Failed to fetch items from the Google Sheet. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (selectedItems: NewsItem[]) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const { content } = await generateNewsletterContent(
        selectedItems.filter(item => item.selected),
        settings.promptTemplate,
        settings.newsletterTemplate
      );
      setContent(content);
      
      // Automatically save the newsletter when content is generated
      const newsletter = {
        title: `Newsletter ${new Date().toLocaleDateString()}`,
        content,
        source_url: '',
        items: selectedItems,
        user_id: user.id
      };
      
      await createNewsletter(newsletter);
      setStep('edit');
    } catch (error) {
      console.error('Failed to generate newsletter:', error);
      setError('Failed to generate newsletter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
      {step === 'url' && <SheetUrlInput onSubmit={handleFetchItems} />}
      {step === 'select' && <NewsItemList items={items} onGenerate={handleGenerate} />}
      {step === 'edit' && (
        <NewsletterEditor content={content} onChange={setContent} onSave={handleSave} />
      )}
    </div>
  );
}