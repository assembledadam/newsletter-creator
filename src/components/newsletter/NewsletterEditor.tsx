import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Save, Copy } from 'lucide-react';
import { marked } from 'marked';

interface Props {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
}

export function NewsletterEditor({ content, onChange, onSave }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Newsletter</h2>
        <div className="space-x-4">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Text
          </Button>
          <Button onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Newsletter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 h-full">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={content}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
          }}
        />
        <div 
          className="prose max-w-none overflow-auto p-6 bg-white rounded-lg shadow-sm"
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        />
      </div>
    </div>
  );
}