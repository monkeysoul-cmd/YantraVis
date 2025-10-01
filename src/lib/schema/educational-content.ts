import { z } from 'zod';

export const GenerateEducationalContentInputSchema = z.object({
  yantraName: z.string().describe('The name of the yantra.'),
  yantraId: z.string().describe('The ID of the yantra.'),
  dimensions: z.record(z.number()).describe('The calculated dimensions of the yantra.'),
});
export type GenerateEducationalContentInput = z.infer<typeof GenerateEducationalContentInputSchema>;

export const GenerateEducationalContentOutputSchema = z.object({
  simplifiedDescription: z.string().describe('A very simple, one-paragraph explanation of the yantra, suitable for a young student or a museum exhibit.'),
  partsList: z.array(z.string()).describe('A list of components needed to build a simple model of the yantra.'),
  buildSteps: z.array(z.string()).describe('A numbered list of simple, step-by-step instructions to build a paper model.'),
  printableTemplate: z.string().describe('An SVG string for a printable template. The SVG should be simple, with clean lines and clear labels for parts based on the partsList. It must have a viewBox="0 0 200 200". Use black strokes and no fill. Add dashed lines for cuts or folds. Make it look like a DIY kit template.'),
});
export type GenerateEducationalContentOutput = z.infer<typeof GenerateEducationalContentOutputSchema>;
