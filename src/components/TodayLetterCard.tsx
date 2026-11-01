import React, { useState } from 'react';
import { Mail, Sparkles, Lock, ArrowRight, Heart, Calendar, Flower2 } from 'lucide-react';
import { DailyLetter } from '../types';
import { sound } from '../utils/audio';

interface TodayLetterCardProps {
  todayLetter: DailyLetter | null;
  onOpenLetter: (letter: DailyLetter) => void;
  isUnlocked: boolean;
  recipientName: string;
}

export const TodayLetterCard: React.FC<TodayLetterCardProps> = ({
  todayLetter,
  onOpenLetter,
  isUnlocked,
  recipientName
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleOpen = () => {
    if (todayLetter && isUnlocked) {
      sound.playEnvelopeSeal();
      onOpenLetter(todayLetter);
    }
  };

  const letterPhotoPath = "/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg";

  if (!todayLetter) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF5F7] to-[#FAF7F2] p-8 border border-[#F7ADC0]/30 shadow-md text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#FFE6EB] flex items-center justify-center text-[#E26887] mb-4">
          <Mail className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-serif text-[#1F2E24] font-medium">
          Today's Letter is Being Penned
        </h3>
        <p className="text-sm text-[#52775C] max-w-md mx-auto mt-2 font-light">
          Your countdown letter for today is blossoming. As soon as it is sealed and published, you will be notified!
        </p>
      </div>
    );
  }

  // Create preview snippet for unlocked state
  const letterPreviewSnippet = todayLetter.quote
    ? todayLetter.quote
    : todayLetter.content.length > 130
      ? todayLetter.content.substring(0, 130) + '...'
      : todayLetter.content;

  return (
    <div
      onClick={isUnlocked ? handleOpen : undefined}
      className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${
        isUnlocked
          ? 'bg-[#FAF7F2] border-2 border-[#D0DDD1] hover:border-[#E26887]/80 shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-1'
          : 'bg-[#F4F7F4] border border-[#D0DDD1]/60 opacity-90'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative envelope flap top border */}
      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D0DDD1] via-[#F7ADC0] to-[#D0DDD1]" />

      <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Letter Keepsake Photo Thumbnail */}
        <div className="relative shrink-0">
          <div
            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-md border-2 border-[#FAF7F2] bg-[#FFE6EB] flex items-center justify-center group"
          >
            <img
              src={letterPhotoPath}
              alt="Today's Letter"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered && isUnlocked ? 'scale-105' : 'scale-100'
              }`}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes('/public/assets/')) {
                  target.src = '/public/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg';
                }
              }}
            />

            {/* Lock overlay if still locked */}
            {!isUnlocked ? (
              <div className="absolute inset-0 bg-[#263B2D]/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-2 text-center">
                <Lock className="w-6 h-6 text-[#F7ADC0] mb-1" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Unlocks at Midnight</span>
              </div>
            ) : (
              <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-[#E26887] text-white shadow-sm flex items-center justify-center">
                <Flower2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* Center: Title, Date AND Unlocked Excerpt Preview */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFE6EB] text-[#A6304C] font-semibold uppercase tracking-wider text-[11px]">
              Day {todayLetter.dayNumber} Letter
            </span>
            <span className="text-[#688D73] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayLetter.dateString}</span>
            </span>
            {isUnlocked && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold flex items-center gap-1 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Unlocked · Click to Read</span>
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif text-[#1F2E24] font-semibold leading-snug group-hover:text-[#46684F] transition-colors">
            {todayLetter.title}
          </h3>

          {/* Letter excerpt preview when unlocked */}
          {isUnlocked ? (
            <div className="pt-1">
              <p className="font-serif italic text-sm sm:text-base text-[#52775C] line-clamp-2 leading-relaxed bg-[#FFF5F7]/80 p-2.5 rounded-xl border border-[#F7ADC0]/40">
                “{letterPreviewSnippet}”
              </p>
              <p className="text-[11px] text-[#A6304C] font-medium mt-1 flex items-center justify-center md:justify-start gap-1">
                <span>Touch card to break wax seal and unfold envelope</span>
                <span>→</span>
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#688D73] italic">
              This letter is sealed with chrysanthemum wax and will blossom on its date.
            </p>
          )}
        </div>

        {/* Right: CTA button */}
        <div className="shrink-0 w-full md:w-auto">
          {isUnlocked ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="w-full md:w-auto px-7 py-3.5 rounded-full bg-[#46684F] hover:bg-[#334E3A] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <span>Break Seal & Read</span>
              <ArrowRight className="w-4 h-4 text-[#F7ADC0]" />
            </button>
          ) : (
            <button
              disabled
              className="w-full md:w-auto px-6 py-3.5 rounded-full bg-[#E6ECE6] text-[#688D73] font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              <span>Locked until date</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
