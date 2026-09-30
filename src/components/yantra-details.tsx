'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Camera, 
  Compass, 
  Sun, 
  Moon, 
  Wrench, 
  CircleDollarSign, 
  CheckCircle, 
  MapPin, 
  Scale, 
  HardHat, 
  Expand, 
  FileCode, 
  Box, 
  FileJson 
} from 'lucide-react';
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
import { generateDxfContent } from '@/lib/dxf-exporter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function YantraDetails({ data }: { data: YantraData }) {
  const [isArModalOpen, setIsArModalOpen] = useState(false);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
  const [animateShadow, setAnimateShadow] = useState(true);
  const viewerRef = useRef<YantraViewerRef>(null);
  const { toast } = useToast();

  const handleStlDownload = () => {
    const blob = viewerRef.current?.exportSTL();
    if (!blob) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Unable to generate 3D STL file from current model.',
      });
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const latLabel = data.location.latitude >= 0 ? `${data.location.latitude.toFixed(2)}N` : `${Math.abs(data.location.latitude).toFixed(2)}S`;
    const lonLabel = data.location.longitude >= 0 ? `${data.location.longitude.toFixed(2)}E` : `${Math.abs(data.location.longitude).toFixed(2)}W`;
    a.download = `${data.yantraId}_${latLabel}_${lonLabel}.stl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'STL 3D Model Exported',
      description: 'Ready for 3D slicing, 3D printing, and CAD mesh inspection.',
    });
  };

  const handleDxfDownload = () => {
    const dxfString = generateDxfContent(data);
    const blob = new Blob([dxfString], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const latLabel = data.location.latitude >= 0 ? `${data.location.latitude.toFixed(2)}N` : `${Math.abs(data.location.latitude).toFixed(2)}S`;
    const lonLabel = data.location.longitude >= 0 ? `${data.location.longitude.toFixed(2)}E` : `${Math.abs(data.location.longitude).toFixed(2)}W`;
    a.download = `${data.yantraId}_${latLabel}_${lonLabel}.dxf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'AutoCAD DXF Exported',
      description: 'Standard 2D/3D CAD vector drawing with parametric layers.',
    });
  };

  const handleJsonDownload = () => {
    const exportData = {
      specVersion: '1.0',
      timestamp: new Date().toISOString(),
      instrument: {
        id: data.yantraId,
        name: data.yantraName,
      },
      coordinates: data.location,
      parametricDimensions: data.dimensions,
      analysis: data.analysis,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.yantraId}_spec_${data.location.latitude.toFixed(2)}_${data.location.longitude.toFixed(2)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Specification Exported',
      description: 'Full architectural metadata, BOM & orientation guidelines downloaded.',
    });
  };

  return (
    <>
      <Card className="shadow-2xl animate-in fade-in duration-500 glass-card border-none">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="font-headline text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-300 to-accent">
                {data.yantraName}
              </CardTitle>
              <CardDescription className="text-foreground/70 mt-1">
                Calibrated for Latitude: {data.location.latitude.toFixed(4)}° N, Longitude: {data.location.longitude.toFixed(4)}° E
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
              <Compass className="h-3.5 w-3.5" />
              <span>Parametric Alignment Active</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-inner">
            <YantraViewer 
              ref={viewerRef} 
              yantraId={data.yantraId as import('@/lib/yantras').Yantra['id']} 
              latitude={data.location.latitude}
              animateShadow={animateShadow} 
            />
            <div className="absolute top-3 left-3 z-10">
              <Button 
                onClick={() => setIsFullScreenModalOpen(true)} 
                variant="ghost" 
                size="icon" 
                className="bg-card/80 backdrop-blur-md shadow-md h-9 w-9 hover:bg-card border border-white/10"
                title="Full Screen 3D Viewer"
              >
                <Expand className="h-4 w-4" />
                <span className="sr-only">Full Screen</span>
              </Button>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-md p-2 rounded-full shadow-md border border-white/10">
                <Sun className="h-4 w-4 text-accent" />
                <Switch
                  id="animate-shadow"
                  checked={animateShadow}
                  onCheckedChange={setAnimateShadow}
                  aria-label="Simulate Day/Night Shadow Movement"
                />
                <Moon className="h-4 w-4 text-indigo-200" />
              </div>
              <div className="bg-card/80 backdrop-blur-md p-2 rounded-full shadow-md border border-white/10 relative" title="True Meridian Alignment (North)">
                <Compass className="h-5 w-5 text-foreground" />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-accent">N</div>
              </div>
            </div>
          </div>

          {/* Parametric Dimensions Grid */}
          <div>
            <h3 className="font-headline text-xl mb-3 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" /> Parametric Construction Dimensions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {Object.entries(data.dimensions).map(([key, value]) => (
                <div key={key} className="bg-secondary/30 p-3 rounded-lg border border-white/5 text-center">
                  <p className="text-muted-foreground capitalize text-xs line-clamp-1">{key}</p>
                  <p className="font-semibold text-lg text-primary mt-0.5">
                    {typeof value === 'number' 
                      ? (key.toLowerCase().includes('angle') || key.toLowerCase().includes('tilt') 
                          ? `${value.toFixed(2)}°` 
                          : value.toFixed(2)) 
                      : value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-headline text-2xl mb-4">Historical & Astronomical Significance</h3>
            <div 
              className="prose prose-invert prose-sm max-w-none text-muted-foreground [&_h3]:font-headline [&_h3]:text-foreground [&_h3]:text-xl [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-3 [&_p]:leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>
          
          <Separator />
          
          <Accordion type="single" collapsible className="w-full" defaultValue="analysis">
            <AccordionItem value="analysis">
              <AccordionTrigger className="font-headline text-xl">
                Construction Analysis & BOM
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <div>
                  <h4 className="font-semibold text-base flex items-center gap-2 mb-2"><Wrench className="text-primary h-4 w-4"/>Bill of Materials (BOM)</h4>
                  <div className="rounded-lg border border-white/5 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-secondary/20">
                        <TableRow>
                          <TableHead>Specification / Material</TableHead>
                          <TableHead className="text-right">Estimated Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.analysis.billOfMaterials.map((item, index) => (
                          <TableRow key={index} className="hover:bg-secondary/10">
                            <TableCell className="font-medium text-foreground/90">{item.item}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/20 p-4 rounded-lg border border-white/5 space-y-1.5">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground"><CircleDollarSign className="text-primary h-4 w-4"/>Cost Estimate</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{data.analysis.costEstimate}</p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg border border-white/5 space-y-1.5">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground"><CheckCircle className="text-primary h-4 w-4"/>Astronomical Accuracy</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{data.analysis.accuracy}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="orientation">
              <AccordionTrigger className="font-headline text-xl">
                Orientation & Foundation Guidance
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/20 p-4 rounded-lg border border-white/5 space-y-1.5">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground"><Compass className="text-primary h-4 w-4"/>True North Meridian Alignment</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{data.analysis.orientation.trueNorthAngle}</p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg border border-white/5 space-y-1.5">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground"><MapPin className="text-primary h-4 w-4"/>Magnetic Declination Correction</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{data.analysis.orientation.magneticDeclination}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-secondary/20 p-4 rounded-lg border border-white/5 space-y-1.5">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground"><HardHat className="text-primary h-4 w-4"/>Foundation Engineering</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{data.analysis.orientation.foundationNotes}</p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg border border-white/5 space-y-1.5">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground"><Scale className="text-primary h-4 w-4"/>Tolerance & Calibration</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{data.analysis.orientation.toleranceGuidance}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          {/* CAD Export & AR Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full sm:w-auto shadow-md shadow-primary/20">
                  <Download className="mr-2 h-4 w-4" />
                  Export CAD / 3D Files
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>CAD & 3D Formats</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleStlDownload} className="cursor-pointer">
                  <Box className="mr-2 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-xs">Export STL (.stl)</p>
                    <p className="text-[10px] text-muted-foreground">3D Printing / FreeCAD / Cura</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDxfDownload} className="cursor-pointer">
                  <FileCode className="mr-2 h-4 w-4 text-accent" />
                  <div>
                    <p className="font-medium text-xs">Export DXF (.dxf)</p>
                    <p className="text-[10px] text-muted-foreground">AutoCAD / 2D/3D Vector Drawing</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleJsonDownload} className="cursor-pointer">
                  <FileJson className="mr-2 h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="font-medium text-xs">Export Spec (.json)</p>
                    <p className="text-[10px] text-muted-foreground">Parametric Dimensions & BOM</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setIsArModalOpen(true)} variant="outline" className="w-full sm:w-auto border-white/10">
              <Camera className="mr-2 h-4 w-4" />
              AR Preview
            </Button>
          </div>
        </CardContent>
      </Card>
      <ArModal
        isOpen={isArModalOpen}
        onClose={() => setIsArModalOpen(false)}
        yantraId={data.yantraId as import('@/lib/yantras').Yantra['id']}
      />
      <FullScreenModal
        isOpen={isFullScreenModalOpen}
        onClose={() => setIsFullScreenModalOpen(false)}
        yantraId={data.yantraId as import('@/lib/yantras').Yantra['id']}
        yantraName={data.yantraName}
        latitude={data.location.latitude}
        animateShadow={animateShadow}
        setAnimateShadow={setAnimateShadow}
      />
    </>
  );
}
