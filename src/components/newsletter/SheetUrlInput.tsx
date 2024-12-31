import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';

interface Props {
  onSubmit: (url: string) => void;
}

export function SheetUrlInput({ onSubmit }: Props) {
  const [url, setUrl] = useState('');

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Newsletter</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Sheet URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="https://docs.google.com/spreadsheets/d/..."
          />
        </div>
        <Button 
          onClick={() => onSubmit(url)}
          disabled={!url}
          className="w-full"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Load Sheet
        </Button>
      </div>
    </div>
  );
}