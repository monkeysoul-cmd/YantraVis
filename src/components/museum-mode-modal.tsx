'use client';

import { useState, useEffect, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getEducationalContent } from '@/app/actions';
import { Loader2, Printer, Wrench, Package, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from './ui/scroll-area';
import type { YantraData } from '@/lib/schema/yantra';
import type { GenerateEducationalContentOutput } from '@/lib/schema/educational-content';

type MuseumModeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  yantraData: YantraData;
};

export default function MuseumModeModal({ isOpen, onClose, yantraData }: MuseumModeModalProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState<GenerateEducationalContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && !content) {
      startTransition(async () => {
        const result = await getEducationalContent(yantraData);
        if ('error' in result) {
          setError(result.error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
          });
        } else {
          setContent(result);
        }
      });
    }
  }, [isOpen, content, yantraData, toast]);

  const handlePrint = () => {
    if (!content?.printableTemplate) return;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Yantra Template</title>');
      printWindow.document.write('<style>@media print { body { -webkit-print-color-adjust: exact; } }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(content.printableTemplate);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="font-headline">Generating Educational Content...</p>
          <p className="text-sm">Please wait, the AI is crafting your guide.</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-destructive text-center p-8">{error}</div>;
    }

    if (!content) {
      return null;
    }

    return (
      <Tabs defaultValue="description" className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description"><Info className="mr-2" />About</TabsTrigger>
          <TabsTrigger value="build"><Wrench className="mr-2" />Build</TabsTrigger>
          <TabsTrigger value="template"><Printer className="mr-2" />Template</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-grow mt-4">
          <TabsContent value="description" className="px-1">
            <h4 className="font-headline text-xl mb-2 text-primary">What is it?</h4>
            <p className="text-muted-foreground">{content.simplifiedDescription}</p>
          </TabsContent>
          <TabsContent value="build" className="px-1">
            <h4 className="font-headline text-xl mb-2 text-primary">Parts List</h4>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground space-y-1">
              {content.partsList.map((part, index) => (
                <li key={index}><Package className="inline-block mr-2 h-4 w-4 text-accent" />{part}</li>
              ))}
            </ul>
            <h4 className="font-headline text-xl mb-2 text-primary">Build Instructions</h4>
            <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
              {content.buildSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </TabsContent>
          <TabsContent value="template" className="px-1 text-center">
            <h4 className="font-headline text-xl mb-2 text-primary">Printable Template</h4>
            <p className="text-sm text-muted-foreground mb-4">Click the SVG to preview or use the button to print.</p>
            <div 
              className="border rounded-md p-4 bg-white cursor-pointer"
              dangerouslySetInnerHTML={{ __html: content.printableTemplate }}
              onClick={() => {
                const newWindow = window.open();
                newWindow?.document.write(content.printableTemplate);
              }}
            />
            <Button onClick={handlePrint} className="mt-4">
              <Printer className="mr-2 h-4 w-4" />
              Print Template
            </Button>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl">Museum Mode: {yantraData.yantraName}</DialogTitle>
          <DialogDescription>
            An educational guide to understanding and building your own yantra.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-auto py-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
