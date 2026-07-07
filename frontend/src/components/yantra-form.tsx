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

const YantraGraphicBackground = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className="absolute inset-0 h-full w-full text-primary/5"
    preserveAspectRatio="none"
  >
    <defs>
      <pattern id="yantra-pattern" patternUnits="userSpaceOnUse" width="14" height="14">
        <circle cx="2" cy="2" r="1" fill="currentColor" />
        <path d="M 2 2 l 10 10" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#yantra-pattern)" />
  </svg>
);


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
                    className="relative z-10 flex h-32 flex-col items-center justify-center rounded-md border border-white/10 bg-black/20 p-4 transition-all hover:bg-white/10 hover:border-white/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/20 cursor-pointer overflow-hidden active:scale-95 duration-200 backdrop-blur-sm"
                >
                    <YantraGraphicBackground />
                    <div className="relative z-20 flex flex-col items-center justify-center">
                        <yantra.Icon className="mb-2 h-10 w-10 text-primary drop-shadow-md" />
                        <span className="text-center text-sm font-semibold">{yantra.name}</span>
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
