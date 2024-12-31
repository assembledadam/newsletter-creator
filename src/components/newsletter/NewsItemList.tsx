import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { NewsItem } from '@/lib/types';
import { FileText } from 'lucide-react';

interface Props {
  items: NewsItem[];
  onGenerate: (selectedItems: NewsItem[]) => void;
}

export function NewsItemList({ items, onGenerate }: Props) {
  const [selectedItems, setSelectedItems] = useState<NewsItem[]>(items);

  const toggleItem = (item: NewsItem) => {
    setSelectedItems(prev => 
      prev.map(i => i === item ? { ...i, selected: !i.selected } : i)
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Select News Items</h2>
        <Button
          onClick={() => onGenerate(selectedItems.filter(item => item.selected))}
          disabled={!selectedItems.some(item => item.selected)}
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Newsletter
        </Button>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={item.selected}
                onCheckedChange={() => toggleItem(item)}
              />
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-500 mt-2">Source: {item.source}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}