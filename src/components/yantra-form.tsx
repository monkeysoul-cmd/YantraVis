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
    <Button type="submit" className="w-full text-base py-6" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Globe className="mr-2 h-5 w-5" />}
      Generate Yantra
    </Button>
  );
}

type YantraFormProps = {
  action: (payload: FormData) => void;
};

export default function YantraForm({ action }: YantraFormProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Configuration</CardTitle>
        <CardDescription>
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
                <div key={yantra.id}>
                  <RadioGroupItem value={yantra.id} id={yantra.id} className="peer sr-only" />
                  <Label
                    htmlFor={yantra.id}
                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 h-32 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent/80 transition-all cursor-pointer"
                  >
                    <yantra.Icon className="mb-2 h-10 w-10 text-primary" />
                    <span className="text-sm font-semibold">{yantra.name}</span>
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
