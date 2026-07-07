import { Telescope } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="border-b border-white/10 bg-card/60 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Telescope className="h-8 w-8 text-primary drop-shadow-md" />
            <h1 className="font-headline text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              YantraVis
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
