'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import YantraViewer from "./yantra-viewer";
import type { Yantra } from "@/lib/yantras";
import { Button } from "./ui/button";
import { X, Sun, Moon, Compass } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

type FullScreenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  yantraId: Yantra['id'];
  yantraName: string;
  animateShadow: boolean;
  setAnimateShadow: (checked: boolean) => void;
};

export default function FullScreenModal({ isOpen, onClose, yantraId, yantraName, animateShadow, setAnimateShadow }: FullScreenModalProps) {
    
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-screen h-screen flex flex-col p-0 gap-0 border-0">
        <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-20 bg-background/50 hover:bg-background/80">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </Button>
        </DialogClose>
        <div className="flex-grow relative overflow-hidden bg-background">
            <YantraViewer yantraId={yantraId} animateShadow={animateShadow}/>
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                 <div className="flex items-center space-x-2 bg-card/70 backdrop-blur-sm p-2 rounded-full shadow-md">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <Switch
                        id="animate-shadow-fullscreen"
                        checked={animateShadow}
                        onCheckedChange={setAnimateShadow}
                    />
                    <Moon className="h-5 w-5 text-slate-400" />
                    <Label htmlFor="animate-shadow-fullscreen" className="sr-only">Simulate Day/Night</Label>
                </div>
                <div className="bg-card/70 backdrop-blur-sm p-2 rounded-full shadow-md relative">
                    <Compass className="h-6 w-6 text-foreground" />
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">N</div>
                </div>
            </div>
        </div>
        <DialogHeader className="p-4 border-t bg-card absolute bottom-0 left-0 right-0 bg-background/50 backdrop-blur-sm">
            <div className='space-y-1.5'>
                <DialogTitle className="font-headline">{yantraName} - Full Screen</DialogTitle>
                <DialogDescription>
                    Use your mouse to rotate and zoom the model. The day/night cycle is simulated.
                </DialogDescription>
            </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
