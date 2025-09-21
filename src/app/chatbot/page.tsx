'use client';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChatbotResponse } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Message = {
  from: 'bot' | 'user';
  text: string;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hello! I am your legal AI assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    if (scrollAreaRef.current) {
      // @ts-ignore
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage: Message = { from: 'user', text: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const botResponse = await getChatbotResponse(input);
        const botMessage: Message = { from: 'bot', text: botResponse };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        const errorMessage: Message = { from: 'bot', text: "Sorry, I couldn't get a response. Please try again." };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        <Card className="w-full max-w-4xl flex flex-col flex-1">
          <CardContent className="p-6 flex flex-col flex-1">
            <ScrollArea className="flex-1 mb-4 pr-4" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      msg.from === 'bot' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {msg.from === 'bot' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xl p-3 rounded-lg shadow-sm ${
                        msg.from === 'bot'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    {msg.from === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                     <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                      </Avatar>
                    <div className="max-w-xl p-3 rounded-lg shadow-sm bg-muted text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm">Thinking...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about a legal topic..."
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
