import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, BrainCircuit, FileSearch } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <UploadCloud className="h-10 w-10 text-primary" />,
      title: '1. Upload or Paste',
      description: 'Easily upload your legal document (PDF, TXT) or simply paste the text into the editor. Our tool is designed to handle various formats securely.',
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: '2. AI-Powered Analysis',
      description: 'Our advanced AI, powered by Google\'s Genkit, reads and analyzes your document in seconds. It identifies key clauses, defines complex terms, and pinpoints potential risks.',
    },
    {
      icon: <FileSearch className="h-10 w-10 text-primary" />,
      title: '3. Get Clear Insights',
      description: 'Receive a simplified summary, an interactive document with highlighted risks, and tools to ask specific questions. Understand your legal text with confidence.',
    },
  ];

  return (
    <section id="how-it-works" className="w-full max-w-4xl mx-auto py-12 md:py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A simple, three-step process to demystify your legal documents.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={index} className="flex flex-col items-center text-center">
            <CardHeader className="items-center">
              {step.icon}
              <CardTitle className="mt-4">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
