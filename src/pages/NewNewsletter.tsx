import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewsletters } from '@/lib/hooks/useNewsletters';
import { fetchNewsItems, generateNewsletterContent } from '@/lib/api';
import { NewsItemList } from '@/components/newsletter/NewsItemList';
import { NewsletterEditor } from '@/components/newsletter/NewsletterEditor';
import { SheetUrlInput } from '@/components/newsletter/SheetUrlInput';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { NewsItem } from '@/lib/types';

export default function NewNewsletter() {
  const navigate = useNavigate();
  const { createNewsletter } = useNewsletters();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [content, setContent] = useState('');
  const [step, setStep] = useState<'url' | 'select' | 'edit'>('url');

  const handleFetchItems = async (url: string) => {
    setLoading(true);
    try {
      const newsItems = await fetchNewsItems(url);
      setItems(newsItems);
      setStep('select');
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (selectedItems: NewsItem[]) => {
    setLoading(true);
    try {
      const { content } = await generateNewsletterContent(
        selectedItems,
        settings.promptTemplate,
        settings.newsletterTemplate
      );
      setContent(content);
      setStep('edit');
    } catch (error) {
      console.error('Failed to generate newsletter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const newsletter = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: `Newsletter ${new Date().toLocaleDateString()}`,
      content,
      sourceUrl: '',
      items,
    };
    createNewsletter(newsletter);
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
      {step === 'url' && <SheetUrlInput onSubmit={handleFetchItems} />}
      {step === 'select' && <NewsItemList items={items} onGenerate={handleGenerate} />}
      {step === 'edit' && (
        <NewsletterEditor content={content} onChange={setContent} onSave={handleSave} />
      )}
    </div>
  );
}