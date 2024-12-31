import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Link2,
  Image,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

interface Props {
  onAction: (action: string, selection?: string) => void;
}

export function MarkdownToolbar({ onAction }: Props) {
  return (
    <div className="flex items-center gap-1 p-1 bg-white border-b border-gray-200">
      <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('heading1')}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('heading2')}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('heading3')}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-1 px-2 border-r border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('numberList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('quote')}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('code')}
          title="Code"
        >
          <Code2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('divider')}
          title="Divider"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('link')}
          title="Link"
        >
          <Link2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('image')}
          title="Image"
        >
          <Image className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}