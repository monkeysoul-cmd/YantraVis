'use server';
/**
 * @fileOverview Generates educational content for a given yantra.
 *
 * - generateEducationalContent - A function that handles the content generation process.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateEducationalContentInputSchema,
  GenerateEducationalContentOutputSchema,
  type GenerateEducationalContentInput,
  type GenerateEducationalContentOutput
} from '@/lib/schema/educational-content';

export async function generateEducationalContent(input: GenerateEducationalContentInput): Promise<GenerateEducationalContentOutput> {
  return generateEducationalContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEducationalContentPrompt',
  input: {schema: GenerateEducationalContentInputSchema},
  output: {schema: GenerateEducationalContentOutputSchema},
  prompt: `You are an expert curriculum developer and museum exhibit designer, tasked with creating a "Museum Mode" for an educational app about Indian astronomical instruments (yantras).

For the given yantra, "{{yantraName}}", generate the following content in a clear, simple, and engaging tone suitable for students and families.

**Your Task:**
1.  **Simplified Description:** Write a single, easy-to-understand paragraph explaining what the "{{yantraName}}" is and its basic purpose. Imagine you're explaining it to a 12-year-old.
2.  **Parts List:** Based on the yantra's structure and its known dimensions, create a simple list of parts needed for a paper model.
3.  **Build Steps:** Provide clear, numbered, step-by-step instructions for assembling the paper model.
4.  **Printable Template (SVG):** Design a simple SVG template for the parts.
    *   It MUST be a valid SVG string.
    *   The SVG MUST have a \`viewBox="0 0 200 200"\`.
    *   Use black strokes (\`stroke="black"\`) and no fill (\`fill="none"\`).
    *   Use dashed lines (\`stroke-dasharray="4 2"\`) for any fold lines.
    *   Label each part clearly using \`<text>\` elements. The labels should correspond to your Parts List.
    *   Arrange the parts to fit neatly within the 200x200 viewbox, like a model kit.

**Yantra Information:**
*   **Name:** {{yantraName}}
*   **ID:** {{yantraId}}
*   **Calculated Dimensions (for context):**
    {{#each dimensions}}
    *   {{@key}}: {{this}}
    {{/each}}
`,
});

const generateEducationalContentFlow = ai.defineFlow(
  {
    name: 'generateEducationalContentFlow',
    inputSchema: GenerateEducationalContentInputSchema,
    outputSchema: GenerateEducationalContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
