'use server';

/**
 * @fileOverview A flow to extract text from a document.
 *
 * - extractTextFromDocument - A function that handles the text extraction from a document.
 * - ExtractTextFromDocumentInput - The input type for the extractTextFromDocument function.
 * - ExtractTextFromDocumentOutput - The return type for the extractTextFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextFromDocumentInputSchema = z.object({
  docDataUri: z
    .string()
    .describe(
      "A document file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromDocumentInput = z.infer<
  typeof ExtractTextFromDocumentInputSchema
>;

const ExtractTextFromDocumentOutputSchema = z.object({
  text: z.string().describe('The extracted text from the document.'),
});
export type ExtractTextFromDocumentOutput = z.infer<
  typeof ExtractTextFromDocumentOutputSchema
>;

export async function extractTextFromDocument(
  input: ExtractTextFromDocumentInput
): Promise<ExtractTextFromDocumentOutput> {
  return extractTextFromDocumentFlow(input);
}

const extractTextFromDocumentFlow = ai.defineFlow(
  {
    name: 'extractTextFromDocumentFlow',
    inputSchema: ExtractTextFromDocumentInputSchema,
    outputSchema: ExtractTextFromDocumentOutputSchema,
  },
  async (input) => {
    const {text} = await ai.generate({
      prompt: [{media: {url: input.docDataUri}}],
    });
    return {text};
  }
);
