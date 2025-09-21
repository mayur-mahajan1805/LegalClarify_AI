'use server';

/**
 * @fileOverview Provides a plain English definition of legal terms.
 *
 * - defineLegalTerms - A function that retrieves a definition of a legal term.
 * - DefineLegalTermsInput - The input type for the defineLegalTerms function.
 * - DefineLegalTermsOutput - The return type for the defineLegalTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DefineLegalTermsInputSchema = z.object({
  term: z.string().describe('The legal term to define.'),
});
export type DefineLegalTermsInput = z.infer<typeof DefineLegalTermsInputSchema>;

const DefineLegalTermsOutputSchema = z.object({
  definition: z.string().describe('The plain English definition of the legal term.'),
});
export type DefineLegalTermsOutput = z.infer<typeof DefineLegalTermsOutputSchema>;

export async function defineLegalTerms(input: DefineLegalTermsInput): Promise<DefineLegalTermsOutput> {
  return defineLegalTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'defineLegalTermsPrompt',
  input: {schema: DefineLegalTermsInputSchema},
  output: {schema: DefineLegalTermsOutputSchema},
  prompt: `You are a legal expert who specializes in explaining legal terms in plain English.

  Please provide a clear and concise definition of the following legal term:

  {{term}}
  `,
});

const defineLegalTermsFlow = ai.defineFlow(
  {
    name: 'defineLegalTermsFlow',
    inputSchema: DefineLegalTermsInputSchema,
    outputSchema: DefineLegalTermsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
