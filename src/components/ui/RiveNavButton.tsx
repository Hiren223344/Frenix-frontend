"use client";

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function RiveNavButton({ className, isMobile, onClick }: { className?: string, isMobile?: boolean, onClick?: () => void }) {
  const { RiveComponent, rive } = useRive({
    src: '/3302-6944-interactive-ui-doggo.riv',
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  return (
    <Link href="/signin" onClick={onClick} className={isMobile ? "w-full" : ""}>
      <Button 
        size={isMobile ? "default" : "sm"} 
        className={cn(
          "relative overflow-hidden group border border-white/10 shadow-lg bg-white/10 hover:bg-white/20 transition-all",
          isMobile ? "w-full h-12 rounded-xl font-bold" : "text-xs h-8 px-6 ml-1 rounded-full",
          className
        )}
        onMouseEnter={() => rive?.play()}
      >
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-80 mix-blend-screen">
          <RiveComponent />
        </div>
        <span className="relative z-10 flex items-center drop-shadow-md font-bold tracking-widest uppercase">
          Get Started
        </span>
      </Button>
    </Link>
  );
}
