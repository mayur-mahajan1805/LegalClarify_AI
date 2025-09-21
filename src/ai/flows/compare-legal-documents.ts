'use server';

/**
 * @fileOverview A flow that compares two legal documents.
 *
 * - compareLegalDocuments - A function that handles the comparison of two legal documents.
 * - CompareLegalDocumentsInput - The input type for the compareLegalDocuments function.
 * - CompareLegalDocumentsOutput - The return type for the compareLegalDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareLegalDocumentsInputSchema = z.object({
  document1Text: z.string().describe('The complete text of the first legal document.'),
  document2Text: z.string().describe('The complete text of the second legal document.'),
});
export type CompareLegalDocumentsInput = z.infer<typeof CompareLegalDocumentsInputSchema>;

const CompareLegalDocumentsOutputSchema = z.object({
  comparisonSummary: z
    .string()
    .describe('A summary of the key differences between the two documents.'),
});
export type CompareLegalDocumentsOutput = z.infer<typeof CompareLegalDocumentsOutputSchema>;

export async function compareLegalDocuments(
  input: CompareLegalDocumentsInput
): Promise<CompareLegalDocumentsOutput> {
  return compareLegalDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareLegalDocumentsPrompt',
  input: {schema: CompareLegalDocumentsInputSchema},
  output: {schema: CompareLegalDocumentsOutputSchema},
  prompt: `You are an AI assistant that specializes in comparing legal documents.

You will be given two legal documents. Your task is to compare them and provide a summary of the key differences. Focus on changes in rights, responsibilities, liabilities, and other significant legal terms.

Document 1:
{{{document1Text}}}

Document 2:
{{{document2Text}}}

Provide a clear and concise summary of the differences below.
`,
});

const compareLegalDocumentsFlow = ai.defineFlow(
  {
    name: 'compareLegalDocumentsFlow',
    inputSchema: CompareLegalDocumentsInputSchema,
    outputSchema: CompareLegalDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
