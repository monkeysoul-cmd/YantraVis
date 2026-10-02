'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { YANTRAS } from '@/lib/yantras';
import { Globe, Loader2, MapPin, Navigation } from 'lucide-react';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      type="submit"
      className="w-full text-sm py-5 font-medium tracking-wide transition-all duration-300 relative overflow-hidden group"
      disabled={isPending}
      style={{
        background: isPending
          ? 'hsla(24, 85%, 42%, 0.6)'
          : 'linear-gradient(135deg, hsl(24, 85%, 42%), hsl(24, 90%, 52%), hsl(38, 95%, 50%))',
        boxShadow: isPending ? 'none' : '0 4px 20px hsla(24, 90%, 55%, 0.35), 0 1px 4px hsla(0,0%,0%,0.2)',
        border: 'none',
        color: 'white',
      }}
    >
      {/* Shimmer overlay on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: isPending ? 'none' : 'shimmer 1.5s infinite'
        }} />
      <span className="relative flex items-center justify-center gap-2">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Calculating Alignments…
          </>
        ) : (
          <>
            <Globe className="h-4 w-4" />
            Generate Yantra Model
          </>
        )}
      </span>
    </Button>
  );
}

const PRESET_LOCATIONS = [
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, title: 'Jantar Mantar (Main)', emoji: '🏛️' },
  { name: 'New Delhi', lat: 28.6271, lon: 77.2166, title: 'Jantar Mantar (Connaught Place)', emoji: '🕌' },
  { name: 'Ujjain', lat: 23.1765, lon: 75.7885, title: 'Vedh Shala', emoji: '⭐' },
  { name: 'Varanasi', lat: 25.3109, lon: 83.0107, title: 'Maan Mandir Observatory', emoji: '🌊' },
  { name: 'Mathura', lat: 27.4924, lon: 77.6737, title: 'Historic Observatory', emoji: '🪷' },
];

type YantraFormProps = {
  action: (payload: FormData) => void;
  isPending: boolean;
};

export default function YantraForm({ action, isPending }: YantraFormProps) {
  const [lat, setLat] = useState('26.9124');
  const [lon, setLon] = useState('75.7873');
  const [selectedYantra, setSelectedYantra] = useState('samrat');
  const [activePreset, setActivePreset] = useState<string>('Jaipur');

  const applyPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    setLat(preset.lat.toString());
    setLon(preset.lon.toString());
    setActivePreset(preset.name);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    action(formData);
  };

  return (
    <Card className="glass-card border-none shadow-none">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsla(24, 85%, 42%, 0.2), hsla(43, 100%, 52%, 0.15))', border: '1px solid hsla(43, 100%, 52%, 0.3)' }}>
            <Navigation className="h-3.5 w-3.5" style={{ color: 'hsl(24, 90%, 60%)' }} />
          </div>
          <CardTitle className="font-headline text-xl tracking-wider" style={{
            background: 'linear-gradient(135deg, hsl(24, 90%, 65%), hsl(43, 100%, 55%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Configuration
          </CardTitle>
        </div>
        <CardDescription className="text-xs leading-relaxed text-muted-foreground">
          Select a geographic location and ancient instrument to generate a parametric 3D model calibrated by celestial mathematics.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="hidden" name="yantra" value={selectedYantra} />

          {/* Geolocation Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" style={{ color: 'hsl(24, 90%, 55%)' }} />
              <span className="font-headline text-sm tracking-wider text-foreground/90">Geolocation</span>
            </div>

            {/* Preset Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Historical Observatories</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_LOCATIONS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    title={preset.title}
                    onClick={() => applyPreset(preset)}
                    className={cn(
                      "flex items-center gap-1 h-7 px-2.5 rounded-lg text-xs font-medium transition-all duration-200",
                      activePreset === preset.name
                        ? "text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    style={{
                      background: activePreset === preset.name
                        ? 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.25), hsla(43, 100%, 52%, 0.2))'
                        : 'hsla(220, 28%, 11%, 0.6)',
                      border: activePreset === preset.name
                        ? '1px solid hsla(43, 100%, 52%, 0.5)'
                        : '1px solid hsla(220, 25%, 14%, 1)',
                      boxShadow: activePreset === preset.name
                        ? '0 0 10px hsla(43, 100%, 52%, 0.2)'
                        : 'none',
                      color: activePreset === preset.name ? 'hsl(43, 100%, 60%)' : undefined
                    }}
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Coordinate Inputs */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1.5">
                <Label htmlFor="latitude" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Latitude (°)
                </Label>
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
                  onChange={(e) => { setLat(e.target.value); setActivePreset(''); }}
                  className="h-9 text-sm bg-background/50 border-border/60 focus-visible:ring-0 focus-visible:border-primary/60 transition-colors"
                  style={{ boxShadow: 'inset 0 2px 4px hsla(0,0%,0%,0.08)' }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="longitude" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Longitude (°)
                </Label>
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
                  onChange={(e) => { setLon(e.target.value); setActivePreset(''); }}
                  className="h-9 text-sm bg-background/50 border-border/60 focus-visible:ring-0 focus-visible:border-primary/60 transition-colors"
                  style={{ boxShadow: 'inset 0 2px 4px hsla(0,0%,0%,0.08)' }}
                />
              </div>
            </div>
          </div>

          <Separator style={{ background: 'linear-gradient(90deg, transparent, hsla(24, 85%, 42%, 0.3), transparent)' }} />

          {/* Instrument Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-headline text-sm tracking-wider text-foreground/90">Select Instrument</span>
              <span className="text-[10px] text-muted-foreground">13 Yantras</span>
            </div>
            <RadioGroup
              value={selectedYantra}
              onValueChange={setSelectedYantra}
              className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1"
            >
              {YANTRAS.map((yantra) => (
                <div key={yantra.id} className="relative" onClick={() => setSelectedYantra(yantra.id)}>
                  <RadioGroupItem value={yantra.id} id={yantra.id} className="peer sr-only" />
                  <Label
                    htmlFor={yantra.id}
                    className={cn(
                      "relative flex h-[90px] flex-col items-center justify-center rounded-xl p-3 cursor-pointer",
                      "transition-all duration-200 select-none",
                      "border backdrop-blur-sm"
                    )}
                    style={{
                      background: selectedYantra === yantra.id
                        ? 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.15), hsla(43, 100%, 52%, 0.1))'
                        : 'hsla(220, 28%, 8%, 0.7)',
                      borderColor: selectedYantra === yantra.id
                        ? 'hsla(43, 100%, 52%, 0.5)'
                        : 'hsla(220, 25%, 14%, 1)',
                      boxShadow: selectedYantra === yantra.id
                        ? '0 0 0 1px hsla(43, 100%, 52%, 0.3), 0 0 16px hsla(43, 100%, 52%, 0.2)'
                        : 'none',
                    }}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <yantra.Icon
                        className="h-6 w-6 transition-all duration-250"
                        style={{
                          color: selectedYantra === yantra.id
                            ? 'hsl(43, 100%, 55%)'
                            : 'hsl(24, 60%, 50%)',
                          filter: selectedYantra === yantra.id
                            ? 'drop-shadow(0 0 6px hsla(43, 100%, 52%, 0.5))'
                            : 'none'
                        }}
                      />
                      <span className="text-center text-[10px] font-medium tracking-wide line-clamp-2 leading-tight"
                        style={{
                          color: selectedYantra === yantra.id ? 'hsl(38, 25%, 90%)' : 'hsl(38, 15%, 58%)'
                        }}>
                        {yantra.name}
                      </span>
                    </div>
                    {/* Active dot indicator */}
                    {selectedYantra === yantra.id && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: 'hsl(43, 100%, 52%)' }} />
                    )}
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
