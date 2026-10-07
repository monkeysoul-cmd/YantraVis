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

import { YANTRA_KNOWLEDGE } from '@/lib/yantra-knowledge';

type TabKey = 'description' | 'dimensions' | 'analysis' | 'orientation';

const TABS: { key: TabKey; label: string; icon: typeof Info }[] = [
  { key: 'description', label: 'About & Working', icon: Info },
  { key: 'dimensions', label: 'Dimensions', icon: Ruler },
  { key: 'analysis', label: 'BOM & Analysis', icon: Layers },
  { key: 'orientation', label: 'Orientation', icon: AlignCenter },
];

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(to right, transparent, hsla(24, 85%, 42%, 0.2))' }} />
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(to left, transparent, hsla(24, 85%, 42%, 0.2))' }} />
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
    <div className="dimension-card group rounded-xl p-4 flex flex-col gap-1.5"
      style={{
        background: accent
          ? 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.10), hsla(43, 100%, 52%, 0.06))'
          : 'hsla(225, 35%, 6%, 0.6)',
        border: `1px solid ${accent ? 'hsla(43, 100%, 52%, 0.2)' : 'hsla(225, 22%, 12%, 0.8)'}`,
      }}>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3 text-muted-foreground/50" />}
        <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground leading-none">
          {label.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim()}
        </p>
      </div>
      <p className="font-headline text-base font-semibold leading-tight stat-value"
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

  const dimEntries = Object.entries(data?.dimensions || {});

  return (
    <>
      <div className="space-y-4 animate-rise-fade">

        {/* ── Header Block ── */}
        <div className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsla(225, 42%, 4%, 1), hsla(225, 35%, 7%, 1))',
            border: '1px solid hsla(24, 85%, 42%, 0.12)',
          }}>
          {/* Ambient light top right */}
          <div className="absolute top-0 right-0 w-80 h-48 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top right, hsla(43, 100%, 52%, 0.06) 0%, transparent 70%)' }} />
          {/* Ambient light bottom left */}
          <div className="absolute bottom-0 left-0 w-48 h-32 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at bottom left, hsla(24, 90%, 55%, 0.04) 0%, transparent 70%)' }} />
          
          <div className="relative p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="info-pill flex items-center gap-1">
                    <Compass className="h-3 w-3" />
                    Parametric Active
                  </span>
                  <span className="info-pill-gold flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {data.location.latitude.toFixed(3)}° N
                  </span>
                  {YANTRA_KNOWLEDGE[data.yantraId] && (
                    <>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-serif"
                        style={{
                          background: 'hsla(43, 100%, 52%, 0.08)',
                          border: '1px solid hsla(43, 100%, 52%, 0.2)',
                          color: 'hsl(43, 100%, 62%)',
                        }}>
                        {YANTRA_KNOWLEDGE[data.yantraId].devanagari}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px]"
                        style={{
                          background: 'hsla(24, 90%, 55%, 0.06)',
                          border: '1px solid hsla(24, 90%, 55%, 0.15)',
                          color: 'hsl(24, 90%, 62%)',
                        }}>
                        {YANTRA_KNOWLEDGE[data.yantraId].category}
                      </span>
                    </>
                  )}
                </div>
                <div>
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold leading-tight text-gradient-gold">
                    {data.yantraName}
                  </h2>
                  {YANTRA_KNOWLEDGE[data.yantraId] && (
                    <p className="text-xs font-medium mt-1 italic"
                      style={{ color: 'hsla(38, 60%, 75%, 0.7)' }}>
                      "{YANTRA_KNOWLEDGE[data.yantraId].meaning}"
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  Calibrated for {data.location.latitude.toFixed(4)}° N, {data.location.longitude.toFixed(4)}° E
                </p>
              </div>

              {/* Quick action controls */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                {/* Day/Night toggle */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: 'hsla(225, 35%, 8%, 0.8)',
                    border: '1px solid hsla(225, 22%, 16%, 0.8)',
                  }}>
                  <Sun className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 58%)' }} />
                  <Switch
                    id="animate-shadow"
                    checked={animateShadow}
                    onCheckedChange={setAnimateShadow}
                    className="scale-90"
                    aria-label="Simulate Day/Night Shadow"
                  />
                  <Moon className="h-3.5 w-3.5 text-muted-foreground/50" />
                </div>
                {/* Expand button */}
                <Button
                  onClick={() => setIsFullScreenModalOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  style={{ border: '1px solid hsla(225, 22%, 16%, 0.8)' }}
                  title="Full Screen 3D Viewer"
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3D Viewer ── */}
        <div className="relative rounded-2xl overflow-hidden viewer-frame h-[320px] sm:h-[400px]">
          <YantraViewer
            ref={viewerRef}
            yantraId={data.yantraId as import('@/lib/yantras').Yantra['id']}
            latitude={data.location.latitude}
            animateShadow={animateShadow}
          />
          
          {/* Top overlay gradient */}
          <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, hsla(225, 45%, 3%, 0.6) 0%, transparent 100%)' }} />
          
          {/* Bottom overlay gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, hsla(225, 45%, 3%, 0.5) 0%, transparent 100%)' }} />

          {/* Compass badge */}
          <div className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full"
            style={{
              background: 'hsla(225, 40%, 5%, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid hsla(43, 100%, 52%, 0.2)',
              boxShadow: '0 4px 12px hsla(0, 0%, 0%, 0.3)',
            }}>
            <div className="relative flex items-center justify-center">
              <Compass className="h-4 w-4" style={{ color: 'hsla(38, 25%, 80%, 0.8)' }} />
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold leading-none"
                style={{ color: 'hsl(43, 100%, 58%)' }}>N</div>
            </div>
          </div>

          {/* Viewer info label */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-muted-foreground"
            style={{
              background: 'hsla(225, 40%, 5%, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid hsla(225, 22%, 16%, 0.5)',
            }}>
            WebGL 3D · Drag to orbit · Scroll to zoom
          </div>
        </div>

        {/* ── Tab Navigation — Animated pill slider ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xl p-1.5"
          style={{
            background: 'hsla(225, 35%, 5%, 0.7)',
            border: '1px solid hsla(225, 22%, 12%, 0.8)',
          }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-350 cursor-pointer"
              style={{
                background: activeTab === key
                  ? 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.15), hsla(43, 100%, 52%, 0.10))'
                  : 'transparent',
                color: activeTab === key ? 'hsl(38, 100%, 82%)' : 'hsl(38, 15%, 45%)',
                border: activeTab === key ? '1px solid hsla(43, 100%, 52%, 0.25)' : '1px solid transparent',
                boxShadow: activeTab === key
                  ? '0 0 15px hsla(43, 100%, 52%, 0.08), inset 0 1px 0 hsla(255, 100%, 100%, 0.04)'
                  : 'none',
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab Content with fade animation ── */}
        <div className="rounded-2xl overflow-hidden surface-premium animate-tab-fade" key={activeTab}>
          <div className="p-5 sm:p-6">

            {/* ABOUT TAB */}
            {activeTab === 'description' && (
              <div className="space-y-4 animate-tab-fade">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" style={{ color: 'hsl(24, 90%, 58%)' }} />
                  <h3 className="font-headline text-sm tracking-wider" style={{ color: 'hsla(38, 25%, 85%, 0.85)' }}>
                    Historical & Astronomical Significance
                  </h3>
                </div>
                <div
                  className="yantra-description"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              </div>
            )}

            {/* DIMENSIONS TAB */}
            {activeTab === 'dimensions' && (
              <div className="space-y-4 animate-tab-fade">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" style={{ color: 'hsl(24, 90%, 58%)' }} />
                    <h3 className="font-headline text-sm tracking-wider" style={{ color: 'hsla(38, 25%, 85%, 0.85)' }}>
                      Parametric Construction Dimensions
                    </h3>
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
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl text-xs text-muted-foreground"
                  style={{
                    background: 'hsla(24, 85%, 42%, 0.04)',
                    border: '1px solid hsla(24, 85%, 42%, 0.10)',
                  }}>
                  <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(24, 90%, 55%)' }} />
                  Dimensions are parametrically computed from the geographic coordinates using authentic astronomical formulae from the Jantar Mantar specifications.
                </div>
              </div>
            )}

            {/* ANALYSIS TAB */}
            {activeTab === 'analysis' && (
              <div className="space-y-5 animate-tab-fade">
                {/* BOM Table */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" style={{ color: 'hsl(24, 90%, 58%)' }} />
                    <h3 className="font-headline text-sm tracking-wider" style={{ color: 'hsla(38, 25%, 85%, 0.85)' }}>
                      Bill of Materials
                    </h3>
                  </div>
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsla(225, 22%, 12%, 0.8)' }}>
                    <Table>
                      <TableHeader>
                        <TableRow style={{
                          background: 'hsla(225, 35%, 6%, 0.8)',
                          borderBottomColor: 'hsla(225, 22%, 12%, 0.8)',
                        }}>
                          <TableHead className="text-[10px] uppercase tracking-widest font-medium py-3 text-muted-foreground">Material / Specification</TableHead>
                          <TableHead className="text-right text-[10px] uppercase tracking-widest font-medium py-3 text-muted-foreground">Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(data.analysis?.billOfMaterials || []).map((item, index) => (
                          <TableRow
                            key={index}
                            className="bom-row transition-colors"
                            style={{ borderBottomColor: 'hsla(225, 22%, 12%, 0.5)' }}
                          >
                            <TableCell className="py-3 text-xs font-medium" style={{ color: 'hsla(38, 25%, 85%, 0.85)' }}>{item.item}</TableCell>
                            <TableCell className="py-3 text-right text-xs text-muted-foreground">{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <SectionDivider label="Assessment" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl space-y-2"
                    style={{
                      background: 'linear-gradient(135deg, hsla(43, 100%, 52%, 0.04), hsla(43, 100%, 52%, 0.02))',
                      border: '1px solid hsla(43, 100%, 52%, 0.12)',
                    }}>
                    <div className="flex items-center gap-1.5">
                      <CircleDollarSign className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 58%)' }} />
                      <h4 className="font-headline text-xs tracking-wider" style={{ color: 'hsl(43, 100%, 62%)' }}>Cost Estimate</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{data.analysis?.costEstimate || 'N/A'}</p>
                  </div>
                  <div className="p-4 rounded-xl space-y-2"
                    style={{
                      background: 'linear-gradient(135deg, hsla(24, 90%, 55%, 0.04), hsla(24, 90%, 55%, 0.02))',
                      border: '1px solid hsla(24, 90%, 55%, 0.12)',
                    }}>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" style={{ color: 'hsl(24, 90%, 62%)' }} />
                      <h4 className="font-headline text-xs tracking-wider" style={{ color: 'hsl(24, 90%, 62%)' }}>Astronomical Accuracy</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{data.analysis?.accuracy || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ORIENTATION TAB */}
            {activeTab === 'orientation' && (
              <div className="space-y-4 animate-tab-fade">
                <div className="flex items-center gap-2">
                  <AlignCenter className="h-4 w-4" style={{ color: 'hsl(24, 90%, 58%)' }} />
                  <h3 className="font-headline text-sm tracking-wider" style={{ color: 'hsla(38, 25%, 85%, 0.85)' }}>
                    Site Installation & Alignment
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { icon: Compass, label: 'True North Meridian Alignment', value: data.analysis?.orientation?.trueNorthAngle || '', color: 'hsl(24, 90%, 58%)' },
                    { icon: MapPin, label: 'Magnetic Declination Correction', value: data.analysis?.orientation?.magneticDeclination || '', color: 'hsl(43, 100%, 55%)' },
                    { icon: HardHat, label: 'Foundation Engineering', value: data.analysis?.orientation?.foundationNotes || '', color: 'hsl(180, 65%, 50%)' },
                    { icon: Scale, label: 'Tolerance & Calibration Guidance', value: data.analysis?.orientation?.toleranceGuidance || '', color: 'hsl(145, 60%, 48%)' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex gap-3 p-4 rounded-xl transition-all duration-300 group"
                      style={{
                        background: 'hsla(225, 35%, 6%, 0.6)',
                        border: '1px solid hsla(225, 22%, 12%, 0.6)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'hsla(24, 90%, 55%, 0.15)';
                        e.currentTarget.style.background = 'hsla(225, 35%, 7%, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'hsla(225, 22%, 12%, 0.6)';
                        e.currentTarget.style.background = 'hsla(225, 35%, 6%, 0.6)';
                      }}>
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                        style={{ 
                          background: 'hsla(225, 28%, 10%, 0.8)',
                          border: '1px solid hsla(225, 22%, 18%, 0.8)',
                        }}>
                        <Icon className="h-4 w-4" style={{ color }} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'hsla(38, 25%, 80%, 0.75)' }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Action Buttons — Premium export bar ── */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex-1 sm:flex-none gap-2 text-sm font-medium h-11 px-6 btn-premium cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, hsl(24, 85%, 40%), hsl(24, 90%, 50%))',
                  boxShadow: '0 4px 20px hsla(24, 90%, 55%, 0.3)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '14px',
                }}
              >
                <Download className="h-4 w-4" />
                Export Files
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60 border-0"
              style={{
                background: 'linear-gradient(135deg, hsl(225, 45%, 5%), hsl(225, 40%, 7%))',
                border: '1px solid hsla(225, 22%, 16%, 0.8)',
                boxShadow: '0 15px 50px hsla(0, 0%, 0%, 0.5)',
              }}>
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">CAD & 3D Formats</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'hsla(225, 22%, 14%, 0.6)' }} />
              <DropdownMenuItem onClick={handleStlDownload} className="cursor-pointer gap-3 focus:bg-primary/10 rounded-lg py-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsla(24, 90%, 55%, 0.1)', border: '1px solid hsla(24, 90%, 55%, 0.2)' }}>
                  <Box className="h-3.5 w-3.5" style={{ color: 'hsl(24, 90%, 60%)' }} />
                </div>
                <div>
                  <p className="font-medium text-xs" style={{ color: 'hsla(38, 25%, 88%, 0.9)' }}>STL 3D Model (.stl)</p>
                  <p className="text-[10px] text-muted-foreground">3D Printing / FreeCAD / Cura</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDxfDownload} className="cursor-pointer gap-3 focus:bg-accent/10 rounded-lg py-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsla(43, 100%, 52%, 0.08)', border: '1px solid hsla(43, 100%, 52%, 0.18)' }}>
                  <FileCode className="h-3.5 w-3.5" style={{ color: 'hsl(43, 100%, 58%)' }} />
                </div>
                <div>
                  <p className="font-medium text-xs" style={{ color: 'hsla(38, 25%, 88%, 0.9)' }}>AutoCAD DXF (.dxf)</p>
                  <p className="text-[10px] text-muted-foreground">2D/3D Vector Drawing</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleJsonDownload} className="cursor-pointer gap-3 focus:bg-emerald-500/10 rounded-lg py-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsla(145, 60%, 48%, 0.08)', border: '1px solid hsla(145, 60%, 48%, 0.18)' }}>
                  <FileJson className="h-3.5 w-3.5" style={{ color: 'hsl(145, 60%, 52%)' }} />
                </div>
                <div>
                  <p className="font-medium text-xs" style={{ color: 'hsla(38, 25%, 88%, 0.9)' }}>Specification (.json)</p>
                  <p className="text-[10px] text-muted-foreground">Parametric Dimensions & BOM</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setIsArModalOpen(true)}
            variant="outline"
            className="flex-1 sm:flex-none gap-2 text-sm h-11 px-6 transition-all duration-300 cursor-pointer"
            style={{
              background: 'hsla(225, 35%, 6%, 0.8)',
              border: '1px solid hsla(24, 90%, 55%, 0.2)',
              color: 'hsl(24, 90%, 62%)',
              borderRadius: '14px',
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
