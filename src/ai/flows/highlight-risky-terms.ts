// src/ai/flows/highlight-risky-terms.ts
'use server';

/**
 * @fileOverview Highlights potentially risky or unusual terms within a legal document.
 *
 * - highlightRiskyTerms - A function that highlights risky terms in a document.
 * - HighlightRiskyTermsInput - The input type for the highlightRiskyTerms function.
 * - HighlightRiskyTermsOutput - The return type for the highlightRiskyTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightRiskyTermsInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text of the legal document to analyze.'),
});
export type HighlightRiskyTermsInput = z.infer<typeof HighlightRiskyTermsInputSchema>;

const HighlightRiskyTermsOutputSchema = z.object({
  highlightedTerms: z
    .array(z.string())
    .describe('An array of potentially risky or unusual terms.'),
  explanation: z
    .string()
    .describe('A plain language explanation of why these terms are risky.'),
});
export type HighlightRiskyTermsOutput = z.infer<typeof HighlightRiskyTermsOutputSchema>;

export async function highlightRiskyTerms(input: HighlightRiskyTermsInput): Promise<HighlightRiskyTermsOutput> {
  return highlightRiskyTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'highlightRiskyTermsPrompt',
  input: {schema: HighlightRiskyTermsInputSchema},
  output: {schema: HighlightRiskyTermsOutputSchema},
  prompt: `You are an AI assistant specializing in legal document analysis. Your task is to identify and highlight potentially risky or unusual terms within a legal document.

Document Text: {{{documentText}}}

Instructions:
1. Analyze the provided document text.
2. Identify any terms, clauses, or sections that could be disadvantageous, unclear, or potentially harmful to the user.
3. Provide a plain language explanation of why these terms are risky.
4. Output only the risky terms in array format.

Example:
Risky Terms: ["Indemnification Clause", "Arbitration Clause", "Confession of Judgment"]
Explanation: "Indemnification clauses may require you to cover the other party's losses. Arbitration clauses limit your ability to sue in court. Confession of judgment allows the other party to obtain a judgment against you without notice or a hearing."

Output:
Risky Terms: 
Explanation:
`,
});

const highlightRiskyTermsFlow = ai.defineFlow(
  {
    name: 'highlightRiskyTermsFlow',
    inputSchema: HighlightRiskyTermsInputSchema,
    outputSchema: HighlightRiskyTermsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
