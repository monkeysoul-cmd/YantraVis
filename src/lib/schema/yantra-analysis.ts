import { z } from 'zod';

export const YantraAnalysisInputSchema = z.object({
  yantraName: z.string().describe('The name of the yantra to analyze.'),
  dimensions: z.record(z.number()).describe('The calculated dimensions of the yantra.'),
});
export type YantraAnalysisInput = z.infer<typeof YantraAnalysisInputSchema>;

export const YantraAnalysisSchema = z.object({
  billOfMaterials: z.array(z.object({
    item: z.string().describe('The material or component needed.'),
    quantity: z.string().describe('The amount or number of the item required (e.g., "100 cubic meters", "5 units").'),
  })).describe('A list of materials required to build the yantra.'),
  costEstimate: z.string().describe('A rough estimate of the construction cost, including materials and labor.'),
  accuracy: z.string().describe('An analysis of the potential accuracy of the instrument based on its design and dimensions.'),
});
export type YantraAnalysisOutput = z.infer<typeof YantraAnalysisSchema>;
