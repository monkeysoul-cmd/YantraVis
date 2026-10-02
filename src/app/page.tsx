'use client';

import { useEffect, useState, useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { ActionState, YantraData } from '@/lib/schema/yantra';
import { generateYantra } from '@/app/actions';

import AppHeader from '@/components/app-header';
import YantraForm from '@/components/yantra-form';
import YantraDetails from '@/components/yantra-details';
import { Compass, Telescope, Star, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { generateParametricYantraData } from '@/lib/yantra-calculator';

const CACHE_KEY = 'yantravis-last-data';
const defaultYantra = generateParametricYantraData('samrat', 26.9124, 75.7873);
const initialState: ActionState = { data: defaultYantra, error: null };

// Decorative background mandala
function MandalaBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {/* Large outer ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border opacity-[0.025] animate-spin-slow"
        style={{ borderColor: 'hsl(24, 90%, 55%)' }} />
      {/* Mid ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border opacity-[0.035] animate-counter-spin"
        style={{ borderColor: 'hsl(43, 100%, 52%)' }} />
      {/* Inner ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border opacity-[0.03] animate-spin-slow"
        style={{ borderColor: 'hsl(24, 90%, 55%)', animationDuration: '35s' }} />
      
      {/* Glowing dots at corners */}
      <div className="absolute top-20 right-20 w-2 h-2 rounded-full animate-twinkle" style={{ background: 'hsl(43, 100%, 65%)', boxShadow: '0 0 12px hsl(43, 100%, 65%)' }} />
      <div className="absolute bottom-32 left-16 w-1.5 h-1.5 rounded-full animate-twinkle delay-300" style={{ background: 'hsl(24, 90%, 65%)', boxShadow: '0 0 10px hsl(24, 90%, 65%)' }} />
      <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full animate-twinkle delay-600" style={{ background: 'hsl(43, 100%, 70%)', boxShadow: '0 0 8px hsl(43, 100%, 70%)' }} />
      <div className="absolute top-2/3 left-[20%] w-1 h-1 rounded-full animate-twinkle delay-200" style={{ background: 'hsl(24, 90%, 70%)', boxShadow: '0 0 8px hsl(24, 90%, 70%)' }} />
    </div>
  );
}

