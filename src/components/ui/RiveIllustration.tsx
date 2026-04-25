"use client";

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export default function RiveIllustration() {
  const { RiveComponent } = useRive({
    src: '/110-170-flying-car.riv',
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  return (
    <div 
      className="absolute inset-y-0 right-0 w-full lg:w-[65%] h-full pointer-events-none z-0"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)'
      }}
    >
      <RiveComponent />
    </div>
  );
}
