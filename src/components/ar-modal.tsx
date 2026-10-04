'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import YantraViewer from "./yantra-viewer";
import type { Yantra } from "@/lib/yantras";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type ArModalProps = {
  isOpen: boolean;
  onClose: () => void;
  yantraId: Yantra['id'];
};

export default function ArModal({ isOpen, onClose, yantraId }: ArModalProps) {
    const bgImage = PlaceHolderImages.find(img => img.id === 'ar-background');
    
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0"
        style={{ background: 'hsl(222, 35%, 5%)', border: '1px solid hsla(24, 85%, 42%, 0.2)' }}>

        <div className="flex-grow relative overflow-hidden" style={{ background: 'hsl(222, 40%, 4%)' }}>
          {bgImage && (
            <Image 
                src={bgImage.imageUrl} 
                alt="Outdoor site for AR preview" 
                fill
                className="object-cover opacity-60"
                data-ai-hint={bgImage.imageHint}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0">
            <YantraViewer yantraId={yantraId} isArMode={true} />
          </div>
          {/* AR overlay badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium"
            style={{ background: 'hsla(220, 32%, 7%, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid hsla(24, 90%, 55%, 0.25)', color: 'hsl(24, 90%, 60%)' }}>
            AR Simulation
          </div>
        </div>

        <DialogHeader className="p-5 flex-shrink-0"
          style={{ borderTop: '1px solid hsla(24, 85%, 42%, 0.15)', background: 'hsla(220, 32%, 7%, 0.95)' }}>
            <div className='space-y-1'>
                <DialogTitle className="font-headline text-base"
                  style={{ color: 'hsl(24, 90%, 62%)' }}>Augmented Reality Preview</DialogTitle>
                <DialogDescription className="text-xs">
                    Simulation mode. On supported mobile devices, this view uses your camera to place the yantra in your real environment.
                </DialogDescription>
            </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
