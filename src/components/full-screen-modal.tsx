'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import YantraViewer from "./yantra-viewer";
import type { Yantra } from "@/lib/yantras";
import { Sun, Moon, Compass, Maximize2 } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

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
      <DialogContent className="max-w-none w-screen h-screen flex flex-col p-0 gap-0 border-0 rounded-none"
        style={{ background: 'hsl(222, 35%, 4%)' }}>
        
        {/* Viewer fills full screen */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          <YantraViewer yantraId={yantraId} latitude={latitude} animateShadow={animateShadow} />
          
          {/* Top controls overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            {/* Shadow toggle */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{
                background: 'hsla(220, 32%, 7%, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid hsla(43, 100%, 52%, 0.2)'
              }}>
              <Sun className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 55%)' }} />
              <Switch
                id="animate-shadow-fullscreen"
                checked={animateShadow}
                onCheckedChange={setAnimateShadow}
                className="scale-90"
              />
              <Moon className="h-3.5 w-3.5 text-muted-foreground/60" />
              <Label htmlFor="animate-shadow-fullscreen" className="sr-only">Simulate Day/Night</Label>
            </div>

            {/* Compass badge aligned */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center relative"
              style={{
                background: 'hsla(220, 32%, 7%, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid hsla(43, 100%, 52%, 0.2)'
              }}
              title="True Meridian — North">
              <div className="relative flex items-center justify-center">
                <Compass className="h-4 w-4 text-foreground/80" />
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold leading-none"
                  style={{ color: 'hsl(43, 100%, 55%)' }}>N</span>
              </div>
            </div>
          </div>

          {/* Bottom gradient + label */}
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to top, hsla(222, 35%, 4%, 0.9) 0%, transparent 100%)' }} />
          <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] text-muted-foreground pointer-events-none"
            style={{ background: 'hsla(220, 32%, 7%, 0.7)', backdropFilter: 'blur(8px)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            WebGL 3D · Drag to orbit · Scroll to zoom · Right-click to pan
          </div>
        </div>

        {/* Bottom info bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-3"
          style={{
            background: 'hsla(220, 32%, 7%, 0.95)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid hsla(24, 85%, 42%, 0.2)'
          }}>
          <div className="space-y-0.5">
            <p className="font-headline text-base font-semibold leading-tight"
              style={{
                background: 'linear-gradient(135deg, hsl(24, 90%, 65%), hsl(43, 100%, 55%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
              {yantraName}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Full-screen 3D simulation · Lat {latitude?.toFixed(4)}° N
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Maximize2 className="h-3.5 w-3.5" />
            Full Screen View
          </div>
        </div>

        {/* Hidden accessible header for screen readers */}
        <DialogHeader className="sr-only">
          <DialogTitle>{yantraName} - Full Screen 3D Simulation</DialogTitle>
          <DialogDescription>Use mouse or touch gestures to rotate, pan, and zoom. Toggle Day/Night cycle to observe shadow dynamics.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
