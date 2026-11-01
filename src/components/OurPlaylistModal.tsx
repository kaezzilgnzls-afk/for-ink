import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, ExternalLink, Search, Disc, Heart, X } from 'lucide-react';
import tracksData from '../data/playlist_tracks.json';
import { PlaylistTrack } from '../types';

interface OurPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack?: (track: PlaylistTrack) => void;
  currentTrackId?: string;
}

export const OurPlaylistModal: React.FC<OurPlaylistModalProps> = ({
  isOpen,
  onClose,
  onSelectTrack,
  currentTrackId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<'all' | 'ridleys' | 'opm'>('all');

  const tracks: PlaylistTrack[] = tracksData as PlaylistTrack[];

  const formatDuration = (ms: number) => {
    if (!ms) return '3:45';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const filteredTracks = tracks.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.album.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTag === 'ridleys') {
      return t.artist.toLowerCase().includes('the ridleys');
    }
    if (selectedTag === 'opm') {
      return (
        t.artist.toLowerCase().includes('the ridleys') ||
        t.artist.toLowerCase().includes('over october') ||
        t.artist.toLowerCase().includes('fitterkarma') ||
        t.artist.toLowerCase().includes('amiel sol') ||
        t.artist.toLowerCase().includes('iv of spades')
      );
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl my-6 bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#D0DDD1] overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-[#263B2D] text-[#FAF7F2] px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#1DB954] text-white">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold">Our Playlist</h2>
                <p className="text-xs text-[#D0DDD1]">love in music embodiment 🗝️ᯓᡣ𐭩 · For ink</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://open.spotify.com/playlist/7GhyESSFGMhV8llwGqtFS2?si=69def875a00b47ab&pt=1f69f497868bae66c5c1971ff729295d"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1DB954] text-white text-xs font-semibold hover:bg-[#1AA34A] transition-colors"
              >
                <Disc className="w-3.5 h-3.5" />
                <span>Open in Spotify</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#D0DDD1] hover:text-white transition-colors cursor-pointer"
                aria-label="Close playlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* Embedded Spotify Player */}
            <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-[#D0DDD1] bg-black/5">
              <iframe
                src="https://open.spotify.com/embed/playlist/7GhyESSFGMhV8llwGqtFS2?utm_source=generator&theme=0"
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Playlist Player for ink"
                className="w-full"
              />
            </div>

            {/* Search & Filter Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <h3 className="text-lg font-serif font-semibold text-[#1F2E24]">
                All Songs ({filteredTracks.length} of {tracks.length})
              </h3>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-[#688D73] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search song or artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-full border border-[#D0DDD1] bg-white text-xs text-[#1F2E24] focus:outline-none focus:ring-1 focus:ring-[#46684F]"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-[#E6ECE6] rounded-full border border-[#D0DDD1]">
                  <button
                    onClick={() => setSelectedTag('all')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                      selectedTag === 'all' ? 'bg-white text-[#1F2E24] shadow-xs' : 'text-[#52775C]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedTag('ridleys')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                      selectedTag === 'ridleys' ? 'bg-white text-[#1F2E24] shadow-xs' : 'text-[#52775C]'
                    }`}
                  >
                    The Ridleys
                  </button>
                  <button
                    onClick={() => setSelectedTag('opm')}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                      selectedTag === 'opm' ? 'bg-white text-[#1F2E24] shadow-xs' : 'text-[#52775C]'
                    }`}
                  >
                    OPM
                  </button>
                </div>
              </div>
            </div>

            {/* Song rows */}
            <div className="divide-y divide-[#D0DDD1]/60 rounded-2xl bg-white border border-[#D0DDD1] overflow-hidden">
              {filteredTracks.map((track, idx) => {
                const isCurrentPlaying = currentTrackId === track.id;
                return (
                  <div
                    key={track.id || idx}
                    onClick={() => onSelectTrack && onSelectTrack(track)}
                    className={`p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-colors group cursor-pointer ${
                      isCurrentPlaying ? 'bg-[#FFE6EB]/60 border-l-4 border-[#E26887]' : 'hover:bg-[#FFF5F7]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-xs font-mono w-6 text-center shrink-0 ${isCurrentPlaying ? 'text-[#E26887] font-bold' : 'text-[#688D73]'}`}>
                        {idx + 1}
                      </span>

                      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-[#E6ECE6] shrink-0 border border-[#D0DDD1]">
                        {track.cover ? (
                          <img
                            src={track.cover}
                            alt={track.name}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            className={`w-full h-full object-cover ${isCurrentPlaying ? 'scale-105' : ''}`}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#E26887]">
                            <Music className="w-4 h-4" />
                          </div>
                        )}
                        {isCurrentPlaying && (
                          <div className="absolute inset-0 bg-[#A6304C]/30 flex items-center justify-center">
                            <Disc className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs sm:text-sm font-semibold truncate transition-colors ${
                            isCurrentPlaying ? 'text-[#A6304C] font-bold' : 'text-[#1F2E24] group-hover:text-[#E26887]'
                          }`}>
                            {track.name}
                          </h4>
                          {isCurrentPlaying && (
                            <span className="text-[10px] bg-[#E26887] text-white font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              Playing
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#52775C] truncate">
                          {track.artist} <span className="opacity-60">·</span> {track.album}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-[#688D73] hidden sm:inline tabular-nums">
                        {formatDuration(track.durationMs)}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectTrack) onSelectTrack(track);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs ${
                          isCurrentPlaying
                            ? 'bg-[#E26887] text-white shadow-xs'
                            : 'bg-white text-[#46684F] border border-[#D0DDD1] hover:bg-[#FFE6EB] hover:text-[#A6304C]'
                        }`}
                        title="Click to play this track"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span className="hidden sm:inline">{isCurrentPlaying ? 'Playing' : 'Play Song'}</span>
                      </button>

                      <a
                        href={track.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-full hover:bg-[#FFE6EB] text-[#52775C] group-hover:text-[#E26887] transition-colors"
                        title="Open in Spotify"
                        aria-label={`Open ${track.name} in Spotify`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
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
