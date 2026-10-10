'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import YantraViewer from "./yantra-viewer";
import type { Yantra } from "@/lib/yantras";
import { Sun, Moon, Compass, Maximize2, X, Eye } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

type FullScreenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  yantraId: Yantra['id'];
  yantraName: string;
  latitude?: number;
  animateShadow: boolean;
  setAnimateShadow: (checked: boolean) => void;
};

export default function FullScreenModal({ 
  isOpen, 
  onClose, 
  yantraId, 
  yantraName, 
  latitude = 26.9124,
  animateShadow, 
  setAnimateShadow 
}: FullScreenModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-none w-screen h-screen h-[100dvh] flex flex-col p-0 gap-0 border-0 rounded-none overflow-hidden select-none"
        style={{ background: 'hsl(225, 47%, 3%)' }}
      >
        {/* Viewer fills full screen */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          <YantraViewer yantraId={yantraId} latitude={latitude} animateShadow={animateShadow} />

          {/* Floating Top Header HUD */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-20 pointer-events-none">
            {/* Left Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
              {/* Shadow toggle capsule */}
              <div 
                className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full surface-glass shadow-lg"
                style={{
                  border: '1px solid hsla(43, 100%, 52%, 0.25)',
                }}
              >
                <Sun className={`h-4 w-4 transition-colors ${animateShadow ? 'text-amber-400 animate-pulse' : 'text-amber-400/70'}`} />
                <Switch
                  id="animate-shadow-fullscreen"
                  checked={animateShadow}
                  onCheckedChange={setAnimateShadow}
                  className="scale-90 data-[state=checked]:bg-amber-500"
                />
                <Moon className={`h-3.5 w-3.5 transition-colors ${animateShadow ? 'text-blue-300' : 'text-muted-foreground/60'}`} />
                <span className="text-[11px] font-medium tracking-wide text-foreground/90 pl-1 hidden sm:inline">
                  {animateShadow ? 'Shadow Orbit Active' : 'Static Light'}
                </span>
                <Label htmlFor="animate-shadow-fullscreen" className="sr-only">Simulate Day/Night</Label>
              </div>

              {/* Compass badge */}
              <div 
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 sm:gap-2 surface-glass shadow-lg hidden xs:flex"
                style={{
                  border: '1px solid hsla(24, 90%, 55%, 0.2)',
                }}
                title="True Celestial Meridian (North Aligned)"
              >
                <Compass className="h-4 w-4 text-primary animate-spin-slow" style={{ animationDuration: '40s' }} />
                <span className="text-[10px] sm:text-[11px] font-semibold text-accent tracking-wider">TRUE N</span>
              </div>
            </div>

            {/* Right Close Button */}
            <div className="pointer-events-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full surface-glass hover:bg-destructive/20 hover:text-destructive border border-border/40 hover:border-destructive/40 transition-all cursor-pointer"
                aria-label="Exit Fullscreen"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom HUD Hint */}
          <div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-medium text-foreground/80 pointer-events-none surface-glass border border-white/5 shadow-xl"
          >
            <Eye className="h-3.5 w-3.5 text-accent" />
            <span>Drag to rotate</span>
            <span className="text-white/20">·</span>
            <span>Pinch / Scroll to zoom</span>
            <span className="text-white/20">·</span>
            <span>Right-click to pan</span>
          </div>

          {/* Soft Bottom Vignette */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
            style={{ background: 'linear-gradient(to top, hsl(225, 47%, 3%) 0%, transparent 100%)' }} 
          />
        </div>

        {/* Bottom Info Bar */}
        <div 
          className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 relative z-10"
          style={{
            background: 'hsla(225, 40%, 5%, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid hsla(24, 85%, 42%, 0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_hsl(43,100%,52%)]" />
            <div>
              <p 
                className="font-headline text-base font-semibold leading-tight text-gradient-gold"
              >
                {yantraName}
              </p>
              <p className="text-[11px] text-muted-foreground/80 flex items-center gap-1.5 mt-0.5">
                <span>Astronomical Simulation</span>
                <span>•</span>
                <span className="text-foreground/70 font-mono">Lat {latitude?.toFixed(4)}° N</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/40">
            <Eye className="h-3.5 w-3.5 text-accent" />
            <span>Interactive Real-time WebGL</span>
          </div>
        </div>

        {/* Accessible Dialog Title */}
        <DialogHeader className="sr-only">
          <DialogTitle>{yantraName} - Full Screen 3D Simulation</DialogTitle>
          <DialogDescription>Interactive full-screen 3D view of {yantraName} at latitude {latitude?.toFixed(4)}° N with real-time solar shadow dynamics.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
