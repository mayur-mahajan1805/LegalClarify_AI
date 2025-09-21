'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';

type DocumentViewerProps = {
  documentText: string;
  riskyTerms: string[];
};

export function DocumentViewer({ documentText, riskyTerms }: DocumentViewerProps) {
  
  const highlightedContent = useMemo(() => {
    if (!riskyTerms || riskyTerms.length === 0) {
      return <span>{documentText}</span>;
    }
    
    // Escape special characters for regex and create a robust regex
    const escapedTerms = riskyTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    
    const parts = documentText.split(regex);
    
    return parts.map((part, index) => {
      const isMatch = riskyTerms.some(term => new RegExp(`^${term}$`, 'i').test(part));
      if (isMatch) {
        return (
          <mark key={index} className="bg-accent/40 rounded px-1 py-0.5 text-accent-foreground font-semibold cursor-pointer hover:bg-accent/60 transition-colors">
            {part}
          </mark>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }, [documentText, riskyTerms]);

  return (
    <Card className="h-full max-h-[80vh]">
      <CardHeader>
        <CardTitle>Original Document</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(80vh-100px)] w-full">
          <p className="whitespace-pre-wrap text-sm leading-relaxed p-1">
            {highlightedContent}
          </p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
