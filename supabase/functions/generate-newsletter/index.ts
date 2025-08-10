import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.28.0';
import { getOnThisDayFact } from './fact.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*' /* Allow specific origin in production */,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define a simple type for example newsletters
interface NewsletterExample {
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { items, prompt, template, examples, targetDate } = await req.json();
    
    console.log('Backend - Received request with targetDate:', targetDate);
    console.log('Backend - targetDate type:', typeof targetDate);
    console.log('Backend - Received items:', JSON.stringify(items, null, 2));
    console.log('Backend - Received examples count:', examples?.length || 0);

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

    // Prepare the examples text
    let examplesText = '';
    if (examples && Array.isArray(examples) && examples.length > 0) {
      examplesText = `\n\n# Examples of previous articles:\n\n` + examples.map((ex: string, index: number) => 
        `--- Example ${index + 1} ---\n${ex}\n--- End Example ${index + 1} ---`
      ).join('\n\n');
    }

    // Construct the final system prompt
    const systemPrompt = `${prompt}

# On this day fact
${onThisDayFact}

Template:
${template}

${examplesText}`;

const userPrompt = `
Generate a new newsletter article based on ALL of the below news items:

${itemsText}`

    console.log('System prompt:', systemPrompt);
    console.log('User prompt:', userPrompt);

    const completion = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      // temperature: 1,
      // max_tokens: 256000, // Consider increasing if examples make prompts too long
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