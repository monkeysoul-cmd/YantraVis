import { Telescope } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="border-b border-white/10 bg-card/70 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Telescope className="h-8 w-8 text-primary drop-shadow-[0_0_14px_rgba(212,92,61,0.5)]" />
            <h1 className="font-headline text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-amber-400 to-accent">
              YantraVis
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium tracking-wide">
              Observational Astronomy
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
