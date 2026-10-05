'use client';

import { useEffect, useState, useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { ActionState, YantraData } from '@/lib/schema/yantra';
import { generateYantra } from '@/app/actions';

import { generateParametricYantraData } from '@/lib/yantra-calculator';

import AppHeader from '@/components/app-header';
import YantraForm from '@/components/yantra-form';
import YantraDetails from '@/components/yantra-details';
import { Compass, Telescope, Star, Sun, Sparkles, Orbit, Layers, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const initialState: ActionState = { data: null, error: null };

// Decorative ambient background with celestial sacred geometry
function MandalaBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Background radial glow spots */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 filter blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsla(24, 90%, 55%, 0.35) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full opacity-25 filter blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsla(43, 100%, 52%, 0.25) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full opacity-15 filter blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsla(18, 85%, 52%, 0.2) 0%, transparent 70%)' }}
      />

      {/* Large outer celestial orbital ring */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-dashed opacity-[0.035] animate-spin-slow pointer-events-none"
        style={{ borderColor: 'hsl(43, 100%, 52%)', animationDuration: '120s' }} 
      />
      {/* Mid astronomical coordinate ring */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border opacity-[0.04] animate-counter-spin pointer-events-none"
        style={{ borderColor: 'hsl(24, 90%, 55%)', animationDuration: '90s' }} 
      />
      {/* Inner sacred geometry ring */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-dotted opacity-[0.05] animate-spin-slow pointer-events-none"
        style={{ borderColor: 'hsl(38, 95%, 62%)', animationDuration: '60s' }} 
      />
      
      {/* Starlight accents */}
      <div className="absolute top-24 right-28 w-1.5 h-1.5 rounded-full bg-accent/40 shadow-[0_0_10px_hsl(43,100%,65%)] animate-pulse" />
      <div className="absolute bottom-40 left-24 w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_10px_hsl(24,90%,65%)] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-accent/30 shadow-[0_0_6px_hsl(43,100%,70%)]" />
      <div className="absolute top-2/3 left-1/4 w-1 h-1 rounded-full bg-primary/30 shadow-[0_0_6px_hsl(24,90%,70%)]" />
    </div>
  );
}

// High-end loading overlay with spinning astrolabe rings
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div 
        className="flex flex-col items-center gap-5 text-center p-8 rounded-3xl max-w-sm mx-4 surface-elevated border border-primary/30 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-radial-gold pointer-events-none opacity-40" />
        
        {/* Animated dual astrolabe loader */}
        <div className="relative w-16 h-16 flex items-center justify-center my-2">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-accent/20 border-b-accent animate-counter-spin" />
          <Orbit className="h-6 w-6 text-accent animate-pulse" />
        </div>

        <div className="space-y-2 relative z-10">
          <p className="font-headline text-base font-semibold tracking-wide text-foreground">
            Recalibrating Geometry
          </p>
          <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
            Applying geographic coordinates to parametric astronomical formulae…
          </p>
        </div>
      </div>
    </div>
  );
}

