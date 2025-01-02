import { useSettings } from '@/lib/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Settings as SettingsType } from '@/lib/types';

export default function Settings() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<SettingsType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!localSettings) return;
    
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
    } finally {
      setIsSaving(false);
    }
  };

  const SaveButton = () => (
    <Button onClick={handleSave} disabled={isSaving}>
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </>
      )}
    </Button>
  );

  if (isLoading || !localSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Settings</h2>
        <SaveButton />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPT Prompt Template
          </label>
          <textarea
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={localSettings.newsletterTemplate}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, newsletterTemplate: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <SaveButton />
      </div>
    </div>
  );
}