import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSettings, saveSettings } from '@/lib/api';
import type { Settings } from '@/lib/types';

export function useSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const updateSettings = useMutation({
    mutationFn: (newSettings: Settings) => saveSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate
  };
}