'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { ActionState, YantraData } from '@/lib/schema/yantra';
import { generateYantra } from '@/app/actions';
import { YantraGenerationFormSchema } from '@/lib/schema/yantra';


import AppHeader from '@/components/app-header';
import YantraForm from '@/components/yantra-form';
import YantraDetails from '@/components/yantra-details';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, Loader2, ChevronsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const CACHE_KEY = 'yantravis-last-data';

const initialState: ActionState = {
  data: null,
  error: null,
};

export default function Home() {
  const [state, formAction] = useActionState(generateYantra, initialState);
  const [localData, setLocalData] = useState<YantraData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Only run on client-side
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
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
  
  const handleFormAction = (formData: FormData) => {
    startTransition(() => {
      setIsFullScreenLoading(true);

      const processRequest = () => {
          formAction(formData);
      };

      setTimeout(() => {
          setIsFullScreenLoading(false);
          processRequest();
      }, 2000);
    });
  };

  const displayData = state.data || localData;

  const renderContent = () => {
    if (isMobile) {
      return (
        <div className="container mx-auto p-4 flex-grow overflow-hidden">
            <ScrollArea className="h-full">
              <YantraForm action={handleFormAction} isPending={isPending} />
            </ScrollArea>
            {displayData && (
              <>
                <div className="fixed bottom-4 right-4 z-20">
                  <Button onClick={() => setIsSheetOpen(true)} className="rounded-full h-14 w-14 shadow-lg animate-in fade-in zoom-in-90">
                    <ChevronsUp />
                    <span className="sr-only">Show Details</span>
                  </Button>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetContent side="bottom" className="h-[95vh]">
                    <ScrollArea className="h-full">
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
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start overflow-hidden">
        <aside className="lg:col-span-1 h-full max-h-[calc(100vh-120px)]">
            <ScrollArea className="h-full pr-6">
                <YantraForm action={handleFormAction} isPending={isPending} />
            </ScrollArea>
        </aside>
        <ScrollArea className="lg:col-span-2 h-full max-h-[calc(100vh-120px)]">
            <div className="pr-6">
            {isLoading ? (
            <Card>
                <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-24 w-full" />
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
                <Card className="min-h-[70vh] flex items-center justify-center transition-opacity duration-500 ease-in-out">
                    <CardContent className="text-center text-muted-foreground p-6">
                        <Compass className="mx-auto h-16 w-16 text-primary/50" />
                        <h2 className="font-headline text-2xl font-semibold text-foreground">Welcome to YantraVis</h2>
                        <p className="mt-2 max-w-sm">Enter a location and select a yantra to generate its 3D model, description, and construction dimensions.</p>
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
    <div className="flex flex-col h-screen bg-background text-foreground">
      {isFullScreenLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <p className="text-lg text-muted-foreground">Generating Yantra...</p>
          </div>
        </div>
      )}
      <AppHeader />
      {renderContent()}
    </div>
  );
}
