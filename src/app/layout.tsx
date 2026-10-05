import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'YantraVis — Ancient Astronomical Instruments of India',
  description: 'Parametric 3D construction, CAD exports, and solar shadow simulations for ancient Indian Yantras. Powered by celestial mathematics and generative AI.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="%230b0e14" stroke="%23f59e0b" stroke-width="2"/><circle cx="24" cy="24" r="16" fill="none" stroke="%23ea580c" stroke-width="1.5"/><line x1="24" y1="2" x2="24" y2="46" stroke="%23fbbf24" stroke-width="1.5"/><line x1="2" y1="24" x2="46" y2="24" stroke="%23fbbf24" stroke-width="1.5"/><polygon points="24,10 36,36 12,36" fill="none" stroke="%23f59e0b" stroke-width="1.5"/><circle cx="24" cy="24" r="3.5" fill="%23fbbf24"/></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen selection:bg-primary/30 selection:text-primary-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
