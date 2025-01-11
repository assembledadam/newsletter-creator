import { supabase } from './supabase';
import type { Newsletter, NewsItem, Settings, ContentSource } from './types';

// ... (keep existing code) ...

export async function fetchContentSources(source?: string): Promise<ContentSource[]> {
  let query = supabase
    .from('content_sources')
    .select('*')
    .order('content_date', { ascending: false });

  if (source) {
    query = query.eq('source', source);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function updateContentSourceSelection(
  id: string,
  selected: boolean
): Promise<void> {
  const { error } = await supabase
    .from('content_sources')
    .update({ selected })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteContentSources(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('content_sources')
    .delete()
    .in('id', ids);

  if (error) throw error;
}

export async function generateNewsletterFromSources(): Promise<{ content: string }> {
  const { data: selectedItems, error: fetchError } = await supabase
    .from('content_sources')
    .select('*')
    .eq('selected', true);

  if (fetchError) throw fetchError;

  // Transform content sources to news items format
  const items: NewsItem[] = selectedItems.map(item => ({
    title: item.title,
    description: item.description || '',
    source: item.source,
    url: item.url || '',
    selected: true
  }));

  // Get user settings
  const { data: settings, error: settingsError } = await supabase
    .from('user_settings')
    .select('*')
    .single();

  if (settingsError) throw settingsError;

  // Generate newsletter content
  const { data, error } = await supabase.functions.invoke('generate-newsletter', {
    body: { 
      items,
      prompt: settings.prompt_template,
      template: settings.newsletter_template
    }
  });

  if (error) throw error;
  return data;
}