import { useSettings } from '@/lib/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Toast } from '@/components/ui/toast';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Settings as SettingsType } from '@/lib/types';

const DEFAULT_SETTINGS: SettingsType = {
  promptTemplate: '',
  newsletterTemplate: '',
  defaultNewsletterTitle: 'The Week In R&D Tax',
  newsletterExamples: [''], // Start with one empty example
};

export default function Settings() {
  const { settings, updateSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (settings) {
      // Ensure newsletterExamples exists and has at least one entry
      setLocalSettings({
        ...DEFAULT_SETTINGS, // Start with defaults to ensure all keys exist
        ...settings,
        newsletterExamples: settings.newsletterExamples && settings.newsletterExamples.length > 0 
          ? settings.newsletterExamples 
          : [''], // Default to one empty string if empty or null
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Filter out empty examples before saving
      const settingsToSave = {
        ...localSettings,
        newsletterExamples: localSettings.newsletterExamples.filter(ex => ex.trim() !== ''),
      };
      await updateSettings(settingsToSave);
      setShowToast(true);
      // Optionally, reset localSettings examples to saved state (including the empty one if all were removed)
      setLocalSettings(prev => ({
        ...prev,
        newsletterExamples: settingsToSave.newsletterExamples.length > 0 ? settingsToSave.newsletterExamples : [''],
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleExampleChange = (index: number, value: string) => {
    const updatedExamples = [...localSettings.newsletterExamples];
    updatedExamples[index] = value;
    setLocalSettings({ ...localSettings, newsletterExamples: updatedExamples });
  };

  const addExampleField = () => {
    setLocalSettings({
      ...localSettings,
      newsletterExamples: [...localSettings.newsletterExamples, ''],
    });
  };

  const removeExampleField = (index: number) => {
    if (localSettings.newsletterExamples.length <= 1) return; // Keep at least one field
    const updatedExamples = localSettings.newsletterExamples.filter((_, i) => i !== index);
    setLocalSettings({ ...localSettings, newsletterExamples: updatedExamples });
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
        
        {/* Newsletter Examples Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Newsletter Examples
          </label>
          <p className="mt-1 mb-3 text-sm text-gray-500">
            Provide examples of previous newsletters to guide the AI's style and format.
          </p>
          <div className="space-y-4">
            {localSettings.newsletterExamples.map((example, index) => (
              <div key={index} className="flex items-start space-x-2">
                <textarea
                  className="flex-grow h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors hover:border-gray-400"
                  value={example}
                  onChange={(e) => handleExampleChange(index, e.target.value)}
                  placeholder={`Example Newsletter ${index + 1}`}
                />
                {localSettings.newsletterExamples.length > 1 && (
                   <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => removeExampleField(index)}
                     className="text-red-500 hover:bg-red-100 hover:text-red-600 mt-1"
                     aria-label="Remove example"
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addExampleField} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Example
            </Button>
          </div>
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