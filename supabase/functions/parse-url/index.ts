import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Use GPT to extract and summarize content
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting and summarizing content from web pages. For the given HTML content:
1. Extract the main title
2. Create a concise summary of the key points (2-3 sentences)
3. Identify the author if available
4. For LinkedIn posts, prioritize the author's name as the title

Focus on R&D tax-related information and implications.`
        },
        {
          role: 'user',
          content: `URL: ${url}\n\nHTML Content: ${html}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Failed to process content');
    }

    // Parse GPT's response
    const lines = content.split('\n');
    const title = lines[0]?.replace(/^Title:\s*/, '').trim();
    const description = lines.slice(1).join('\n').trim();
    const author = lines.find(line => line.startsWith('Author:'))?.replace(/^Author:\s*/, '').trim();

    return new Response(
      JSON.stringify({
        source,
        title,
        description,
        author,
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