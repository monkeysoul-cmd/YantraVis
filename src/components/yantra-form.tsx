'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { YANTRAS } from '@/lib/yantras';
import { Globe, Loader2, MapPin } from 'lucide-react';
import { Separator } from './ui/separator';

function SubmitButton({ isPending }: { isPending: boolean }) {
  const { pending } = useFormStatus();
  const loading = isPending || pending;

  return (
    <Button 
      type="submit" 
      className="w-full text-base py-6 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 font-headline font-medium" 
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Calculating Alignment...
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

const PRESET_LOCATIONS = [
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, title: 'Jantar Mantar (Main)' },
  { name: 'New Delhi', lat: 28.6271, lon: 77.2166, title: 'Jantar Mantar (Connaught Place)' },
  { name: 'Ujjain', lat: 23.1765, lon: 75.7885, title: 'Vedh Shala' },
  { name: 'Varanasi', lat: 25.3109, lon: 83.0107, title: 'Maan Mandir Observatory' },
];

type YantraFormProps = {
  action: (payload: FormData) => void;
  isPending: boolean;
};

export default function YantraForm({ action, isPending }: YantraFormProps) {
  const [lat, setLat] = useState('26.9124');
  const [lon, setLon] = useState('75.7873');
  const [selectedYantra, setSelectedYantra] = useState('samrat');

  const applyPreset = (presetLat: number, presetLon: number) => {
    setLat(presetLat.toString());
    setLon(presetLon.toString());
  };

  return (
    <Card className="shadow-2xl glass-card border-none">
      <CardHeader>
        <CardTitle className="font-headline text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-300 to-accent">
          Configuration
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Define the celestial location and select your astronomical instrument.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          {/* Explicit hidden input ensuring selected yantra is always sent in form data */}
          <input type="hidden" name="yantra" value={selectedYantra} />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-xl flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Geolocation
              </h3>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground font-medium">Historical Observatories:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_LOCATIONS.map((preset) => (
                  <Button
                    key={preset.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-secondary/40 hover:bg-primary/20 border-white/10 hover:border-primary/40"
                    title={preset.title}
                    onClick={() => applyPreset(preset.lat, preset.lon)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="latitude" className="text-xs font-medium">Latitude (°) N</Label>
                <Input 
                  id="latitude" 
                  name="latitude" 
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  placeholder="26.9124" 
                  required 
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="bg-background/50 border-white/10 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="longitude" className="text-xs font-medium">Longitude (°) E</Label>
                <Input 
                  id="longitude" 
                  name="longitude" 
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  placeholder="75.7873" 
                  required 
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  className="bg-background/50 border-white/10 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>
          
          <Separator />

          <div className="space-y-3">
            <h3 className="font-headline text-xl">Instrument Selection</h3>
            <RadioGroup 
              value={selectedYantra} 
              onValueChange={setSelectedYantra}
              className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1"
            >
            {YANTRAS.map((yantra) => (
              <div key={yantra.id} className="relative" onClick={() => setSelectedYantra(yantra.id)}>
                <RadioGroupItem value={yantra.id} id={yantra.id} className="peer sr-only" />
                <Label
                  htmlFor={yantra.id}
                  className="relative flex h-24 flex-col items-center justify-center rounded-xl border border-white/10 bg-background/50 backdrop-blur-md p-3 transition-all duration-300 hover:bg-secondary/40 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-primary/25 peer-data-[state=checked]:shadow-[0_0_20px_rgba(255,215,0,0.35)] cursor-pointer active:scale-95"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <yantra.Icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-center text-xs font-medium tracking-wide line-clamp-1">{yantra.name}</span>
                  </div>
                </Label>
              </div>
            ))}
            </RadioGroup>
          </div>

          <SubmitButton isPending={isPending} />
        </form>
      </CardContent>
    </Card>
  );
}
