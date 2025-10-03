'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Camera, Compass, Sun, Moon, Wrench, CircleDollarSign, CheckCircle, MapPin, Scale, HardHat, Expand } from 'lucide-react';
import YantraViewer, { type YantraViewerRef } from './yantra-viewer';
import ArModal from './ar-modal';
import FullScreenModal from './full-screen-modal';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import type { YantraData } from '@/lib/schema/yantra';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export default function YantraDetails({ data }: { data: YantraData }) {
  const [isArModalOpen, setIsArModalOpen] = useState(false);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
  const [animateShadow, setAnimateShadow] = useState(true);
  const viewerRef = useRef<YantraViewerRef>(null);
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
      <Card className="shadow-lg animate-in fade-in duration-500">
        <CardHeader>
          <CardTitle className="font-headline text-4xl text-primary">{data.yantraName}</CardTitle>
          <CardDescription>
            Generated for Latitude: {data.location.latitude.toFixed(4)}°, Longitude: {data.location.longitude.toFixed(4)}°
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gradient-to-br from-secondary/30 to-background">
            <YantraViewer ref={viewerRef} yantraId={data.yantraId} animateShadow={animateShadow} />
            <div className="absolute top-3 right-3 flex items-center gap-2">
                <div className="flex items-center space-x-2 bg-card/70 backdrop-blur-sm p-2 rounded-full shadow-md">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <Switch
                        id="animate-shadow"
                        checked={animateShadow}
                        onCheckedChange={setAnimateShadow}
                    />
                    <Moon className="h-5 w-5 text-slate-400" />
                    <Label htmlFor="animate-shadow" className="sr-only">Simulate Day/Night</Label>
                </div>
                <div className="bg-card/70 backdrop-blur-sm p-2 rounded-full shadow-md relative">
                    <Compass className="h-6 w-6 text-foreground" />
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">N</div>
                </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-headline text-2xl mb-4">Cosmic Significance</h3>
            <div 
              className="prose prose-sm max-w-none text-muted-foreground [&_h3]:font-headline [&_h3]:text-foreground [&_h3]:text-xl [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-4" 
              dangerouslySetInnerHTML={{ __html: data.description }}
            ></div>
          </div>
          
          <Separator />
          
          <Accordion type="single" collapsible className="w-full" defaultValue="analysis">
            <AccordionItem value="analysis">
              <AccordionTrigger className="font-headline text-2xl">
                Construction Analysis
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <div>
                  <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><Wrench className="text-primary"/>Bill of Materials</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.analysis.billOfMaterials.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.item}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-4 rounded-md border">
                    <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><CircleDollarSign className="text-primary"/>Cost Estimate</h4>
                    <p className="text-muted-foreground">{data.analysis.costEstimate}</p>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-md border">
                    <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><CheckCircle className="text-primary"/>Accuracy</h4>
                    <p className="text-muted-foreground">{data.analysis.accuracy}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="orientation">
              <AccordionTrigger className="font-headline text-2xl">
                Orientation & Foundation
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                  <div className="bg-secondary/30 p-4 rounded-md border">
                    <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><Compass className="text-primary"/>True North Alignment</h4>
                    <p className="text-muted-foreground">{data.analysis.orientation.trueNorthAngle}</p>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-md border">
                    <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><MapPin className="text-primary"/>Magnetic Declination</h4>
                    <p className="text-muted-foreground">{data.analysis.orientation.magneticDeclination}</p>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-md border">
                    <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><HardHat className="text-primary"/>Foundation Notes</h4>
                    <p className="text-muted-foreground">{data.analysis.orientation.foundationNotes}</p>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-md border">
                    <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><Scale className="text-primary"/>Tolerance Guidance</h4>
                    <p className="text-muted-foreground">{data.analysis.orientation.toleranceGuidance}</p>

                  </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
            <Button onClick={handleCadDownload} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export CAD (TXT)
            </Button>
             <Button onClick={() => setIsFullScreenModalOpen(true)} variant="outline" className="w-full sm:w-auto">
              <Expand className="mr-2 h-4 w-4" />
              Full Screen
            </Button>
            <Button onClick={() => setIsArModalOpen(true)} variant="outline" className="w-full sm:w-auto">
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
      <FullScreenModal
        isOpen={isFullScreenModalOpen}
        onClose={() => setIsFullScreenModalOpen(false)}
        yantraId={data.yantraId}
        yantraName={data.yantraName}
      />
    </>
  );
}
