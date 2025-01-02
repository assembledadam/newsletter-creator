import OpenAI from 'https://esm.sh/openai@4.28.0';
import { format } from 'https://esm.sh/date-fns@2.30.0';
import { searchHistoricalEvents } from './research.ts';

export async function getOnThisDayFact(openai: OpenAI): Promise<string> {
  const today = format(new Date(), 'do of MMMM');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: `Today is the ${today}. Find an interesting historical fact about technology R&D that happened on this day.`
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
              description: 'The date to search for in format "day of month"'
            }
          },
          required: ['date']
        }
      }
    ],
    function_call: { name: 'searchHistoricalEvents' }
  });

  // Get the function call
  const functionCall = completion.choices[0]?.message?.function_call;
  if (!functionCall) {
    throw new Error('No function call received from GPT');
  }

  // Parse the arguments
  const { date } = JSON.parse(functionCall.arguments);

  // Search for historical events
  const searchResults = await searchHistoricalEvents(date);

  // Ask GPT to analyze the search results
  const finalCompletion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a technology historian. Create a concise and interesting fact about technology R&D history based on the search results provided. Focus on verifiable facts and include the year in your response.'
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