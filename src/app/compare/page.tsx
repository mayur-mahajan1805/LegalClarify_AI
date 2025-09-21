'use client';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, FileText } from 'lucide-react';
import { useState, useRef } from 'react';
import { handleFile, compareDocuments } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function ComparePage() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [comparisonResult, setComparisonResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!text1.trim() || !text2.trim()) {
      setError("Please provide both documents to compare.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setComparisonResult('');
    try {
      const result = await compareDocuments(text1, text2);
      setComparisonResult(result);
    } catch (e) {
      console.error(e);
      setError("An error occurred while comparing the documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-6xl text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">
            Compare Two Legal Documents
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Upload or paste the text of two documents below to see a side-by-side comparison and an AI-generated analysis of the differences.
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <DocumentInput text={text1} setText={setText1} title="Document 1" />
            <DocumentInput text={text2} setText={setText2} title="Document 2" />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button size="lg" onClick={handleCompare} disabled={!text1.trim() || !text2.trim() || isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Comparing...</> : 'Compare Documents'}
            </Button>
          </div>

          {error && (
            <div className="w-full max-w-2xl text-center mt-8">
              <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Comparison Failed</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {comparisonResult && (
            <Card className="w-full mt-8 text-left">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Comparison Analysis</h2>
                <p className="whitespace-pre-wrap text-sm">{comparisonResult}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

function DocumentInput({ text, setText, title }: { text: string, setText: (text: string) => void, title: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUri = e.target?.result as string;
        try {
          toast({
            title: "Processing PDF",
            description: "Extracting text from your PDF. This may take a moment.",
          });
          const extractedText = await handleFile(dataUri);
          setText(extractedText);
          toast({
            title: "File Loaded",
            description: `${file.name} has been processed.`,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "PDF Processing Error",
            description: "Could not extract text from the PDF. Please try pasting the text manually.",
          });
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('image/')) {
       toast({
        variant: "destructive",
        title: "Unsupported File Type",
        description: "Image files are not supported for comparison.",
      });
    }
     else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
        toast({
          title: "File Loaded",
          description: `${file.name} has been loaded.`,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };


  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ${
            isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="font-semibold text-lg mb-2">Drag & drop document here</p>
          <p className="text-muted-foreground mb-4">or</p>
          <Button onClick={triggerFileSelect}>
            <FileText />
            Upload Document
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".txt,.md,.pdf"
          />
        </div>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or Paste Text</span>
          </div>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your legal text here..."
          className="min-h-[200px] text-sm font-mono"
        />
      </CardContent>
    </Card>
  );
}
