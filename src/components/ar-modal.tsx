'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import YantraViewer from "./yantra-viewer";
import type { Yantra } from "@/lib/yantras";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Eye, View } from "lucide-react";

type ArModalProps = {
  isOpen: boolean;
  onClose: () => void;
  yantraId: Yantra['id'];
};

export default function ArModal({ isOpen, onClose, yantraId }: ArModalProps) {
  const bgImage = PlaceHolderImages.find(img => img.id === 'ar-background');
    
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl h-[88vh] flex flex-col p-0 gap-0 overflow-hidden border border-primary/20 surface-elevated rounded-2xl shadow-2xl"
      >
        <div className="flex-grow relative overflow-hidden bg-background">
          {bgImage && (
            <Image 
              src={bgImage.imageUrl} 
              alt="Outdoor site for AR preview" 
              fill
              className="object-cover opacity-50"
              data-ai-hint={bgImage.imageHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
            />
          )}
          <div className="absolute inset-0">
            <YantraViewer yantraId={yantraId} isArMode={true} />
          </div>
          
          {/* AR overlay pill */}
          <div 
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium surface-glass border border-accent/30 shadow-lg text-accent"
          >
            <View className="h-3.5 w-3.5" />
            <span>AR Environment Simulation</span>
          </div>
        </div>

        <DialogHeader 
          className="p-5 flex-shrink-0 border-t border-border/30 surface-glass"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-accent" />
              <DialogTitle className="font-headline text-lg text-gradient-gold">
                Augmented Reality Perspective
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Spatial scale preview. When deployed to AR-compatible mobile browsers with WebXR, this projects the 1:1 scale parametric geometry into your real-world horizon.
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
