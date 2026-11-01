import React from 'react';
import { Music, Disc, ArrowRight, Sparkles } from 'lucide-react';

interface OurPlaylistButtonCardProps {
  onOpen: () => void;
  currentSongName?: string;
  currentArtist?: string;
}

export const OurPlaylistButtonCard: React.FC<OurPlaylistButtonCardProps> = ({
  onOpen,
  currentSongName,
  currentArtist
}) => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#EAF1EB] via-[#FAF7F2] to-[#FFF5F7] border-2 border-[#46684F]/20 p-6 sm:p-8 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
        {/* Animated Vinyl Disc Icon */}
        <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#1C2C22] flex items-center justify-center shrink-0 shadow-md border-2 border-white group">
          <Disc className="w-10 h-10 text-[#F7ADC0] animate-[spin_12s_linear_infinite]" />
          <div className="absolute w-4 h-4 rounded-full bg-[#FAF7F2] border border-[#1C2C22]" />
        </div>

        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#46684F] bg-[#E6ECE6] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Music className="w-3 h-3 text-[#1DB954]" />
              <span>Dedicated Soundtrack</span>
            </span>
            <span className="text-xs text-[#688D73]">30 Songs</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif text-[#1F2E24] font-semibold">
            Our Playlist
          </h3>

          <p className="text-xs sm:text-sm text-[#52775C] max-w-md mt-1 font-light">
            love in music embodiment 🗝️ᯓᡣ𐭩 · Browse all 30 songs and choose any song to play together.
          </p>

          {currentSongName && (
            <p className="text-xs text-[#E26887] font-medium mt-1.5 flex items-center justify-center md:justify-start gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Now Playing: {currentSongName} {currentArtist ? `by ${currentArtist}` : ''}</span>
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onOpen}
        className="w-full md:w-auto px-7 py-3.5 rounded-full bg-[#46684F] hover:bg-[#334E3A] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
      >
        <Music className="w-4 h-4 text-[#F7ADC0]" />
        <span>Choose & Play Songs</span>
        <ArrowRight className="w-4 h-4 text-[#F7ADC0]" />
      </button>
    </div>
  );
};
