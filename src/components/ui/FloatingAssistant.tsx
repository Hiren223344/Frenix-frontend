"use client";

import { useRive, Layout, Fit, Alignment, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tips = [
  "Enable Edge Caching for <40ms latency.",
  "Swap providers dynamically in settings.",
  "Review Intelligence Distribution.",
  "Secure calls with key rotation."
];

export default function FloatingAssistant() {
  const [tipIndex, setTipIndex] = useState(0);

  const { RiveComponent, rive } = useRive({
    src: '/17319-32483-rimix-of-ryuheis-character-facial-animation.riv',
    autoplay: true,
    stateMachines: "State Machine 1",
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  // Comprehensive list of possible input names for tracking
  const ix1 = useStateMachineInput(rive, "State Machine 1", "xAxis");
  const iy1 = useStateMachineInput(rive, "State Machine 1", "yAxis");
  const ix2 = useStateMachineInput(rive, "State Machine 1", "mouseX");
  const iy2 = useStateMachineInput(rive, "State Machine 1", "mouseY");
  const ix3 = useStateMachineInput(rive, "State Machine 1", "Number 1");
  const iy3 = useStateMachineInput(rive, "State Machine 1", "Number 2");

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 10000);

    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Normalize to 0-100
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      [ix1, ix2, ix3].forEach(input => { if (input) input.value = x; });
      [iy1, iy2, iy3].forEach(input => { if (input) input.value = y; });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      clearInterval(interval);
    };
  }, [ix1, ix2, ix3, iy1, iy2, iy3]);

  return (
    <div className="fixed top-24 left-8 z-[100] flex items-center gap-4 pointer-events-none">
      {/* Circle Avatar - Old Style Mask */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden border-4 border-white bg-[#efefef] shadow-2xl relative"
      >
        <div className="absolute inset-0 w-[140%] h-[140%] -left-[20%] -top-[20%]">
          <RiveComponent />
        </div>
      </motion.div>

      {/* AI Tip Bubble */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/95 backdrop-blur-md rounded-[20px] rounded-tl-sm p-4 border border-white/20 shadow-2xl max-w-[200px]"
      >
        <div className="text-[9px] font-['Ranade'] font-normal uppercase tracking-[0.25em] text-emerald-600/40 mb-1.5 drop-shadow-sm">AI Assistant</div>
        <div className="relative h-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="text-[12px] font-['Ranade'] font-normal text-slate-600 leading-tight italic"
            >
              "{tips[tipIndex]}"
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
