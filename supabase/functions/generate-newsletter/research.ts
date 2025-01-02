import { format } from 'https://esm.sh/date-fns@2.30.0';

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export async function searchHistoricalEvents(date: string): Promise<SearchResult[]> {
  const searchUrl = new URL('https://www.googleapis.com/customsearch/v1');
  searchUrl.searchParams.append('key', Deno.env.get('GOOGLE_API_KEY') || '');
  searchUrl.searchParams.append('cx', Deno.env.get('GOOGLE_SEARCH_CX') || '');
  searchUrl.searchParams.append('q', `"on this day" "${date}" technology research development invention patent`);

  const response = await fetch(searchUrl.toString());
  const data = await response.json();

  if (!response.ok) {
    console.error('Google Search API error:', data);
    throw new Error('Failed to search historical events');
  }

  return (data.items || []).map((item: any) => ({
    title: item.title,
    snippet: item.snippet,
    url: item.link
  }));
}