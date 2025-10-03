'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import YantraViewer from "./yantra-viewer";
import type { Yantra } from "@/lib/yantras";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type FullScreenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  yantraId: Yantra['id'];
  yantraName: string;
};

export default function FullScreenModal({ isOpen, onClose, yantraId, yantraName }: FullScreenModalProps) {
    
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
            <YantraViewer yantraId={yantraId} animateShadow={true}/>
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
