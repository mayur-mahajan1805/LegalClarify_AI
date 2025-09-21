'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, FileText } from 'lucide-react';
import { sampleLegalText } from '@/lib/sample-data';
import { useToast } from "@/hooks/use-toast";
import { handleFile } from '@/app/actions';

type UploadSectionProps = {
  onAnalyze: (text: string) => void;
};

export function UploadSection({ onAnalyze }: UploadSectionProps) {
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleAnalyzeClick = () => {
    onAnalyze(text);
  };
  
  const handleTryDemoClick = () => {
    setText(sampleLegalText);
    toast({
      title: "Demo Loaded",
      description: "Sample legal text has been pasted. You can now analyze it.",
    });
  };

  const processFile = async (file: File) => {
    const reader = new FileReader();

    if (file.type === 'application/pdf') {
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
            description: `${file.name} has been processed. You can now analyze it.`,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "PDF Processing Error",
            description: "Could not extract text from the PDF. Please try pasting the text manually.",
          });
        }
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "File Read Error",
          description: `Could not read the file ${file.name}.`,
        });
      }
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('image/') || file.type.includes('word')) {
      toast({
        variant: "destructive",
        title: "Unsupported File Type",
        description: `Automatic text extraction from ${file.type} is not yet supported. Please paste the text manually.`,
      });
      return;
    } else {
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
        toast({
          title: "File Loaded",
          description: `${file.name} has been loaded. You can now analyze it.`,
        });
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "File Read Error",
          description: `Could not read the file ${file.name}.`,
        });
      }
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

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="w-full max-w-4xl text-center flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline">
        Understand Legal Documents in Simple Words
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8">
        Upload, Ask, and Get Clear Explanations—powered by AI
      </p>

      <Card className="w-full">
        <CardContent className="p-6">
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
            <p className="font-semibold text-lg mb-2">Drag & drop your document here</p>
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
              accept=".txt,.md,.html,.pdf"
            />
            <p className="text-xs text-muted-foreground mt-2">(DOCX and image OCR coming soon)</p>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or Paste Text Below</span>
            </div>
          </div>

          <Textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Paste your legal text here..."
            className="min-h-[200px] text-sm font-mono"
          />
        </CardContent>
      </Card>
      
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Button size="lg" onClick={handleAnalyzeClick} disabled={!text.trim()}>
          Analyze Document
        </Button>
        <Button size="lg" variant="outline" onClick={handleTryDemoClick}>
          Try a Demo
        </Button>
      </div>
    </div>
  );
}
