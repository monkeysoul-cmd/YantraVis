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
  FileJson,
  Ruler,
  Info,
  ChevronDown,
  Globe,
  Layers,
  AlignCenter,
} from 'lucide-react';
import YantraViewer, { type YantraViewerRef } from './yantra-viewer';
import ArModal from './ar-modal';
import FullScreenModal from './full-screen-modal';
import { useToast } from '@/hooks/use-toast';
import { Switch } from './ui/switch';
import type { YantraData } from '@/lib/schema/yantra';
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
import { cn } from '@/lib/utils';

type TabKey = 'description' | 'dimensions' | 'analysis' | 'orientation';

const TABS: { key: TabKey; label: string; icon: typeof Info }[] = [
  { key: 'description', label: 'About', icon: Info },
  { key: 'dimensions', label: 'Dimensions', icon: Ruler },
  { key: 'analysis', label: 'BOM & Analysis', icon: Layers },
  { key: 'orientation', label: 'Orientation', icon: AlignCenter },
];

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(to right, transparent, hsla(24, 85%, 42%, 0.25))' }} />
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(to left, transparent, hsla(24, 85%, 42%, 0.25))' }} />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent = false }: { label: string; value: string | number; icon?: typeof Compass; accent?: boolean }) {
  const displayValue = typeof value === 'number'
    ? (label.toLowerCase().includes('angle') || label.toLowerCase().includes('tilt')
        ? `${value.toFixed(2)}°`
        : value.toFixed(2))
    : value;

  return (
    <div className="dimension-card group rounded-xl p-3.5 flex flex-col gap-1"
      style={{
        background: accent
          ? 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.12), hsla(43, 100%, 52%, 0.08))'
          : 'hsla(220, 28%, 8%, 0.6)',
        border: `1px solid ${accent ? 'hsla(43, 100%, 52%, 0.25)' : 'hsla(220, 25%, 14%, 0.8)'}`,
      }}>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3 text-muted-foreground/60" />}
        <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground capitalize leading-none">
          {label.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
        </p>
      </div>
      <p className="font-headline text-base font-semibold leading-tight"
        style={{
          background: accent
            ? 'linear-gradient(135deg, hsl(24, 90%, 65%), hsl(43, 100%, 55%))'
            : 'linear-gradient(135deg, hsl(38, 25%, 88%), hsl(38, 20%, 70%))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
        {displayValue}
      </p>
    </div>
  );
}

export default function YantraDetails({ data }: { data: YantraData }) {
  const [isArModalOpen, setIsArModalOpen] = useState(false);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
  const [animateShadow, setAnimateShadow] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('description');
  const viewerRef = useRef<YantraViewerRef>(null);
  const { toast } = useToast();

  const handleStlDownload = () => {
    const blob = viewerRef.current?.exportSTL();
    if (!blob) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Unable to generate 3D STL file.' });
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
    toast({ title: '3D STL Exported', description: 'Ready for 3D printing and CAD mesh inspection.' });
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
    toast({ title: 'AutoCAD DXF Exported', description: '2D/3D CAD vector drawing with parametric layers.' });
  };

  const handleJsonDownload = () => {
    const exportData = {
      specVersion: '1.0',
      timestamp: new Date().toISOString(),
      instrument: { id: data.yantraId, name: data.yantraName },
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
    toast({ title: 'Specification Exported', description: 'Full metadata, BOM & orientation guidelines downloaded.' });
  };

  const dimEntries = Object.entries(data.dimensions);

  return (
    <>
      <div className="space-y-4 animate-rise-fade">

        {/* ── Header Block ── */}
        <div className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsla(220, 32%, 6%, 1), hsla(220, 28%, 9%, 1))',
            border: '1px solid hsla(24, 85%, 42%, 0.15)',
          }}>
          {/* Ambient light top right */}
          <div className="absolute top-0 right-0 w-64 h-40 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top right, hsla(43, 100%, 52%, 0.08) 0%, transparent 70%)' }} />
          
          <div className="relative p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="info-pill flex items-center gap-1">
                    <Compass className="h-3 w-3" />
                    Parametric Active
                  </span>
                  <span className="info-pill-gold flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {data.location.latitude.toFixed(3)}° N
                  </span>
                </div>
                <h2 className="font-headline text-2xl sm:text-3xl font-bold leading-tight"
                  style={{
                    background: 'linear-gradient(135deg, hsl(24, 90%, 68%), hsl(38, 95%, 62%), hsl(43, 100%, 56%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 8px hsla(24, 90%, 55%, 0.2))'
                  }}>
                  {data.yantraName}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  Calibrated for {data.location.latitude.toFixed(4)}° N, {data.location.longitude.toFixed(4)}° E
                </p>
              </div>

              {/* Quick action controls (vertically centered) */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                {/* Day/Night toggle */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'hsla(220, 25%, 12%, 0.8)', border: '1px solid hsla(220, 25%, 18%, 1)' }}>
                  <Sun className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 55%)' }} />
                  <Switch
                    id="animate-shadow"
                    checked={animateShadow}
                    onCheckedChange={setAnimateShadow}
                    className="scale-90"
                    aria-label="Simulate Day/Night Shadow"
                  />
                  <Moon className="h-3.5 w-3.5 text-muted-foreground/60" />
                </div>
                {/* Expand button */}
                <Button
                  onClick={() => setIsFullScreenModalOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                  style={{ border: '1px solid hsla(220, 25%, 18%, 1)' }}
                  title="Full Screen 3D Viewer"
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3D Viewer ── */}
        <div className="relative rounded-2xl overflow-hidden viewer-frame h-[320px] sm:h-[380px]">
          <YantraViewer
            ref={viewerRef}
            yantraId={data.yantraId as import('@/lib/yantras').Yantra['id']}
            latitude={data.location.latitude}
            animateShadow={animateShadow}
          />
          
          {/* Top overlay gradient */}
          <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, hsla(222, 40%, 4%, 0.7) 0%, transparent 100%)' }} />
          
          {/* Bottom overlay gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{ background: 'linear-gradient(to top, hsla(222, 40%, 4%, 0.6) 0%, transparent 100%)' }} />

          {/* Compass badge aligned */}
          <div className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full"
            style={{ background: 'hsla(220, 32%, 7%, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid hsla(43, 100%, 52%, 0.25)' }}>
            <div className="relative flex items-center justify-center">
              <Compass className="h-4 w-4 text-foreground/80" />
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold leading-none"
                style={{ color: 'hsl(43, 100%, 55%)' }}>N</div>
            </div>
          </div>

          {/* Viewer info label */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] text-muted-foreground"
            style={{ background: 'hsla(220, 32%, 7%, 0.75)', backdropFilter: 'blur(8px)', border: '1px solid hsla(220, 25%, 18%, 0.6)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            WebGL 3D · Drag to orbit · Scroll to zoom
          </div>
        </div>

        {/* ── Tab Navigation (Balanced grid for mobile & desktop) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xl p-1.5"
          style={{ background: 'hsla(220, 28%, 8%, 0.7)', border: '1px solid hsla(220, 25%, 14%, 1)' }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: activeTab === key
                  ? 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.2), hsla(43, 100%, 52%, 0.15))'
                  : 'transparent',
                color: activeTab === key ? 'hsl(38, 95%, 80%)' : 'hsl(38, 15%, 50%)',
                border: activeTab === key ? '1px solid hsla(43, 100%, 52%, 0.3)' : '1px solid transparent',
                boxShadow: activeTab === key ? '0 0 10px hsla(43, 100%, 52%, 0.1)' : 'none',
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="rounded-2xl overflow-hidden glass-card" key={activeTab}>
          <div className="p-5 sm:p-6">

            {/* ABOUT TAB */}
            {activeTab === 'description' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" style={{ color: 'hsl(24, 90%, 55%)' }} />
                  <h3 className="font-headline text-sm tracking-wider text-foreground/80">Historical & Astronomical Significance</h3>
                </div>
                <div
                  className="yantra-description"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              </div>
            )}

            {/* DIMENSIONS TAB */}
            {activeTab === 'dimensions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" style={{ color: 'hsl(24, 90%, 55%)' }} />
                    <h3 className="font-headline text-sm tracking-wider text-foreground/80">Parametric Construction Dimensions</h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{dimEntries.length} parameters</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {dimEntries.map(([key, value], i) => (
                    <StatCard
                      key={key}
                      label={key}
                      value={value}
                      accent={i < 3}
                    />
                  ))}
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl text-xs text-muted-foreground"
                  style={{ background: 'hsla(24, 85%, 42%, 0.06)', border: '1px solid hsla(24, 85%, 42%, 0.12)' }}>
                  <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(24, 90%, 55%)' }} />
                  Dimensions are parametrically computed from the geographic coordinates using authentic astronomical formulae from the Jantar Mantar specifications.
                </div>
              </div>
            )}

            {/* ANALYSIS TAB */}
            {activeTab === 'analysis' && (
              <div className="space-y-5">
                {/* BOM Table */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" style={{ color: 'hsl(24, 90%, 55%)' }} />
                    <h3 className="font-headline text-sm tracking-wider text-foreground/80">Bill of Materials</h3>
                  </div>
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsla(220, 25%, 14%, 1)' }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{ background: 'hsla(220, 28%, 8%, 0.8)', borderBottomColor: 'hsla(220, 25%, 14%, 1)' }}>
                          <TableHead className="text-[10px] uppercase tracking-widest font-medium py-2.5 text-muted-foreground">Material / Specification</TableHead>
                          <TableHead className="text-right text-[10px] uppercase tracking-widest font-medium py-2.5 text-muted-foreground">Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.analysis.billOfMaterials.map((item, index) => (
                          <TableRow
                            key={index}
                            className="transition-colors"
                            style={{ borderBottomColor: 'hsla(220, 25%, 14%, 0.6)' }}
                          >
                            <TableCell className="py-2.5 text-xs font-medium text-foreground/85">{item.item}</TableCell>
                            <TableCell className="py-2.5 text-right text-xs text-muted-foreground">{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <SectionDivider label="Assessment" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl space-y-2"
                    style={{ background: 'hsla(43, 100%, 52%, 0.06)', border: '1px solid hsla(43, 100%, 52%, 0.15)' }}>
                    <div className="flex items-center gap-1.5">
                      <CircleDollarSign className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 55%)' }} />
                      <h4 className="font-headline text-xs tracking-wider" style={{ color: 'hsl(43, 100%, 62%)' }}>Cost Estimate</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{data.analysis.costEstimate}</p>
                  </div>
                  <div className="p-4 rounded-xl space-y-2"
                    style={{ background: 'hsla(24, 90%, 55%, 0.06)', border: '1px solid hsla(24, 90%, 55%, 0.15)' }}>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" style={{ color: 'hsl(24, 90%, 60%)' }} />
                      <h4 className="font-headline text-xs tracking-wider" style={{ color: 'hsl(24, 90%, 62%)' }}>Astronomical Accuracy</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{data.analysis.accuracy}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ORIENTATION TAB */}
            {activeTab === 'orientation' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlignCenter className="h-4 w-4" style={{ color: 'hsl(24, 90%, 55%)' }} />
                  <h3 className="font-headline text-sm tracking-wider text-foreground/80">Site Installation & Alignment</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { icon: Compass, label: 'True North Meridian Alignment', value: data.analysis.orientation.trueNorthAngle, color: 'hsl(24, 90%, 55%)' },
                    { icon: MapPin, label: 'Magnetic Declination Correction', value: data.analysis.orientation.magneticDeclination, color: 'hsl(43, 100%, 52%)' },
                    { icon: HardHat, label: 'Foundation Engineering', value: data.analysis.orientation.foundationNotes, color: 'hsl(180, 65%, 48%)' },
                    { icon: Scale, label: 'Tolerance & Calibration Guidance', value: data.analysis.orientation.toleranceGuidance, color: 'hsl(145, 60%, 48%)' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex gap-3 p-4 rounded-xl"
                      style={{ background: 'hsla(220, 28%, 8%, 0.6)', border: '1px solid hsla(220, 25%, 14%, 0.8)' }}>
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                        style={{ 
                          background: 'hsla(220, 28%, 14%, 0.8)',
                          border: '1px solid hsla(220, 25%, 22%, 1)'
                        }}>
                        <Icon className="h-3.5 w-3.5" style={{ color }} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
                        <p className="text-xs text-foreground/80 leading-relaxed">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex-1 sm:flex-none gap-2 text-sm font-medium h-10 px-5"
                style={{
                  background: 'linear-gradient(135deg, hsl(24, 85%, 42%), hsl(24, 90%, 52%))',
                  boxShadow: '0 4px 16px hsla(24, 90%, 55%, 0.3)',
                  border: 'none',
                  color: 'white'
                }}
              >
                <Download className="h-4 w-4" />
                Export Files
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56"
              style={{ background: 'hsl(220, 32%, 7%)', border: '1px solid hsla(220, 25%, 18%, 1)' }}>
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">CAD & 3D Formats</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'hsla(220, 25%, 14%, 1)' }} />
              <DropdownMenuItem onClick={handleStlDownload} className="cursor-pointer gap-3 focus:bg-primary/10">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsla(24, 90%, 55%, 0.15)', border: '1px solid hsla(24, 90%, 55%, 0.3)' }}>
                  <Box className="h-3.5 w-3.5" style={{ color: 'hsl(24, 90%, 60%)' }} />
                </div>
                <div>
                  <p className="font-medium text-xs">STL 3D Model (.stl)</p>
                  <p className="text-[10px] text-muted-foreground">3D Printing / FreeCAD / Cura</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDxfDownload} className="cursor-pointer gap-3 focus:bg-accent/10">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsla(43, 100%, 52%, 0.12)', border: '1px solid hsla(43, 100%, 52%, 0.25)' }}>
                  <FileCode className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 55%)' }} />
                </div>
                <div>
                  <p className="font-medium text-xs">AutoCAD DXF (.dxf)</p>
                  <p className="text-[10px] text-muted-foreground">2D/3D Vector Drawing</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleJsonDownload} className="cursor-pointer gap-3 focus:bg-emerald-500/10">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsla(145, 60%, 48%, 0.12)', border: '1px solid hsla(145, 60%, 48%, 0.25)' }}>
                  <FileJson className="h-3.5 w-3.5" style={{ color: 'hsl(145, 60%, 52%)' }} />
                </div>
                <div>
                  <p className="font-medium text-xs">Specification (.json)</p>
                  <p className="text-[10px] text-muted-foreground">Parametric Dimensions & BOM</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setIsArModalOpen(true)}
            variant="outline"
            className="flex-1 sm:flex-none gap-2 text-sm h-10 px-5"
            style={{
              background: 'hsla(220, 28%, 9%, 0.8)',
              border: '1px solid hsla(24, 90%, 55%, 0.25)',
              color: 'hsl(24, 90%, 60%)'
            }}
          >
            <Camera className="h-4 w-4" />
            AR Preview
          </Button>
        </div>
      </div>

      <ArModal isOpen={isArModalOpen} onClose={() => setIsArModalOpen(false)} yantraId={data.yantraId as import('@/lib/yantras').Yantra['id']} />
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
