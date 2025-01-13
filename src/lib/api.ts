import { supabase } from './supabase';
import type { Newsletter, NewsItem, Settings, ContentSource } from './types';
import { getWeekDateRange } from './utils/date';

const DEFAULT_SETTINGS: Settings = {
  promptTemplate: `You are an expert in R&D tax relief. Create a professional newsletter summarizing the following R&D tax news items. Use a conversational yet professional tone. Focus on the implications for tax advisors and accountants. Include a brief introduction paragraph before the main content. Format the content using markdown.`,
  newsletterTemplate: `# R&D Tax Weekly Update

[Introduction paragraph will go here]

## Latest Updates

[Main content will go here organized by topic]

## Key Takeaways

- [Bullet points summarizing main points]

---
*Want to discuss how these changes might affect your R&D tax claims? Let's connect.*`,
  defaultNewsletterTitle: 'The Week In R&D Tax'
};

export async function fetchSettings(): Promise<Settings> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.user.id)
    .maybeSingle();

  if (error) throw error;

  // Return default settings if none exist
  if (!data) {
    return DEFAULT_SETTINGS;
  }

  // Map database fields to application fields
  return {
    promptTemplate: data.prompt_template || DEFAULT_SETTINGS.promptTemplate,
    newsletterTemplate: data.newsletter_template || DEFAULT_SETTINGS.newsletterTemplate,
    defaultNewsletterTitle: data.default_newsletter_title || DEFAULT_SETTINGS.defaultNewsletterTitle
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const { error: upsertError } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.user.id,
      prompt_template: settings.promptTemplate,
      newsletter_template: settings.newsletterTemplate,
      default_newsletter_title: settings.defaultNewsletterTitle
    });

  if (upsertError) throw upsertError;
}

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

export async function createNewsletter(newsletter: Omit<Newsletter, 'id' | 'created_at' | 'updated_at'>): Promise<Newsletter> {
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

export async function deleteNewsletter(id: string): Promise<void> {
  const { error } = await supabase
    .from('newsletters')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function fetchContentSources(source?: string): Promise<ContentSource[]> {
  let query = supabase
    .from('content_sources')
    .select('*')
    .order('content_date', { ascending: true }); // Changed to ascending order

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

export async function generateNewsletterFromSources(): Promise<Newsletter> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  // Get selected items
  const { data: selectedItems, error: fetchError } = await supabase
    .from('content_sources')
    .select('*')
    .eq('selected', true)
    .order('content_date', { ascending: true }); // Ensure selected items are also ordered

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
  const settings = await fetchSettings();

  // Generate newsletter content
  const { data, error } = await supabase.functions.invoke('generate-newsletter', {
    body: { 
      items,
      prompt: settings.promptTemplate,
      template: settings.newsletterTemplate
    }
  });

  if (error) throw error;

  // Generate title with date range
  const dateRange = getWeekDateRange();
  const title = `${settings.defaultNewsletterTitle} (${dateRange})`;

  // Create the newsletter
  const newsletter = await createNewsletter({
    title,
    content: data.content,
    items,
    source_url: null,
    user_id: user.user.id
  });

  // Reset selected status
  const { error: resetError } = await supabase
    .from('content_sources')
    .update({ selected: false })
    .eq('selected', true);

  if (resetError) throw resetError;

  return newsletter;
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