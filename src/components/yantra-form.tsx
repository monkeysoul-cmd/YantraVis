'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { YANTRAS } from '@/lib/yantras';
import { Globe, Loader2, MapPin, Navigation, Compass } from 'lucide-react';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      type="submit"
      className="w-full text-sm py-5 font-medium tracking-wide btn-premium cursor-pointer"
      disabled={isPending}
      style={{
        background: isPending
          ? 'hsla(24, 85%, 42%, 0.5)'
          : 'linear-gradient(135deg, hsl(24, 85%, 40%), hsl(24, 90%, 50%), hsl(38, 95%, 48%))',
        boxShadow: isPending ? 'none' : '0 4px 24px hsla(24, 90%, 55%, 0.3), 0 1px 4px hsla(0,0%,0%,0.25)',
        border: 'none',
        color: 'white',
        borderRadius: '14px',
      }}
    >
      <span className="relative flex items-center justify-center gap-2.5 font-medium">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Computing Alignments…
          </>
        ) : (
          <>
            <Globe className="h-4 w-4" />
            Generate / Recalibrate Model
          </>
        )}
      </span>
    </Button>
  );
}

export const PRESET_LOCATIONS = [
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, title: 'Jantar Mantar (Main)', emoji: '🏛️' },
  { name: 'New Delhi', lat: 28.6271, lon: 77.2166, title: 'Jantar Mantar (Connaught Place)', emoji: '🕌' },
  { name: 'Ujjain', lat: 23.1765, lon: 75.7885, title: 'Vedh Shala', emoji: '⭐' },
  { name: 'Varanasi', lat: 25.3109, lon: 83.0107, title: 'Maan Mandir Observatory', emoji: '🌊' },
  { name: 'Mathura', lat: 27.4924, lon: 77.6737, title: 'Historic Observatory', emoji: '🪷' },
];

export type YantraFormProps = {
  action: (payload: FormData) => void;
  isPending: boolean;
  activeYantraId?: string;
  onYantraChange?: (yantraId: string) => void;
  onCoordinatesChange?: (lat: number, lon: number) => void;
};

