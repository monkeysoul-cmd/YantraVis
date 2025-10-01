'use client';

import { useActionState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { ActionState } from '@/lib/schema/yantra';
import { generateYantra } from '@/app/actions';

import AppHeader from '@/components/app-header';
import YantraForm from '@/components/yantra-form';
import YantraDetails from '@/components/yantra-details';
import { Card, CardContent } from '@/components/ui/card';
import { Compass } from 'lucide-react';

const initialState: ActionState = {
  data: null,
  error: null,
};

export default function Home() {
  const [state, formAction] = useActionState(generateYantra, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 sticky top-8">
            <YantraForm action={formAction} />
          </div>
          <div className="lg:col-span-2">
            {state.data ? (
              <YantraDetails data={state.data} />
            ) : (
              <Card className="min-h-[70vh] flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground p-6">
                    <Compass className="mx-auto h-16 w-16 mb-4 text-primary/50" />
                    <h2 className="font-headline text-2xl font-semibold text-foreground">Welcome to YantraVis</h2>
                    <p className="mt-2 max-w-sm">Enter a location and select a yantra to generate its 3D model, AI-powered description, and construction dimensions.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
