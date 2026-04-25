"use client";

import { useRive, Layout, Fit, Alignment, useStateMachineInput } from '@rive-app/react-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const tips = [
  "Edge caching for <40ms latency.",
  "Swap providers in settings.",
  "Review Intelligence Distribution.",
  "Secure calls with key rotation."
];

export default function DashboardTipCard({ totalRequests = 0 }: { totalRequests?: number }) {
  const [tipIndex, setTipIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { RiveComponent, rive } = useRive({
    src: '/17319-32483-rimix-of-ryuheis-character-facial-animation.riv',
    autoplay: true,
    stateMachines: "State Machine 1",
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  // Track mouse inputs for character facial tracking
  const ix1 = useStateMachineInput(rive, "State Machine 1", "xAxis");
  const iy1 = useStateMachineInput(rive, "State Machine 1", "yAxis");
  const ix2 = useStateMachineInput(rive, "State Machine 1", "mouseX");
  const iy2 = useStateMachineInput(rive, "State Machine 1", "mouseY");
  const ix3 = useStateMachineInput(rive, "State Machine 1", "Number 1");
  const iy3 = useStateMachineInput(rive, "State Machine 1", "Number 2");

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    [ix1, ix2, ix3].forEach(input => { if (input) input.value = x; });
    [iy1, iy2, iy3].forEach(input => { if (input) input.value = y; });
  };

  return (
    <motion.div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="col-span-1 h-full min-h-[140px] relative flex group"
    >
      {/* Light Chat Bubble Card with Refractive Edge */}
      <div className="w-full h-full bg-white/90 backdrop-blur-xl rounded-[24px] rounded-bl-none p-5 md:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)] relative flex flex-col justify-start overflow-visible border border-white/40 transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] group-hover:-translate-y-0.5">
        
        {/* Premium Refractive Edge */}
        <div className="absolute inset-0 rounded-[24px] rounded-bl-none pointer-events-none border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />

        {/* Chat Bubble Tail - Sophisticated sharp look */}
        <div className="absolute -bottom-[12px] left-0 w-0 h-0 border-t-[12px] border-t-white/90 border-r-[18px] border-r-transparent drop-shadow-lg" />

        {/* Character Avatar - TIGHTER IMPACT */}
        <div 
          className="absolute -top-10 -left-10 w-[100px] h-[100px] md:w-[120px] md:h-[120px] shrink-0 rounded-full overflow-hidden border-[4px] border-white bg-[#f8f8f8] shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-30 group-hover:scale-105 transition-transform duration-700 ease-out"
        >
          <div className="absolute inset-0 w-[150%] h-[150%] -left-[25%] -top-[25%]">
            <RiveComponent />
          </div>
        </div>

        <div className="flex flex-col relative z-10 items-start text-left pl-14 md:pl-16">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="text-[9px] font-['Ranade'] font-medium uppercase tracking-[0.3em] text-emerald-600 block mb-2"
          >
            Gateway Intelligence
          </motion.span>
          
          <div className="flex items-center gap-2 mb-3">
             <span className="text-3xl md:text-4xl font-['Ranade'] font-light text-slate-900 tracking-tighter leading-none">
              {totalRequests.toLocaleString()}
             </span>
             <div className="flex flex-col">
                <span className="text-[8px] font-['Ranade'] font-normal text-slate-400 uppercase tracking-[0.2em] leading-tight opacity-50">Total</span>
                <span className="text-[8px] font-['Ranade'] font-normal text-slate-400 uppercase tracking-[0.2em] leading-tight opacity-50">Requests</span>
             </div>
          </div>
          
          <div className="relative h-10 w-full mt-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={tipIndex}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="text-[13px] md:text-[14px] font-['Ranade'] font-light text-slate-500 leading-snug absolute inset-x-0 top-0 italic"
              >
                "{tips[tipIndex]}"
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