// Loading overlay
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-lg flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-5 text-center p-8 rounded-2xl max-w-sm mx-4"
        style={{
          background: 'hsla(220, 32%, 7%, 0.95)',
          border: '1px solid hsla(24, 85%, 42%, 0.3)',
          boxShadow: '0 0 60px hsla(24, 90%, 55%, 0.15), 0 20px 60px hsla(0, 0%, 0%, 0.4)'
        }}>
        {/* Dual ring loader */}
        <div className="loading-ring" />
        {/* Icon centered in ring */}
        <div className="space-y-2 -mt-4">
          <p className="font-headline text-base tracking-wider"
            style={{ color: 'hsl(38, 25%, 88%)' }}>Computing Celestial Alignments</p>
          <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
            Applying geographic coordinates to parametric astronomical formulae…
          </p>
        </div>
        {/* Animated dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{
                background: 'hsl(24, 90%, 55%)',
                animationDelay: `${i * 200}ms`,
                animationDuration: '1s'
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Welcome empty state
function WelcomeState() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-4 space-y-6 animate-rise-fade">
        {/* Decorative telescope icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full border border-primary/20 animate-spin-slow" />
          <div className="absolute w-20 h-20 rounded-full border border-accent/15 animate-counter-spin" />
          <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsla(24, 85%, 42%, 0.2), hsla(43, 100%, 52%, 0.15))',
              border: '1px solid hsla(43, 100%, 52%, 0.3)',
              boxShadow: '0 0 30px hsla(24, 90%, 55%, 0.2)'
            }}>
            <Telescope className="h-8 w-8 animate-float" style={{ color: 'hsl(24, 90%, 62%)' }} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-headline text-3xl font-bold tracking-wider"
            style={{
              background: 'linear-gradient(135deg, hsl(24, 90%, 68%), hsl(38, 95%, 62%), hsl(43, 100%, 56%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            Welcome to YantraVis
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select a location in India and an ancient astronomical instrument from the panel to generate a parametric 3D model with solar shadow simulation.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {[
            { icon: Star, label: '13 Instruments' },
            { icon: Sun, label: 'Solar Shadows' },
            { icon: Compass, label: 'True North' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'hsla(24, 85%, 42%, 0.08)',
                border: '1px solid hsla(24, 85%, 42%, 0.15)',
                color: 'hsl(24, 90%, 60%)'
              }}>
              <Icon className="h-3 w-3" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 space-y-3"
        style={{ background: 'hsla(220, 32%, 7%, 0.9)', border: '1px solid hsla(220, 25%, 14%, 1)' }}>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" style={{ background: 'hsla(220, 25%, 14%, 1)' }} />
          <Skeleton className="h-5 w-20 rounded-full" style={{ background: 'hsla(220, 25%, 14%, 1)' }} />
        </div>
        <Skeleton className="h-9 w-2/3" style={{ background: 'hsla(220, 25%, 14%, 1)' }} />
        <Skeleton className="h-4 w-1/2" style={{ background: 'hsla(220, 25%, 14%, 1)' }} />
      </div>
      <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: '16/9', background: 'hsla(220, 32%, 6%, 0.9)' }} />
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 rounded-lg" style={{ background: 'hsla(220, 25%, 11%, 1)' }} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [state, setState] = useState<ActionState>(initialState);
  const [isPending, startTransition] = useTransition();
  const [localData, setLocalData] = useState<YantraData>(defaultYantra);
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleFormAction = (formData: FormData) => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const res = await generateYantra(state, formData);
        setState(res);
      } catch (err) {
        console.error("Form action failed:", err);
        toast({
          variant: 'destructive',
          title: 'Notice',
          description: 'Failed to calculate instrument data. Using local parametric model.',
        });
      } finally {
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.yantraId) setLocalData(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (state.error) {
      toast({ variant: 'destructive', title: 'Notice', description: state.error });
      setIsSheetOpen(false);
    }
    if (state.data) {
      setLocalData(state.data);
      if (isMobile) setIsSheetOpen(true);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(state.data)); } catch { /* ignore */ }
    }
  }, [state, toast, isMobile]);

  const displayData = state.data || localData || defaultYantra;
  const isProcessing = isLoading || isPending;

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <MandalaBg />
        {isProcessing && <LoadingOverlay />}
        <AppHeader />
        <div className="container mx-auto p-4 flex-grow overflow-hidden flex flex-col relative z-10">
          <ScrollArea className="flex-grow">
            <YantraForm action={handleFormAction} isPending={isProcessing} />
          </ScrollArea>
          {displayData && (
            <>
              <div className="fixed bottom-6 right-6 z-20">
                <Button
                  onClick={() => setIsSheetOpen(true)}
                  className="rounded-full h-14 w-14 shadow-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(24, 85%, 42%), hsl(43, 100%, 52%))',
                    boxShadow: '0 8px 30px hsla(24, 90%, 55%, 0.5)',
                    border: 'none'
                  }}
                  aria-label="Show Details"
                >
                  <Compass className="h-6 w-6 text-white animate-float" />
                </Button>
              </div>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="bottom" className="h-[93vh] p-0 border-t-0"
                  style={{
                    background: 'hsl(222, 35%, 5%)',
                    borderTop: '1px solid hsla(24, 85%, 42%, 0.25)'
                  }}>
                  <SheetHeader className="p-4 pb-3"
                    style={{ borderBottom: '1px solid hsla(220, 25%, 14%, 1)' }}>
                    <SheetTitle className="font-headline text-lg"
                      style={{
                        background: 'linear-gradient(135deg, hsl(24, 90%, 65%), hsl(43, 100%, 55%))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                      {displayData.yantraName}
                    </SheetTitle>
                    <SheetDescription className="text-xs">
                      Lat {displayData.location.latitude.toFixed(4)}° · Lon {displayData.location.longitude.toFixed(4)}°
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(93vh-80px)] p-4">
                    <YantraDetails data={displayData} />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <MandalaBg />
      {isProcessing && <LoadingOverlay />}
      <AppHeader />

      <main className="flex-grow relative z-10 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0">
          
          {/* Left panel — Config */}
          <div className="relative h-full overflow-hidden"
            style={{ borderRight: '1px solid hsla(220, 25%, 12%, 1)' }}>
            {/* Panel inner glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, hsla(24, 90%, 55%, 0.04) 0%, transparent 60%)' }} />
            <ScrollArea className="h-full">
              <div className="p-5 lg:p-6 relative z-10">
                <YantraForm action={handleFormAction} isPending={isProcessing} />
              </div>
            </ScrollArea>
          </div>

          {/* Right panel — Details */}
          <div className="relative h-full overflow-hidden bg-background/50">
            {/* Right panel ambient */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 10%, hsla(43, 100%, 52%, 0.04) 0%, transparent 60%)' }} />
            <ScrollArea className="h-full">
              <div className="p-5 lg:p-6 relative z-10">
                {isProcessing ? (
                  <LoadingSkeleton />
                ) : displayData ? (
                  <div className={cn("transition-opacity duration-500", displayData ? 'opacity-100' : 'opacity-0')}>
                    <YantraDetails data={displayData} />
                  </div>
                ) : (
                  <WelcomeState />
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
}
