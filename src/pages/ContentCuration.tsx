import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContentCurationList } from '@/components/content/ContentCurationList';
import { fetchContentSources, updateContentSourceSelection, deleteContentSources, generateNewsletterFromSources } from '@/lib/api';
import { FileText, Loader2 } from 'lucide-react';
import { Toast } from '@/components/ui/toast';

export default function ContentCuration() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sourceFilter, setSourceFilter] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['content-sources', sourceFilter],
    queryFn: () => fetchContentSources(sourceFilter || undefined)
  });

  const toggleSelection = useMutation({
    mutationFn: ({ id, selected }: { id: string; selected: boolean }) =>
      updateContentSourceSelection(id, selected),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-sources'] });
    }
  });

  const deleteItems = useMutation({
    mutationFn: deleteContentSources,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-sources'] });
      showToastMessage('Items deleted successfully', 'success');
    }
  });

  const generateNewsletter = useMutation({
    mutationFn: generateNewsletterFromSources,
    onSuccess: async (data) => {
      // Create a new newsletter with the generated content
      // ... (implement this based on your newsletter creation logic)
      showToastMessage('Newsletter generated successfully', 'success');
      navigate('/');
    },
    onError: (error) => {
      showToastMessage('Failed to generate newsletter', 'error');
    }
  });

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const selectedCount = items.filter(item => item.selected).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Curation</h2>
        {selectedCount > 0 && (
          <Button
            onClick={() => generateNewsletter.mutate()}
            disabled={generateNewsletter.isLoading}
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Newsletter ({selectedCount})
          </Button>
        )}
      </div>

      <ContentCurationList
        items={items}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
        onToggleSelect={(id, selected) => toggleSelection.mutate({ id, selected })}
        onDelete={(ids) => deleteItems.mutate(ids)}
      />

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}