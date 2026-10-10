'use client';

import { useEffect, useState, useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { ActionState, YantraData } from '@/lib/schema/yantra';
import { generateYantra } from '@/app/actions';
import { generateParametricYantraData } from '@/lib/yantra-calculator';

import AppHeader from '@/components/app-header';
import YantraForm from '@/components/yantra-form';
import YantraDetails from '@/components/yantra-details';
import { 
  Compass, 
  Telescope, 
  Star, 
  Sun, 
  Orbit, 
  Award, 
  SlidersHorizontal, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import SolarSystemBackground from '@/components/solar-system-background';

const initialState: ActionState = { data: null, error: null };

// Fullscreen loading overlay
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

// Initial empty state
function WelcomeState({ 
  onLoadDemo, 
  onSwitchToConfig 
}: { 
  onLoadDemo?: () => void;
  onSwitchToConfig?: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] py-6 sm:py-10">
      <div className="text-center max-w-lg px-4 space-y-5 sm:space-y-6 animate-rise-fade">
        {/* Hero icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-primary/20 animate-spin-slow" style={{ animationDuration: '40s' }} />
          <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-accent/20 animate-counter-spin" style={{ animationDuration: '30s' }} />
          <div 
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center surface-glass border border-accent/30 shadow-[0_0_40px_hsla(24,90%,55%,0.25)]"
          >
            <Telescope className="h-8 w-8 sm:h-10 sm:w-10 text-primary animate-float" />
          </div>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider text-accent surface-glass border border-accent/25 uppercase">
            <Orbit className="h-3.5 w-3.5 text-accent" />
            Parametric Observatory Engine
          </div>
          <h2 className="font-headline text-2xl sm:text-4xl font-bold tracking-tight text-gradient-gold">
            YantraVis Digital Vault
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Explore 13 precision instruments of 18th-century Indian astronomy with real-time parametric modeling, solar shadows, and CAD export.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {[
            { icon: Star, label: '13 Parametric Yantras' },
            { icon: Sun, label: 'Real-time Solar Shadows' },
            { icon: Compass, label: 'Meridian True North' },
            { icon: Award, label: 'SIH 2025 Edition' },
          ].map(({ icon: Icon, label }) => (
            <div 
              key={label} 
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium surface-glass border border-white/5 text-foreground/80 hover:border-primary/30 transition-colors"
            >
              <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-accent" />
              {label}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          {onLoadDemo && (
            <Button
              onClick={onLoadDemo}
              className="btn-premium h-11 px-5 rounded-xl font-medium text-xs sm:text-sm text-white gap-2 cursor-pointer w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, hsl(24, 85%, 40%), hsl(24, 90%, 50%), hsl(38, 95%, 48%))',
                boxShadow: '0 4px 20px hsla(24, 90%, 55%, 0.3)',
              }}
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch 3D Samrat Yantra Demo</span>
            </Button>
          )}
          {onSwitchToConfig && (
            <Button
              variant="outline"
              onClick={onSwitchToConfig}
              className="h-11 px-5 rounded-xl font-medium text-xs sm:text-sm text-amber-200/90 gap-2 cursor-pointer w-full sm:w-auto md:hidden"
              style={{
                background: 'hsla(225, 35%, 6%, 0.8)',
                border: '1px solid hsla(43, 100%, 52%, 0.25)',
              }}
            >
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              <span>Customize Parameters</span>
            </Button>
          )}
        </div>

        <p className="text-[11px] sm:text-xs text-muted-foreground/75 pt-1">
          Select an instrument and location in the configuration panel, then click{' '}
          <span className="text-accent font-medium">&ldquo;Generate / Recalibrate Model&rdquo;</span> to load its 3D simulation.
        </p>
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
      <Skeleton className="w-full rounded-2xl h-[360px] sm:h-[420px] bg-muted/30 border border-border/20" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
  const [localData, setLocalData] = useState<YantraData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileTab, setMobileTab] = useState<'viewer' | 'config'>('viewer');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  // Load model on mount if explicitly requested via URL search parameters (deep linking)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const yantraParam = params.get('yantra');
      if (yantraParam) {
        const latParam = Number(params.get('latitude'));
        const lonParam = Number(params.get('longitude'));
        const lat = !isNaN(latParam) && latParam !== 0 ? latParam : 26.9124;
        const lon = !isNaN(lonParam) && lonParam !== 0 ? lonParam : 75.7873;
        setLocalData(generateParametricYantraData(yantraParam, lat, lon));
      }
    }
  }, []);

  // Listen for global custom events from header dialogs to switch to 3D viewer view
  useEffect(() => {
    const handleNavigationSwitch = () => {
      setMobileTab('viewer');
    };
    window.addEventListener('select-yantra', handleNavigationSwitch);
    window.addEventListener('select-location', handleNavigationSwitch);
    return () => {
      window.removeEventListener('select-yantra', handleNavigationSwitch);
      window.removeEventListener('select-location', handleNavigationSwitch);
    };
  }, []);

  const handleFormAction = (formData: FormData) => {
    setIsLoading(true);
    setMobileTab('viewer');
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

  const handleLoadDemo = (yantraId = 'samrat') => {
    setIsLoading(true);
    startTransition(() => {
      const demoData = generateParametricYantraData(yantraId, 26.9124, 75.7873);
      setLocalData(demoData);
      setState({ data: demoData, error: null });
      setMobileTab('viewer');
      setIsLoading(false);
      toast({
        title: 'Samrat Yantra Calibrated',
        description: 'Interactive 3D model loaded for Jaipur coordinates (26.9124° N, 75.7873° E).',
      });
    });
  };

  useEffect(() => {
    if (state.error) {
      toast({ variant: 'destructive', title: 'Notice', description: state.error });
    }
    if (state.data) {
      setLocalData(state.data);
    }
  }, [state, toast]);

  const displayData = state.data || localData;
  const isProcessing = isLoading || isPending;

  return (
    <div className="flex flex-col h-[100dvh] min-h-[100dvh] bg-black text-foreground overflow-hidden selection:bg-primary/30 selection:text-primary-foreground">
      <SolarSystemBackground />
      {isProcessing && <LoadingOverlay />}
      <AppHeader />

      {/* Mobile view switcher tab bar (phones & compact screens < 768px) */}
      <div className="md:hidden px-3 pt-2 pb-1 shrink-0 z-20">
        <div className="grid grid-cols-2 p-1 rounded-xl surface-glass border border-white/10 shadow-lg max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setMobileTab('viewer')}
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300",
              mobileTab === 'viewer'
                ? "bg-primary/20 text-accent border border-accent/30 shadow-md font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Telescope className="h-3.5 w-3.5" />
            <span>3D Model</span>
            {displayData && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('config')}
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300",
              mobileTab === 'config'
                ? "bg-primary/20 text-accent border border-accent/30 shadow-md font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Configure</span>
          </button>
        </div>
      </div>

      <main className="flex-1 min-h-0 relative z-10 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left panel — Config & Parameters */}
        <div 
          className={cn(
            "h-full overflow-hidden border-r border-border/30 bg-card/40 backdrop-blur-sm transition-all duration-300 ease-in-out relative",
            // Mobile visibility
            mobileTab === 'config' ? 'flex flex-col flex-1 w-full' : 'hidden',
            // Tablet / Desktop layout
            'md:flex md:flex-col',
            sidebarCollapsed 
              ? 'md:w-0 md:opacity-0 md:pointer-events-none md:border-r-0' 
              : 'md:w-[340px] lg:w-[380px] xl:w-[420px] 2xl:w-[450px] md:opacity-100 md:shrink-0'
          )}
        >
          {/* Panel ambient lighting */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, hsla(24, 90%, 55%, 0.05) 0%, transparent 60%)' }} 
          />

          {/* Desktop collapse toolbar */}
          <div className="hidden md:flex items-center justify-between px-4 py-2.5 border-b border-border/20 shrink-0 bg-background/20 relative z-10">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Parameters</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(true)}
              className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1 rounded-lg hover:bg-primary/10"
              title="Collapse panel for larger 3D workspace"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Collapse</span>
            </Button>
          </div>

          <ScrollArea className="flex-1 h-full">
            <div className="p-3 sm:p-5 lg:p-6 pb-20 md:pb-6 relative z-10 max-w-md mx-auto md:max-w-none w-full">
              <YantraForm
                action={handleFormAction}
                isPending={isProcessing}
                activeYantraId={displayData?.yantraId}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Right panel — 3D Viewer, Controls & Details */}
        <div 
          className={cn(
            "relative h-full overflow-hidden bg-background/30 backdrop-blur-[2px] transition-all duration-300 ease-in-out",
            // Mobile visibility
            mobileTab === 'viewer' ? 'flex flex-col flex-1 w-full' : 'hidden',
            // Tablet / Desktop layout
            'md:flex md:flex-col md:flex-1 md:min-w-0'
          )}
        >
          {/* Ambient lighting seam */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 85% 15%, hsla(43, 100%, 52%, 0.04) 0%, transparent 65%)' }} 
          />

          {/* Floating Reopen Button if sidebar is collapsed on desktop / tablet */}
          {sidebarCollapsed && (
            <div className="hidden md:block absolute top-4 left-4 z-30 animate-in fade-in duration-200">
              <Button
                onClick={() => setSidebarCollapsed(false)}
                className="h-9 px-3.5 rounded-xl text-xs gap-2 shadow-2xl cursor-pointer btn-premium"
                style={{
                  background: 'linear-gradient(135deg, hsla(225, 45%, 6%, 0.95), hsla(225, 35%, 10%, 0.9))',
                  border: '1px solid hsla(43, 100%, 52%, 0.35)',
                  color: 'hsl(38, 100%, 85%)',
                  boxShadow: '0 4px 25px hsla(0, 0%, 0%, 0.5)',
                }}
              >
                <PanelLeftOpen className="h-4 w-4 text-accent" />
                <span>Show Parameters</span>
              </Button>
            </div>
          )}

          {/* Mobile quick indicator: jump to config */}
          {displayData && (
            <div className="md:hidden px-3 pt-2 shrink-0 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate pr-2">
                <Compass className="h-3 w-3 text-accent shrink-0" />
                <span className="truncate">Active: <strong className="text-foreground font-semibold">{displayData.yantraName}</strong></span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileTab('config')}
                className="h-7 px-2.5 text-[11px] text-accent gap-1 hover:bg-primary/10 rounded-lg shrink-0"
              >
                <SlidersHorizontal className="h-3 w-3" />
                Edit
              </Button>
            </div>
          )}

          <ScrollArea className="flex-1 h-full">
            <div className="p-3 sm:p-5 lg:p-6 max-w-5xl 2xl:max-w-6xl mx-auto w-full relative z-10 pb-12 sm:pb-6">
              {isProcessing ? (
                <LoadingSkeleton />
              ) : displayData ? (
                <div className={cn("transition-opacity duration-500", displayData ? 'opacity-100' : 'opacity-0')}>
                  <YantraDetails 
                    key={`details-${displayData.yantraId}-${displayData.location.latitude}-${displayData.location.longitude}`} 
                    data={displayData} 
                  />
                </div>
              ) : (
                <WelcomeState 
                  onLoadDemo={() => handleLoadDemo('samrat')}
                  onSwitchToConfig={() => setMobileTab('config')}
                />
              )}
            </div>
          </ScrollArea>
        </div>

      </main>
    </div>
  );
}
