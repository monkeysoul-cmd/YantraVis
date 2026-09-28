import { z } from 'zod';

export const GenerateYantraDescriptionInputSchema = z.object({
  yantraName: z.string().describe('The name of the yantra to describe.'),
});
export type GenerateYantraDescriptionInput = z.infer<typeof GenerateYantraDescriptionInputSchema>;

export const GenerateYantraDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed description of the yantra, including its purpose and historical significance.'),
});
export type GenerateYantraDescriptionOutput = z.infer<typeof GenerateYantraDescriptionOutputSchema>;
