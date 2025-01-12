import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Filter, Loader2 } from 'lucide-react';
import { formatSourceType } from '@/lib/utils/formatters';
import { formatRelativeTime } from '@/lib/utils/date';
import { marked } from 'marked';
import type { ContentSource } from '@/lib/types';

interface Props {
  items: ContentSource[];
  sourceFilter: string;
  availableSources: string[];
  onSourceFilterChange: (source: string) => void;
  onToggleSelect: (id: string, selected: boolean) => void;
  onDelete: (ids: string[]) => void;
  isDeleting?: boolean;
  isGenerating?: boolean;
}

export function ContentCurationList({ 
  items, 
  sourceFilter,
  availableSources,
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
      setSelectedIds(new Set()); // Clear selection after delete
    }
  };

  const handleDeleteSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete([id]);
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

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
            {availableSources.map(source => (
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
              checked={items.length > 0 && selectedIds.size === items.length}
              onCheckedChange={toggleSelectAll}
              className="mr-3"
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
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
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
                            {item.source === 'google' && item.metadata?.domain && (
                              <span className="ml-2 text-sm text-gray-500">
                                ({item.metadata.domain})
                              </span>
                            )}
                          </a>
                        ) : (
                          <span>
                            {item.title}
                            {item.source === 'google' && item.metadata?.domain && (
                              <span className="ml-2 text-sm text-gray-500">
                                ({item.metadata.domain})
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <div 
                        className="text-sm text-gray-500 mt-1 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: marked(item.description || '') }}
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSelect(item.id, !item.selected);
                        }}
                        className={item.selected ? 'text-green-600' : 'text-gray-400'}
                        disabled={isGenerating}
                      >
                        {item.selected ? 'Selected' : 'Select'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteSingle(item.id, e)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={isGenerating}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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