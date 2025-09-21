'use server';

/**
 * @fileOverview Summarizes legal documents into simplified, easy-to-understand summaries.
 *
 * - summarizeLegalDocument - A function that handles the summarization process.
 * - SummarizeLegalDocumentInput - The input type for the summarizeLegalDocument function.
 * - SummarizeLegalDocumentOutput - The return type for the summarizeLegalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLegalDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the legal document to be summarized.'),
});
export type SummarizeLegalDocumentInput = z.infer<
  typeof SummarizeLegalDocumentInputSchema
>;

const SummarizeLegalDocumentOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A simplified, easy-to-understand summary of the legal document.'
    ),
});
export type SummarizeLegalDocumentOutput = z.infer<
  typeof SummarizeLegalDocumentOutputSchema
>;

export async function summarizeLegalDocument(
  input: SummarizeLegalDocumentInput
): Promise<SummarizeLegalDocumentOutput> {
  return summarizeLegalDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLegalDocumentPrompt',
  input: {schema: SummarizeLegalDocumentInputSchema},
  output: {schema: SummarizeLegalDocumentOutputSchema},
  prompt: `You are an expert legal professional skilled at summarizing complex legal documents into easy to understand language.

Please provide a simplified summary of the following legal document:

{{{documentText}}}
`,
});

const summarizeLegalDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeLegalDocumentFlow',
    inputSchema: SummarizeLegalDocumentInputSchema,
    outputSchema: SummarizeLegalDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
