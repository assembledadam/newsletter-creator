import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewsletters } from '@/lib/hooks/useNewsletters';
import { useSettings } from '@/lib/hooks/useSettings';
import { generateNewsletterContent } from '@/lib/api';
import { NewsItemList } from '@/components/newsletter/NewsItemList';
import { NewsletterEditor } from '@/components/newsletter/NewsletterEditor';
import { DatePickerModal } from '@/components/newsletter/DatePickerModal';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getPreviousWeekDateRange } from '@/lib/utils/date';
import type { NewsItem } from '@/lib/types';

export default function NewNewsletter() {
  const navigate = useNavigate();
  const { createNewsletter } = useNewsletters();
  const { settings } = useSettings();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [content, setContent] = useState('');
  const [step, setStep] = useState<'select' | 'edit'>('select');
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedItems, setSelectedItems] = useState<NewsItem[]>([]);

  const handleGenerate = async (items: NewsItem[]) => {
    setSelectedItems(items);
    setShowDatePicker(true);
  };

  const handleDateSelected = async (date: Date) => {
    if (!user || !settings) return;
    
    setLoading(true);
    setError(null);
    try {
      const { content } = await generateNewsletterContent(
        selectedItems.filter(item => item.selected),
        settings.promptTemplate,
        settings.newsletterTemplate,
        date
      );
      setContent(content);
      
      // Generate title with date range
      const dateRange = getPreviousWeekDateRange();
      const title = `${settings.defaultNewsletterTitle} (${dateRange})`;
      
      // Automatically save the newsletter when content is generated
      const newsletter = {
        title,
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
      setShowDatePicker(false);
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
      {step === 'select' && <NewsItemList items={items} onGenerate={handleGenerate} />}
      {step === 'edit' && (
        <NewsletterEditor 
          title={`${settings?.defaultNewsletterTitle} (${getPreviousWeekDateRange()})`}
          content={content} 
          onChange={setContent} 
          onSave={handleSave} 
        />
      )}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelected={handleDateSelected}
      />
    </div>
  );
}