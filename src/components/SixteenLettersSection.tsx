import React, { useState, useEffect } from 'react';
import { Mail, Lock, Unlock, Sparkles, Heart, Flower2, Clock } from 'lucide-react';
import { BirthdayLetter16 } from '../types';
import { sound } from '../utils/audio';

interface SixteenLettersSectionProps {
  letters16: BirthdayLetter16[];
  onOpenLetter: (letter: BirthdayLetter16) => void;
  testModeUnlocked: boolean;
  birthdayDate: string; // 2026-11-13T00:00:00+08:00
  recipientName: string;
}

export const SixteenLettersSection: React.FC<SixteenLettersSectionProps> = ({
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

  const sealImg = "/src/assets/images/chrysanthemum_envelope_seal_1793457201857.jpg";

  return (
    <div className="relative rounded-3xl bg-[#FAF7F2] border border-[#D0DDD1] p-6 sm:p-10 shadow-sm space-y-8 overflow-hidden">
      {/* Background botanical blush accent */}
      <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#FFE6EB]/40 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#D0DDD1] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A6304C] mb-1">
            <Heart className="w-4 h-4 fill-current text-[#E26887]" />
            <span>Special Birthday Keepsake</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1F2E24] font-semibold">
            16 Letters for November 13
          </h2>
          <p className="text-xs sm:text-sm text-[#52775C] mt-1">
            Sixteen sealed letters written with deepest devotion to celebrate {recipientName}'s birthday
          </p>
        </div>

        {/* Lock / Unlock Status Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border bg-white shadow-xs">
          {isUnlocked ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#46684F]">
              <Unlock className="w-4 h-4 text-[#E26887]" />
              <span>Unsealed for November 13!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C233E]">
              <Lock className="w-4 h-4 text-[#E26887]" />
              <span>Unlocks November 13 (PHT)</span>
            </div>
          )}
        </div>
      </div>

      {/* Lock Notice Banner if not yet unlocked */}
      {!isUnlocked && (
        <div className="p-6 rounded-2xl bg-[#263B2D] text-[#FAF7F2] border border-[#46684F]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE6EB] text-[#E26887] flex items-center justify-center shrink-0">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#FFF5F7]">
                These 16 Letters are Sealed with Chrysanthemum Wax
              </h3>
              <p className="text-xs sm:text-sm text-[#D0DDD1] mt-0.5 font-light">
                All 16 envelopes will simultaneously unlock at 12:00 AM on November 13 (Philippine Time).
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
      )}

      {/* The 16 Letters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {letters16.map((letter) => {
          return (
            <div
              key={letter.id}
              onClick={() => handleCardClick(letter)}
              className={`relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 border ${
                isUnlocked
                  ? 'bg-white border-[#D0DDD1] hover:border-[#E26887] hover:shadow-md cursor-pointer hover:-translate-y-1'
                  : 'bg-[#F4F7F4]/70 border-[#D0DDD1]/70 cursor-not-allowed opacity-80'
              }`}
            >
              <div>
                {/* Header envelope badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#A6304C] bg-[#FFE6EB] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    #{letter.letterNumber}
                  </span>

                  {isUnlocked ? (
                    <Flower2 className="w-4 h-4 text-[#E26887]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#688D73]" />
                  )}
                </div>

                {/* Wax seal mini icon or thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden mb-3 border border-[#E6ECE6] bg-[#FFE6EB]/40 flex items-center justify-center">
                  <img
                    src={sealImg}
                    alt="Seal"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <h4 className="font-serif text-base sm:text-lg font-semibold text-[#1F2E24] leading-snug line-clamp-2">
                  {isUnlocked ? letter.title : `Letter #${letter.letterNumber}`}
                </h4>

                <p className="text-xs text-[#52775C] mt-1 line-clamp-2 font-light">
                  {isUnlocked ? letter.content : 'A birthday keepsake waiting to unseal on November 13.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6ECE6] flex items-center justify-between text-xs">
                {isUnlocked ? (
                  <span className="text-[#E26887] font-medium flex items-center gap-1">
                    <span>Read letter</span>
                    <span>→</span>
                  </span>
                ) : (
                  <span className="text-[#688D73] italic">Unlocks Nov 13</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
