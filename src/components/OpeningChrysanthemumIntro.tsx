import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface OpeningChrysanthemumIntroProps {
  onEnter: () => void;
  isOpen: boolean;
}

export const OpeningChrysanthemumIntro: React.FC<OpeningChrysanthemumIntroProps> = ({
  onEnter,
  isOpen
}) => {
  const [bloomPhase, setBloomPhase] = useState<'bud' | 'opening' | 'full'>('bud');
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // 72 Concentric Petals
  const petals = useMemo(() => {
    const list: Array<{
      id: number;
      angle: number;
      length: number;
      width: number;
      curve: number;
      delay: number;
      color: string;
      d: string;
    }> = [];

    const whorls = [
      { count: 24, length: 116, width: 22, curve: 14, delay: 0.15, color: '#FCE7EB' }, // Outermost soft blush
      { count: 20, length: 96, width: 20, curve: 18, delay: 0.55, color: '#F8B4C4' },  // Rose
      { count: 16, length: 76, width: 17, curve: 24, delay: 0.95, color: '#F0809C' },  // Deep petal pink
      { count: 12, length: 52, width: 14, curve: 30, delay: 1.35, color: '#D95276' }   // Core ruby pink
    ];

    let id = 0;
    whorls.forEach((whorl, wIdx) => {
      const step = 360 / whorl.count;
      for (let i = 0; i < whorl.count; i++) {
        const length = whorl.length + (Math.sin(i * 1.5) * 4);
        const width = whorl.width;
        const d = `M 0 0 C -${width * 0.4} -${length * 0.3}, -${width * 0.5} -${length * 0.75}, 0 -${length} C ${width * 0.5} -${length * 0.75}, ${width * 0.4} -${length * 0.3}, 0 0 Z`;

        list.push({
          id: id++,
          angle: (wIdx * 15) + (i * step),
          length,
          width,
          curve: whorl.curve + (i % 2 === 0 ? 3 : -3),
          delay: +(whorl.delay + (i * 0.02)).toFixed(2),
          color: whorl.color,
          d
        });
      }
    });
    return list;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setBloomPhase('bud');
      const t1 = setTimeout(() => {
        setBloomPhase('opening');
        sound.playBloomChime();
      }, 300);

      const t2 = setTimeout(() => {
        setBloomPhase('full');
      }, 2400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isBloomed = bloomPhase !== 'bud';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#16241B] text-[#FAF7F2] overflow-hidden"
      >
        {/* Deep botanical ambient aura */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#F7ADC0]/20 via-[#46684F]/15 to-transparent blur-3xl animate-pulse" />
        </div>

        {/* Audio Mute button in top right */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] transition-colors border border-white/10 cursor-pointer"
            title={isMuted ? "Unmute chime" : "Mute chime"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#F7ADC0]" />}
          </button>
        </div>

        {/* Header Greeting with requested poem / text */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 mb-4 max-w-xl px-4"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#C4D7C7] block mb-2">
            for ink
          </span>
          <p className="text-lg sm:text-2xl font-serif italic text-[#FFF5F7] font-normal leading-relaxed tracking-wide text-balance">
            “November is a very special month for all of the people around you. It is a gift from God, you are a Gift from God. Our heaven sent, my heaven sent.”
          </p>
        </motion.div>

        {/* The Blooming Chrysanthemum Animation Canvas/SVG */}
        <div className="relative w-72 h-72 sm:w-92 sm:h-92 flex items-center justify-center my-1">
          {/* Central Radiance Glow */}
          <div
            className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#F8B4C4] to-[#7EA887] blur-3xl opacity-35"
            style={{
              transform: bloomPhase === 'full' ? 'scale(1.05)' : 'scale(0.85)',
              transition: 'transform 3s ease-in-out'
            }}
          />

          <svg
            viewBox="-160 -160 320 320"
            className="w-full h-full overflow-visible drop-shadow-2xl"
          >
            <defs>
              <radialGradient id="introCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="60%" stopColor="#F5B800" />
                <stop offset="100%" stopColor="#4A6B53" />
              </radialGradient>
            </defs>

            {/* Sage Sepals */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <path
                key={`intro-sepal-${i}`}
                d="M0,0 C-12,20 -15,60 0,78 C15,60 12,20 0,0 Z"
                fill="#3E5E46"
                stroke="#2B4332"
                strokeWidth="1"
                style={{
                  transformOrigin: '0 0',
                  transform: `rotate(${deg + 15}deg) scale(${isBloomed ? 1.05 : 0.5})`,
                  opacity: 0.95,
                  transition: 'transform 1.4s ease-out',
                  willChange: 'transform'
                }}
              />
            ))}

            {/* 72 Fast GPU-composited Chrysanthemum Petals */}
            {petals.map((petal) => (
              <g
                key={`intro-petal-${petal.id}`}
                style={{
                  transformOrigin: '0 0',
                  transform: `rotate(${petal.angle}deg) scale(${isBloomed ? 1 : 0.16})`,
                  opacity: isBloomed ? 0.93 : 0.2,
                  transition: `transform 1.6s cubic-bezier(0.2, 0.9, 0.3, 1) ${isBloomed ? petal.delay : 0}s, opacity 1.6s ease ${isBloomed ? petal.delay : 0}s`,
                  willChange: 'transform, opacity'
                }}
              >
                <path
                  d={petal.d}
                  fill={petal.color}
                  stroke="#FFFFFF"
                  strokeWidth="0.6"
                  strokeOpacity="0.45"
                />
                <line
                  x1="0"
                  y1="-4"
                  x2="0"
                  y2={-petal.length * 0.85}
                  stroke="#FFFFFF"
                  strokeWidth="0.75"
                  strokeOpacity="0.5"
                />
              </g>
            ))}

            {/* Central Golden Receptacle */}
            <circle
              cx="0"
              cy="0"
              r="19"
              fill="url(#introCoreGlow)"
              style={{
                transformOrigin: '0 0',
                transform: `scale(${isBloomed ? 1 : 0.5})`,
                transition: 'transform 1.8s ease-out'
              }}
            />

            {/* Stamen florets */}
            {[...Array(16)].map((_, idx) => {
              const angle = (idx / 16) * 360;
              const r = 9;
              const cx = Math.cos((angle * Math.PI) / 180) * r;
              const cy = Math.sin((angle * Math.PI) / 180) * r;
              return (
                <circle
                  key={`intro-stamen-${idx}`}
                  cx={cx}
                  cy={cy}
                  r="1.8"
                  fill="#FFF7CC"
                  opacity="0.9"
                />
              );
            })}
          </svg>
        </div>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="z-10 mt-5 flex flex-col items-center gap-2"
        >
          <button
            onClick={onEnter}
            className="px-8 py-3.5 rounded-full bg-[#E26887] hover:bg-[#D45575] text-white font-serif text-lg tracking-wide flex items-center gap-2 shadow-xl shadow-[#E26887]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Enter for ink</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#C4D7C7]/80">
            Music will automatically start playing
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
