import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNewsletters, createNewsletter, updateNewsletter } from '@/lib/api';
import type { Newsletter } from '@/lib/types';

export function useNewsletters() {
  const queryClient = useQueryClient();

  const { data: newsletters = [], isLoading } = useQuery({
    queryKey: ['newsletters'],
    queryFn: fetchNewsletters
  });

  const createMutation = useMutation({
    mutationFn: createNewsletter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletters'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, newsletter }: { id: string; newsletter: Newsletter }) =>
      updateNewsletter(id, newsletter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletters'] });
    }
  });

  return {
    newsletters,
    isLoading,
    createNewsletter: createMutation.mutate,
    updateNewsletter: updateMutation.mutate
  };
}