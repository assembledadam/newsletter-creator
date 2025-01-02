import { useState, useRef, useEffect, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  onEdit?: () => void;
  className?: string;
}

export const InlineEdit = forwardRef<HTMLDivElement, InlineEditProps>(
  ({ value, onSave, onEdit, className }, ref) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        setEditValue(value);
        setIsEditing(false);
      }
    };

    const handleSave = () => {
      if (editValue.trim() !== value) {
        onSave(editValue.trim());
      }
      setIsEditing(false);
    };

    const handleBlur = () => {
      handleSave();
    };

    const startEditing = () => {
      setIsEditing(true);
      onEdit?.();
    };

    if (isEditing) {
      return (
        <div ref={ref}>
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={cn(
              "bg-transparent w-full px-0 text-lg font-medium text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:ring-0",
              className
            )}
          />
        </div>
      );
    }

    return (
      <div ref={ref}>
        <h3
          onClick={startEditing}
          className={cn(
            "inline-edit-trigger text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600",
            className
          )}
        >
          {value}
        </h3>
      </div>
    );
  }
);