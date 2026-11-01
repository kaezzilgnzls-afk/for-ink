/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Flower2,
  Calendar,
  Mail,
  Heart,
  Volume2,
  VolumeX,
  Smartphone,
  Lock,
  Sparkles,
  Music,
  FolderHeart,
  MessageCircle,
  MessageSquareHeart
} from 'lucide-react';
import { AppSettings, DailyLetter, BirthdayLetter16, AppNotification, PlaylistTrack, ChatMessage, AppreciationLetter } from './types';
import { OpeningChrysanthemumIntro } from './components/OpeningChrysanthemumIntro';
import { ChrysanthemumBloom } from './components/ChrysanthemumBloom';
import { BirthdayCountdown } from './components/BirthdayCountdown';
import { TodayLetterCard } from './components/TodayLetterCard';
import { SixteenLettersButtonCard } from './components/SixteenLettersButtonCard';
import { SixteenLettersModal } from './components/SixteenLettersModal';
import { OurPlaylistButtonCard } from './components/OurPlaylistButtonCard';
import { OurPlaylistModal } from './components/OurPlaylistModal';
import { LettersGarden } from './components/LettersGarden';
import { LetterReaderModal } from './components/LetterReaderModal';
import { AppreciationWall } from './components/AppreciationWall';
import { LiveChatModal } from './components/LiveChatModal';
import { AuthorStudio } from './components/AuthorStudio';
import { NotificationBanner } from './components/NotificationBanner';
import { RandomSongPlayer } from './components/RandomSongPlayer';
import { PetalShower } from './components/PetalShower';
import { AndroidAppModal } from './components/AndroidAppModal';
import { sound } from './utils/audio';
import playlistTracks from './data/playlist_tracks.json';

