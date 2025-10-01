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

  Provide a detailed description of the {{yantraName}} yantra, including its purpose and historical significance.
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
