import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { NewsItem } from '@/lib/types';
import { FileText } from 'lucide-react';
import { formatSourceType } from '@/lib/utils/formatters';

interface Props {
  items: NewsItem[];
  onGenerate: (selectedItems: NewsItem[]) => void;
}

export function NewsItemList({ items, onGenerate }: Props) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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
        {items.map((item) => (
          <div
            key={item.title}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
            onClick={() => toggleItem(item.title)}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedItems.has(item.title)}
                onCheckedChange={() => toggleItem(item.title)}
                id={`item-${item.title}`}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="font-medium">
                      <span className="text-gray-600">{formatSourceType(item.source)}: </span>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.title}
                        </a>
                      ) : (
                        <span className="text-gray-900">{item.title}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleGenerate}
          disabled={selectedItems.size === 0}
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Newsletter
        </Button>
      </div>
    </div>
  );
}