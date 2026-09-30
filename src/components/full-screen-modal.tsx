'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import YantraViewer from "./yantra-viewer";
import type { Yantra } from "@/lib/yantras";
import { Sun, Moon, Compass } from "lucide-react";
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
      <DialogContent className="max-w-none w-screen h-screen flex flex-col p-0 gap-0 border-0 bg-background/95">
        <div className="flex-grow relative overflow-hidden bg-background">
          <YantraViewer yantraId={yantraId} latitude={latitude} animateShadow={animateShadow}/>
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-md p-2 rounded-full shadow-md border border-white/10">
              <Sun className="h-4 w-4 text-accent" />
              <Switch
                id="animate-shadow-fullscreen"
                checked={animateShadow}
                onCheckedChange={setAnimateShadow}
              />
              <Moon className="h-4 w-4 text-indigo-200" />
              <Label htmlFor="animate-shadow-fullscreen" className="sr-only">Simulate Day/Night</Label>
            </div>
            <div className="bg-card/80 backdrop-blur-md p-2 rounded-full shadow-md relative border border-white/10" title="True Meridian Alignment">
              <Compass className="h-5 w-5 text-foreground" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-accent">N</div>
            </div>
          </div>
        </div>
        <DialogHeader className="p-4 border-t bg-card/80 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10">
          <div className="space-y-1">
            <DialogTitle className="font-headline text-lg text-primary">{yantraName} - 3D Simulation</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Use mouse or touch gestures to rotate, pan, and zoom. Toggle Day/Night cycle to observe shadow dynamics.
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
