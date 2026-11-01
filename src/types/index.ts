export type FlowerTheme = 'soft-pink' | 'blush-rose' | 'matcha-sage' | 'golden-core';

export interface DailyLetter {
  id: string;
  dayNumber: number;
  dateString: string; // YYYY-MM-DD
  title: string;
  content: string;
  quote?: string;
  photoUrl?: string;
  flowerTheme?: FlowerTheme;
  isRead?: boolean;
  createdAt: string;
  notifySent?: boolean;
}

export interface BirthdayLetter16 {
  id: string;
  letterNumber: number; // 1 to 16
  title: string;
  content: string;
  quote?: string;
  photoUrl?: string;
  theme?: FlowerTheme;
  isOpened?: boolean;
}

export interface PlaylistTrack {
  name: string;
  artist: string;
  album: string;
  cover: string;
  id: string;
  uri: string;
  durationMs: number;
  url: string;
}

export interface AppFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface AppSettings {
  recipientName: string;
  authorName: string;
  birthdayDate: string; // 2026-11-13T00:00:00+08:00
  countdownStartDate: string; // 2026-11-01T00:00:00+08:00
  countdownSubtitle: string;
  authorPin: string; // 'drigorry'
  enableAudio: boolean;
  testModeUnlocked: boolean;
  spotifyPlaylistUrl: string;
  // Controls for hiding/showing 16 letters
  show16Letters: boolean; // default false (hidden until author enables or date arrives)
  show16LettersDate: string; // e.g. 2026-11-13T00:00:00+08:00
  // App feature toggles
  enableFallingPetals: boolean;
  petalSpeed?: number; // 0.5 (slow/gentle) to 2.0 (fast/swift), default 1.0
  petalDensity?: number; // 6 (sparse) to 48 (lush), default 18
  enableBloomIntro: boolean;
  heroMessage: string;
  additionalFeatures: AppFeature[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  letterId?: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderRole?: 'ink' | 'zzy' | 'guest';
  message: string;
  timestamp: string;
  flowerEmoji?: string;
  likes?: number;
}

export interface AppreciationLetter {
  id: string;
  author: string;
  authorRole?: 'ink' | 'zzy' | 'friend';
  title: string;
  content: string;
  stampTheme: 'chrysanthemum' | 'blush-rose' | 'golden-core' | 'sage' | 'lavender';
  pinnedDate: string;
  likes: number;
  photoUrl?: string;
}

export interface AppDataResponse {
  settings: AppSettings;
  letters: DailyLetter[];
  letters16: BirthdayLetter16[];
  notifications: AppNotification[];
  chatMessages: ChatMessage[];
  appreciationLetters: AppreciationLetter[];
}
