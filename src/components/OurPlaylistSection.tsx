import React, { useState } from 'react';
import { Music, Play, ExternalLink, Search, Disc, Heart, Sparkles } from 'lucide-react';
import tracksData from '../data/playlist_tracks.json';
import { PlaylistTrack } from '../types';

export const OurPlaylistSection: React.FC = () => {
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

  return (
    <div className="relative rounded-3xl bg-[#FAF7F2] border border-[#D0DDD1] p-6 sm:p-10 shadow-sm space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#D0DDD1] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E26887] mb-1">
            <Music className="w-4 h-4" />
            <span>Dedicated Birthday Soundtrack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1F2E24] font-semibold">
            Our Playlist
          </h2>
          <p className="text-xs sm:text-sm text-[#52775C] mt-1">
            love in music embodiment 🗝️ᯓᡣ𐭩 · Curated with love for ink
          </p>
        </div>

        <a
          href="https://open.spotify.com/playlist/7GhyESSFGMhV8llwGqtFS2?si=69def875a00b47ab&pt=1f69f497868bae66c5c1971ff729295d"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1AA34A] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
        >
          <Disc className="w-4 h-4" />
          <span>Open in Spotify App</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

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

      {/* All Tracks In This Playlist */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-serif font-semibold text-[#1F2E24]">
              All Songs in this Playlist ({tracks.length})
            </h3>
          </div>

          {/* Search bar & quick filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
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
                className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${
                  selectedTag === 'all' ? 'bg-white text-[#1F2E24] shadow-xs' : 'text-[#52775C]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedTag('ridleys')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${
                  selectedTag === 'ridleys' ? 'bg-white text-[#1F2E24] shadow-xs' : 'text-[#52775C]'
                }`}
              >
                The Ridleys
              </button>
              <button
                onClick={() => setSelectedTag('opm')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${
                  selectedTag === 'opm' ? 'bg-white text-[#1F2E24] shadow-xs' : 'text-[#52775C]'
                }`}
              >
                OPM
              </button>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="divide-y divide-[#D0DDD1]/60 rounded-2xl bg-white border border-[#D0DDD1] overflow-hidden">
          {filteredTracks.map((track, idx) => (
            <div
              key={track.id || idx}
              className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FFF5F7]/40 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-[#688D73] w-6 text-center shrink-0">
                  {idx + 1}
                </span>

                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[#E6ECE6] shrink-0 border border-[#D0DDD1]">
                  {track.cover ? (
                    <img
                      src={track.cover}
                      alt={track.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#E26887]">
                      <Music className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[#1F2E24] truncate group-hover:text-[#E26887] transition-colors">
                    {track.name}
                  </h4>
                  <p className="text-xs text-[#52775C] truncate">
                    {track.artist} <span className="opacity-60">·</span> {track.album}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-[#688D73] hidden sm:inline tabular-nums">
                  {formatDuration(track.durationMs)}
                </span>

                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-[#FFE6EB] text-[#46684F] group-hover:text-[#E26887] transition-colors"
                  title="Play on Spotify"
                  aria-label={`Play ${track.name} on Spotify`}
                >
                  <Play className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
