import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { settings, updateSettings } = useStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPT Prompt Template
          </label>
          <textarea
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={localSettings.promptTemplate}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, promptTemplate: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Newsletter Template
          </label>
          <textarea
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={localSettings.newsletterTemplate}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, newsletterTemplate: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}