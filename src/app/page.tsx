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
import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { SAMRAT_JAIPUR_DATA } from '@/lib/pre-generated/samrat-jaipur';
import { RAMA_JAIPUR_DATA } from '@/lib/pre-generated/rama-jaipur';
import { JAI_PRAKASH_JAIPUR_DATA } from '@/lib/pre-generated/jai-prakash-jaipur';
import { RASIVALAYA_JAIPUR_DATA } from '@/lib/pre-generated/rasivalaya-jaipur';
import { DIGAMSA_JAIPUR_DATA } from '@/lib/pre-generated/digamsa-jaipur';
import { DHRUVA_PROTHA_CHAKRA_JAIPUR_DATA } from '@/lib/pre-generated/dhruva-protha-chakra-jaipur';
import { YANTRA_SAMRAT_COMBO_JAIPUR_DATA } from '@/lib/pre-generated/yantra-samrat-combo-jaipur';
import { GOLAYANTRA_CHAKRA_JAIPUR_DATA } from '@/lib/pre-generated/golayantra-chakra-jaipur';
import { BHITTI_JAIPUR_DATA } from '@/lib/pre-generated/bhitti-jaipur';
import { DAKSHINOTTARA_BHITTI_JAIPUR_DATA } from '@/lib/pre-generated/dakshinottara-bhitti-jaipur';
import { NADI_VALAYA_JAIPUR_DATA } from '@/lib/pre-generated/nadi-valaya-jaipur';
import { PALAKA_JAIPUR_DATA } from '@/lib/pre-generated/palaka-jaipur';
import { CHAAPA_JAIPUR_DATA } from '@/lib/pre-generated/chaapa-jaipur';
import { ScrollArea } from '@/components/ui/scroll-area';

const CACHE_KEY = 'yantravis-last-data';
const PRE_GENERATED_DATA: Record<string, YantraData> = {
    'samrat-26.9124-75.7873': SAMRAT_JAIPUR_DATA,
    'rama-26.9124-75.7873': RAMA_JAIPUR_DATA,
    'jai-prakash-26.9124-75.7873': JAI_PRAKASH_JAIPUR_DATA,
    'rasivalaya-26.9124-75.7873': RASIVALAYA_JAIPUR_DATA,
    'digamsa-26.9124-75.7873': DIGAMSA_JAIPUR_DATA,
    'dhruva-protha-chakra-26.9124-75.7873': DHRUVA_PROTHA_CHAKRA_JAIPUR_DATA,
    'yantra-samrat-combo-26.9124-75.7873': YANTRA_SAMRAT_COMBO_JAIPUR_DATA,
    'golayantra-chakra-26.9124-75.7873': GOLAYANTRA_CHAKRA_JAIPUR_DATA,
    'bhitti-26.9124-75.7873': BHITTI_JAIPUR_DATA,
    'dakshinottara-bhitti-26.9124-75.7873': DAKSHINOTTARA_BHITTI_JAIPUR_DATA,
    'nadi-valaya-26.9124-75.7873': NADI_VALAYA_JAIPUR_DATA,
    'palaka-26.9124-75.7873': PALAKA_JAIPUR_DATA,
    'chaapa-26.9124-75.7873': CHAAPA_JAIPUR_DATA,
};


const initialState: ActionState = {
  data: null,
  error: null,
};

export default function Home() {
  const [state, formAction] = useActionState(generateYantra, initialState);
  const [localData, setLocalData] = useState<YantraData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Load data from localStorage on initial client-side render
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setLocalData(parsedData);
      } else {
        // If no cached data, load the pre-generated default
        setLocalData(SAMRAT_JAIPUR_DATA);
      }
    } catch (error) {
      console.error("Failed to load cached yantra data:", error);
      // Fallback to pre-generated data on error
      setLocalData(SAMRAT_JAIPUR_DATA);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (state.data) {
      setLocalData(state.data);
      // Save successful generation to localStorage
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(state.data));
      } catch (error) {
        console.error("Failed to cache yantra data:", error);
      }
    }
  }, [state, toast]);
  
  const handleFormAction = (formData: FormData) => {
    const validatedFields = YantraGenerationFormSchema.safeParse({
        latitude: formData.get('latitude'),
        longitude: formData.get('longitude'),
        yantra: formData.get('yantra'),
    });

    if (validatedFields.success) {
        const { latitude, longitude, yantra } = validatedFields.data;
        const preGenKey = `${yantra}-${latitude.toFixed(4)}-${longitude.toFixed(4)}`;
        
        if (PRE_GENERATED_DATA[preGenKey]) {
            startTransition(() => {
                setLocalData(PRE_GENERATED_DATA[preGenKey]);
                localStorage.setItem(CACHE_KEY, JSON.stringify(PRE_GENERATED_DATA[preGenKey]));
            });
            return;
        }
    }
    
    // Fallback to server action
    startTransition(() => {
        formAction(formData);
    });
  };

  const displayData = state.data || localData;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start overflow-hidden">
        <aside className="lg:col-span-1 h-full">
            <ScrollArea className="h-full pr-6">
                <YantraForm action={handleFormAction} isPending={isPending} />
            </ScrollArea>
        </aside>
        <ScrollArea className="lg:col-span-2 h-full">
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
    </div>
  );
}
