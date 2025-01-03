import { useSettings } from '@/lib/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';
import { Save, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Settings as SettingsType } from '@/lib/types';

const DEFAULT_SETTINGS: SettingsType = {
  promptTemplate: '',
  newsletterTemplate: '',
  defaultNewsletterTitle: 'The Week In R&D Tax'
};

export default function Settings() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Newsletter Title
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors hover:border-gray-400"
            value={localSettings.defaultNewsletterTitle}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, defaultNewsletterTitle: e.target.value })
            }
            placeholder="The Week In R&D Tax"
          />
          <p className="mt-1 text-sm text-gray-500">
            The date range will be automatically appended to this title (e.g. "The Week In R&D Tax (1-7 Jan)")
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPT Prompt Template
          </label>
          <textarea
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors hover:border-gray-400"
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
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors hover:border-gray-400"
            value={localSettings.newsletterTemplate}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, newsletterTemplate: e.target.value })
            }
          />
        </div>
      </div>

      {showToast && (
        <Toast
          message="Settings saved successfully"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}