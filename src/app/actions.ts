'use server';

import { summarizeLegalDocument } from '@/ai/flows/summarize-legal-document';
import { highlightRiskyTerms } from '@/ai/flows/highlight-risky-terms';
import { defineLegalTerms } from '@/ai/flows/define-legal-terms';
import { explainSpecificClause } from '@/ai/flows/explain-specific-clause';
import { extractTextFromDocument } from '@/ai/flows/extract-text-from-document';
import { compareLegalDocuments } from '@/ai/flows/compare-legal-documents';
import { chat } from '@/ai/flows/chatbot';


export type AnalysisResult = {
  summary: string;
  risks: {
    highlightedTerms: string[];
    explanation: string;
  };
};

export async function analyzeDocument(documentText: string): Promise<AnalysisResult> {
  try {
    const [summaryResult, risksResult] = await Promise.all([
      summarizeLegalDocument({ documentText }),
      highlightRiskyTerms({ documentText }),
    ]);

    if (!summaryResult || !risksResult) {
      throw new Error('Failed to get a complete analysis from the AI.');
    }
    
    return {
      summary: summaryResult.summary,
      risks: {
        highlightedTerms: risksResult.highlightedTerms,
        explanation: risksResult.explanation,
      },
    };
  } catch (error) {
    console.error("Error in analyzeDocument:", error);
    throw new Error("Failed to analyze document.");
  }
}

export async function defineTerm(term: string): Promise<string> {
  try {
    const result = await defineLegalTerms({ term });
    return result.definition;
  } catch (error) {
    console.error(`Error defining term "${term}":`, error);
    return "Could not find a definition for this term.";
  }
}

export async function explainClause(documentText: string, clause: string, question: string): Promise<string> {
    try {
        const result = await explainSpecificClause({ documentText, clause, question });
        return `${result.explanation}\n\nConfidence: ${Math.round(result.confidence * 100)}%`;
    } catch (error) {
        console.error(`Error explaining clause:`, error);
        return "Sorry, I couldn't provide an explanation for this clause.";
    }
}

export async function handleFile(docDataUri: string): Promise<string> {
  try {
    const result = await extractTextFromDocument({ docDataUri });
    return result.text;
  } catch (error) {
    console.error('Error extracting text from document:', error);
    throw new Error('Failed to extract text from document.');
  }
}

export async function compareDocuments(document1Text: string, document2Text: string): Promise<string> {
  try {
    const result = await compareLegalDocuments({ document1Text, document2Text });
    return result.comparisonSummary;
  } catch (error) {
    console.error('Error comparing documents:', error);
    throw new Error('Failed to compare documents.');
  }
}

export async function getChatbotResponse(message: string): Promise<string> {
    try {
        const result = await chat({ message });
        return result.response;
    } catch (error) {
        console.error('Error in chatbot:', error);
        return "Sorry, I'm having trouble responding right now. Please try again later.";
    }
}
