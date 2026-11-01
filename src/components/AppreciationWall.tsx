import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Plus, Flower2, Sparkles, Send, X, Calendar, User, MessageSquareHeart, Bookmark } from 'lucide-react';
import { AppreciationLetter } from '../types';
import { sound } from '../utils/audio';

interface AppreciationWallProps {
  letters: AppreciationLetter[];
  onAddLetter: (letterData: Partial<AppreciationLetter>) => Promise<void>;
  onLikeLetter: (id: string) => Promise<void>;
  recipientName: string;
  authorName: string;
}

export const AppreciationWall: React.FC<AppreciationWallProps> = ({
  letters,
  onAddLetter,
  onLikeLetter,
  recipientName,
  authorName
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReadLetter, setSelectedReadLetter] = useState<AppreciationLetter | null>(null);
  const [filterAuthor, setFilterAuthor] = useState<'all' | 'ink' | 'zzy'>('all');

  // New letter form state
  const [authorChoice, setAuthorChoice] = useState<'ink' | 'zzy' | 'other'>('ink');
  const [customAuthor, setCustomAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [stampTheme, setStampTheme] = useState<'chrysanthemum' | 'blush-rose' | 'golden-core' | 'sage' | 'lavender'>('chrysanthemum');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getEffectiveAuthor = () => {
    if (authorChoice === 'ink') return recipientName || 'ink';
    if (authorChoice === 'zzy') return authorName || 'zzy';
    return customAuthor.trim() || 'A Loved One';
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const finalAuthor = getEffectiveAuthor();
      const role = authorChoice === 'ink' ? 'ink' : authorChoice === 'zzy' ? 'zzy' : 'friend';
      await onAddLetter({
        author: finalAuthor,
        authorRole: role,
        title: title.trim() || 'A Letter of Love & Appreciation',
        content: content.trim(),
        stampTheme,
        photoUrl: authorChoice === 'ink'
          ? '/assets/aistudio/photo_6201466797702187888_y_ad526240.jpg'
          : '/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg'
      });

      sound.playEnvelopeSeal();
      setIsAddModalOpen(false);
      setTitle('');
      setContent('');
      setCustomAuthor('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLetters = letters.filter(l => {
    if (filterAuthor === 'ink') return l.author.toLowerCase().includes('ink');
    if (filterAuthor === 'zzy') return l.author.toLowerCase().includes('zzy');
    return true;
  });

  const getThemeStyles = (theme: AppreciationLetter['stampTheme']) => {
    switch (theme) {
      case 'blush-rose':
        return {
          badge: 'bg-[#FFE6EB] text-[#A6304C] border-[#F7ADC0]',
          border: 'border-[#F7ADC0]/50 hover:border-[#E26887]',
          seal: 'from-[#E26887] to-[#A6304C]',
          tag: 'Blush Rose'
        };
      case 'golden-core':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          border: 'border-amber-200 hover:border-amber-400',
          seal: 'from-amber-400 to-amber-600',
          tag: 'Golden Core'
        };
      case 'sage':
        return {
          badge: 'bg-[#E6ECE6] text-[#263B2D] border-[#D0DDD1]',
          border: 'border-[#D0DDD1] hover:border-[#46684F]',
          seal: 'from-[#688D73] to-[#263B2D]',
          tag: 'Sage Garden'
        };
      case 'lavender':
        return {
          badge: 'bg-purple-50 text-purple-800 border-purple-200',
          border: 'border-purple-200 hover:border-purple-400',
          seal: 'from-purple-400 to-purple-600',
          tag: 'Lavender'
        };
      case 'chrysanthemum':
      default:
        return {
          badge: 'bg-[#FFF5F7] text-[#E26887] border-[#F7ADC0]',
          border: 'border-[#E26887]/30 hover:border-[#E26887]',
          seal: 'from-[#F7ADC0] to-[#E26887]',
          tag: 'Chrysanthemum'
        };
    }
  };

  return (
    <section id="appreciation-wall" className="space-y-6">
      {/* Wall Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D0DDD1] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#FFE6EB] text-[#E26887]">
              <MessageSquareHeart className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1F2E24] font-semibold">
              Appreciation Wall for ink
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#52775C] mt-1">
            A keepsake board of handwritten letters, memories, and appreciation. ink & loved ones can pin a letter anytime!
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Author filter */}
          <div className="flex items-center gap-1 p-1 bg-[#E6ECE6]/80 rounded-full border border-[#D0DDD1] text-xs">
            <button
              onClick={() => setFilterAuthor('all')}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                filterAuthor === 'all' ? 'bg-white text-[#1F2E24] shadow-xs' : 'text-[#52775C]'
              }`}
            >
              All ({letters.length})
            </button>
            <button
              onClick={() => setFilterAuthor('ink')}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                filterAuthor === 'ink' ? 'bg-white text-[#A6304C] shadow-xs' : 'text-[#52775C]'
              }`}
            >
              From ink 🌸
            </button>
            <button
              onClick={() => setFilterAuthor('zzy')}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                filterAuthor === 'zzy' ? 'bg-white text-[#46684F] shadow-xs' : 'text-[#52775C]'
              }`}
            >
              From zzy 💌
            </button>
          </div>

          {/* Add Letter Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-full bg-[#E26887] hover:bg-[#D45575] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Pin a Letter</span>
          </button>
        </div>
      </div>

      {/* Letters Masonry/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLetters.map((letter) => {
          const theme = getThemeStyles(letter.stampTheme);

          return (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedReadLetter(letter)}
              className={`relative rounded-3xl p-6 bg-[#FAF7F2] border-2 ${theme.border} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1.5`}
            >
              {/* Decorative vintage washi tape on top */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#FFE6EB]/80 backdrop-blur-xs border border-[#F7ADC0]/50 rounded-sm shadow-2xs rotate-1 pointer-events-none opacity-80" />

              <div>
                {/* Header row with stamp badge & author */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFE6EB] to-[#FFF5F7] border border-[#F7ADC0] flex items-center justify-center text-xs font-bold text-[#A6304C]">
                      {letter.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1F2E24] leading-none">
                        {letter.author}
                      </p>
                      <span className="text-[10px] text-[#688D73]">
                        {letter.pinnedDate}
                      </span>
                    </div>
                  </div>

                  {/* Stamp Seal Badge */}
                  <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${theme.badge}`}>
                    <Flower2 className="w-3 h-3" />
                    <span>{theme.tag}</span>
                  </div>
                </div>

                {/* Letter Title */}
                <h3 className="font-serif text-xl text-[#1F2E24] font-semibold leading-snug group-hover:text-[#46684F] transition-colors mb-2">
                  {letter.title}
                </h3>

                {/* Excerpt Snippet Preview */}
                <p className="font-serif italic text-sm text-[#52775C] line-clamp-3 leading-relaxed bg-[#FCFAF6] p-3 rounded-2xl border border-[#D0DDD1]/50 mb-3">
                  “{letter.content}”
                </p>
              </div>

              {/* Bottom footer with Likes & Read CTA */}
              <div className="pt-3 border-t border-[#D0DDD1]/50 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playHeartSparkle();
                    onLikeLetter(letter.id);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFE6EB]/60 hover:bg-[#FFE6EB] text-[#A6304C] transition-colors cursor-pointer group-hover:scale-105"
                  title="Send love to this letter"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-[#E26887]" />
                  <span className="font-semibold">{letter.likes || 1}</span>
                </button>

                <span className="font-medium text-[#E26887] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read full note</span>
                  <span>→</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredLetters.length === 0 && (
        <div className="text-center py-12 bg-white/60 rounded-3xl border border-[#D0DDD1]">
          <MessageSquareHeart className="w-8 h-8 text-[#D0DDD1] mx-auto mb-2" />
          <p className="text-[#52775C] text-sm">No appreciation letters yet in this view.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 px-4 py-2 rounded-full bg-[#E26887] text-white text-xs font-semibold"
          >
            Be the first to pin a letter! 💌
          </button>
        </div>
      )}

      {/* MODAL: ADD A NEW LETTER TO THE WALL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#D0DDD1] overflow-hidden my-6"
          >
            {/* Header */}
            <div className="bg-[#46684F] text-[#FAF7F2] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flower2 className="w-5 h-5 text-[#F7ADC0]" />
                <h3 className="font-serif text-lg font-semibold">Pin a Letter to the Wall</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-[#D0DDD1] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Who is writing? */}
              <div>
                <label className="block text-xs font-semibold text-[#263B2D] uppercase tracking-wider mb-2">
                  Who is writing this letter?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthorChoice('ink')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      authorChoice === 'ink'
                        ? 'bg-[#FFE6EB] border-[#E26887] text-[#A6304C] shadow-xs'
                        : 'bg-white border-[#D0DDD1] text-[#52775C]'
                    }`}
                  >
                    <span>ink 🌸</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthorChoice('zzy')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      authorChoice === 'zzy'
                        ? 'bg-[#E6ECE6] border-[#46684F] text-[#263B2D] shadow-xs'
                        : 'bg-white border-[#D0DDD1] text-[#52775C]'
                    }`}
                  >
                    <span>zzy 💌</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthorChoice('other')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      authorChoice === 'other'
                        ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                        : 'bg-white border-[#D0DDD1] text-[#52775C]'
                    }`}
                  >
                    <span>Guest / Friend ✨</span>
                  </button>
                </div>

                {authorChoice === 'other' && (
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    className="mt-2 w-full px-3.5 py-2 rounded-xl bg-white border border-[#D0DDD1] text-xs focus:ring-2 focus:ring-[#46684F] focus:outline-none"
                    required
                  />
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#263B2D] uppercase tracking-wider mb-1">
                  Letter Title / Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. A memory I will forever hold dear"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D0DDD1] text-sm focus:ring-2 focus:ring-[#46684F] focus:outline-none"
                />
              </div>

              {/* Botanical Stamp Theme */}
              <div>
                <label className="block text-xs font-semibold text-[#263B2D] uppercase tracking-wider mb-2">
                  Botanical Stamp Seal
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'chrysanthemum', label: '🌸 Chrysanthemum' },
                    { id: 'blush-rose', label: '🌹 Blush Rose' },
                    { id: 'golden-core', label: '🌼 Golden Core' },
                    { id: 'sage', label: '🌿 Sage Leaf' },
                    { id: 'lavender', label: '💜 Lavender' }
                  ].map((stamp) => (
                    <button
                      key={stamp.id}
                      type="button"
                      onClick={() => setStampTheme(stamp.id as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        stampTheme === stamp.id
                          ? 'bg-[#263B2D] text-white border-[#263B2D]'
                          : 'bg-white text-[#52775C] border-[#D0DDD1]'
                      }`}
                    >
                      {stamp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Content */}
              <div>
                <label className="block text-xs font-semibold text-[#263B2D] uppercase tracking-wider mb-1">
                  Heartfelt Words & Message *
                </label>
                <textarea
                  rows={6}
                  placeholder="Write your letter of love, appreciation, or sweet memories here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D0DDD1] text-sm leading-relaxed focus:ring-2 focus:ring-[#46684F] focus:outline-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#52775C] hover:bg-[#E6ECE6] rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="px-6 py-2.5 rounded-full bg-[#46684F] hover:bg-[#334E3A] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#F7ADC0]" />
                  <span>{isSubmitting ? 'Pinning...' : 'Seal & Pin to Wall'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: READ FULL APPRECIATION LETTER */}
      {selectedReadLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#D0DDD1] overflow-hidden my-6"
          >
            {/* Header bar */}
            <div className="bg-[#46684F] text-[#FAF7F2] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F7ADC0] animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-[#D0DDD1] font-medium">
                  Appreciation Keepsake Note
                </span>
              </div>
              <button
                onClick={() => setSelectedReadLetter(null)}
                className="p-1 rounded-full hover:bg-white/10 text-[#D0DDD1] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Stationery */}
            <div className="p-6 sm:p-8 letter-stationery max-h-[75vh] overflow-y-auto space-y-4">
              <div className="border-b border-[#D0DDD1]/60 pb-4">
                <div className="flex items-center gap-2 text-xs text-[#52775C] mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedReadLetter.pinnedDate}</span>
                  <span>•</span>
                  <span>Pinned by <strong className="text-[#1F2E24]">{selectedReadLetter.author}</strong></span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1F2E24]">
                  {selectedReadLetter.title}
                </h3>
              </div>

              <div className="prose prose-stone max-w-none text-base leading-relaxed text-[#263B2D] space-y-3 font-sans font-light">
                {selectedReadLetter.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>

              {selectedReadLetter.photoUrl && (
                <div className="pt-2">
                  <img
                    src={selectedReadLetter.photoUrl}
                    alt="Shared Memory"
                    className="w-full max-h-72 object-cover rounded-2xl shadow-sm border border-[#E6ECE6]"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Sign off and like */}
              <div className="pt-4 border-t border-[#D0DDD1]/60 flex items-center justify-between">
                <p className="font-serif italic text-xl text-[#46684F]">
                  with love, {selectedReadLetter.author}
                </p>

                <button
                  onClick={() => {
                    sound.playHeartSparkle();
                    onLikeLetter(selectedReadLetter.id);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE6EB] hover:bg-[#FCD2DC] text-[#A6304C] text-xs font-semibold transition-all cursor-pointer shadow-xs"
                >
                  <Heart className="w-4 h-4 fill-current text-[#E26887]" />
                  <span>Heart ({selectedReadLetter.likes || 1})</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};
