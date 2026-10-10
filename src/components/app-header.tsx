'use client';

import { useState } from 'react';
import { Telescope, Star, Compass, Landmark, BookOpen, ExternalLink, Menu, Layers } from 'lucide-react';
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
    highlight: "UNESCO World Heritage Site with the world's largest stone sundial (Vrihat Samrat Yantra).",
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
  const [heritageOpen, setHeritageOpen] = useState(false);

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
    <header className="shrink-0 w-full z-40 header-glass relative select-none"
      style={{
        borderBottom: '1px solid hsla(24, 85%, 42%, 0.12)',
        boxShadow: '0 4px 30px hsla(0, 0%, 0%, 0.5), 0 1px 0 hsla(24, 90%, 55%, 0.05) inset',
      }}>

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 150% at 50% -50%, hsla(24, 90%, 55%, 0.10) 0%, transparent 70%)',
        }}
      />

      {/* Animated golden bottom rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, hsla(24, 90%, 55%, 0.4) 25%, hsla(43, 100%, 52%, 0.8) 50%, hsla(24, 90%, 55%, 0.4) 75%, transparent 95%)',
        }}
      />
      {/* Secondary subtle glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, transparent 15%, hsla(43, 100%, 52%, 0.06) 50%, transparent 85%)',
          filter: 'blur(2px)',
        }}
      />

      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex h-[56px] sm:h-[60px] items-center justify-between gap-2 sm:gap-4">
          
          {/* Branding */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 group cursor-default">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center">
              {/* Outer Orbit ring */}
              <div className="absolute inset-0 rounded-full border border-primary/30 animate-spin-slow pointer-events-none" />
              {/* Inner Orbit ring */}
              <div className="absolute inset-1 rounded-full border border-accent/25 animate-counter-spin pointer-events-none" />
              {/* Center Icon */}
              <div
                className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, hsla(24, 90%, 50%, 0.3), hsla(43, 100%, 52%, 0.22))',
                  border: '1px solid hsla(43, 100%, 52%, 0.45)',
                  boxShadow: '0 0 16px hsla(24, 90%, 55%, 0.3), inset 0 1px 0 hsla(255, 100%, 100%, 0.2)',
                }}
              >
                <Telescope className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: 'hsl(38, 100%, 65%)' }} />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span
                className="font-headline text-base sm:text-xl font-bold tracking-wider leading-none"
                style={{
                  background: 'linear-gradient(135deg, hsl(38, 100%, 78%), hsl(24, 95%, 65%), hsl(43, 100%, 58%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 12px hsla(43, 100%, 52%, 0.3))',
                }}
              >
                YantraVis
              </span>
              <span className="text-[8px] sm:text-[10px] font-body font-semibold tracking-[0.16em] sm:tracking-[0.22em] uppercase text-amber-200/70 leading-none mt-0.5 sm:mt-1 truncate max-w-[130px] sm:max-w-none">
                Observational Astronomy
              </span>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            
            {/* Instruments Directory Dialog */}
            <Dialog open={instrumentsOpen} onOpenChange={setInstrumentsOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  style={{
                    color: 'hsla(38, 25%, 80%, 0.8)',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(38, 100%, 85%)';
                    e.currentTarget.style.background = 'hsla(24, 90%, 55%, 0.06)';
                    e.currentTarget.style.borderColor = 'hsla(24, 90%, 55%, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'hsla(38, 25%, 80%, 0.8)';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <Layers className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 58%)' }} />
                  <span>Instruments</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: 'hsla(43, 100%, 52%, 0.1)',
                      border: '1px solid hsla(43, 100%, 52%, 0.25)',
                      color: 'hsl(43, 100%, 60%)',
                    }}>
                    13
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="w-[94vw] sm:w-full max-w-2xl max-h-[85vh] p-0 flex flex-col border-0"
                style={{
                  background: 'linear-gradient(135deg, hsl(225, 45%, 4%), hsl(225, 40%, 6%))',
                  border: '1px solid hsla(24, 85%, 42%, 0.2)',
                  boxShadow: '0 25px 80px hsla(0, 0%, 0%, 0.6), 0 0 40px hsla(24, 90%, 55%, 0.08)',
                }}>
                <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4" style={{ borderBottom: '1px solid hsla(225, 22%, 14%, 0.8)' }}>
                  <DialogTitle className="font-headline text-xl flex items-center gap-2.5"
                    style={{
                      background: 'linear-gradient(135deg, hsl(24, 90%, 65%), hsl(43, 100%, 58%))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    <Compass className="h-5 w-5" style={{ color: 'hsl(43, 100%, 58%)' }} />
                    13 Ancient Indian Astronomical Yantras
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-1">
                    Click any instrument below to render its parametric 3D model with celestial mathematics.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 p-6 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-4">
                    {YANTRAS.map((yantra) => (
                      <button
                        key={yantra.id}
                        type="button"
                        onClick={() => handleSelectYantra(yantra.id)}
                        className="instrument-card p-3.5 rounded-xl transition-all flex flex-col gap-1.5 text-left group cursor-pointer"
                        style={{
                          background: 'hsla(225, 35%, 7%, 0.8)',
                          border: '1px solid hsla(225, 22%, 14%, 0.6)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'hsla(43, 100%, 52%, 0.35)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.06), hsla(43, 100%, 52%, 0.04))';
                          e.currentTarget.style.boxShadow = '0 8px 25px hsla(0, 0%, 0%, 0.2), 0 0 15px hsla(24, 90%, 55%, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'hsla(225, 22%, 14%, 0.6)';
                          e.currentTarget.style.background = 'hsla(225, 35%, 7%, 0.8)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <yantra.Icon className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform duration-300"
                              style={{ color: 'hsl(43, 100%, 58%)' }} />
                            <h4 className="font-headline text-sm font-semibold transition-colors duration-200"
                              style={{ color: 'hsla(38, 25%, 88%, 0.9)' }}>
                              {yantra.name}
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0"
                            style={{ color: 'hsl(43, 100%, 58%)' }}>
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
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer"
                  style={{
                    color: 'hsla(38, 25%, 80%, 0.8)',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(38, 100%, 85%)';
                    e.currentTarget.style.background = 'hsla(24, 90%, 55%, 0.06)';
                    e.currentTarget.style.borderColor = 'hsla(24, 90%, 55%, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'hsla(38, 25%, 80%, 0.8)';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <Landmark className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 58%)' }} />
                  <span>Observatories</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: 'hsla(225, 28%, 14%, 0.6)',
                      border: '1px solid hsla(225, 22%, 18%, 0.8)',
                      color: 'hsla(38, 15%, 60%, 0.9)',
                    }}>
                    5
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="w-[94vw] sm:w-full max-w-xl max-h-[85vh] p-0 flex flex-col border-0"
                style={{
                  background: 'linear-gradient(135deg, hsl(225, 45%, 4%), hsl(225, 40%, 6%))',
                  border: '1px solid hsla(24, 85%, 42%, 0.2)',
                  boxShadow: '0 25px 80px hsla(0, 0%, 0%, 0.6), 0 0 40px hsla(24, 90%, 55%, 0.08)',
                }}>
                <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4" style={{ borderBottom: '1px solid hsla(225, 22%, 14%, 0.8)' }}>
                  <DialogTitle className="font-headline text-xl flex items-center gap-2.5"
                    style={{
                      background: 'linear-gradient(135deg, hsl(24, 90%, 65%), hsl(43, 100%, 58%))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    <Landmark className="h-5 w-5" style={{ color: 'hsl(43, 100%, 58%)' }} />
                    Historic Jantar Mantar Observatories
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-1">
                    Click any observatory to recalibrate instruments for its exact coordinates.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 p-6 pt-4">
                  <div className="space-y-2.5 pb-4">
                    {OBSERVATORIES.map((obs) => (
                      <button
                        key={obs.name}
                        type="button"
                        onClick={() => handleSelectObservatory(obs)}
                        className="w-full text-left p-4 rounded-xl transition-all duration-300 space-y-1.5 group cursor-pointer"
                        style={{
                          background: 'hsla(225, 35%, 7%, 0.8)',
                          border: '1px solid hsla(225, 22%, 14%, 0.6)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'hsla(43, 100%, 52%, 0.3)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.06), hsla(43, 100%, 52%, 0.04))';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px hsla(0, 0%, 0%, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'hsla(225, 22%, 14%, 0.6)';
                          e.currentTarget.style.background = 'hsla(225, 35%, 7%, 0.8)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-headline text-sm font-semibold group-hover:text-amber-300 transition-colors duration-200"
                            style={{ color: 'hsla(38, 25%, 88%, 0.9)' }}>
                            {obs.name}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md"
                            style={{
                              background: 'hsla(43, 100%, 52%, 0.08)',
                              border: '1px solid hsla(43, 100%, 52%, 0.15)',
                              color: 'hsl(43, 100%, 58%)',
                            }}>
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
            <Dialog open={heritageOpen} onOpenChange={setHeritageOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer"
                  style={{
                    color: 'hsla(38, 25%, 80%, 0.8)',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'hsl(38, 100%, 85%)';
                    e.currentTarget.style.background = 'hsla(24, 90%, 55%, 0.06)';
                    e.currentTarget.style.borderColor = 'hsla(24, 90%, 55%, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'hsla(38, 25%, 80%, 0.8)';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <BookOpen className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 58%)' }} />
                  <span>Heritage & Math</span>
                </button>
              </DialogTrigger>
              <DialogContent className="w-[94vw] sm:w-full max-w-xl max-h-[85vh] p-0 flex flex-col border-0"
                style={{
                  background: 'linear-gradient(135deg, hsl(225, 45%, 4%), hsl(225, 40%, 6%))',
                  border: '1px solid hsla(24, 85%, 42%, 0.2)',
                  boxShadow: '0 25px 80px hsla(0, 0%, 0%, 0.6), 0 0 40px hsla(24, 90%, 55%, 0.08)',
                }}>
                <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4" style={{ borderBottom: '1px solid hsla(225, 22%, 14%, 0.8)' }}>
                  <DialogTitle className="font-headline text-lg sm:text-xl flex items-center gap-2.5"
                    style={{
                      background: 'linear-gradient(135deg, hsl(24, 90%, 65%), hsl(43, 100%, 58%))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    <BookOpen className="h-5 w-5" style={{ color: 'hsl(43, 100%, 58%)' }} />
                    Celestial Mathematics of Yantras
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-1">
                    How ancient trigonometric architecture translates celestial motions into precise measurements.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 p-4 sm:p-6 pt-4">
                  <div className="space-y-4 text-xs leading-relaxed text-muted-foreground pb-4">
                    <div className="p-4 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.08), hsla(43, 100%, 52%, 0.05))',
                        border: '1px solid hsla(24, 90%, 55%, 0.15)',
                      }}>
                      <strong className="block font-semibold mb-1.5" style={{ color: 'hsl(38, 100%, 80%)' }}>
                        True North & Latitude Calibration:
                      </strong>
                      <span style={{ color: 'hsla(38, 25%, 80%, 0.8)' }}>
                        Every Yantra is physically aligned to True Astronomical North. The gnomon triangular angle of the Samrat Yantra is constructed to match the local geographical latitude (Φ) exactly.
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-headline text-sm font-semibold" style={{ color: 'hsla(38, 25%, 90%, 0.9)' }}>
                        Core Astronomical Formulas:
                      </h5>
                      <ul className="list-disc pl-5 space-y-1.5" style={{ color: 'hsla(38, 25%, 75%, 0.7)' }}>
                        <li><strong style={{ color: 'hsl(24, 90%, 62%)' }}>Solar Declination (δ):</strong> Calibrated using ecliptic longitude from the vernal equinox.</li>
                        <li><strong style={{ color: 'hsl(24, 90%, 62%)' }}>Hour Angle (h):</strong> Time offset from local solar noon, measured directly along the quadrant scales.</li>
                        <li><strong style={{ color: 'hsl(24, 90%, 62%)' }}>Shadow Projection:</strong> Dynamic cast computed via ray-plane intersections in 3D Euclidean space.</li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

          </nav>

          {/* Actions and badges */}
          <div className="flex items-center gap-2.5">
            
            {/* SIH 2025 badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold relative overflow-hidden"
              style={{
                background: 'hsla(43, 100%, 52%, 0.08)',
                border: '1px solid hsla(43, 100%, 52%, 0.3)',
                color: 'hsl(43, 100%, 62%)',
                boxShadow: '0 0 15px hsla(43, 100%, 52%, 0.1)',
              }}
            >
              <Star className="h-3 w-3" style={{ color: 'hsl(43, 100%, 60%)' }} />
              <span>SIH 2025</span>
              {/* Shimmer overlay */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsla(43, 100%, 80%, 0.08), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'badge-shimmer 3s ease-in-out infinite',
                }} />
            </div>

            {/* GitHub Project Link */}
            <a
              href="https://github.com/monkeysoul-cmd/YantraVis"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
              style={{
                color: 'hsla(38, 25%, 75%, 0.7)',
                background: 'hsla(225, 28%, 8%, 0.5)',
                border: '1px solid hsla(225, 22%, 14%, 0.6)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'hsl(38, 100%, 85%)';
                e.currentTarget.style.borderColor = 'hsla(24, 90%, 55%, 0.2)';
                e.currentTarget.style.background = 'hsla(24, 90%, 55%, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'hsla(38, 25%, 75%, 0.7)';
                e.currentTarget.style.borderColor = 'hsla(225, 22%, 14%, 0.6)';
                e.currentTarget.style.background = 'hsla(225, 28%, 8%, 0.5)';
              }}
            >
              <ExternalLink className="h-3 w-3" />
              <span>GitHub</span>
            </a>

            {/* Mobile / Tablet Menu Sheet */}
            <div className="lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-lg"
                    style={{
                      border: '1px solid hsla(225, 22%, 14%, 0.6)',
                      color: 'hsla(38, 25%, 80%, 0.8)',
                    }}
                    aria-label="Open Navigation Menu"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] p-0 flex flex-col border-0"
                  style={{
                    background: 'linear-gradient(180deg, hsl(225, 45%, 4%), hsl(225, 40%, 5%))',
                    borderLeft: '1px solid hsla(24, 85%, 42%, 0.15)',
                  }}
                >
                  <SheetHeader className="p-5 pb-4" style={{ borderBottom: '1px solid hsla(225, 22%, 14%, 0.8)' }}>
                    <SheetTitle className="font-headline text-lg flex items-center gap-2.5"
                      style={{
                        background: 'linear-gradient(135deg, hsl(24, 90%, 65%), hsl(43, 100%, 58%))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>
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
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setInstrumentsOpen(true);
                          }}
                          className="w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer hover:bg-primary/10"
                          style={{ background: 'hsla(225, 35%, 7%, 0.8)', border: '1px solid hsla(225, 22%, 14%, 0.6)' }}
                        >
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4" style={{ color: 'hsl(43, 100%, 58%)' }} />
                            <span className="text-xs font-medium" style={{ color: 'hsla(38, 25%, 85%, 0.9)' }}>Instruments</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold"
                            style={{ background: 'hsla(43, 100%, 52%, 0.1)', border: '1px solid hsla(43, 100%, 52%, 0.2)', color: 'hsl(43, 100%, 58%)' }}>
                            13 Models
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setObservatoriesOpen(true);
                          }}
                          className="w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer hover:bg-primary/10"
                          style={{ background: 'hsla(225, 35%, 7%, 0.8)', border: '1px solid hsla(225, 22%, 14%, 0.6)' }}
                        >
                          <div className="flex items-center gap-2">
                            <Landmark className="h-4 w-4" style={{ color: 'hsl(43, 100%, 58%)' }} />
                            <span className="text-xs font-medium" style={{ color: 'hsla(38, 25%, 85%, 0.9)' }}>Observatories</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold"
                            style={{ background: 'hsla(225, 28%, 14%, 0.6)', border: '1px solid hsla(225, 22%, 18%, 0.8)', color: 'hsla(38, 15%, 60%, 0.8)' }}>
                            5 Sites
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setHeritageOpen(true);
                          }}
                          className="w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer hover:bg-primary/10"
                          style={{ background: 'hsla(225, 35%, 7%, 0.8)', border: '1px solid hsla(225, 22%, 14%, 0.6)' }}
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" style={{ color: 'hsl(43, 100%, 58%)' }} />
                            <span className="text-xs font-medium" style={{ color: 'hsla(38, 25%, 85%, 0.9)' }}>Heritage & Math</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold"
                            style={{ background: 'hsla(24, 90%, 55%, 0.1)', border: '1px solid hsla(24, 90%, 55%, 0.2)', color: 'hsl(24, 90%, 62%)' }}>
                            Science
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href="https://github.com/monkeysoul-cmd/YantraVis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-medium transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.12), hsla(43, 100%, 52%, 0.08))',
                          border: '1px solid hsla(24, 90%, 55%, 0.2)',
                          color: 'hsl(24, 90%, 62%)',
                        }}
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
