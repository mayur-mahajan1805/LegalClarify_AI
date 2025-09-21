'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/app/actions';
import { analyzeDocument } from '@/app/actions';
import { Header } from '@/components/layout/header';
import { UploadSection } from '@/components/app/upload-section';
import { LoadingView } from '@/components/app/loading-view';
import { ResultsView } from '@/components/app/results-view';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Terminal } from 'lucide-react';
import { HowItWorks } from '@/components/app/how-it-works';

type ViewState = 'upload' | 'loading' | 'results' | 'error';

export default function Home() {
  const [view, setView] = useState<ViewState>('upload');
  const [documentText, setDocumentText] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    if (!text.trim()) {
      setError('Please upload or paste a document to analyze.');
      setView('error');
      return;
    }
    setView('loading');
    setDocumentText(text);
    setError(null);
    try {
      const result = await analyzeDocument(text);
      setAnalysis(result);
      setView('results');
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred during analysis. Please try again.');
      setView('error');
    }
  };
  
  const handleReset = () => {
    setView('upload');
    setDocumentText('');
    setAnalysis(null);
    setError(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <LoadingView />;
      case 'results':
        return analysis ? (
          <ResultsView documentText={documentText} analysis={analysis} onReset={handleReset} />
        ) : (
          <ErrorView error="Analysis data is missing. Please try again." onReset={handleReset} />
        );
      case 'error':
        return <ErrorView error={error} onReset={handleReset} />;
      case 'upload':
      default:
        return (
          <>
            <UploadSection onAnalyze={handleAnalyze} />
            <HowItWorks />
          </>
        );
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}

const ErrorView = ({ error, onReset }: { error: string | null; onReset: () => void }) => (
  <div className="w-full max-w-2xl text-center">
    <Alert variant="destructive" className="mb-4">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Analysis Failed</AlertTitle>
      <AlertDescription>
        {error || 'An unknown error occurred. Please try again.'}
      </AlertDescription>
    </Alert>
    <Button onClick={onReset}>Try Again</Button>
  </div>
);
