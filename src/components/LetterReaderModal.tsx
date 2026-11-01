import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Calendar, Sparkles, Share2, Check, RotateCcw, Flower2, Mail } from 'lucide-react';
import { DailyLetter, BirthdayLetter16 } from '../types';
import { sound } from '../utils/audio';

type AnyLetter = DailyLetter | BirthdayLetter16;

interface LetterReaderModalProps {
  letter: AnyLetter | null;
  isOpen: boolean;
  onClose: () => void;
  authorName?: string;
  recipientName?: string;
}

export const LetterReaderModal: React.FC<LetterReaderModalProps> = ({
  letter,
  isOpen,
  onClose,
  authorName = 'with love, zzy',
  recipientName = 'ink'
}) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  // Animation stages: 'envelope' -> 'breaking' -> 'sliding' -> 'reading'
  const [stage, setStage] = useState<'envelope' | 'breaking' | 'sliding' | 'reading'>('envelope');

  // Reset or initialize animation whenever a new letter is opened
  useEffect(() => {
    if (isOpen && letter) {
      setHasLiked(false);
      setCopied(false);
      setStage('envelope');
    }
  }, [isOpen, letter]);

  if (!isOpen || !letter) return null;

  const isDaily = 'dayNumber' in letter;
  const letterNumberText = isDaily
    ? `Day ${letter.dayNumber} Countdown Letter`
    : `Letter #${(letter as BirthdayLetter16).letterNumber} of 16 (Nov 13)`;

  const formattedDate = isDaily && (letter as DailyLetter).dateString
    ? new Date((letter as DailyLetter).dateString + 'T00:00:00').toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'November 13, 2026 · Birthday Keepsake';

  const handleBreakSeal = () => {
    sound.playEnvelopeSeal();
    setStage('breaking');
    setTimeout(() => {
      setStage('sliding');
      setTimeout(() => {
        sound.playBloomChime();
        setStage('reading');
      }, 700);
    }, 600);
  };

  const handleReplayOpening = () => {
    setStage('envelope');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: letter.title,
        text: `${letter.title}\n\n${letter.content}\n\nwith love, zzy`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${letter.title}\n\n${letter.content}\n\nwith love, zzy`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
        {/* ENVELOPE OPENING ANIMATION VIEW */}
        {stage !== 'reading' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-lg my-auto flex flex-col items-center"
          >
            {/* Close button in top-right */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hint text */}
            <p className="text-white/80 text-xs sm:text-sm font-medium tracking-wide uppercase mb-4 flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-[#F7ADC0]" />
              <span>Tap the Wax Seal to Open Your Letter</span>
            </p>

            {/* Vintage Envelope Container */}
            <div
              onClick={stage === 'envelope' ? handleBreakSeal : undefined}
              className="relative w-full aspect-[4/3] max-w-md bg-[#E8DDD1] rounded-2xl shadow-2xl border-4 border-[#D9CABB] overflow-hidden cursor-pointer select-none group"
              style={{ perspective: 1000 }}
            >
              {/* Subtle envelope texture and lining */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAF4EC] via-[#E8DDD1] to-[#DACABC]" />

              {/* Postal Stamp Badge */}
              <div className="absolute top-4 right-4 p-2 bg-[#FFF5F7] border border-dashed border-[#E26887] rounded-md shadow-xs flex flex-col items-center rotate-3">
                <Flower2 className="w-5 h-5 text-[#E26887]" />
                <span className="text-[9px] font-mono uppercase text-[#A6304C] font-bold">NOV 13</span>
              </div>

              {/* Envelope Flap Fold Lines */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: 'polygon(0% 100%, 50% 50%, 100% 100%)',
                  background: 'linear-gradient(to top, rgba(200, 185, 170, 0.45), transparent)'
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: 'polygon(0% 0%, 0% 100%, 50% 50%)',
                  background: 'linear-gradient(to right, rgba(210, 195, 180, 0.35), transparent)'
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: 'polygon(100% 0%, 100% 100%, 50% 50%)',
                  background: 'linear-gradient(to left, rgba(210, 195, 180, 0.35), transparent)'
                }}
              />

              {/* Calligraphy Address on Envelope */}
              <div className="absolute left-6 bottom-8 z-10 space-y-1">
                <p className="font-serif italic text-sm text-[#7D6B5A]">To:</p>
                <p className="font-serif italic text-2xl sm:text-3xl font-bold text-[#2E241B]">
                  Dearest {recipientName} 🌸
                </p>
                <p className="text-[11px] text-[#8C7A69] uppercase tracking-widest font-mono">
                  {letterNumberText}
                </p>
              </div>

              {/* LETTER SLIDING UP ANIMATION */}
              <AnimatePresence>
                {(stage === 'sliding' || stage === 'breaking') && (
                  <motion.div
                    initial={{ y: 80, opacity: 0.8 }}
                    animate={{ y: -60, opacity: 1 }}
                    transition={{ duration: 0.65, ease: 'easeInOut' }}
                    className="absolute inset-x-6 top-8 bottom-6 bg-[#FCFAF6] rounded-t-xl shadow-lg border border-[#D0DDD1] p-4 flex flex-col justify-start z-20 letter-stationery"
                  >
                    <div className="h-1.5 w-16 bg-[#E26887]/60 rounded-full mx-auto mb-2" />
                    <p className="font-serif italic text-xs text-[#52775C]">Unfolding keepsake...</p>
                    <h3 className="font-serif text-lg font-bold text-[#1F2E24] mt-1 line-clamp-1">
                      {letter.title}
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TOP TRIANGULAR FLAP WITH 3D FLIP */}
              <motion.div
                animate={{
                  rotateX: stage === 'envelope' ? 0 : 180,
                  transformOrigin: 'top center'
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute top-0 inset-x-0 h-1/2 z-30"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  background: 'linear-gradient(to bottom, #F4EBE1 0%, #D8C7B5 100%)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              />

              {/* CHRYSANTHEMUM WAX SEAL (Centered on the flap tip) */}
              <motion.div
                animate={
                  stage === 'breaking'
                    ? { scale: [1, 1.25, 0], opacity: [1, 1, 0], rotate: [0, 15, -20] }
                    : { scale: [1, 1.05, 1], rotate: [0, -1, 1, 0] }
                }
                transition={
                  stage === 'breaking'
                    ? { duration: 0.5, ease: 'easeOut' }
                    : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }
                className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform"
              >
                {/* Wax seal outer rim with organic vintage bevel */}
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[#E26887] via-[#C84364] to-[#8C233E] p-1 shadow-2xl flex items-center justify-center border-2 border-[#FFE6EB]/40">
                  <div className="w-full h-full rounded-full border border-dashed border-[#FFE6EB]/60 flex flex-col items-center justify-center text-white">
                    <Flower2 className="w-6 h-6 text-[#FFE6EB] drop-shadow-sm" />
                    <span className="text-[9px] font-serif font-black tracking-widest text-[#FFF5F7]">Z & I</span>
                  </div>

                  {/* Sparkle burst on hover */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-300 animate-ping opacity-75" />
                </div>
              </motion.div>

              {/* Sparkle particles during breaking */}
              {stage === 'breaking' && (
                <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1.5, 0],
                        x: (Math.random() - 0.5) * 220,
                        y: (Math.random() - 0.5) * 220,
                        opacity: [1, 0.8, 0]
                      }}
                      transition={{ duration: 0.65, ease: 'easeOut' }}
                      className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-[#F7ADC0] to-[#E26887]"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Click CTA button below envelope */}
            <button
              onClick={handleBreakSeal}
              className="mt-6 px-8 py-3 rounded-full bg-[#46684F] hover:bg-[#334E3A] text-white font-medium text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#F7ADC0]" />
              <span>Break Seal & Unfold Letter</span>
            </button>
          </motion.div>
        ) : (
          /* FULL UNFOLDED LETTER READER VIEW */
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-2xl my-6 bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#D0DDD1] overflow-hidden"
          >
            {/* Top Vintage Botanical Ribbon Bar */}
            <div className="bg-[#46684F] text-[#FAF7F2] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F7ADC0] animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-[#D0DDD1] font-semibold">
                  {letterNumberText}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReplayOpening}
                  className="px-2.5 py-1 rounded-full hover:bg-white/10 text-[#D0DDD1] hover:text-white transition-colors flex items-center gap-1 text-xs cursor-pointer"
                  title="Replay Envelope Opening Animation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fold to Envelope</span>
                </button>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#D0DDD1] hover:text-white transition-colors cursor-pointer"
                  title="Share or copy letter"
                  aria-label="Share letter"
                >
                  {copied ? <Check className="w-4 h-4 text-[#F7ADC0]" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#D0DDD1] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close letter"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letter Parchment Body */}
            <div className="p-6 sm:p-10 letter-stationery max-h-[80vh] overflow-y-auto">
              <div className="border-b border-[#D0DDD1]/60 pb-6 mb-6">
                <div className="flex items-center gap-2 text-xs text-[#52775C] mb-2 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formattedDate}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2E24] font-semibold leading-tight">
                  {letter.title}
                </h2>
              </div>

              <p className="font-serif italic text-lg sm:text-xl text-[#52775C] mb-5">
                My dearest {recipientName},
              </p>

              <div className="prose prose-stone max-w-none text-base sm:text-lg leading-relaxed text-[#263B2D] space-y-4 font-sans font-light">
                {letter.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>

              {letter.quote && (
                <div className="my-8 p-5 sm:p-6 rounded-2xl bg-[#FFE6EB]/60 border-l-4 border-[#E26887] text-[#8C233E] shadow-2xs">
                  <p className="font-serif italic text-lg sm:text-xl leading-snug">
                    {letter.quote}
                  </p>
                </div>
              )}

              {letter.photoUrl && (
                <div className="my-6 p-3 bg-white rounded-2xl shadow-sm border border-[#E6ECE6]">
                  <img
                    src={letter.photoUrl}
                    alt="Letter Keepsake"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="w-full max-h-96 object-cover rounded-xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <p className="text-xs text-center text-[#688D73] mt-2 font-serif italic">
                    A keepsake memory for ink 🌸
                  </p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-[#D0DDD1]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-serif italic text-2xl text-[#1F2E24] mt-1">{authorName}</p>
                </div>

                <button
                  onClick={() => {
                    sound.playHeartSparkle();
                    setHasLiked(!hasLiked);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    hasLiked
                      ? 'bg-[#E26887] text-white shadow-md scale-105'
                      : 'bg-[#FFE6EB] text-[#A6304C] hover:bg-[#FCD2DC]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{hasLiked ? 'Kept in heart ❤️' : 'Hold in heart'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
