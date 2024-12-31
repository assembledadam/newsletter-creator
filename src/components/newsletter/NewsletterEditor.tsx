import { CodeEditor } from './CodeEditor';
import { MarkdownPreview } from './MarkdownPreview';
import { EditorToolbar } from './EditorToolbar';

interface Props {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
}

export function NewsletterEditor({ content, onChange, onSave }: Props) {
  return (
    <div className="h-[calc(100vh-12rem)]">
      <EditorToolbar onSave={onSave} content={content} />
      <div className="grid grid-cols-2 gap-8 h-full">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <CodeEditor content={content} onChange={onChange} />
        </div>
        <MarkdownPreview content={content} />
      </div>
    </div>
  );
}