'use server';
/**
 * @fileOverview A yantra analysis AI agent.
 *
 * - generateYantraAnalysis - A function that handles the yantra analysis generation process.
 */

import {ai} from '@/ai/genkit';
import {
  YantraAnalysisInputSchema,
  YantraAnalysisSchema,
  type YantraAnalysisInput,
  type YantraAnalysisOutput
} from '@/lib/schema/yantra-analysis';


export async function generateYantraAnalysis(input: YantraAnalysisInput): Promise<YantraAnalysisOutput> {
  return generateYantraAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateYantraAnalysisPrompt',
  input: {schema: YantraAnalysisInputSchema},
  output: {schema: YantraAnalysisSchema},
  prompt: `You are an expert in ancient Indian architecture and astronomical instrument construction.

  Based on the yantra named '{{yantraName}}' with the following dimensions:
  {{#each dimensions}}
  - {{@key}}: {{this}}
  {{/each}}
  
  Provide a practical analysis for its construction. Assume it's a large-scale public installation.
  
  1.  **Bill of Materials**: List the primary materials needed. Be realistic for historical and modern construction (e.g., brick, marble, bronze, concrete).
  2.  **Cost Estimate**: Provide a very rough, narrative cost estimate. Consider materials, specialized labor, and location. For example, "Likely in the range of a significant public monument, requiring substantial funding for materials like high-quality marble and expert masonry."
  3.  **Accuracy**: Describe the factors affecting its accuracy and its expected precision. For example, "The accuracy of the Samrat Yantra is exceptional, potentially down to 2 seconds, but this is highly dependent on the precision of the gnomon's edge and the markings on the quadrants."
  `,
});

const generateYantraAnalysisFlow = ai.defineFlow(
  {
    name: 'generateYantraAnalysisFlow',
    inputSchema: YantraAnalysisInputSchema,
    outputSchema: YantraAnalysisSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
