export interface NewsItem {
  title: string;
  description: string;
  source: string;
  url: string;
  selected?: boolean;
}

export interface Newsletter {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  source_url: string | null;
  items: NewsItem[];
  user_id: string;
}

export interface Settings {
  promptTemplate: string;
  newsletterTemplate: string;
  defaultNewsletterTitle: string;
}

export interface ContentSource {
  id: string;
  content_date: string;
  source: string;
  title: string;
  description: string | null;
  author: string | null;
  url: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  selected: boolean;
}