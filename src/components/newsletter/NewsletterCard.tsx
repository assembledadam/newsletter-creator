import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NewsletterTimestamp } from './NewsletterTimestamp';
import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import type { Newsletter } from '@/lib/types';

interface Props {
  newsletter: Newsletter;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Newsletter>) => void;
}

export function NewsletterCard({ newsletter, onDelete, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(newsletter.title);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this newsletter?')) {
      onDelete(newsletter.id);
    }
  };

  const handleSave = () => {
    if (editTitle.trim() !== newsletter.title) {
      onUpdate(newsletter.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(newsletter.title);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 group">
            {isEditing ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 text-lg font-medium text-gray-900 bg-white border-b border-blue-500 focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-500 hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link to={`/edit/${newsletter.id}`} className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                    {newsletter.title}
                  </h3>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          <NewsletterTimestamp 
            createdAt={newsletter.created_at}
            updatedAt={newsletter.updated_at}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}