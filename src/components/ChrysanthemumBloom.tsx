import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flower2, Heart, Volume2, VolumeX, X, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface ChrysanthemumBloomProps {
  recipientName: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenTodayLetter?: () => void;
  hasTodayLetter?: boolean;
}

interface PetalData {
  id: number;
  whorl: number; // 0 (outer) to 3 (inner)
  angle: number; // in degrees
  length: number;
  width: number;
  curve: number;
  delay: number;
  color: string;
}

export const ChrysanthemumBloom: React.FC<ChrysanthemumBloomProps> = ({
  recipientName,
  isOpen,
  onClose,
  onOpenTodayLetter,
  hasTodayLetter = true
}) => {
  const [bloomStage, setBloomStage] = useState<'bud' | 'blooming' | 'full'>('bud');
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Generate 72 concentric botanical petals in the golden ratio whorl
  const petals: PetalData[] = useMemo(() => {
    const list: PetalData[] = [];
    const whorlConfigs = [
      // Outer layer (longest, sweeping petals)
      { count: 24, length: 110, width: 22, curve: 12, delayBase: 0.1, color: '#FCE7EB' }, // Softest blush
      // Mid-outer layer
      { count: 20, length: 90, width: 20, curve: 18, delayBase: 0.5, color: '#F8B4C4' }, // Rose pink
      // Mid-inner layer
      { count: 16, length: 70, width: 18, curve: 24, delayBase: 0.9, color: '#F0809C' }, // Petal pink
      // Core tight whorl
      { count: 12, length: 48, width: 14, curve: 30, delayBase: 1.3, color: '#D95276' }  // Deep blush heart
    ];

    let id = 0;
    whorlConfigs.forEach((whorl, wIdx) => {
      const step = 360 / whorl.count;
      for (let i = 0; i < whorl.count; i++) {
        const offsetAngle = (wIdx * 15) + (i * step);
        list.push({
          id: id++,
          whorl: wIdx,
          angle: offsetAngle,
          length: whorl.length + (Math.sin(i * 1.5) * 5),
          width: whorl.width,
          curve: whorl.curve + (i % 2 === 0 ? 3 : -3),
          delay: whorl.delayBase + (i * 0.02),
          color: whorl.color
        });
      }
    });
    return list;
  }, []);

  const triggerBloom = () => {
    setBloomStage('bud');
    setTimeout(() => {
      setBloomStage('blooming');
      sound.playBloomChime();
    }, 200);

    setTimeout(() => {
      setBloomStage('full');
    }, 2400);
  };

  useEffect(() => {
    if (isOpen) {
      triggerBloom();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1B2920]/90 backdrop-blur-md overflow-hidden"
      >
        {/* Ambient background particles & botanical aura */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#FCE7EB]/15 via-[#688D73]/10 to-transparent blur-3xl" />
        </div>

        {/* Top Controls: Sound toggle & Close */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] transition-colors border border-white/10 backdrop-blur-sm"
            title={isMuted ? "Unmute flower chime" : "Mute chime"}
            aria-label="Toggle chime sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#F7ADC0]" />}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] transition-colors border border-white/10 backdrop-blur-sm"
            aria-label="Close blooming modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Blooming Center Card */}
        <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
          {/* Header Title with editorial typography */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-[#C4D7C7] font-medium">
              Daily Birthday Bloom
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#FFF5F7] mt-1 font-normal tracking-wide">
              {recipientName ? `For ${recipientName}` : 'A Bloom For You'}
            </h2>
            <p className="text-sm text-[#D6E3D8] max-w-sm mx-auto mt-1 font-light">
              Every day unfurls a new petal of love and memories as your birthday nears.
            </p>
          </motion.div>

          {/* The Blooming Chrysanthemum Canvas / SVG */}
          <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center my-2 cursor-pointer" onClick={triggerBloom} title="Click to bloom again">
            {/* Soft background glow */}
            <motion.div
              animate={{
                scale: bloomStage === 'full' ? [1, 1.06, 1] : 0.8,
                opacity: bloomStage === 'full' ? 0.35 : 0.15
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-[#F8B4C4] to-[#B3D0BA] blur-2xl"
            />

            <svg
              viewBox="-160 -160 320 320"
              className="w-full h-full overflow-visible drop-shadow-xl"
            >
              <defs>
                {/* Radial glow for core */}
                <radialGradient id="kikuCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF2A3" stopOpacity="1" />
                  <stop offset="60%" stopColor="#F5B800" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#5E8364" stopOpacity="0.8" />
                </radialGradient>
                <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A6B53" />
                  <stop offset="100%" stopColor="#2E4835" />
                </linearGradient>
              </defs>

              {/* Underlying Sage Sepals */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <motion.path
                  key={`sepal-${i}`}
                  d="M0,0 C-12,20 -15,60 0,75 C15,60 12,20 0,0 Z"
                  fill="#46684F"
                  stroke="#334E3A"
                  strokeWidth="0.8"
                  transform={`rotate(${deg + 15})`}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{
                    scale: bloomStage === 'bud' ? 0.6 : 1.1,
                    opacity: 0.95
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              ))}

              {/* Layered Concentric Chrysanthemum Petals */}
              {petals.map((petal) => {
                const isBloomed = bloomStage !== 'bud';
                // Calculate petal curve path radiating from center
                const d = `M 0 0 
                  C -${petal.width * 0.4} -${petal.length * 0.3}, -${petal.width * 0.5} -${petal.length * 0.75}, 0 -${petal.length}
                  C ${petal.width * 0.5} -${petal.length * 0.75}, ${petal.width * 0.4} -${petal.length * 0.3}, 0 0 Z`;

                return (
                  <motion.g
                    key={`petal-${petal.id}`}
                    transform={`rotate(${petal.angle})`}
                    initial={{ scaleY: 0.15, scaleX: 0.15, opacity: 0 }}
                    animate={{
                      scaleY: isBloomed ? 1 : 0.2,
                      scaleX: isBloomed ? 1 : 0.2,
                      opacity: isBloomed ? 0.92 : 0.3
                    }}
                    transition={{
                      duration: 1.6,
                      delay: isBloomed ? petal.delay : 0,
                      ease: [0.25, 1, 0.5, 1]
                    }}
                  >
                    <path
                      d={d}
                      fill={petal.color}
                      stroke="#FFFFFF"
                      strokeWidth="0.6"
                      strokeOpacity="0.4"
                    />
                    {/* Delicate petal vein highlight */}
                    <line
                      x1="0"
                      y1="-5"
                      x2="0"
                      y2={-petal.length * 0.85}
                      stroke="#FFFFFF"
                      strokeWidth="0.75"
                      strokeOpacity="0.45"
                    />
                  </motion.g>
                );
              })}

              {/* Central Golden Receptacle with dense florets */}
              <motion.circle
                cx="0"
                cy="0"
                r="18"
                fill="url(#kikuCoreGlow)"
                initial={{ scale: 0.3 }}
                animate={{
                  scale: bloomStage === 'full' ? [1, 1.08, 1] : 0.7
                }}
                transition={{
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              />

              {/* Core golden stamen texture dots */}
              {[...Array(16)].map((_, idx) => {
                const angle = (idx / 16) * 360;
                const r = 9;
                const cx = Math.cos((angle * Math.PI) / 180) * r;
                const cy = Math.sin((angle * Math.PI) / 180) * r;
                return (
                  <circle
                    key={`stamen-${idx}`}
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

          {/* Action buttons & cues */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 w-full"
          >
            {hasTodayLetter && onOpenTodayLetter && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTodayLetter();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#E26887] hover:bg-[#D45575] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E26887]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Read Today's Letter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={triggerBloom}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 text-[#FFF5F7] font-medium text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Flower2 className="w-4 h-4 text-[#F7ADC0]" />
              <span>Bloom Again</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-full text-[#D6E3D8] hover:text-white font-medium text-sm transition-colors"
            >
              View Countdown
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
