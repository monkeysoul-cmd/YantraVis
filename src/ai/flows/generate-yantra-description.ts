'use server';
/**
 * @fileOverview A yantra description AI agent.
 *
 * - generateYantraDescription - A function that handles the yantra description generation process.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateYantraDescriptionInputSchema,
  GenerateYantraDescriptionOutputSchema,
  type GenerateYantraDescriptionInput,
  type GenerateYantraDescriptionOutput
} from '@/lib/schema/yantra-description';


export async function generateYantraDescription(input: GenerateYantraDescriptionInput): Promise<GenerateYantraDescriptionOutput> {
  return generateYantraDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateYantraDescriptionPrompt',
  input: {schema: GenerateYantraDescriptionInputSchema},
  output: {schema: GenerateYantraDescriptionOutputSchema},
  prompt: `You are an expert in Indian astronomical instruments.

  Provide a detailed and engaging description of the {{yantraName}} yantra.
  
  Structure your response with the following sections, using bullet points and relevant emojis for each:
  - 📜 **Purpose**: Explain what the instrument is used for.
  - 🏛️ **Historical Significance**: Describe its history and importance.
  - ✨ **Fun Fact**: Add an interesting tidbit about the instrument.
  `,
});

const generateYantraDescriptionFlow = ai.defineFlow(
  {
    name: 'generateYantraDescriptionFlow',
    inputSchema: GenerateYantraDescriptionInputSchema,
    outputSchema: GenerateYantraDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
