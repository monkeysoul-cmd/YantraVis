'use client';

import { useState } from 'react';
import type { YantraData } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Camera, Compass } from 'lucide-react';
import YantraViewer from './yantra-viewer';
import ArModal from './ar-modal';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function YantraDetails({ data }: { data: YantraData }) {
  const [isArModalOpen, setIsArModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCadDownload = () => {
    // This is a simulation. A real app would generate a file.
    const fileContent = `CAD Data for ${data.yantraName}\nLocation: (${data.location.latitude}, ${data.location.longitude})\n\n` +
      JSON.stringify(data.dimensions, null, 2);
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.yantraId}_${data.location.latitude}_${data.location.longitude}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
        title: 'Download Started',
        description: 'Your simulated CAD file is downloading.'
    });
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-4xl text-primary">{data.yantraName}</CardTitle>
          <CardDescription>
            Generated for Latitude: {data.location.latitude.toFixed(4)}°, Longitude: {data.location.longitude.toFixed(4)}°
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gradient-to-br from-secondary/30 to-background">
            <YantraViewer yantraId={data.yantraId} />
            <div className="absolute top-3 right-3 bg-card/70 backdrop-blur-sm p-2 rounded-full shadow-md">
                <Compass className="h-6 w-6 text-foreground" />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">N</div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-headline text-2xl mb-2">Cosmic Significance</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{data.description}</p>
          </div>
          
          <Separator />

          <div>
            <h3 className="font-headline text-2xl mb-2">Construction Dimensions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {Object.entries(data.dimensions).map(([key, value]) => (
                    <div key={key} className="bg-secondary/30 p-3 rounded-md border text-center">
                        <p className="text-muted-foreground capitalize text-xs">{key}</p>
                        <p className="font-semibold text-lg text-primary">{value.toFixed(2)}</p>
                    </div>
                ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <Button onClick={handleCadDownload} className="w-full sm:w-auto flex-1 sm:flex-none">
              <Download className="mr-2 h-4 w-4" />
              Export CAD (TXT)
            </Button>
            <Button onClick={() => setIsArModalOpen(true)} variant="outline" className="w-full sm:w-auto flex-1 sm:flex-none">
              <Camera className="mr-2 h-4 w-4" />
              AR Preview
            </Button>
          </div>
        </CardContent>
      </Card>
      <ArModal
        isOpen={isArModalOpen}
        onClose={() => setIsArModalOpen(false)}
        yantraId={data.yantraId}
      />
    </>
  );
}
