'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import YantraViewer from "./yantra-viewer";
import type { Yantra } from "@/lib/yantras";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "./ui/button";

type ArModalProps = {
  isOpen: boolean;
  onClose: () => void;
  yantraId: Yantra['id'];
};

export default function ArModal({ isOpen, onClose, yantraId }: ArModalProps) {
    const bgImage = PlaceHolderImages.find(img => img.id === 'ar-background');
    
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <div className="flex-grow relative overflow-hidden bg-secondary">
          {bgImage && (
            <Image 
                src={bgImage.imageUrl} 
                alt="Outdoor site for AR preview" 
                fill
                className="object-cover"
                data-ai-hint={bgImage.imageHint}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-black/10">
            <YantraViewer yantraId={yantraId} isArMode={true} />
          </div>
        </div>
        <DialogHeader className="p-6 border-t bg-card">
          <DialogTitle className="font-headline">Augmented Reality Preview</DialogTitle>
          <DialogDescription>
            This is a simulation. On a supported mobile device, this view would use your camera to place the yantra in your environment.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
