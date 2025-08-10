import OpenAI from 'https://esm.sh/openai@4.28.0';
import { format, parseISO } from 'https://esm.sh/date-fns@2.30.0';
import { searchHistoricalEvents } from './research.ts';

export async function getOnThisDayFact(openai: OpenAI, targetDate?: string): Promise<string> {
  console.log('getOnThisDayFact - Received targetDate:', targetDate);
  console.log('getOnThisDayFact - targetDate type:', typeof targetDate);
  
  // Parse the ISO string date if provided, otherwise use current date
  const date = targetDate ? parseISO(targetDate) : new Date();
  console.log('getOnThisDayFact - Initial parsed date:', date);
  console.log('getOnThisDayFact - Initial date components:', {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    timezone: date.getTimezoneOffset()
  });

  // Ensure we're working with UTC dates by setting to noon UTC
  const utcDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    12, 0, 0, 0  // Use noon UTC to avoid any date shifting
  ));
  
  console.log('getOnThisDayFact - Created UTC date:', utcDate.toISOString());
  console.log('getOnThisDayFact - UTC date components:', {
    year: utcDate.getUTCFullYear(),
    month: utcDate.getUTCMonth() + 1,
    day: utcDate.getUTCDate(),
    hours: utcDate.getUTCHours(),
    minutes: utcDate.getUTCMinutes()
  });
  
  // Format the date using UTC values directly
  const month = format(utcDate, 'MMMM');
  const day = utcDate.getUTCDate();
  const formattedDate = `${month} ${day}`;
  console.log('getOnThisDayFact - Formatted date for prompt:', formattedDate);

  const completion = await openai.chat.completions.create({
    model: 'gpt-5',
    messages: [
      {
        role: 'user',
        content: `Today is ${formattedDate}. Find a significant technological breakthrough, invention, or scientific discovery that happened on this day. Focus on concrete achievements like first successful demonstrations, patent grants, or research breakthroughs.`
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

  const { date: searchDate } = JSON.parse(functionCall.arguments);
  const searchResults = await searchHistoricalEvents(searchDate);

  const finalCompletion = await openai.chat.completions.create({
    model: 'gpt-5',
    messages: [
      {
        role: 'system',
        content: `You are a technology historian specialising in breakthrough innovations. Create a concise and engaging fact about a significant technological achievement that occurred on this day in history (${formattedDate}). Focus specifically on:

1. First successful demonstrations of new technologies
2. Groundbreaking patent grants
3. Major scientific or engineering breakthroughs
4. Launch of revolutionary products or systems
5. Key discoveries that enabled future innovations

Include the specific year and, if relevant, the names of key inventors or researchers. Aim to highlight concrete achievements rather than general historical events. Use British English.`
      },
      {
        role: 'user',
        content: `Here are the search results for historical events on ${formattedDate}:\n\n${JSON.stringify(searchResults, null, 2)}`
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });

  return finalCompletion.choices[0]?.message?.content || '';
}