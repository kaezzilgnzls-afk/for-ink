import React from 'react';
import { Heart, Lock, Unlock, ArrowRight, Sparkles } from 'lucide-react';

interface SixteenLettersButtonCardProps {
  onOpen: () => void;
  isUnlocked: boolean;
}

export const SixteenLettersButtonCard: React.FC<SixteenLettersButtonCardProps> = ({
  onOpen,
  isUnlocked
}) => {
  const letterPhotoPath = "/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg";

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#FFF5F7] via-[#FAF7F2] to-[#EAF1EB] border-2 border-[#E26887]/30 p-6 sm:p-8 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
      {/* Visual left seal and teaser */}
      <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-sm border-2 border-white shrink-0 bg-[#FFE6EB]">
          <img
            src={letterPhotoPath}
            alt="16 Letters Photo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (!target.src.includes('/public/assets/')) {
                target.src = '/public/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg';
              }
            }}
          />
          <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/90 text-[#E26887] shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A6304C] bg-[#FFE6EB] px-2.5 py-0.5 rounded-full">
              Birthday Vault
            </span>
            <span className="text-xs text-[#52775C] flex items-center gap-1">
              {isUnlocked ? <Unlock className="w-3 h-3 text-[#46684F]" /> : <Lock className="w-3 h-3 text-[#E26887]" />}
              <span>{isUnlocked ? 'Unlocked for Nov 13!' : 'Unlocks Nov 13 (PHT)'}</span>
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif text-[#1F2E24] font-semibold">
            16 Letters for ink
          </h3>

          <p className="text-xs sm:text-sm text-[#52775C] max-w-md mt-1 font-light">
            Sixteen special keepsake letters sealed with love. Separated especially for ink's birthday celebration.
          </p>
        </div>
      </div>

      {/* Button to open the 16 letters modal */}
      <button
        onClick={onOpen}
        className="w-full md:w-auto px-7 py-3.5 rounded-full bg-[#E26887] hover:bg-[#D45575] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
      >
        <span>Open 16 Letters</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
