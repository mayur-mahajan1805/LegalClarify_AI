import { config } from 'dotenv';
config();

import '@/ai/flows/explain-specific-clause.ts';
import '@/ai/flows/highlight-risky-terms.ts';
import '@/ai/flows/summarize-legal-document.ts';
import '@/ai/flows/define-legal-terms.ts';
import '@/ai/flows/extract-text-from-document.ts';
import '@/ai/flows/compare-legal-documents.ts';
import '@/ai/flows/chatbot.ts';
