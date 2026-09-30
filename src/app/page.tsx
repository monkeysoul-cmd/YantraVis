'use client';

import { useEffect, useState, useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { ActionState, YantraData } from '@/lib/schema/yantra';
import { generateYantra } from '@/app/actions';

import AppHeader from '@/components/app-header';
import YantraForm from '@/components/yantra-form';
import YantraDetails from '@/components/yantra-details';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, Loader2, ChevronsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { generateParametricYantraData } from '@/lib/yantra-calculator';

const CACHE_KEY = 'yantravis-last-data';

const defaultYantra = generateParametricYantraData('samrat', 26.9124, 75.7873);

const initialState: ActionState = {
  data: defaultYantra,
  error: null,
};

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
          description: 'Failed to calculate instrument data. Falling back to local model.',
        });
      } finally {
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    // Check if there is cached data from previous session
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.yantraId) {
          setLocalData(parsed);
        }
      }
    } catch {
      // Ignore cache parse error
    }
  }, []);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Notice',
        description: state.error,
      });
      setIsSheetOpen(false);
    }
    if (state.data) {
      setLocalData(state.data);
      if (isMobile) {
        setIsSheetOpen(true);
      }
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(state.data));
      } catch (error) {
        console.error("Failed to cache yantra data:", error);
      }
    }
  }, [state, toast, isMobile]);

  const displayData = state.data || localData || defaultYantra;

  const renderContent = () => {
    if (isMobile) {
      return (
        <div className="container mx-auto p-4 flex-grow overflow-hidden flex flex-col">
            <ScrollArea className="flex-grow">
              <YantraForm action={handleFormAction} isPending={isPending || isLoading} />
            </ScrollArea>
            {displayData && (
              <>
                <div className="fixed bottom-6 right-6 z-20">
                  <Button 
                    onClick={() => setIsSheetOpen(true)} 
                    className="rounded-full h-14 w-14 shadow-xl shadow-primary/40 flex items-center justify-center animate-bounce bg-primary text-primary-foreground hover:bg-primary/90"
                    aria-label="Show Details"
                  >
                    <ChevronsUp className="h-6 w-6" />
                  </Button>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetContent side="bottom" className="h-[92vh] p-0 bg-background/95 backdrop-blur-xl border-t border-white/10">
                    <SheetHeader className="p-4 border-b border-white/10">
                      <SheetTitle className="font-headline text-xl text-primary">{displayData.yantraName}</SheetTitle>
                      <SheetDescription className="text-xs">
                        Lat: {displayData.location.latitude.toFixed(4)}°, Lon: {displayData.location.longitude.toFixed(4)}°
                      </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(92vh-80px)] p-4">
                      <YantraDetails data={displayData} />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </>
            )}
        </div>
      );
    }

    return (
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start min-h-0 overflow-y-auto lg:overflow-hidden">
        <aside className="lg:col-span-1 lg:h-full lg:max-h-[calc(100vh-110px)]">
            <ScrollArea className="h-full pr-2 lg:pr-4">
                <YantraForm action={handleFormAction} isPending={isPending || isLoading} />
            </ScrollArea>
        </aside>
        <ScrollArea className="lg:col-span-2 lg:h-full lg:max-h-[calc(100vh-110px)]">
            <div className="pr-2 lg:pr-4">
            {isLoading || isPending ? (
              <Card className="glass-card border-none">
                  <CardContent className="p-6 space-y-4">
                      <Skeleton className="h-8 w-1/2 bg-white/10" />
                      <Skeleton className="h-4 w-3/4 bg-white/10" />
                      <Skeleton className="aspect-video w-full bg-white/10" />
                      <Skeleton className="h-24 w-full bg-white/10" />
                  </CardContent>
              </Card>
            ) : (
              <>
                <div className={cn("transition-opacity duration-500", displayData ? 'opacity-100' : 'opacity-0' )}>
                    {displayData && (
                        <YantraDetails data={displayData} />
                    )}
                </div>
                {!displayData && (
                  <Card className="min-h-[70vh] flex items-center justify-center transition-opacity duration-500 ease-in-out glass-card border border-white/5">
                      <CardContent className="text-center text-muted-foreground p-8 max-w-lg">
                          <div className="relative inline-block mb-6">
                            <Compass className="h-24 w-24 text-primary animate-pulse" />
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10" />
                          </div>
                          <h2 className="font-headline text-3xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-300 to-accent">
                            Welcome to YantraVis
                          </h2>
                          <p className="mt-4 text-foreground/80 leading-relaxed text-sm md:text-base">
                            Select an ancient astronomical instrument and specify any location in India. YantraVis calculates real-time parametric dimensions, true meridian alignment, and interactive 3D solar simulations.
                          </p>
                          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                            <span className="px-3 py-1 rounded-full bg-secondary/50 border border-white/5">✨ Parametric CAD</span>
                            <span className="px-3 py-1 rounded-full bg-secondary/50 border border-white/5">☀️ Solar Shadow</span>
                            <span className="px-3 py-1 rounded-full bg-secondary/50 border border-white/5">🧭 True North</span>
                          </div>
                      </CardContent>
                  </Card>
                )}
              </>
            )}
            </div>
        </ScrollArea>
      </main>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {isPending && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4 text-center p-8 rounded-2xl glass-card border border-primary/30 shadow-2xl max-w-md mx-4">
            <div className="relative">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <Compass className="h-8 w-8 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-headline font-semibold text-foreground">Computing Astronomical Alignments</p>
              <p className="text-sm text-muted-foreground">Generating parametric dimensions, true north angles & solar geometry...</p>
            </div>
          </div>
        </div>
      )}
      <AppHeader />
      {renderContent()}
    </div>
  );
}
