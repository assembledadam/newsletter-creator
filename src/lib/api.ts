import { supabase } from './supabase';
import type { Newsletter, NewsItem, Settings } from './types';

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

export async function deleteNewsletter(id: string): Promise<void> {
  const { error } = await supabase
    .from('newsletters')
    .delete()
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
