'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/app/actions';
import { defineTerm, explainClause } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, BookOpen, Search, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type AnalysisSidebarProps = {
  documentText: string;
  analysis: AnalysisResult;
};

export function AnalysisSidebar({ documentText, analysis }: AnalysisSidebarProps) {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-4 no-print">
        <TabsTrigger value="summary"><Sparkles className="w-4 h-4 mr-2"/>Summary</TabsTrigger>
        <TabsTrigger value="risks"><AlertCircle className="w-4 h-4 mr-2"/>Risks</TabsTrigger>
        <TabsTrigger value="explainer">Explainer</TabsTrigger>
        <TabsTrigger value="dictionary"><BookOpen className="w-4 h-4 mr-2"/>Dictionary</TabsTrigger>
      </TabsList>
      <Card className="mt-2">
        <ScrollArea className="h-[calc(80vh-50px)]">
          <TabsContent value="summary" className="p-0">
            <SummaryTab summary={analysis.summary} />
          </TabsContent>
          <TabsContent value="risks" className="p-0">
            <RisksTab explanation={analysis.risks.explanation} />
          </TabsContent>
          <TabsContent value="explainer" className="p-0">
            <ClauseExplainerTab documentText={documentText} />
          </TabsContent>
          <TabsContent value="dictionary" className="p-0">
            <DictionaryTab />
          </TabsContent>
        </ScrollArea>
      </Card>
    </Tabs>
  );
}

const SummaryTab = ({ summary }: { summary: string }) => (
  <>
    <CardHeader>
      <CardTitle>AI-Generated Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{summary}</p>
    </CardContent>
  </>
);

const RisksTab = ({ explanation }: { explanation: string }) => (
  <>
    <CardHeader>
      <CardTitle>Risk Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{explanation}</p>
    </CardContent>
  </>
);

const ClauseExplainerTab = ({ documentText }: { documentText: string }) => {
  const [clause, setClause] = useState('');
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clause || !question) return;
    setIsLoading(true);
    setExplanation('');
    const result = await explainClause(documentText, clause, question);
    setExplanation(result);
    setIsLoading(false);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Clause Explainer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Copy and paste a clause from the document and ask a specific question about it.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste the clause here..."
            value={clause}
            onChange={(e) => setClause(e.target.value)}
            className="min-h-[100px]"
          />
          <Textarea
            placeholder="What is your question about this clause?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[60px]"
          />
          <Button type="submit" disabled={isLoading || !clause || !question}>
            {isLoading ? 'Explaining...' : 'Explain Clause'}
          </Button>
        </form>
        {isLoading && (
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {explanation && (
          <div className="pt-4">
            <h4 className="font-semibold mb-2">Explanation</h4>
            <p className="whitespace-pre-wrap text-sm p-4 bg-muted/50 rounded-md">{explanation}</p>
          </div>
        )}
      </CardContent>
    </>
  );
};


const DictionaryTab = () => {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term) return;
    setIsLoading(true);
    setDefinition('');
    const result = await defineTerm(term);
    setDefinition(result);
    setIsLoading(false);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Legal Dictionary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Look up the plain English definition of a legal term.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="e.g., Indemnification"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <Button type="submit" disabled={isLoading || !term}><Search className="w-4 h-4 mr-2"/>Search</Button>
        </form>
        {isLoading && (
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {definition && (
          <div className="pt-4">
            <h4 className="font-semibold mb-2 capitalize">{term}</h4>
            <p className="whitespace-pre-wrap text-sm p-4 bg-muted/50 rounded-md">{definition}</p>
          </div>
        )}
      </CardContent>
    </>
  );
};
