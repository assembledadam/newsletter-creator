import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { NewsItem } from '@/lib/types';
import { FileText, ExternalLink } from 'lucide-react';

interface Props {
  items: NewsItem[];
  onGenerate: (selectedItems: NewsItem[]) => void;
}

export function NewsItemList({ items, onGenerate }: Props) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Debug log to check incoming items
  console.log('NewsItemList items:', items);

  const toggleItem = (title: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const handleGenerate = () => {
    const selectedNewsItems = items.map(item => ({
      ...item,
      selected: selectedItems.has(item.title)
    }));
    onGenerate(selectedNewsItems);
  };

  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      // Debug log for URL validation
      console.log('Validating URL:', url);
      new URL(url);
      return true;
    } catch (error) {
      console.log('Invalid URL:', url, error);
      return false;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Select News Items</h2>
        <Button
          onClick={handleGenerate}
          disabled={selectedItems.size === 0}
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Newsletter
        </Button>
      </div>
      
      <div className="space-y-4">
        {items.map((item) => {
          // Debug log for each item's URL
          console.log('Item URL:', item.title, item.url);
          
          return (
            <div
              key={item.title}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedItems.has(item.title)}
                  onCheckedChange={() => toggleItem(item.title)}
                  id={`item-${item.title}`}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-medium">{item.title}</h3>
                    {isValidUrl(item.url) && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm whitespace-nowrap"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Source
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Source: {item.source}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}