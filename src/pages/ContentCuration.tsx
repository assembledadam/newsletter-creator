import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ContentCurationList } from '@/components/content/ContentCurationList';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { fetchContentSources, updateContentSourceSelection, deleteContentSources, generateNewsletterFromSources } from '@/lib/api';
import { FileText, Loader2 } from 'lucide-react';
import { Toast } from '@/components/ui/toast';
import type { ContentSource } from '@/lib/types';

export default function ContentCuration() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sourceFilter, setSourceFilter] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch all items in a single query
  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ['content-sources'],
    queryFn: () => fetchContentSources()
  });

  // Filter items in memory
  const items = sourceFilter 
    ? allItems.filter(item => item.source === sourceFilter)
    : allItems;

  // Get unique sources from all items
  const availableSources = Array.from(new Set(allItems.map(item => item.source))).sort();

  // Reset source filter if there are no items for the current filter
  useEffect(() => {
    if (sourceFilter && items.length === 0) {
      setSourceFilter('');
    }
  }, [items.length, sourceFilter]);

  const toggleSelection = useMutation({
    mutationFn: ({ id, selected }: { id: string; selected: boolean }) =>
      updateContentSourceSelection(id, selected),
    onMutate: async ({ id, selected }) => {
      await queryClient.cancelQueries({ queryKey: ['content-sources'] });
      const previousItems = queryClient.getQueryData<ContentSource[]>(['content-sources']);
      queryClient.setQueryData<ContentSource[]>(['content-sources'], old => {
        return old?.map(item =>
          item.id === id ? { ...item, selected } : item
        ) ?? [];
      });
      return { previousItems };
    },
    onError: (err, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['content-sources'], context.previousItems);
      }
      showToastMessage('Failed to update selection', 'error');
    },
    onSuccess: () => {
      showToastMessage('Selection updated', 'success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['content-sources'] });
    }
  });

  const deleteItems = useMutation({
    mutationFn: deleteContentSources,
    onMutate: async (itemIds) => {
      await queryClient.cancelQueries({ queryKey: ['content-sources'] });
      const previousItems = queryClient.getQueryData<ContentSource[]>(['content-sources']);
      queryClient.setQueryData<ContentSource[]>(['content-sources'], old => {
        return old?.filter(item => !itemIds.includes(item.id)) ?? [];
      });
      return { previousItems };
    },
    onError: (error, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['content-sources'], context.previousItems);
      }
      console.error('Failed to delete items:', error);
      showToastMessage('Failed to delete items', 'error');
    },
    onSuccess: () => {
      showToastMessage('Items deleted successfully', 'success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['content-sources'] });
    }
  });

  const generateNewsletter = useMutation({
    mutationFn: generateNewsletterFromSources,
    onMutate: () => {
      setIsGenerating(true);
    },
    onSuccess: (newsletter) => {
      queryClient.invalidateQueries({ queryKey: ['newsletters'] });
      queryClient.invalidateQueries({ queryKey: ['content-sources'] });
      showToastMessage('Newsletter generated successfully', 'success');
      navigate(`/edit/${newsletter.id}`);
    },
    onError: (error) => {
      console.error('Failed to generate newsletter:', error);
      showToastMessage('Failed to generate newsletter. Please try again.', 'error');
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleGenerateNewsletter = () => {
    const selectedCount = items.filter(item => item.selected).length;
    if (selectedCount === 0) {
      showToastMessage('Please select at least one item', 'error');
      return;
    }
    generateNewsletter.mutate();
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
    <div className="relative min-h-[calc(100vh-12rem)]">
      {(isGenerating || generateNewsletter.isLoading) && (
        <LoadingOverlay message="Generating your newsletter... This may take a few moments." />
      )}
      
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Content Curation</h2>
          {selectedCount > 0 && (
            <Button
              onClick={handleGenerateNewsletter}
              disabled={isGenerating || generateNewsletter.isLoading}
              className="min-w-[200px]"
            >
              {(isGenerating || generateNewsletter.isLoading) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Newsletter ({selectedCount})
                </>
              )}
            </Button>
          )}
        </div>

        <ContentCurationList
          items={items}
          sourceFilter={sourceFilter}
          availableSources={availableSources}
          onSourceFilterChange={setSourceFilter}
          onToggleSelect={(id, selected) => {
            toggleSelection.mutate({ id, selected });
          }}
          onDelete={(ids) => {
            if (ids.length > 0) {
              deleteItems.mutate(ids);
            }
          }}
          isDeleting={deleteItems.isLoading}
          isGenerating={isGenerating || generateNewsletter.isLoading}
        />

        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}