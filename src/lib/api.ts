import { supabase } from './supabase';
import type { Newsletter, NewsItem } from './types';

export async function fetchNewsletters(): Promise<Newsletter[]> {
  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchNewsletter(id: string): Promise<Newsletter> {
  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createNewsletter(newsletter: Omit<Newsletter, 'id' | 'created_at'>): Promise<Newsletter> {
  const { data, error } = await supabase
    .from('newsletters')
    .insert([newsletter])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNewsletter(id: string, newsletter: Partial<Newsletter>): Promise<void> {
  const { error } = await supabase
    .from('newsletters')
    .update(newsletter)
    .eq('id', id);

  if (error) throw error;
}

export async function fetchNewsItems(sheetUrl: string): Promise<NewsItem[]> {
  const { data, error } = await supabase.functions.invoke('parse-sheet', {
    body: { url: sheetUrl }
  });

  if (error) throw error;
  return data;
}

export async function generateNewsletterContent(
  items: NewsItem[], 
  prompt: string, 
  template: string
): Promise<{ content: string }> {
  const { data, error } = await supabase.functions.invoke('generate-newsletter', {
    body: { items, prompt, template }
  });

  if (error) throw error;
  return data;
}