const STORAGE_KEY = 'for_ink_birthday_app_state_v5';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>({
    recipientName: "ink",
    authorName: "zzy",
    birthdayDate: "2026-11-13T00:00:00+08:00",
    countdownStartDate: "2026-11-01T00:00:00+08:00",
    countdownSubtitle: "A blooming garden of daily letters counting down to November 13",
    authorPin: "drigorry",
    enableAudio: true,
    testModeUnlocked: false,
    spotifyPlaylistUrl: "https://open.spotify.com/playlist/7GhyESSFGMhV8llwGqtFS2?si=69def875a00b47ab&pt=1f69f497868bae66c5c1971ff729295d",
    show16Letters: false,
    show16LettersDate: "2026-11-13T00:00:00+08:00",
    enableFallingPetals: true,
    petalSpeed: 1.0,
    petalDensity: 18,
    enableBloomIntro: true,
    heroMessage: "November is a very special month for all of the people around you. It is a gift from God, you are a Gift from God. Our heaven sent, my heaven sent.",
    additionalFeatures: [
      { id: "bloom_intro", name: "Blooming Chrysanthemum Opening", description: "Plays the blossoming flower greeting when the app opens", enabled: true },
      { id: "ambient_petals", name: "Falling Petal Shower", description: "Serene drifting chrysanthemum petals across the screen", enabled: true },
      { id: "random_song_player", name: "Automatic Random Playlist Player", description: "Plays songs when opening app and reading letters", enabled: true }
    ]
  });

  const [letters, setLetters] = useState<DailyLetter[]>([]);
  const [letters16, setLetters16] = useState<BirthdayLetter16[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [appreciationLetters, setAppreciationLetters] = useState<AppreciationLetter[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & views
  const [showOpeningIntro, setShowOpeningIntro] = useState(true);
  const [isBloomModalOpen, setIsBloomModalOpen] = useState(false);
  const [is16LettersModalOpen, setIs16LettersModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<DailyLetter | BirthdayLetter16 | null>(null);
  const [isAuthorStudioOpen, setIsAuthorStudioOpen] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isOnline, setIsOnline] = useState(true);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Randomized song state & autoplay trigger nonce
  const [currentTrack, setCurrentTrack] = useState<PlaylistTrack | null>(null);
  const [songTriggerReason, setSongTriggerReason] = useState<string>('Now Playing');
  const [autoPlayNonce, setAutoPlayNonce] = useState<number>(1);

  const tracksList: PlaylistTrack[] = playlistTracks as PlaylistTrack[];

  // Pick a random song from playlist and automatically trigger playback
  const pickRandomSong = useCallback((reason: string) => {
    if (tracksList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * tracksList.length);
    const chosen = tracksList[randomIndex];
    setCurrentTrack(chosen);
    setSongTriggerReason(reason);
    setAutoPlayNonce(prev => prev + 1);
  }, [tracksList]);

  const lastDataJsonRef = React.useRef<string>('');

  const updateStateIfChanged = useCallback((data: any) => {
    const raw = JSON.stringify(data);
    if (raw === lastDataJsonRef.current) return;
    lastDataJsonRef.current = raw;
    if (data.settings) setSettings(data.settings);
    if (data.letters) setLetters(data.letters);
    if (data.letters16) setLetters16(data.letters16);
    if (data.chatMessages) setChatMessages(data.chatMessages);
    if (data.appreciationLetters) setAppreciationLetters(data.appreciationLetters);
    if (data.notifications) setNotifications(data.notifications);
  }, []);

  // Load app data
  const loadData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        updateStateIfChanged(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          updateStateIfChanged(parsed);
        } catch {
          // Ignore
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Pick initial random song
    pickRandomSong('Opened app');

    // Check author mode parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'author' || urlParams.get('author') === 'true') {
      setShowOpeningIntro(false);
      setIsAuthorStudioOpen(true);
    }
  }, [pickRandomSong]);

  // Real-time online synchronization via Server-Sent Events (SSE)
  // When an author posts/updates a letter, settings, or notification on any device,
  // all connected clients (ink and loved ones) update instantly in real time!
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimer: any = null;
    let isSubscribed = true;

    const setupSSE = () => {
      try {
        if (!isSubscribed) return;
        eventSource = new EventSource('/api/events');

        eventSource.onopen = () => {
          if (isSubscribed) setIsOnline(true);
        };

        eventSource.addEventListener('init', (e: MessageEvent) => {
          if (!isSubscribed) return;
          try {
            const data = JSON.parse(e.data);
            updateStateIfChanged(data);
            setIsOnline(true);
          } catch {
            // Ignore
          }
        });

        eventSource.addEventListener('update', (e: MessageEvent) => {
          if (!isSubscribed) return;
          try {
            const data = JSON.parse(e.data);
            updateStateIfChanged(data);
            setIsOnline(true);
          } catch {
            // Ignore
          }
        });

        eventSource.onerror = () => {
          if (!isSubscribed) return;
          setIsOnline(false);
          eventSource?.close();
          clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(setupSSE, 3000);
        };
      } catch {
        if (!isSubscribed) return;
        setIsOnline(false);
        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(setupSSE, 5000);
      }
    };

    setupSSE();

    // Fallback background polling every 6s in case device sleep suspends SSE
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    }, 6000);

    // Immediate sync when phone screen wakes up or browser tab regains focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      isSubscribed = false;
      if (eventSource) eventSource.close();
      clearTimeout(reconnectTimer);
      clearInterval(pollInterval);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [updateStateIfChanged]);

  const todayYMD = new Date().toISOString().split('T')[0];
  const todayLetter = letters.find(l => l.dateString === todayYMD) || letters[0] || null;

  const isTodayLetterUnlocked = () => {
    if (settings.testModeUnlocked) return true;
    if (!todayLetter) return false;
    const letterDate = new Date(todayLetter.dateString + 'T23:59:59').getTime();
    return letterDate <= new Date().getTime();
  };

  const isNov13Unlocked = () => {
    if (settings.testModeUnlocked) return true;
    const target = new Date(settings.birthdayDate).getTime();
    return new Date().getTime() >= target;
  };

  // 16 letters are hidden from ink unless author reveals or target date arrives
  const shouldShow16Letters =
    Boolean(settings.show16Letters) ||
    Boolean(settings.testModeUnlocked) ||
    (settings.show16LettersDate ? new Date().getTime() >= new Date(settings.show16LettersDate).getTime() : false);

  // When opening a letter -> randomize song automatically!
  const handleOpenLetter = (letter: DailyLetter | BirthdayLetter16) => {
    setSelectedLetter(letter);
    pickRandomSong('Opened letter');
  };

  // When closing a letter -> randomize song automatically!
  const handleCloseLetter = () => {
    setSelectedLetter(null);
    pickRandomSong('Closed letter');
  };

  // Author actions
  const handleSaveLetter = async (letterData: Partial<DailyLetter>) => {
    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(letterData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.store) {
          setLetters(data.store.letters);
          setNotifications(data.store.notifications);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.store));
        }
      }
    } catch {
      // Offline fallback
      const newLetter: DailyLetter = {
        id: letterData.id || `letter-${Date.now()}`,
        dayNumber: letterData.dayNumber || letters.length + 1,
        dateString: letterData.dateString || todayYMD,
        title: letterData.title || 'Untitled Letter',
        content: letterData.content || '',
        quote: letterData.quote,
        photoUrl: letterData.photoUrl || '/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg',
        flowerTheme: letterData.flowerTheme || 'soft-pink',
        createdAt: new Date().toISOString(),
        isRead: false
      };
      setLetters(prev => prev.map(l => l.id === newLetter.id ? newLetter : l));
    }
  };

  const handleSaveLetter16 = async (updatedLetter: BirthdayLetter16) => {
    try {
      const res = await fetch('/api/letters16', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLetter)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.letters16) {
          setLetters16(data.letters16);
        }
      }
    } catch {
      setLetters16(prev => prev.map(l => l.id === updatedLetter.id ? updatedLetter : l));
    }
  };

  const handleDeleteLetter = async (id: string) => {
    try {
      const res = await fetch(`/api/letters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        if (data.store) {
          setLetters(data.store.letters);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.store));
        }
      }
    } catch {
      setLetters(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch {
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
  };

  const handleSendTestNotification = async (title: string, body: string) => {
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) setNotifications(data.notifications);
      }
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      }
      sound.playBloomChime();
    } catch {
      // Ignore
    }
  };

  const handleOpenLetterById = (letterId: string) => {
    const foundDaily = letters.find(l => l.id === letterId);
    if (foundDaily) {
      handleOpenLetter(foundDaily);
      return;
    }
    const found16 = letters16.find(l => l.id === letterId);
    if (found16) {
      handleOpenLetter(found16);
    }
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const res = await fetch('/api/notifications/ack', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) setNotifications(data.notifications);
      }
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const handleSendMessage = async (msg: { sender: string; senderRole: 'ink' | 'zzy' | 'guest'; message: string; flowerEmoji?: string }) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.chatMessages) setChatMessages(data.chatMessages);
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `chat-${Date.now()}`,
        sender: msg.sender,
        senderRole: msg.senderRole,
        message: msg.message,
        timestamp: new Date().toISOString(),
        flowerEmoji: msg.flowerEmoji,
        likes: 0
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handleLikeChatMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/chat/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setChatMessages(prev => prev.map(m => m.id === id ? data.message : m));
        }
      }
    } catch {
      setChatMessages(prev => prev.map(m => m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m));
    }
  };

  const handleAddAppreciationLetter = async (letterData: Partial<AppreciationLetter>) => {
    try {
      const res = await fetch('/api/appreciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(letterData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.appreciationLetters) setAppreciationLetters(data.appreciationLetters);
        loadData();
      }
    } catch {
      const fallback: AppreciationLetter = {
        id: `apprec-${Date.now()}`,
        author: letterData.author || 'ink',
        authorRole: letterData.authorRole || 'ink',
        title: letterData.title || 'Appreciation Letter',
        content: letterData.content || '',
        stampTheme: letterData.stampTheme || 'chrysanthemum',
        pinnedDate: new Date().toISOString().split('T')[0],
        likes: 1
      };
      setAppreciationLetters(prev => [fallback, ...prev]);
    }
  };

  const handleLikeAppreciationLetter = async (id: string) => {
    try {
      const res = await fetch(`/api/appreciation/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.letter) {
          setAppreciationLetters(prev => prev.map(l => l.id === id ? data.letter : l));
        }
      }
    } catch {
      setAppreciationLetters(prev => prev.map(l => l.id === id ? { ...l, likes: (l.likes || 0) + 1 } : l));
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinAttempt.trim() === settings.authorPin || pinAttempt.trim() === 'drigorry') {
      setShowPinModal(false);
      setIsAuthorStudioOpen(true);
      setPinAttempt('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F2E24] flex flex-col relative selection:bg-[#FFE6EB] selection:text-[#A6304C]">
      {/* Ambient Falling Chrysanthemum Petals */}
      {settings.enableFallingPetals !== false && (
        <PetalShower
          speed={settings.petalSpeed ?? 1.0}
          density={settings.petalDensity ?? 18}
        />
      )}

      {/* Floating Randomized Song Player with Autoplay & Song Chooser */}
      <RandomSongPlayer
        track={currentTrack}
        onShuffleNext={() => pickRandomSong('Shuffled song')}
        triggerReason={songTriggerReason}
        autoPlayNonce={autoPlayNonce}
        onOpenPlaylist={() => setIsPlaylistModalOpen(true)}
      />

      {/* OPENING CHRYSANTHEMUM BLOOM INTRO */}
      {settings.enableBloomIntro !== false && (
        <OpeningChrysanthemumIntro
          isOpen={showOpeningIntro}
          onEnter={() => {
            setShowOpeningIntro(false);
            pickRandomSong('Entered garden');
          }}
        />
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#D0DDD1]/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 sm:gap-8">
        <a href="/" className="flex items-center gap-2 text-xl font-serif font-bold tracking-tight text-[#263B2D] whitespace-nowrap shrink-0 hover:text-[#46684F] transition-colors">
          <Flower2 className="w-5 h-5 text-[#E26887]" />
          <span>for ink</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#52775C]">
          <a href="#countdown" className="hover:text-[#1F2E24] transition-colors whitespace-nowrap shrink-0">
            Countdown
          </a>
          <a href="#today-letter" className="hover:text-[#1F2E24] transition-colors whitespace-nowrap shrink-0">
            Today's Letter
          </a>
          <a href="#appreciation-wall" className="hover:text-[#E26887] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 font-semibold text-[#A6304C]">
            <MessageSquareHeart className="w-3.5 h-3.5 text-[#E26887]" />
            <span>Appreciation Wall</span>
          </a>
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="hover:text-[#E26887] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-[#46684F] font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#E26887]" />
            <span>Live Chat</span>
            {chatMessages.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#FFE6EB] text-[#A6304C] rounded-full text-[10px] font-bold">
                {chatMessages.length}
              </span>
            )}
          </button>
          {shouldShow16Letters && (
            <button
              onClick={() => setIs16LettersModalOpen(true)}
              className="hover:text-[#E26887] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-[#A6304C] font-semibold"
            >
              <Heart className="w-3.5 h-3.5 text-[#E26887] fill-current" />
              <span>16 Letters</span>
            </button>
          )}
          <button
            onClick={() => setIsPlaylistModalOpen(true)}
            className="hover:text-[#1F2E24] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer font-medium text-[#46684F]"
          >
            <Music className="w-3.5 h-3.5 text-[#1DB954]" />
            <span>Our Playlist</span>
          </button>
          <a href="#garden" className="hover:text-[#1F2E24] transition-colors whitespace-nowrap shrink-0">
            Daily Archive
          </a>
          <button
            onClick={() => setIsBloomModalOpen(true)}
            className="hover:text-[#E26887] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-[#E26887]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F7ADC0]" />
            <span>Re-bloom</span>
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-white/80 border border-[#D0DDD1] text-[#263B2D] shadow-2xs transition-colors"
            title={isOnline ? "Live Online Sync: Updates appear instantly on all devices" : "Reconnecting to live sync..."}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            <span className="hidden sm:inline">{isOnline ? 'Live Synced' : 'Syncing...'}</span>
          </div>

          <button
            onClick={() => setIsChatModalOpen(true)}
            className="p-2 rounded-full bg-[#FFE6EB] hover:bg-[#FCD2DC] text-[#A6304C] border border-[#F7ADC0] transition-all cursor-pointer relative"
            title="Open Live Chat"
            aria-label="Open Live Chat"
          >
            <MessageCircle className="w-4 h-4 text-[#E26887]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-[#52775C] hover:text-[#1F2E24] border border-[#D0DDD1] transition-all cursor-pointer"
            title={isMuted ? "Unmute flower chime" : "Mute chime"}
            aria-label="Toggle audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#E26887]" />}
          </button>

          <NotificationBanner
            notifications={notifications}
            onOpenLetterById={handleOpenLetterById}
            onDismissNotification={handleDismissNotification}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
          />

          <button
            onClick={() => setShowAndroidModal(true)}
            className="px-3 py-1.5 rounded-full bg-[#FFE6EB] hover:bg-[#FDD0DC] text-[#A6304C] border border-[#E26887]/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            title="Install on Android Phone"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#E26887]" />
            <span className="hidden sm:inline">Android App</span>
            <span className="sm:hidden">App</span>
          </button>

          <button
            onClick={() => setShowPinModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-[#46684F] hover:bg-[#334E3A] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#F7ADC0]" />
            <span className="hidden sm:inline">Author Studio</span>
            <span className="sm:hidden">Author</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* HERO BOTANICAL BANNER WITH COVER PHOTO */}
        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#D0DDD1] bg-gradient-to-r from-[#FFF5F7] via-[#FAF7F2] to-[#EAF1EB]">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="p-6 sm:p-10 md:col-span-7 space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#688D73]">
                Dedicated to ink
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#1F2E24] font-semibold leading-tight">
                for ink
              </h2>
              <p className="text-sm text-[#52775C] font-light leading-relaxed max-w-md">
                {settings.heroMessage || "November is a very special month for all of the people around you. It is a gift from God, you are a Gift from God. Our heaven sent, my heaven sent."}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsBloomModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-[#E26887] hover:bg-[#D45575] text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <Flower2 className="w-4 h-4" />
                  <span>Bloom Chrysanthemum</span>
                </button>

                <a
                  href="#appreciation-wall"
                  className="px-5 py-2.5 rounded-full bg-white text-[#A6304C] border border-[#F7ADC0] hover:bg-[#FFF5F7] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageSquareHeart className="w-3.5 h-3.5 fill-current text-[#E26887]" />
                  <span>Appreciation Wall</span>
                </a>

                <button
                  onClick={() => setIsChatModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-[#46684F] hover:bg-[#334E3A] text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#F7ADC0]" />
                  <span>Live Chat</span>
                </button>

                {shouldShow16Letters && (
                  <button
                    onClick={() => setIs16LettersModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-white text-[#A6304C] border border-[#F7ADC0] hover:bg-[#FFF5F7] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-[#E26887]" />
                    <span>View 16 Letters</span>
                  </button>
                )}

                <button
                  onClick={() => setIsPlaylistModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-white text-[#263B2D] border border-[#D0DDD1] hover:bg-[#F4F7F4] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Music className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>Our Playlist</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-5 h-72 sm:h-80 md:h-full min-h-[280px] sm:min-h-[340px] relative overflow-hidden group">
              <img
                src="/assets/aistudio/photo_6201466797702187888_y_ad526240.jpg"
                alt="zzy and ink"
                referrerPolicy="no-referrer"
                decoding="async"
                className="w-full h-full object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.includes('/public/assets/')) {
                    target.src = '/public/assets/aistudio/photo_6201466797702187888_y_ad526240.jpg';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-transparent to-[#FAF7F2]/20" />
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1.5 shadow-sm">
                <Heart className="w-3 h-3 text-[#F7ADC0] fill-current" />
                <span>zzy & ink</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. COUNTDOWN SECTION */}
        <section id="countdown">
          <BirthdayCountdown
            settings={settings}
            letters={letters}
            onTriggerBloom={() => setIsBloomModalOpen(true)}
          />
        </section>

        {/* 2. DEDICATED BUTTON & CARD FOR 16 LETTERS (HIDDEN UNTIL UNLOCKED OR REVEALED BY AUTHOR) */}
        {shouldShow16Letters && (
          <section id="letters-16-card">
            <SixteenLettersButtonCard
              onOpen={() => setIs16LettersModalOpen(true)}
              isUnlocked={isNov13Unlocked()}
            />
          </section>
        )}

        {/* 3. TODAY'S DAILY COUNTDOWN LETTER (NO TEXT PREVIEW) */}
        <section id="today-letter" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif text-[#1F2E24] font-semibold flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#E26887]" />
              <span>Today's Unfolding Letter for ink</span>
            </h2>
            <span className="text-xs text-[#52775C]">
              {todayLetter ? `Day ${todayLetter.dayNumber} of Countdown` : 'Ready to bloom'}
            </span>
          </div>

          <TodayLetterCard
            todayLetter={todayLetter}
            onOpenLetter={handleOpenLetter}
            isUnlocked={isTodayLetterUnlocked()}
            recipientName={settings.recipientName}
          />
        </section>

        {/* 4. OUR PLAYLIST BUTTON CARD (SMOOTH ANIMATED OPENING ONLY ON CLICK) */}
        <section id="playlist-card">
          <OurPlaylistButtonCard
            onOpen={() => setIsPlaylistModalOpen(true)}
            currentSongName={currentTrack?.name}
            currentArtist={currentTrack?.artist}
          />
        </section>

        {/* 5. APPRECIATION WALL (SHE & LOVED ONES CAN PIN LETTERS & MEMORIES) */}
        <section id="appreciation-wall">
          <AppreciationWall
            letters={appreciationLetters}
            onAddLetter={handleAddAppreciationLetter}
            onLikeLetter={handleLikeAppreciationLetter}
            recipientName={settings.recipientName}
            authorName={settings.authorName}
          />
        </section>

        {/* 6. DAILY COUNTDOWN LETTERS ARCHIVE */}
        <section id="garden">
          <LettersGarden
            letters={letters}
            onOpenLetter={handleOpenLetter}
            testModeUnlocked={settings.testModeUnlocked}
          />
        </section>
      </main>

      {/* FLOATING QUICK LIVE CHAT BUTTON */}
      <button
        onClick={() => setIsChatModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-[#263B2D] hover:bg-[#1C2C22] text-[#FAF7F2] shadow-xl hover:shadow-2xl border-2 border-[#F7ADC0]/80 flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer group"
        title="Open Live Chat with ink & zzy"
      >
        <div className="relative">
          <MessageCircle className="w-4 h-4 text-[#F7ADC0]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="text-xs font-semibold font-serif tracking-wide">Live Chat</span>
        {chatMessages.length > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-[#E26887] text-white text-[10px] font-bold">
            {chatMessages.length}
          </span>
        )}
      </button>

      {/* FOOTER */}
      <footer className="mt-16 py-12 text-center border-t border-[#D0DDD1]/60 bg-[#FAF7F2]">
        <p className="font-serif italic text-lg sm:text-xl text-[#46684F] tracking-wide">
          with love, zzy
        </p>
      </footer>

      {/* LIVE CHAT MODAL */}
      <LiveChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        onLikeMessage={handleLikeChatMessage}
        recipientName={settings.recipientName}
        authorName={settings.authorName}
      />

      {/* OUR PLAYLIST SMOOTH ANIMATED MODAL */}
      <OurPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        currentTrackId={currentTrack?.id}
        onSelectTrack={(track) => {
          setCurrentTrack(track);
          setSongTriggerReason(`Chosen: ${track.name}`);
          setAutoPlayNonce(prev => prev + 1);
        }}
      />

      {/* 16 LETTERS DEDICATED MODAL */}
      <SixteenLettersModal
        isOpen={is16LettersModalOpen}
        onClose={() => setIs16LettersModalOpen(false)}
        letters16={letters16}
        onOpenLetter={handleOpenLetter}
        testModeUnlocked={settings.testModeUnlocked}
        birthdayDate={settings.birthdayDate}
        recipientName={settings.recipientName}
      />

      {/* BLOOMING CHRYSANTHEMUM MODAL */}
      <ChrysanthemumBloom
        recipientName={settings.recipientName}
        isOpen={isBloomModalOpen}
        onClose={() => setIsBloomModalOpen(false)}
        hasTodayLetter={Boolean(todayLetter)}
        onOpenTodayLetter={() => {
          if (todayLetter) handleOpenLetter(todayLetter);
        }}
      />

      {/* LETTER READER MODAL */}
      <LetterReaderModal
        letter={selectedLetter}
        isOpen={Boolean(selectedLetter)}
        onClose={handleCloseLetter}
        authorName="with love, zzy"
        recipientName={settings.recipientName}
      />

      {/* AUTHOR STUDIO MODAL */}
      {isAuthorStudioOpen && (
        <AuthorStudio
          settings={settings}
          letters={letters}
          letters16={letters16}
          onSaveLetter={handleSaveLetter}
          onDeleteLetter={handleDeleteLetter}
          onSaveLetter16={handleSaveLetter16}
          onUpdateSettings={handleUpdateSettings}
          onSendTestNotification={handleSendTestNotification}
          onClose={() => setIsAuthorStudioOpen(false)}
          onSelectTrack={(track) => {
            setCurrentTrack(track);
            setSongTriggerReason(`Chosen: ${track.name}`);
            setAutoPlayNonce(prev => prev + 1);
          }}
          currentTrack={currentTrack}
          onOpenAndroidModal={() => setShowAndroidModal(true)}
        />
      )}

      {/* ANDROID APP INSTALL & APK MODAL */}
      <AndroidAppModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
        deferredPrompt={deferredPrompt}
      />

      {/* AUTHOR PASSWORD MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#D0DDD1] shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFE6EB] text-[#E26887] mx-auto flex items-center justify-center mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#1F2E24]">Author Access</h3>
            <p className="text-xs text-[#52775C] mt-1 mb-4">
              Enter password to access Author Studio
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                placeholder="Enter Password"
                value={pinAttempt}
                onChange={(e) => {
                  setPinAttempt(e.target.value);
                  setPinError(false);
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-center text-base tracking-wider bg-white focus:outline-none ${
                  pinError ? 'border-red-400 ring-2 ring-red-200' : 'border-[#D0DDD1] focus:ring-2 focus:ring-[#46684F]'
                }`}
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-red-600 font-medium">Incorrect password. Please try again.</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-full text-xs font-medium text-[#52775C] hover:bg-[#E6ECE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#46684F] hover:bg-[#334E3A] text-white text-xs font-semibold"
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
