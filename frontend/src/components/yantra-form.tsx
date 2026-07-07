'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { YANTRAS } from '@/lib/yantras';
import { Globe, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full text-base py-6 transition-all duration-300" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Globe className="mr-2 h-5 w-5" />
          Generate Yantra
        </>
      )}
    </Button>
  );
}


type YantraFormProps = {
  action: (payload: FormData) => void;
  isPending: boolean;
};

export default function YantraForm({ action, isPending }: YantraFormProps) {
  return (
    <Card className="shadow-2xl glass-card border-none">
      <CardHeader>
        <CardTitle className="font-headline text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Configuration</CardTitle>
        <CardDescription className="text-foreground/70">
          Define the celestial parameters for your instrument.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-headline text-xl">Location</h3>
            <div className="space-y-2">
                <Label htmlFor="latitude">Latitude (°) North</Label>
                <Input id="latitude" name="latitude" placeholder="e.g., 26.9124" required defaultValue="26.9124" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="longitude">Longitude (°) East</Label>
                <Input id="longitude" name="longitude" placeholder="e.g., 75.7873" required defaultValue="75.7873" />
            </div>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <h3 className="font-headline text-xl">Instrument</h3>
            <RadioGroup name="yantra" defaultValue="samrat" className="grid grid-cols-2 gap-4">
            {YANTRAS.map((yantra) => (
                <div key={yantra.id} className="relative">
                <RadioGroupItem value={yantra.id} id={yantra.id} className="peer sr-only" />
                <Label
                    htmlFor={yantra.id}
                    className="relative flex h-28 flex-col items-center justify-center rounded-xl border border-white/5 bg-background/40 backdrop-blur-md p-4 transition-all duration-300 hover:bg-secondary/40 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-[0_0_20px_rgba(139,92,246,0.5)] cursor-pointer active:scale-95"
                >
                    <div className="flex flex-col items-center justify-center gap-3">
                        <yantra.Icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-center text-sm font-medium tracking-wide">{yantra.name}</span>
                    </div>
                </Label>
                </div>
            ))}
            </RadioGroup>
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
