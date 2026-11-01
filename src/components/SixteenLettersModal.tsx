import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Unlock, Sparkles, Heart, Flower2, Clock, X, ArrowRight } from 'lucide-react';
import { BirthdayLetter16 } from '../types';
import { sound } from '../utils/audio';

interface SixteenLettersModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters16: BirthdayLetter16[];
  onOpenLetter: (letter: BirthdayLetter16) => void;
  testModeUnlocked: boolean;
  birthdayDate: string;
  recipientName: string;
}

export const SixteenLettersModal: React.FC<SixteenLettersModalProps> = ({
  isOpen,
  onClose,
  letters16,
  onOpenLetter,
  testModeUnlocked,
  birthdayDate,
  recipientName
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeUntilUnlock, setTimeUntilUnlock] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const checkUnlock = () => {
      if (testModeUnlocked) {
        setIsUnlocked(true);
        return;
      }
      const target = new Date(birthdayDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeUntilUnlock({ days, hours, minutes, seconds });
      }
    };

    checkUnlock();
    const interval = setInterval(checkUnlock, 1000);
    return () => clearInterval(interval);
  }, [birthdayDate, testModeUnlocked]);

  const handleCardClick = (letter: BirthdayLetter16) => {
    if (isUnlocked) {
      sound.playEnvelopeSeal();
      onOpenLetter(letter);
    }
  };

  const letterPhotoPath = "/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl my-6 bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#D0DDD1] overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-[#263B2D] text-[#FAF7F2] px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#E26887] text-white">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold">16 Letters for November 13</h2>
                <p className="text-xs text-[#D0DDD1]">Written exclusively for {recipientName}'s 16th birthday</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#D0DDD1] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* Status notice */}
            {!isUnlocked ? (
              <div className="p-6 rounded-2xl bg-[#263B2D] text-[#FAF7F2] border border-[#46684F]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFE6EB] text-[#E26887] flex items-center justify-center shrink-0">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#FFF5F7]">
                      Sealed with Chrysanthemum Wax
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D0DDD1] mt-0.5 font-light">
                      All 16 envelopes will unlock at 12:00 AM on November 13 (Philippine Time).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-center shrink-0">
                  {[
                    { val: timeUntilUnlock.days, label: 'Days' },
                    { val: timeUntilUnlock.hours, label: 'Hrs' },
                    { val: timeUntilUnlock.minutes, label: 'Min' },
                    { val: timeUntilUnlock.seconds, label: 'Sec' }
                  ].map((slot, i) => (
                    <div key={i} className="px-3 py-2 rounded-xl bg-[#1C2C22] border border-[#46684F]/30 min-w-14">
                      <span className="block font-mono font-bold text-sm sm:text-base text-[#F7ADC0] tabular-nums">
                        {String(slot.val).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase text-[#D0DDD1] tracking-wider">{slot.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFE6EB] to-[#FAF7F2] border border-[#E26887]/40 flex items-center gap-3">
                <Flower2 className="w-6 h-6 text-[#E26887] shrink-0" />
                <p className="text-xs sm:text-sm text-[#263B2D] font-medium">
                  Happy November 13! All 16 letters are unsealed and ready. Click any letter to open its envelope and break the wax seal.
                </p>
              </div>
            )}

            {/* 16 Letters Grid with Preview when unlocked */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {letters16.map((letter) => {
                const previewText = letter.quote
                  ? letter.quote
                  : letter.content.length > 70
                    ? letter.content.substring(0, 70) + '...'
                    : letter.content;

                return (
                  <div
                    key={letter.id}
                    onClick={() => handleCardClick(letter)}
                    className={`relative rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 border ${
                      isUnlocked
                        ? 'bg-white border-[#D0DDD1] hover:border-[#E26887] shadow-xs hover:shadow-lg cursor-pointer hover:-translate-y-1'
                        : 'bg-[#F4F7F4]/70 border-[#D0DDD1]/70 cursor-not-allowed opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#A6304C] bg-[#FFE6EB] px-2 py-0.5 rounded-full">
                          Letter #{letter.letterNumber}
                        </span>
                        {isUnlocked ? (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-[#46684F]">
                            <Flower2 className="w-3.5 h-3.5 text-[#E26887]" />
                            <span>Unsealed</span>
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-[#688D73]" />
                        )}
                      </div>

                      <div className="w-full h-28 rounded-xl overflow-hidden mb-2.5 border border-[#E6ECE6] bg-[#FFE6EB]/40 flex items-center justify-center relative group">
                        <img
                          src={letterPhotoPath}
                          alt="Letter photo"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (!target.src.includes('/public/assets/')) {
                              target.src = '/public/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg';
                            }
                          }}
                        />
                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-[#263B2D]/60 backdrop-blur-[1px] flex items-center justify-center text-white">
                            <Lock className="w-4 h-4 text-[#F7ADC0]" />
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-serif text-sm sm:text-base font-semibold text-[#1F2E24] leading-snug line-clamp-2">
                        {isUnlocked ? letter.title : `Letter #${letter.letterNumber}`}
                      </h4>

                      {/* Preview Snippet when unlocked */}
                      {isUnlocked && (
                        <p className="mt-1.5 text-xs font-serif italic text-[#52775C] line-clamp-2 bg-[#FFF5F7] p-1.5 rounded-lg border border-[#F7ADC0]/30 leading-snug">
                          “{previewText}”
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#E6ECE6] text-right">
                      {isUnlocked ? (
                        <span className="text-[11px] text-[#E26887] font-semibold flex items-center justify-end gap-1">
                          <span>Unfold letter</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#688D73] italic">Unlocks Nov 13</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
