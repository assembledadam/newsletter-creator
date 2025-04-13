import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.28.0';
import { getOnThisDayFact } from './fact.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { items, prompt, template, targetDate } = await req.json();
    
    console.log('Backend - Received request with targetDate:', targetDate);
    console.log('Backend - targetDate type:', typeof targetDate);
    console.log('Backend - Received items:', JSON.stringify(items, null, 2));

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Get the "On this day" fact with research capability
    console.log('Backend - Calling getOnThisDayFact with date:', targetDate);
    const onThisDayFact = await getOnThisDayFact(openai, targetDate);
    console.log('Backend - Generated fact:', onThisDayFact);

    // Prepare the content for GPT with URLs included
    const itemsText = items
      .map((item: any) => `Title: ${item.title}
Description: ${item.description}
Source: ${item.source}${item.url ? `\nURL: ${item.url}` : ''}\n`)
      .join('\n');

    const systemPrompt = `${prompt}\n\nOn this day fact: ${onThisDayFact}\n\nTemplate:\n${template}\n\nNews Items:\n${itemsText}`;
    
    console.log('System prompt:', systemPrompt);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate a newsletter based on the provided template and news items.' }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '';

    return new Response(
      JSON.stringify({ content }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Backend - API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});