import { z } from 'zod';

export const YantraAnalysisInputSchema = z.object({
  yantraName: z.string().describe('The name of the yantra to analyze.'),
  dimensions: z.record(z.number()).describe('The calculated dimensions of the yantra.'),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).describe('The geographic location for the yantra.'),
});
export type YantraAnalysisInput = z.infer<typeof YantraAnalysisInputSchema>;

export const YantraAnalysisSchema = z.object({
  billOfMaterials: z.array(z.object({
    item: z.string().describe('The material or component needed.'),
    quantity: z.string().describe('The amount or number of the item required (e.g., "100 cubic meters", "5 units").'),
  })).describe('A list of materials required to build the yantra.'),
  costEstimate: z.string().describe('A rough estimate of the construction cost, including materials and labor.'),
  accuracy: z.string().describe('An analysis of the potential accuracy of the instrument based on its design and dimensions.'),
  orientation: z.object({
    trueNorthAngle: z.string().describe("Guidance on aligning the instrument with true north. For equatorial sundials, this is critical. Explain why it's important."),
    magneticDeclination: z.string().describe("An estimated magnetic declination for the given location (latitude, longitude). Explain that this value changes over time and a precise, current measurement is needed for construction."),
    foundationNotes: z.string().describe("Recommendations for the instrument's foundation. E.g., 'Requires a massive, stable concrete foundation to prevent any shifting.'"),
    toleranceGuidance: z.string().describe("Notes on the construction precision required. E.g., 'The gnomon's edge must be perfectly sharp and straight, and degree markings must be precise to within 1/60th of a degree.'"),
  }).describe('Guidance for orienting and constructing the yantra.'),
});
export type YantraAnalysisOutput = z.infer<typeof YantraAnalysisSchema>;
