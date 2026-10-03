'use client';

import { useState } from 'react';
import { Telescope, Star, Compass, Landmark, Sparkles, ExternalLink, Menu, BookOpen, Layers } from 'lucide-react';
import { YANTRAS } from '@/lib/yantras';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const OBSERVATORIES = [
  {
    name: 'Jantar Mantar, Jaipur',
    state: 'Rajasthan',
    lat: 26.9239,
    lon: 75.8267,
    highlight: 'UNESCO World Heritage Site with the world’s largest stone sundial (Vrihat Samrat Yantra).',
  },
  {
    name: 'Jantar Mantar, New Delhi',
    state: 'National Capital Territory',
    lat: 28.6271,
    lon: 77.2166,
    highlight: 'First observatory built by Maharaja Jai Singh II in 1724 with 4 primary instruments.',
  },
  {
    name: 'Vedh Shala, Ujjain',
    state: 'Madhya Pradesh',
    lat: 23.1765,
    lon: 75.7725,
    highlight: 'Ancient prime meridian of Indian astronomy (0° Greenwich of ancient Hindu astronomers).',
  },
  {
    name: 'Man Mahal Observatory, Varanasi',
    state: 'Uttar Pradesh',
    lat: 25.3076,
    lon: 83.0084,
    highlight: 'Rooftop observatory on the banks of the sacred Ganges overlooking the river ghats.',
  },
  {
    name: 'Jantar Mantar, Mathura',
    state: 'Uttar Pradesh',
    lat: 27.4924,
    lon: 77.6737,
    highlight: 'Historic observatory on the old fort of Kans Qila, reconstructed for astronomical research.',
  },
];

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [instrumentsOpen, setInstrumentsOpen] = useState(false);
  const [observatoriesOpen, setObservatoriesOpen] = useState(false);

  const handleSelectYantra = (id: string) => {
    window.dispatchEvent(new CustomEvent('select-yantra', { detail: { yantraId: id } }));
    setInstrumentsOpen(false);
  };

  const handleSelectObservatory = (obs: typeof OBSERVATORIES[0]) => {
    window.dispatchEvent(
      new CustomEvent('select-location', {
        detail: { lat: obs.lat, lon: obs.lon, name: obs.name.split(',')[1]?.trim() || obs.name }
      })
    );
    setObservatoriesOpen(false);
  };

  return (
    <header className="shrink-0 w-full z-40 bg-[#070c18]/95 backdrop-blur-2xl border-b border-amber-500/20 relative shadow-[0_4px_24px_rgba(0,0,0,0.6)] select-none">
      {/* Radiant ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 120% at 50% -30%, hsla(24, 90%, 55%, 0.12) 0%, transparent 75%)',
        }}
      />

      {/* Golden gradient bottom rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1.5px]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsla(24, 90%, 55%, 0.5), hsla(43, 100%, 52%, 0.9), hsla(24, 90%, 55%, 0.5), transparent)',
        }}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
              {/* Outer Orbit ring */}
              <div className="absolute inset-0 rounded-full border border-primary/30 animate-spin-slow pointer-events-none" />
              {/* Inner Orbit ring */}
              <div className="absolute inset-1 rounded-full border border-accent/25 animate-counter-spin pointer-events-none" />
              {/* Center Icon */}
              <div
                className="relative w-7 h-7 flex items-center justify-center rounded-lg shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, hsla(24, 90%, 50%, 0.3), hsla(43, 100%, 52%, 0.22))',
                  border: '1px solid hsla(43, 100%, 52%, 0.45)',
                  boxShadow: '0 0 16px hsla(24, 90%, 55%, 0.3), inset 0 1px 0 hsla(255, 100%, 100%, 0.2)',
                }}
              >
                <Telescope className="h-4 w-4" style={{ color: 'hsl(38, 100%, 65%)' }} />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span
                className="font-headline text-lg sm:text-xl font-bold tracking-wider leading-none"
                style={{
                  background: 'linear-gradient(135deg, hsl(38, 100%, 75%), hsl(24, 95%, 65%), hsl(43, 100%, 55%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 10px hsla(43, 100%, 52%, 0.35))',
                }}
              >
                YantraVis
              </span>
              <span className="text-[9px] sm:text-[10px] font-body font-semibold tracking-[0.22em] uppercase text-amber-200/70 leading-none mt-1">
                Observational Astronomy
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            
            {/* Instruments Directory Dialog */}
            <Dialog open={instrumentsOpen} onOpenChange={setInstrumentsOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all border border-transparent hover:border-amber-500/20 cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5 text-amber-400" />
                  <span>Instruments</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    13
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-[#090e1c] border-amber-500/30 text-foreground max-h-[85vh] p-0 flex flex-col">
                <DialogHeader className="p-6 pb-3 border-b border-white/10">
                  <DialogTitle className="font-headline text-xl text-amber-300 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-amber-400" />
                    13 Ancient Indian Astronomical Yantras
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Click any instrument below to instantly render its parametric 3D model and celestial mathematics.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 p-6 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                    {YANTRAS.map((yantra) => (
                      <button
                        key={yantra.id}
                        type="button"
                        onClick={() => handleSelectYantra(yantra.id)}
                        className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-amber-500/50 hover:bg-amber-500/[0.08] transition-all flex flex-col gap-1.5 text-left group cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <yantra.Icon className="h-4 w-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                            <h4 className="font-headline text-sm font-semibold text-foreground/95 group-hover:text-amber-300 transition-colors">
                              {yantra.name}
                            </h4>
                          </div>
                          <span className="text-[10px] text-amber-400/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                            View 3D →
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {yantra.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* Observatories Dialog */}
            <Dialog open={observatoriesOpen} onOpenChange={setObservatoriesOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all border border-transparent hover:border-amber-500/20 cursor-pointer"
                >
                  <Landmark className="h-3.5 w-3.5 text-amber-400" />
                  <span>Observatories</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-muted-foreground">
                    5
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl bg-[#090e1c] border-amber-500/30 text-foreground max-h-[85vh] p-0 flex flex-col">
                <DialogHeader className="p-6 pb-3 border-b border-white/10">
                  <DialogTitle className="font-headline text-xl text-amber-300 flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-amber-400" />
                    Historic Jantar Mantar Observatories
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Click any observatory below to recalibrate the instruments for its exact geographic coordinates.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 p-6 pt-3">
                  <div className="space-y-3 pb-4">
                    {OBSERVATORIES.map((obs) => (
                      <button
                        key={obs.name}
                        type="button"
                        onClick={() => handleSelectObservatory(obs)}
                        className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:border-amber-500/50 hover:bg-amber-500/[0.08] transition-all space-y-1.5 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-headline text-sm font-semibold text-foreground group-hover:text-amber-300 transition-colors">
                            {obs.name}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {obs.lat.toFixed(4)}° N, {obs.lon.toFixed(4)}° E
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {obs.highlight}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* Heritage & Science Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all border border-transparent hover:border-amber-500/20"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Heritage & Math</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl bg-[#090e1c] border-amber-500/30 text-foreground p-6">
                <DialogHeader className="pb-3 border-b border-white/10">
                  <DialogTitle className="font-headline text-xl text-amber-300 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Celestial Mathematics of Yantras
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    How ancient trigonometric architecture translates celestial motions into precise measurements.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-3 text-xs leading-relaxed text-muted-foreground">
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <strong className="block font-semibold mb-1">True North & Latitude Calibration:</strong>
                    Every Yantra is physically aligned to True Astronomical North. The gnomon triangular angle of the Samrat Yantra is constructed to match the local geographical latitude (Φ) exactly.
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-headline text-sm font-semibold text-foreground">Core Astronomical Formulas:</h5>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Solar Declination (δ):</strong> Calibrated using ecliptic longitude from the vernal equinox.</li>
                      <li><strong>Hour Angle (h):</strong> Time offset from local solar noon, measured directly along the quadrant scales.</li>
                      <li><strong>Shadow Projection:</strong> Dynamic cast computed via ray-plane intersections in 3D Euclidean space.</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

          </nav>

          {/* Right Badges & External Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* SIH 2025 Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: 'hsla(43, 100%, 52%, 0.12)',
                border: '1px solid hsla(43, 100%, 52%, 0.4)',
                color: 'hsl(43, 100%, 62%)',
                boxShadow: '0 0 12px hsla(43, 100%, 52%, 0.15)',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>SIH 2025</span>
            </div>

            {/* GitHub Project Link */}
            <a
              href="https://github.com/monkeysoul-cmd/YantraVis"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/80 hover:text-foreground bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all hover:border-amber-500/30"
            >
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
              <span>GitHub</span>
            </a>

            {/* Mobile Menu Sheet */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-lg border border-white/10 text-foreground/80 hover:text-foreground"
                    aria-label="Open Navigation Menu"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] bg-[#090e1c] border-l border-amber-500/30 text-foreground p-0 flex flex-col"
                >
                  <SheetHeader className="p-5 pb-3 border-b border-white/10">
                    <SheetTitle className="font-headline text-lg text-amber-300 flex items-center gap-2">
                      <Telescope className="h-4 w-4 text-amber-400" />
                      YantraVis
                    </SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground">
                      Navigation & Astronomical Directory
                    </SheetDescription>
                  </SheetHeader>
                  <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Directory</p>
                      <div className="space-y-1">
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                          <span className="text-xs font-medium">Instruments</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">13 Models</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                          <span className="text-xs font-medium">Observatories</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-muted-foreground">5 Sites</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href="https://github.com/monkeysoul-cmd/YantraVis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View Repository on GitHub</span>
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
