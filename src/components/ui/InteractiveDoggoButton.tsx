"use client";

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function InteractiveDoggoButton({ className, href = "/dashboard", size = "default" }: { className?: string, href?: string, size?: "default" | "large" }) {
  const { RiveComponent, rive } = useRive({
    src: '/3302-6944-interactive-ui-doggo.riv',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomCenter }),
  });

  return (
    <div 
      className={cn("relative group inline-block", className)}
      onMouseEnter={() => rive?.play()}
    >
      {/* Doggo sitting on top of the button */}
      <div className="absolute bottom-[80%] left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none z-20">
        <RiveComponent />
      </div>

      <Link 
        href={href} 
        className={cn(
          "relative z-30 bg-white text-black flex items-center justify-center font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl",
          size === "large" ? "h-14 px-10 rounded-2xl text-sm tracking-widest uppercase" : "w-full sm:w-auto h-12 px-7 rounded-xl text-[13px] shadow-white/5"
        )}
      >
        <span className="relative z-10 flex items-center">
          Get started
          {size === "large" ? (
            <ArrowRight size={18} className="ml-2" />
          ) : (
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          )}
        </span>
      </Link>
    </div>
  );
}
