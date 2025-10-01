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

  Based on the yantra named '{{yantraName}}' for location (lat: {{location.latitude}}, lon: {{location.longitude}}) with the following dimensions:
  {{#each dimensions}}
  - {{@key}}: {{this}}
  {{/each}}
  
  Provide a practical analysis for its construction as a large-scale public installation.
  
  1.  **Bill of Materials**: List primary materials for historical and modern construction (e.g., brick, marble, bronze, concrete).
  2.  **Cost Estimate**: Provide a rough, narrative cost estimate (e.g., "Likely in the range of a significant public monument...").
  3.  **Accuracy**: Describe factors affecting its accuracy and expected precision (e.g., "The Samrat Yantra's accuracy is exceptional, potentially down to 2 seconds...").
  4.  **Orientation**:
      - **True North Angle**: Explain how to align it with true north and why it is critical.
      - **Magnetic Declination**: Provide a realistic, estimated magnetic declination for the given latitude and longitude. Mention that this is an estimate and varies.
      - **Foundation Notes**: Give advice on the foundation (e.g., "Requires a massive, stable concrete foundation...").
      - **Tolerance Guidance**: Provide notes on construction precision (e.g., "The gnomon's edge must be perfectly sharp...").
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
