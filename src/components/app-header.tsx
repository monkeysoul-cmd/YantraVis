import { Telescope, Star } from 'lucide-react';

export default function AppHeader() {

  return (
    <header className="relative border-b bg-card/60 backdrop-blur-2xl sticky top-0 z-30 overflow-hidden"
      style={{ borderBottomColor: 'hsla(24, 85%, 42%, 0.15)' }}>
      
      {/* Decorative gradient underline */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(24, 90%, 55%), hsl(43, 100%, 52%), transparent)' }} />
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 100% at 50% -50%, hsla(24, 90%, 55%, 0.06) 0%, transparent 70%)'
        }} />

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo + Title (Aligned with page sidebar grid) */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center">
              {/* Outer Orbit ring */}
              <div className="absolute inset-0 rounded-full border border-primary/25 animate-spin-slow pointer-events-none" />
              {/* Inner Orbit ring */}
              <div className="absolute inset-1.5 rounded-full border border-accent/20 animate-counter-spin pointer-events-none" />
              {/* Center Icon */}
              <div className="relative w-8 h-8 flex items-center justify-center rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, hsla(24, 85%, 42%, 0.25), hsla(43, 100%, 52%, 0.18))',
                  border: '1px solid hsla(43, 100%, 52%, 0.35)',
                  boxShadow: '0 0 16px hsla(24, 90%, 55%, 0.25), inset 0 1px 0 hsla(255, 100%, 100%, 0.12)'
                }}>
                <Telescope className="h-4.5 w-4.5" style={{ color: 'hsl(24, 90%, 62%)' }} />
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="font-headline text-xl sm:text-2xl font-bold tracking-wider leading-none"
                style={{
                  background: 'linear-gradient(135deg, hsl(24, 90%, 65%), hsl(38, 95%, 58%), hsl(43, 100%, 55%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 12px hsla(43, 100%, 52%, 0.25))'
                }}>
                YantraVis
              </h1>
              <p className="text-[9.5px] font-body font-medium tracking-[0.22em] uppercase text-muted-foreground/80 leading-none mt-1">
                Observational Astronomy
              </p>
            </div>
          </div>

          {/* Right side badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'hsla(24, 90%, 55%, 0.08)',
                border: '1px solid hsla(24, 90%, 55%, 0.2)',
                color: 'hsl(24, 90%, 60%)'
              }}>
              <Star className="h-3 w-3 fill-current" />
              <span>13 Instruments</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'hsla(43, 100%, 52%, 0.08)',
                border: '1px solid hsla(43, 100%, 52%, 0.25)',
                color: 'hsl(43, 100%, 52%)'
              }}>
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span className="hidden sm:inline">SIH 2025</span>
              <span className="sm:hidden">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
