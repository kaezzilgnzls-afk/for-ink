import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, Heart, Sparkles, X, User, Flower2, Smile } from 'lucide-react';
import { ChatMessage } from '../types';
import { sound } from '../utils/audio';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (msg: { sender: string; senderRole: 'ink' | 'zzy' | 'guest'; message: string; flowerEmoji?: string }) => Promise<void>;
  onLikeMessage: (id: string) => Promise<void>;
  recipientName: string;
  authorName: string;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onLikeMessage,
  recipientName,
  authorName
}) => {
  const [currentSenderRole, setCurrentSenderRole] = useState<'ink' | 'zzy' | 'guest'>('ink');
  const [customName, setCustomName] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('🌸');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages.length]);

  if (!isOpen) return null;

  const getEffectiveSenderName = () => {
    if (currentSenderRole === 'ink') return recipientName || 'ink';
    if (currentSenderRole === 'zzy') return authorName || 'zzy';
    return customName.trim() || 'A Friend';
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const sender = getEffectiveSenderName();
      await onSendMessage({
        sender,
        senderRole: currentSenderRole,
        message: inputMessage.trim(),
        flowerEmoji: selectedEmoji
      });

      sound.playMessageChime();
      setInputMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const quickStickers = ['🌸', '💖', '🎂', '💌', '✨', '🌿', '🫂', '🌻'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl h-[88vh] max-h-[700px] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#D0DDD1] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#46684F] text-[#FAF7F2] px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#FFE6EB] text-[#E26887] flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#46684F]" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-semibold flex items-center gap-1.5 leading-none">
                  <span>Live Chat</span>
                  <span className="text-xs font-sans font-normal text-[#D0DDD1]">· for ink</span>
                </h3>
                <p className="text-[11px] text-[#D0DDD1] mt-0.5">
                  Real-time space for ink, zzy & loved ones
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#D0DDD1] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SENDER IDENTITY SWITCHER */}
          <div className="px-5 py-3 bg-[#E6ECE6]/60 border-b border-[#D0DDD1] flex flex-wrap items-center justify-between gap-2 shrink-0">
            <span className="text-xs text-[#52775C] font-medium">Chatting as:</span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentSenderRole('ink')}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  currentSenderRole === 'ink'
                    ? 'bg-[#E26887] text-white shadow-xs'
                    : 'bg-white text-[#A6304C] border border-[#F7ADC0]'
                }`}
              >
                <span>ink 🌸</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentSenderRole('zzy')}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  currentSenderRole === 'zzy'
                    ? 'bg-[#263B2D] text-white shadow-xs'
                    : 'bg-white text-[#263B2D] border border-[#D0DDD1]'
                }`}
              >
                <span>zzy 💌</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentSenderRole('guest')}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  currentSenderRole === 'guest'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-amber-800 border border-amber-200'
                }`}
              >
                <span>Guest ✨</span>
              </button>
            </div>
          </div>

          {currentSenderRole === 'guest' && (
            <div className="px-5 py-2 bg-amber-50/80 border-b border-amber-200/60 shrink-0">
              <input
                type="text"
                placeholder="Enter your name to appear in chat"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-xs focus:outline-none"
              />
            </div>
          )}

          {/* MESSAGES LIST */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 letter-stationery">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Flower2 className="w-8 h-8 text-[#D0DDD1] mx-auto mb-2" />
                <p className="text-xs text-[#52775C]">No messages yet. Say hello to ink!</p>
              </div>
            )}

            {messages.map((msg) => {
              const isInk = msg.senderRole === 'ink' || msg.sender.toLowerCase().includes('ink');
              const isZzy = msg.senderRole === 'zzy' || msg.sender.toLowerCase().includes('zzy');

              const bubbleClasses = isInk
                ? 'bg-gradient-to-br from-[#FFF0F4] to-[#FFE6EB] border border-[#F7ADC0] text-[#1F2E24]'
                : isZzy
                  ? 'bg-gradient-to-br from-[#EBF3ED] to-[#E3EEE5] border border-[#BDD4C1] text-[#1F2E24]'
                  : 'bg-white border border-[#D0DDD1] text-[#1F2E24]';

              const roleLabel = isInk ? '🌸 Birthday Girl' : isZzy ? '💌 Author' : 'Friend';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs font-bold text-[#263B2D]">
                      {msg.sender}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#E6ECE6] text-[#52775C] font-medium">
                      {roleLabel}
                    </span>
                    <span className="text-[10px] text-[#8C9E90] ml-auto">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-2xl shadow-2xs ${bubbleClasses} relative group`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans font-light">
                      {msg.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-black/5">
                      <span className="text-sm">{msg.flowerEmoji || '🌸'}</span>

                      <button
                        onClick={() => {
                          sound.playHeartSparkle();
                          onLikeMessage(msg.id);
                        }}
                        className="flex items-center gap-1 text-[11px] text-[#A6304C] hover:text-[#E26887] px-2 py-0.5 rounded-full hover:bg-black/5 transition-all cursor-pointer"
                        title="Heart this message"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current text-[#E26887]" />
                        <span>{msg.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK REACTION STICKERS */}
          <div className="px-4 py-2 bg-white/70 border-t border-[#D0DDD1] flex items-center gap-2 overflow-x-auto shrink-0">
            <span className="text-[11px] text-[#688D73] font-medium shrink-0">Stamps:</span>
            {quickStickers.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setSelectedEmoji(emoji);
                  sound.playHeartSparkle();
                }}
                className={`text-base p-1 rounded-lg transition-transform hover:scale-125 cursor-pointer ${
                  selectedEmoji === emoji ? 'bg-[#FFE6EB] ring-1 ring-[#E26887]' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={handleSend}
            className="p-3.5 bg-white border-t border-[#D0DDD1] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder={`Write a sweet message as ${getEffectiveSenderName()}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#D0DDD1] text-sm focus:outline-none focus:ring-2 focus:ring-[#46684F]"
            />

            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="p-3 rounded-2xl bg-[#46684F] hover:bg-[#334E3A] text-white disabled:opacity-40 transition-transform active:scale-95 shadow-xs cursor-pointer shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4 text-[#F7ADC0]" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
