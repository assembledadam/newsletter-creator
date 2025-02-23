import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Props {
  onAdd: (url: string) => Promise<void>;
  isLoading?: boolean;
}

export function AddContentUrl({ onAdd, isLoading = false }: Props) {
  const [url, setUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(url.trim());
      setUrl('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    // Prevent closing the dialog while submitting
    if (isSubmitting || isLoading) return;
    setIsOpen(open);
  };

  const showLoading = isLoading || isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={showLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Content by URL</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={showLoading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a URL from LinkedIn, news articles, or other content sources
            </p>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={showLoading || !url.trim()}>
              {showLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Content'
              )}
            </Button>
          </div>
        </form>
        {showLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
              <p className="mt-2 text-sm font-medium text-gray-900">Adding content...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}