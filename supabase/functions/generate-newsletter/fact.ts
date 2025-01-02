import OpenAI from 'https://esm.sh/openai@4.28.0';
import { format } from 'https://esm.sh/date-fns@2.30.0';
import { searchHistoricalEvents } from './research.ts';

export async function getOnThisDayFact(openai: OpenAI): Promise<string> {
  const today = format(new Date(), 'MMMM d');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: `Today is ${today}. Find a significant technological breakthrough, invention, or scientific discovery that happened on this day. Focus on concrete achievements like first successful demonstrations, patent grants, or research breakthroughs.`
      }
    ],
    functions: [
      {
        name: 'searchHistoricalEvents',
        description: 'Search for historical events that occurred on a specific date',
        parameters: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'The date to search for in format "month day"'
            }
          },
          required: ['date']
        }
      }
    ],
    function_call: { name: 'searchHistoricalEvents' }
  });

  const functionCall = completion.choices[0]?.message?.function_call;
  if (!functionCall) {
    throw new Error('No function call received from GPT');
  }

  const { date } = JSON.parse(functionCall.arguments);
  const searchResults = await searchHistoricalEvents(date);

  const finalCompletion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a technology historian specializing in breakthrough innovations. Create a concise and engaging fact about a significant technological achievement that occurred on this day in history. Focus specifically on:

1. First successful demonstrations of new technologies
2. Groundbreaking patent grants
3. Major scientific or engineering breakthroughs
4. Launch of revolutionary products or systems
5. Key discoveries that enabled future innovations

Include the specific year and, if relevant, the names of key inventors or researchers. Aim to highlight concrete achievements rather than general historical events.`
      },
      {
        role: 'user',
        content: `Here are the search results for historical events on ${today}:\n\n${JSON.stringify(searchResults, null, 2)}`
      }
    ],
    temperature: 0.7,
    max_tokens: 200
  });

  return finalCompletion.choices[0]?.message?.content || '';
}