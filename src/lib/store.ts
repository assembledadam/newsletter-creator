import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Newsletter, Settings } from './types';

interface AppState {
  newsletters: Newsletter[];
  settings: Settings;
  addNewsletter: (newsletter: Newsletter) => void;
  updateNewsletter: (id: string, newsletter: Partial<Newsletter>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const DEFAULT_PROMPT = `You are an expert in R&D tax relief. Create a professional newsletter summarizing the following R&D tax news items. Use a conversational yet professional tone. Focus on the implications for tax advisors and accountants. Include a brief introduction paragraph before the main content. Format the content using markdown.`;

const DEFAULT_TEMPLATE = `# R&D Tax Weekly Update

[Introduction paragraph will go here]

## Latest Updates

[Main content will go here organized by topic]

## Key Takeaways

- [Bullet points summarizing main points]

---
*Want to discuss how these changes might affect your R&D tax claims? Let's connect.*`;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      newsletters: [],
      settings: {
        promptTemplate: DEFAULT_PROMPT,
        newsletterTemplate: DEFAULT_TEMPLATE,
        defaultNewsletterTitle: 'The Week In R&D Tax'
      },
      addNewsletter: (newsletter) =>
        set((state) => ({
          newsletters: [...state.newsletters, newsletter],
        })),
      updateNewsletter: (id, newsletter) =>
        set((state) => ({
          newsletters: state.newsletters.map((n) =>
            n.id === id ? { ...n, ...newsletter } : n
          ),
        })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
    }),
    {
      name: 'rd-newsletter-storage',
    }
  )
);