// Museum showcase empty state
function WelcomeState() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-lg px-4 space-y-6 animate-rise-fade">
        {/* Decorative celestial showcase icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full border border-primary/20 animate-spin-slow" style={{ animationDuration: '40s' }} />
          <div className="absolute w-24 h-24 rounded-full border border-accent/20 animate-counter-spin" style={{ animationDuration: '30s' }} />
          <div 
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center surface-glass border border-accent/30 shadow-[0_0_40px_hsla(24,90%,55%,0.25)]"
          >
            <Telescope className="h-10 w-10 text-primary animate-float" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider text-accent surface-glass border border-accent/25 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Parametric Observatory Engine
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-gradient-gold">
            YantraVis Digital Vault
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Explore 13 precision instruments of 18th-century Indian astronomy with real-time parametric modeling, solar shadows, and CAD export.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 pt-2">
          {[
            { icon: Star, label: '13 Parametric Yantras' },
            { icon: Sun, label: 'Real-time Solar Shadows' },
            { icon: Compass, label: 'Meridian True North' },
            { icon: Award, label: 'SIH 2025 Edition' },
          ].map(({ icon: Icon, label }) => (
            <div 
              key={label} 
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium surface-glass border border-white/5 text-foreground/80 hover:border-primary/30 transition-colors"
            >
              <Icon className="h-3.5 w-3.5 text-accent" />
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
    <div className="space-y-5 animate-pulse">
      <div className="rounded-2xl p-6 space-y-3 surface-elevated border border-border/40">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-28 rounded-full bg-muted/40" />
          <Skeleton className="h-5 w-20 rounded-full bg-muted/40" />
        </div>
        <Skeleton className="h-10 w-2/3 bg-muted/40 rounded-xl" />
        <Skeleton className="h-4 w-1/2 bg-muted/40 rounded-lg" />
      </div>
      <Skeleton className="w-full rounded-2xl h-[420px] bg-muted/30 border border-border/20" />
      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 rounded-xl bg-muted/30" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [state, setState] = useState<ActionState>(initialState);
  const [isPending, startTransition] = useTransition();
  const [localData, setLocalData] = useState<YantraData | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const yantraParam = params.get('yantra');
      const latParam = Number(params.get('latitude'));
      const lonParam = Number(params.get('longitude'));
      if (yantraParam) {
        const lat = !isNaN(latParam) && latParam !== 0 ? latParam : 26.9124;
        const lon = !isNaN(lonParam) && lonParam !== 0 ? lonParam : 75.7873;
        return generateParametricYantraData(yantraParam, lat, lon);
      }
    }
    return generateParametricYantraData('samrat', 26.9124, 75.7873);
  });
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
        const yantraId = (formData.get('yantra') as string) || 'samrat';
        const lat = Number(formData.get('latitude')) || 26.9124;
        const lon = Number(formData.get('longitude')) || 75.7873;
        const fallback = generateParametricYantraData(yantraId, lat, lon);
        setLocalData(fallback);
        setState({ data: fallback, error: null });
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
    if (state.error) {
      toast({ variant: 'destructive', title: 'Notice', description: state.error });
      setIsSheetOpen(false);
    }
    if (state.data) {
      setLocalData(state.data);
      if (isMobile) setIsSheetOpen(true);
    }
  }, [state, toast, isMobile]);

  const displayData = state.data || localData;
  const isProcessing = isLoading || isPending;

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <MandalaBg />
        {isProcessing && <LoadingOverlay />}
        <AppHeader />
        <div className="w-full p-3 sm:p-4 flex-1 min-h-0 overflow-hidden flex flex-col relative z-10">
          <ScrollArea className="flex-grow">
            <div className="max-w-md mx-auto w-full pb-20">
              <YantraForm
                action={handleFormAction}
                isPending={isProcessing}
                activeYantraId={displayData?.yantraId}
              />
            </div>
          </ScrollArea>
          {displayData && (
            <>
              <div className="fixed bottom-6 right-6 z-20">
                <Button
                  onClick={() => setIsSheetOpen(true)}
                  className="rounded-full h-14 w-14 shadow-2xl flex items-center justify-center cursor-pointer btn-premium"
                  style={{
                    boxShadow: '0 8px 30px hsla(24, 90%, 55%, 0.5)',
                  }}
                  aria-label="Show Details"
                >
                  <Compass className="h-6 w-6 text-white animate-float" />
                </Button>
              </div>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent 
                  side="bottom" 
                  className="h-[93vh] p-0 border-t-0 surface-elevated"
                  style={{
                    borderTop: '1px solid hsla(24, 85%, 42%, 0.25)',
                  }}
                >
                  <SheetHeader 
                    className="p-4 pb-3"
                    style={{ borderBottom: '1px solid hsla(225, 22%, 12%, 1)' }}
                  >
                    <SheetTitle className="font-headline text-lg text-gradient-gold">
                      {displayData.yantraName}
                    </SheetTitle>
                    <SheetDescription className="text-xs">
                      Lat {displayData.location.latitude.toFixed(4)}° · Lon {displayData.location.longitude.toFixed(4)}°
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(93vh-80px)] p-3 sm:p-4">
                    <YantraDetails 
                      key={`mobile-${displayData.yantraId}-${displayData.location.latitude}-${displayData.location.longitude}`} 
                      data={displayData} 
                    />
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

      <main className="flex-1 min-h-0 relative z-10 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-0">
          
          {/* Left panel — Config */}
          <div 
            className="relative h-full overflow-hidden border-r border-border/30 bg-card/40 backdrop-blur-sm"
          >
            {/* Panel inner ambient lighting */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, hsla(24, 90%, 55%, 0.05) 0%, transparent 60%)' }} 
            />
            <ScrollArea className="h-full">
              <div className="p-4 sm:p-5 lg:p-6 relative z-10">
                <YantraForm
                  action={handleFormAction}
                  isPending={isProcessing}
                  activeYantraId={displayData?.yantraId}
                />
              </div>
            </ScrollArea>
          </div>

          {/* Right panel — 3D Viewer & Analysis */}
          <div className="relative h-full overflow-hidden bg-background/30 backdrop-blur-[2px]">
            {/* Ambient lighting seam */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 50% at 85% 15%, hsla(43, 100%, 52%, 0.04) 0%, transparent 65%)' }} 
            />
            <ScrollArea className="h-full">
              <div className="p-5 lg:p-6 max-w-5xl mx-auto w-full relative z-10">
                {isProcessing ? (
                  <LoadingSkeleton />
                ) : displayData ? (
                  <div className={cn("transition-opacity duration-500", displayData ? 'opacity-100' : 'opacity-0')}>
                    <YantraDetails 
                      key={`desktop-${displayData.yantraId}-${displayData.location.latitude}-${displayData.location.longitude}`} 
                      data={displayData} 
                    />
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
