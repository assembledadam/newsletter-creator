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
}