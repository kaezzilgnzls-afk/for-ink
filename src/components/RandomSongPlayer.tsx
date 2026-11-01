import React, { useState, useEffect, useRef } from 'react';
import { Music, Shuffle, Disc, ExternalLink, Sparkles } from 'lucide-react';
import { PlaylistTrack } from '../types';
import { sound } from '../utils/audio';

interface RandomSongPlayerProps {
  track: PlaylistTrack | null;
  onShuffleNext: () => void;
  triggerReason?: string;
  autoPlayNonce?: number;
  onOpenPlaylist?: () => void;
}

export const RandomSongPlayer: React.FC<RandomSongPlayerProps> = ({
  track,
  onShuffleNext,
  triggerReason,
  autoPlayNonce,
  onOpenPlaylist
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlayingVisual, setIsPlayingVisual] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // When track updates, trigger gentle harmonic chime
  useEffect(() => {
    if (track) {
      setIsPlayingVisual(true);
      sound.playBloomChime();
    }
  }, [track?.id]);

  if (!track) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-auto">
      <div className="relative rounded-2xl bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D0DDD1] shadow-xl p-2.5 sm:p-3 flex items-center gap-2.5 transition-all hover:shadow-2xl">
        {/* Spinning Vinyl Album Art with Equalizer Wave */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-12 h-12 rounded-full overflow-hidden border border-[#D0DDD1] shrink-0 bg-[#E6ECE6] cursor-pointer group shadow-sm will-change-transform"
          title="Click to toggle Spotify player"
        >
          {track.cover ? (
            <img
              src={track.cover}
              alt={track.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover will-change-transform ${
                isPlayingVisual ? 'animate-[spin_8s_linear_infinite]' : ''
              }`}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#E26887]">
              <Disc className="w-5 h-5 animate-spin" />
            </div>
          )}
          {/* Vinyl center hole */}
          <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-[#FAF7F2] border border-[#263B2D] flex items-center justify-center pointer-events-none">
            <div className="w-1 h-1 rounded-full bg-[#E26887]" />
          </div>
        </div>

        {/* Track info & Context */}
        <div className="min-w-0 flex-1 pr-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-1.5 text-[10px] text-[#A6304C] font-semibold uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5 animate-pulse" />
            <span className="truncate">{triggerReason || 'Auto-Playing Song'}</span>
          </div>
          <h4 className="text-xs sm:text-sm font-semibold text-[#1F2E24] truncate leading-tight">
            {track.name}
          </h4>
          <p className="text-[11px] text-[#52775C] truncate">
            {track.artist}
          </p>
        </div>

        {/* Live Audio Equalizer Wave Graphic */}
        <div className="flex items-end gap-0.5 h-4 px-1" title="Music Playing">
          <span className="w-0.5 bg-[#E26887] rounded-full animate-[bounce_0.8s_infinite] h-3" />
          <span className="w-0.5 bg-[#E26887] rounded-full animate-[bounce_0.6s_infinite] h-4" />
          <span className="w-0.5 bg-[#E26887] rounded-full animate-[bounce_1s_infinite] h-2" />
        </div>

        {/* Actions: Choose Song & Shuffle */}
        <div className="flex items-center gap-1 shrink-0">
          {onOpenPlaylist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPlaylist();
              }}
              className="px-2.5 py-1.5 rounded-full bg-[#FFE6EB] hover:bg-[#F8CCD5] text-[#A6304C] text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="Choose any song from playlist"
            >
              <Music className="w-3 h-3 text-[#E26887]" />
              <span className="hidden xs:inline">Choose</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShuffleNext();
            }}
            className="p-1.5 rounded-full hover:bg-[#FFE6EB] text-[#52775C] hover:text-[#E26887] transition-colors cursor-pointer"
            title="Shuffle next random song"
            aria-label="Shuffle song"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full hover:bg-[#1DB954]/15 text-[#1DB954] transition-colors"
            title="Open in Spotify"
            aria-label="Open track on Spotify"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Embedded Spotify Track Player (Kept smoothly responsive) */}
      <div className={`mt-2 rounded-2xl overflow-hidden shadow-2xl border border-[#D0DDD1] bg-black transition-all duration-300 ${isExpanded ? 'block' : 'h-20 opacity-95'}`}>
        <iframe
          ref={iframeRef}
          key={`spotify-track-${track.id}`}
          src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0&autoplay=1`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="eager"
          title={`Spotify Player - ${track.name}`}
          className="w-full"
        />
      </div>
    </div>
  );
};
