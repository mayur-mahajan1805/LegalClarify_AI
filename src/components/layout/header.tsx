import { Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Compare Documents', href: '/compare' },
    { name: 'AI Chatbot', href: '/chatbot' },
  ];

  return (
    <header className="w-full border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <a href="/" className="flex items-center gap-2">
          <Gavel className="w-7 h-7 text-primary" />
          <span className="font-bold text-lg tracking-tight">
            Legal Clarity AI
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Button variant="link" asChild key={item.name}>
              <Link href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
