import React, { useState } from 'react';
import { Flower2, Lock, Calendar, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { DailyLetter } from '../types';
import { sound } from '../utils/audio';

interface LettersGardenProps {
  letters: DailyLetter[];
  onOpenLetter: (letter: DailyLetter) => void;
  testModeUnlocked: boolean;
}

export const LettersGarden: React.FC<LettersGardenProps> = ({
  letters,
  onOpenLetter,
  testModeUnlocked
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'upcoming'>('all');

  const nowTime = new Date().getTime();

  const isLetterUnlocked = (letter: DailyLetter) => {
    if (testModeUnlocked) return true;
    const letterDateTime = new Date(letter.dateString + 'T23:59:59').getTime();
    return letterDateTime <= nowTime;
  };

  const sortedLetters = [...letters].sort((a, b) => a.dayNumber - b.dayNumber);

  const filteredLetters = sortedLetters.filter((letter) => {
    const unlocked = isLetterUnlocked(letter);
    if (filter === 'unlocked') return unlocked;
    if (filter === 'upcoming') return !unlocked;
    return true;
  });

  const letterPhotoPath = "/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg";

  const handleLetterClick = (letter: DailyLetter, unlocked: boolean) => {
    if (unlocked) {
      sound.playEnvelopeSeal();
      onOpenLetter(letter);
    }
  };

  return (
    <div className="space-y-6">
      {/* Garden Header and Filter controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D0DDD1] pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2E24] font-semibold flex items-center gap-2">
            <span>Garden of Daily Letters</span>
            <Flower2 className="w-5 h-5 text-[#E26887]" />
          </h2>
          <p className="text-xs sm:text-sm text-[#52775C] mt-0.5">
            Every day is a keepsake letter blooming through your birthday countdown
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E6ECE6]/70 rounded-full border border-[#D0DDD1]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-[#1F2E24] shadow-xs'
                : 'text-[#52775C] hover:text-[#1F2E24]'
            }`}
          >
            All ({letters.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
              filter === 'unlocked'
                ? 'bg-white text-[#1F2E24] shadow-xs'
                : 'text-[#52775C] hover:text-[#1F2E24]'
            }`}
          >
            Unlocked
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
              filter === 'upcoming'
                ? 'bg-white text-[#1F2E24] shadow-xs'
                : 'text-[#52775C] hover:text-[#1F2E24]'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredLetters.map((letter) => {
          const unlocked = isLetterUnlocked(letter);

          // Preview snippet when unlocked
          const previewText = letter.quote
            ? letter.quote
            : letter.content.length > 95
              ? letter.content.substring(0, 95) + '...'
              : letter.content;

          return (
            <div
              key={letter.id}
              onClick={() => handleLetterClick(letter, unlocked)}
              className={`group relative rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
                unlocked
                  ? 'bg-[#FAF7F2] border-2 border-[#D0DDD1] hover:border-[#E26887] shadow-sm hover:shadow-xl cursor-pointer hover:-translate-y-1.5'
                  : 'bg-[#F4F7F4]/60 border border-dashed border-[#D0DDD1] opacity-75'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A6304C] bg-[#FFE6EB] px-2.5 py-0.5 rounded-full">
                    Day {letter.dayNumber}
                  </span>

                  {unlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-[#46684F] bg-[#E6ECE6] px-2.5 py-0.5 rounded-full border border-[#D0DDD1]/60">
                      <Flower2 className="w-3.5 h-3.5 text-[#E26887]" />
                      <span>Bloomed · Click to Open</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-[#688D73] bg-[#E6ECE6]/80 px-2.5 py-0.5 rounded-full">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sealed</span>
                    </span>
                  )}
                </div>

                {/* Letter Photo Thumbnail */}
                <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-3.5 border border-[#E6ECE6] bg-[#FFE6EB]/30">
                  <img
                    src={letterPhotoPath}
                    alt={letter.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.includes('/public/assets/')) {
                        target.src = '/public/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg';
                      }
                    }}
                  />

                  {unlocked ? (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#F7ADC0]" />
                      <span>Unsealed</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-[#263B2D]/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-2 text-center">
                      <Lock className="w-5 h-5 text-[#F7ADC0] mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Unlocks {letter.dateString}</span>
                    </div>
                  )}
                </div>

                {/* Letter title */}
                <h3 className="text-lg sm:text-xl font-serif text-[#1F2E24] font-semibold group-hover:text-[#46684F] transition-colors line-clamp-1">
                  {unlocked ? letter.title : `Day ${letter.dayNumber}: A flower waiting to unfold`}
                </h3>

                {/* LETTER PREVIEW SNIPPET WHEN UNLOCKED */}
                {unlocked ? (
                  <p className="mt-2 text-xs sm:text-sm font-serif italic text-[#52775C] line-clamp-2 leading-relaxed bg-[#FFF5F7]/70 p-2 rounded-xl border border-[#F7ADC0]/30">
                    “{previewText}”
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-[#688D73] italic">
                    Written with devotion. Waiting for countdown day {letter.dayNumber} to unseal.
                  </p>
                )}
              </div>

              {/* Bottom footer */}
              <div className="mt-4 pt-3 border-t border-[#E6ECE6] flex items-center justify-between text-xs text-[#688D73]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{letter.dateString}</span>
                </span>

                {unlocked ? (
                  <span className="font-semibold text-[#E26887] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Unfold letter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-xs text-[#688D73] italic flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredLetters.length === 0 && (
        <div className="text-center py-12 bg-white/60 rounded-3xl border border-[#D0DDD1]">
          <Flower2 className="w-8 h-8 text-[#D0DDD1] mx-auto mb-2" />
          <p className="text-[#52775C] text-sm">No letters found in this view.</p>
        </div>
      )}
    </div>
  );
};
