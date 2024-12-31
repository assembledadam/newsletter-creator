export interface NewsItem {
  title: string;
  description: string;
  source: string;
  selected?: boolean;
}

export interface Newsletter {
  id: string;
  createdAt: string;
  title: string;
  content: string;
  sourceUrl: string;
  items: NewsItem[];
}

export interface Settings {
  promptTemplate: string;
  newsletterTemplate: string;
}