import { Button } from '@/components/ui/button';
import { Save, Copy } from 'lucide-react';
import { marked } from 'marked';

interface Props {
  onSave: () => void;
  content: string;
}

export function EditorToolbar({ onSave, content }: Props) {
  const handleCopy = async () => {
    try {
      const htmlContent = marked(content);
      
      // Create a Blob containing both HTML and plain text versions
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const data = new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([content], { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([data]);
    } catch (err) {
      console.error('Failed to copy formatted text:', err);
      // Fallback to plain text copy if HTML copy fails
      try {
        await navigator.clipboard.writeText(content);
      } catch (fallbackErr) {
        console.error('Failed to copy text:', fallbackErr);
      }
    }
  };

  return (
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
  );
}