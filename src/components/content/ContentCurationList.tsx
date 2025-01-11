import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Filter, Loader2 } from 'lucide-react';
import { formatSourceType } from '@/lib/utils/formatters';
import { formatRelativeTime } from '@/lib/utils/date';
import type { ContentSource } from '@/lib/types';

interface Props {
  items: ContentSource[];
  sourceFilter: string;
  onSourceFilterChange: (source: string) => void;
  onToggleSelect: (id: string, selected: boolean) => void;
  onDelete: (ids: string[]) => void;
  isDeleting?: boolean;
  isGenerating?: boolean;
}

export function ContentCurationList({ 
  items, 
  sourceFilter, 
  onSourceFilterChange, 
  onToggleSelect, 
  onDelete,
  isDeleting = false,
  isGenerating = false
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(items.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDelete = () => {
    if (selectedIds.size > 0) {
      onDelete(Array.from(selectedIds));
    }
  };

  const handleDeleteSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete([id]);
    }
  };

  // Get unique sources for filter dropdown
  const sources = Array.from(new Set(items.map(item => item.source))).sort();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <select
            value={sourceFilter}
            onChange={(e) => onSourceFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isGenerating}
          >
            <option value="">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>
                {formatSourceType(source)}
              </option>
            ))}
          </select>
          <Filter className="w-4 h-4 text-gray-500" />
        </div>
        
        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || isGenerating}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedIds.size})
              </>
            )}
          </Button>
        )}
      </div>

      <div className={`bg-white rounded-lg shadow transition-opacity ${isGenerating ? 'opacity-50' : ''}`}>
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <Checkbox
              checked={selectedIds.size === items.length}
              onCheckedChange={toggleSelectAll}
              className="mr-3"
              disabled={isGenerating}
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedIds.size} selected
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 transition-colors ${
                item.selected ? 'bg-green-50' : 'hover:bg-gray-50'
              } ${isGenerating ? 'pointer-events-none' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={() => toggleItem(item.id)}
                    disabled={isGenerating}
                  />
                </div>
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => !isGenerating && onToggleSelect(item.id, !item.selected)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
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
                          item.title
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect(item.id, !item.selected);
                      }}
                      disabled={isGenerating}
                      className={item.selected ? 'text-green-600' : 'text-gray-400'}
                    >
                      {item.selected ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="font-medium">{formatSourceType(item.source)}</span>
                    {item.author && (
                      <>
                        <span>•</span>
                        <span>{item.author}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{formatRelativeTime(item.content_date)}</span>
                    <button
                      onClick={(e) => handleDeleteSingle(item.id, e)}
                      disabled={isGenerating || isDeleting}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 -my-1 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}