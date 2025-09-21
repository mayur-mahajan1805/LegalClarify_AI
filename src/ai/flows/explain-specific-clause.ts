'use server';

/**
 * @fileOverview A flow that explains a specific clause in a legal document.
 *
 * - explainSpecificClause - A function that handles the explanation of a specific clause.
 * - ExplainSpecificClauseInput - The input type for the explainSpecificClause function.
 * - ExplainSpecificClauseOutput - The return type for the explainSpecificClause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSpecificClauseInputSchema = z.object({
  documentText: z.string().describe('The complete text of the legal document.'),
  clause: z.string().describe('The specific clause the user is asking about.'),
  question: z.string().describe('The user question about the clause.'),
});
export type ExplainSpecificClauseInput = z.infer<
  typeof ExplainSpecificClauseInputSchema
>;

const ExplainSpecificClauseOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A plain-language explanation of the clause.'),
  confidence: z
    .number()
    .describe(
      'A number between 0 and 1 indicating the AI confidence in the accuracy of the explanation.'
    ),
});
export type ExplainSpecificClauseOutput = z.infer<
  typeof ExplainSpecificClauseOutputSchema
>;

export async function explainSpecificClause(
  input: ExplainSpecificClauseInput
): Promise<ExplainSpecificClauseOutput> {
  return explainSpecificClauseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSpecificClausePrompt',
  input: {schema: ExplainSpecificClauseInputSchema},
  output: {schema: ExplainSpecificClauseOutputSchema},
  prompt: `You are an AI assistant that explains legal clauses in plain language.

You are given a legal document, a specific clause from that document, and a user question about that clause.

Your task is to provide a clear and concise explanation of the clause that answers the user's question.

Document: {{{documentText}}}
Clause: {{{clause}}}
Question: {{{question}}}

Your explanation should be easy to understand for someone without a legal background. Also provide a confidence score between 0 and 1 on how confident you are in the explanation.

Explanation: {{explanation}}
Confidence: {{confidence}}`,
});

const explainSpecificClauseFlow = ai.defineFlow(
  {
    name: 'explainSpecificClauseFlow',
    inputSchema: ExplainSpecificClauseInputSchema,
    outputSchema: ExplainSpecificClauseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
