'use client';

import type { AnalysisResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { DocumentViewer } from './document-viewer';
import { AnalysisSidebar } from './analysis-sidebar';
import { FeedbackForm } from './feedback-form';

type ResultsViewProps = {
  documentText: string;
  analysis: AnalysisResult;
  onReset: () => void;
};

export function ResultsView({ documentText, analysis, onReset }: ResultsViewProps) {

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6 no-print">
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft />
          Analyze Another Document
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer />
          Export as PDF
        </Button>
      </div>

      <div className="print-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="lg:order-2">
            <AnalysisSidebar documentText={documentText} analysis={analysis} />
          </div>
          <div className="lg:order-1 mt-8 lg:mt-0">
            <DocumentViewer documentText={documentText} riskyTerms={analysis.risks.highlightedTerms} />
          </div>
        </div>
      </div>

      <div className="mt-12 no-print">
        <FeedbackForm />
      </div>
    </div>
  );
}
