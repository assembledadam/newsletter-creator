import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentResponse {
  title: string;
  description: string;
  author?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    // Fetch the content from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch URL content');
    }
    
    const html = await response.text();

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Determine source type
    let source = 'google';
    if (url.includes('linkedin.com')) {
      source = url.includes('/newsletter/') ? 'linkedin_newsletter' : 'linkedin_search';
    }

    // Use GPT to extract and summarize content with a structured response format
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting and summarising content from web pages, specialising in R&D tax-related content. 

Your task is to analyse the provided HTML content and return a structured response in the following format EXACTLY:

{
  "title": "The main article title, or for LinkedIn posts, the author's name",
  "description": "A 2-3 sentence summary focusing on key points and R&D tax implications",
  "author": "The content author's name (if available)"
}

Guidelines:
- For LinkedIn posts, use the author's name as the title
- For articles, use the main headline as the title (without any prefixes or domain info)
- Keep descriptions focused and concise
- Only include the author field if explicitly stated in the content
- Return ONLY the JSON response, no additional text
- Use British English in your response (en-gb)`
        },
        {
          role: 'user',
          content: `URL: ${url}\n\nHTML Content: ${html}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Failed to process content');
    }

    // Parse the JSON response
    const parsedContent = JSON.parse(content) as ContentResponse;

    return new Response(
      JSON.stringify({
        source,
        title: parsedContent.title,
        description: parsedContent.description,
        author: parsedContent.author,
        metadata: {
          domain: new URL(url).hostname
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in parse-url function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});