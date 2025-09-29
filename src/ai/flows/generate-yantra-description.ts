'use server';
/**
 * @fileOverview A yantra description AI agent.
 *
 * - generateYantraDescription - A function that handles the yantra description generation process.
 * - GenerateYantraDescriptionInput - The input type for the generateYantraDescription function.
 * - GenerateYantraDescriptionOutput - The return type for the generateYantraDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateYantraDescriptionInputSchema = z.object({
  yantraName: z.string().describe('The name of the yantra to describe.'),
});
export type GenerateYantraDescriptionInput = z.infer<typeof GenerateYantraDescriptionInputSchema>;

const GenerateYantraDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed description of the yantra, including its purpose and historical significance.'),
});
export type GenerateYantraDescriptionOutput = z.infer<typeof GenerateYantraDescriptionOutputSchema>;

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
