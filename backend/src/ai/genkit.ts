import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '';

export const ai = genkit({
  plugins: [googleAI({ apiKey: apiKey || undefined })],
  model: (process.env.GEMINI_MODEL as any) || 'googleai/gemini-2.0-flash',
});