export default function YantraForm({
  action,
  isPending,
  activeYantraId,
  onYantraChange,
  onCoordinatesChange,
}: YantraFormProps) {
  const [lat, setLat] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('latitude');
      if (p) return p;
    }
    return '26.9124';
  });
  const [lon, setLon] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('longitude');
      if (p) return p;
    }
    return '75.7873';
  });
  const [selectedYantra, setSelectedYantra] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('yantra');
      if (p) return p;
    }
    return activeYantraId || 'samrat';
  });
  const [activePreset, setActivePreset] = useState<string>('Jaipur');

  // Keep selectedYantra in sync with external changes (e.g., when a new model is generated)
  useEffect(() => {
    if (activeYantraId) {
      setSelectedYantra(activeYantraId);
    }
  }, [activeYantraId]);

  // Handle selection of a Yantra in the configuration panel (does NOT generate model until Generate button is clicked)
  const handleSelectYantra = (yantraId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedYantra(yantraId);
    if (onYantraChange) {
      onYantraChange(yantraId);
    }
  };

  const applyPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    const latStr = preset.lat.toString();
    const lonStr = preset.lon.toString();
    setLat(latStr);
    setLon(lonStr);
    setActivePreset(preset.name);

    if (onCoordinatesChange) {
      onCoordinatesChange(preset.lat, preset.lon);
    }
  };

  // Listen for global custom events from the top navigation bar dialogs
  useEffect(() => {
    const handleGlobalSelectYantra = (e: Event) => {
      const customEvent = e as CustomEvent<{ yantraId: string }>;
      if (customEvent.detail?.yantraId) {
        const newYantraId = customEvent.detail.yantraId;
        handleSelectYantra(newYantraId);
        const btn = document.getElementById(`btn-yantra-${newYantraId}`);
        btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Automatically generate/recalibrate 3D model for the selected instrument
        const fd = new FormData();
        fd.set('yantra', newYantraId);
        fd.set('latitude', lat);
        fd.set('longitude', lon);
        action(fd);
      }
    };

    const handleGlobalSelectLocation = (e: Event) => {
      const customEvent = e as CustomEvent<{ lat: number; lon: number; name?: string }>;
      if (customEvent.detail) {
        const { lat: newLat, lon: newLon, name: newName } = customEvent.detail;
        setLat(newLat.toString());
        setLon(newLon.toString());
        if (newName) setActivePreset(newName);
        if (onCoordinatesChange) {
          onCoordinatesChange(newLat, newLon);
        }
        // Automatically recalibrate 3D model for the selected observatory coordinates
        const fd = new FormData();
        fd.set('yantra', selectedYantra || activeYantraId || 'samrat');
        fd.set('latitude', newLat.toString());
        fd.set('longitude', newLon.toString());
        action(fd);
      }
    };

    window.addEventListener('select-yantra', handleGlobalSelectYantra);
    window.addEventListener('select-location', handleGlobalSelectLocation);
    return () => {
      window.removeEventListener('select-yantra', handleGlobalSelectYantra);
      window.removeEventListener('select-location', handleGlobalSelectLocation);
    };
  }, [onCoordinatesChange, lat, lon, selectedYantra, activeYantraId, action]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const effectiveYantra = selectedYantra || activeYantraId || 'samrat';
    const formData = new FormData(e.currentTarget);
    formData.set('yantra', effectiveYantra);
    formData.set('latitude', lat);
    formData.set('longitude', lon);
    action(formData);
  };

  return (
    <Card className="glass-card border-none shadow-none bg-transparent">
      {/* Header */}
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, hsla(24, 85%, 42%, 0.15), hsla(43, 100%, 52%, 0.10))',
              border: '1px solid hsla(43, 100%, 52%, 0.25)',
              boxShadow: '0 0 15px hsla(24, 90%, 55%, 0.08)',
            }}>
            <Navigation className="h-4 w-4" style={{ color: 'hsl(24, 90%, 62%)' }} />
          </div>
          <CardTitle className="font-headline text-xl tracking-wider" style={{
            background: 'linear-gradient(135deg, hsl(24, 90%, 65%), hsl(43, 100%, 58%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 1px 6px hsla(24, 90%, 55%, 0.15))',
          }}>
            Configuration
          </CardTitle>
        </div>
        <CardDescription className="text-xs leading-relaxed text-muted-foreground pl-[42px]">
          Select an ancient instrument and location, then generate its calibrated 3D model.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <form onSubmit={handleSubmit} method="post" action="#" className="space-y-5">
          <input type="hidden" name="yantra" value={selectedYantra} />

          {/* ─── Geolocation Section ─── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" style={{ color: 'hsl(24, 90%, 58%)' }} />
              <span className="font-headline text-sm tracking-wider" style={{ color: 'hsla(38, 25%, 88%, 0.85)' }}>Geolocation</span>
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
                      "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer",
                      activePreset === preset.name
                        ? "text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    style={{
                      background: activePreset === preset.name
                        ? 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.18), hsla(43, 100%, 52%, 0.12))'
                        : 'hsla(225, 28%, 8%, 0.6)',
                      border: activePreset === preset.name
                        ? '1px solid hsla(43, 100%, 52%, 0.4)'
                        : '1px solid hsla(225, 22%, 14%, 0.8)',
                      boxShadow: activePreset === preset.name
                        ? '0 0 12px hsla(43, 100%, 52%, 0.12), inset 0 1px 0 hsla(255, 100%, 100%, 0.05)'
                        : 'none',
                      color: activePreset === preset.name ? 'hsl(43, 100%, 62%)' : undefined
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
                  onChange={(e) => {
                    setLat(e.target.value);
                    setActivePreset('');
                  }}
                  className="h-10 text-sm input-premium transition-all duration-300"
                  style={{
                    background: 'hsla(225, 35%, 6%, 0.8)',
                    border: '1px solid hsla(225, 22%, 14%, 0.6)',
                    borderRadius: '10px',
                    boxShadow: 'inset 0 2px 6px hsla(0, 0%, 0%, 0.15)',
                    color: 'hsl(38, 25%, 88%)',
                  }}
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
                  onChange={(e) => {
                    setLon(e.target.value);
                    setActivePreset('');
                  }}
                  className="h-10 text-sm input-premium transition-all duration-300"
                  style={{
                    background: 'hsla(225, 35%, 6%, 0.8)',
                    border: '1px solid hsla(225, 22%, 14%, 0.6)',
                    borderRadius: '10px',
                    boxShadow: 'inset 0 2px 6px hsla(0, 0%, 0%, 0.15)',
                    color: 'hsl(38, 25%, 88%)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="relative py-1">
            <Separator className="opacity-0" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, hsla(24, 85%, 42%, 0.25), hsla(43, 100%, 52%, 0.15), transparent)' }} />
          </div>

          {/* ─── Instrument Selection ─── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 58%)' }} />
                <span className="font-headline text-sm tracking-wider" style={{ color: 'hsla(38, 25%, 88%, 0.85)' }}>Select Instrument</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono px-2 py-0.5 rounded-md"
                style={{
                  background: 'hsla(225, 28%, 8%, 0.6)',
                  border: '1px solid hsla(225, 22%, 14%, 0.6)',
                }}>
                13 Yantras
              </span>
            </div>

            {/* Instrument selection cards with 3D tilt */}
            <div className="grid grid-cols-2 gap-2">
              {YANTRAS.map((yantra) => {
                const isSelected = selectedYantra === yantra.id;
                return (
                  <div key={yantra.id} className="instrument-card">
                    <button
                      type="button"
                      id={`btn-yantra-${yantra.id}`}
                      aria-pressed={isSelected}
                      onClick={(e) => handleSelectYantra(yantra.id, e)}
                      className={cn(
                        "instrument-card-inner relative flex flex-col items-center justify-center rounded-xl p-3 h-[88px] text-center cursor-pointer w-full",
                        "select-none group border backdrop-blur-sm",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                      )}
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.14), hsla(43, 100%, 52%, 0.08))'
                          : 'hsla(225, 35%, 6%, 0.7)',
                        borderColor: isSelected
                          ? 'hsla(43, 100%, 52%, 0.45)'
                          : 'hsla(225, 22%, 14%, 0.6)',
                        boxShadow: isSelected
                          ? '0 0 0 1px hsla(43, 100%, 52%, 0.3), 0 0 20px hsla(43, 100%, 52%, 0.15), inset 0 1px 0 hsla(255, 100%, 100%, 0.06)'
                          : 'none',
                      }}
                    >
                      {/* Active glow indicator */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-xl pointer-events-none animate-glow-breathe"
                          style={{ opacity: 0.5 }} />
                      )}
                      <div className="flex flex-col items-center gap-2 w-full relative z-10">
                        <yantra.Icon
                          className="h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:scale-115"
                          style={{
                            color: isSelected
                              ? 'hsl(43, 100%, 58%)'
                              : 'hsl(24, 60%, 48%)',
                            filter: isSelected
                              ? 'drop-shadow(0 0 8px hsla(43, 100%, 52%, 0.5))'
                              : 'none',
                            transition: 'color 0.3s, filter 0.3s, transform 0.3s',
                          }}
                        />
                        <span
                          className="text-[11px] font-medium tracking-wide leading-tight line-clamp-2 transition-colors duration-300"
                          style={{
                            color: isSelected ? 'hsl(38, 25%, 95%)' : 'hsl(38, 15%, 58%)'
                          }}
                        >
                          {yantra.name}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky action bar */}
          <div className="pt-2 sticky bottom-0 z-10 pb-1"
            style={{
              background: 'linear-gradient(to top, hsl(225, 47%, 3%) 60%, transparent)',
            }}>
            <SubmitButton isPending={isPending} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
