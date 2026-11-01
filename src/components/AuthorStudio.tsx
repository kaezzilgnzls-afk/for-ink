import React, { useState } from 'react';
import {
  PenTool,
  Plus,
  Save,
  Trash2,
  Smartphone,
  Calendar,
  Sparkles,
  Lock,
  Unlock,
  Check,
  Copy,
  ExternalLink,
  Edit2,
  X,
  Heart,
  FolderHeart,
  Sliders,
  Music,
  Play,
  Eye,
  EyeOff,
  Clock,
  Layers,
  Search,
  Wind,
  Flower2
} from 'lucide-react';
import { AppSettings, DailyLetter, BirthdayLetter16, FlowerTheme, PlaylistTrack, AppFeature } from '../types';
import playlistTracks from '../data/playlist_tracks.json';
import { sound } from '../utils/audio';

interface AuthorStudioProps {
  settings: AppSettings;
  letters: DailyLetter[];
  letters16: BirthdayLetter16[];
  onSaveLetter: (letter: Partial<DailyLetter>) => Promise<void>;
  onDeleteLetter: (id: string) => Promise<void>;
  onSaveLetter16: (letter: BirthdayLetter16) => Promise<void>;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  onSendTestNotification: (title: string, body: string) => Promise<void>;
  onClose: () => void;
  onSelectTrack?: (track: PlaylistTrack) => void;
  currentTrack?: PlaylistTrack | null;
  onOpenAndroidModal?: () => void;
}

export const AuthorStudio: React.FC<AuthorStudioProps> = ({
  settings,
  letters,
  letters16,
  onSaveLetter,
  onDeleteLetter,
  onSaveLetter16,
  onUpdateSettings,
  onSendTestNotification,
  onClose,
  onSelectTrack,
  currentTrack,
  onOpenAndroidModal
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'letters16' | 'manage' | 'features' | 'music' | 'settings'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<'author' | 'recipient' | null>(null);

  // Daily & Additional Letter form state
  const [editingLetterId, setEditingLetterId] = useState<string | null>(null);
  const [letterType, setLetterType] = useState<'countdown' | 'additional'>('countdown');
  const [dayNumber, setDayNumber] = useState<number>(letters.length + 1);
  const [dateString, setDateString] = useState<string>(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [quote, setQuote] = useState('');
  const [photoUrl, setPhotoUrl] = useState('/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg');
  const [flowerTheme, setFlowerTheme] = useState<FlowerTheme>('soft-pink');
  const [notifyRecipient, setNotifyRecipient] = useState(true);

  // 16 Letters editor state
  const [selectedLetter16Index, setSelectedLetter16Index] = useState<number>(0);
  const [letter16Title, setLetter16Title] = useState<string>(letters16[0]?.title || '');
  const [letter16Content, setLetter16Content] = useState<string>(letters16[0]?.content || '');
  const [letter16Quote, setLetter16Quote] = useState<string>(letters16[0]?.quote || '');
  const [letter16Photo, setLetter16Photo] = useState<string>(letters16[0]?.photoUrl || '/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg');

  // Features & 16 Letters Visibility state
  const [show16Letters, setShow16Letters] = useState<boolean>(Boolean(settings.show16Letters));
  const [show16LettersDate, setShow16LettersDate] = useState<string>(
    settings.show16LettersDate ? settings.show16LettersDate.slice(0, 16) : '2026-11-13T00:00'
  );
  const [enableBloomIntro, setEnableBloomIntro] = useState<boolean>(settings.enableBloomIntro !== false);
  const [enableFallingPetals, setEnableFallingPetals] = useState<boolean>(settings.enableFallingPetals !== false);
  const [petalSpeed, setPetalSpeed] = useState<number>(settings.petalSpeed ?? 1.0);
  const [petalDensity, setPetalDensity] = useState<number>(settings.petalDensity ?? 18);
  const [enableAudio, setEnableAudio] = useState<boolean>(settings.enableAudio !== false);
  const [heroMessage, setHeroMessage] = useState<string>(
    settings.heroMessage || "November is a very special month for all of the people around you. It is a gift from God, you are a Gift from God. Our heaven sent, my heaven sent."
  );
  const [additionalFeatures, setAdditionalFeatures] = useState<AppFeature[]>(
    settings.additionalFeatures || [
      { id: 'bonus_gallery', name: 'Surprise Keepsake Photos', description: 'Special photo snapshots woven into letter reading', enabled: true },
      { id: 'anniversary_note', name: 'Bonus Celebration Letter', description: 'Surprise letter for November 14 onwards', enabled: true }
    ]
  );
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');

  // Settings & Account state
  const [recipientNameInput, setRecipientNameInput] = useState(settings.recipientName || 'ink');
  const [authorNameInput, setAuthorNameInput] = useState(settings.authorName || 'zzy');
  const [birthdayDateInput, setBirthdayDateInput] = useState(settings.birthdayDate ? settings.birthdayDate.slice(0, 16) : '2026-11-13T00:00');
  const [pinInput, setPinInput] = useState(settings.authorPin || 'drigorry');
  const [testModeUnlocked, setTestModeUnlocked] = useState(Boolean(settings.testModeUnlocked));

  // Music search state
  const [musicSearch, setMusicSearch] = useState('');
  const tracks: PlaylistTrack[] = playlistTracks as PlaylistTrack[];
  const filteredTracks = tracks.filter(t =>
    t.name.toLowerCase().includes(musicSearch.toLowerCase()) ||
    t.artist.toLowerCase().includes(musicSearch.toLowerCase())
  );

  // Check if 16 letters are currently visible to ink
  const is16LettersCurrentlyVisible =
    show16Letters ||
    testModeUnlocked ||
    (show16LettersDate && new Date().getTime() >= new Date(show16LettersDate).getTime());

  // Select a letter from the 16 letters to edit
  const handleSelectLetter16 = (idx: number) => {
    setSelectedLetter16Index(idx);
    const target = letters16[idx];
    if (target) {
      setLetter16Title(target.title);
      setLetter16Content(target.content);
      setLetter16Quote(target.quote || '');
      setLetter16Photo(target.photoUrl || '/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg');
    }
  };

  const handleSaveLetter16 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const current = letters16[selectedLetter16Index];
      const updated: BirthdayLetter16 = {
        id: current?.id || `letter-16-${selectedLetter16Index + 1}`,
        letterNumber: selectedLetter16Index + 1,
        title: letter16Title.trim(),
        content: letter16Content.trim(),
        quote: letter16Quote.trim() || undefined,
        photoUrl: letter16Photo.trim() || '/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg',
        theme: current?.theme || 'soft-pink'
      };
      await onSaveLetter16(updated);
      setStatusMessage(`Letter #${selectedLetter16Index + 1} of 16 saved successfully!`);
    } catch {
      setStatusMessage('Failed to save letter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDailyForm = (isAdditional = false) => {
    setEditingLetterId(null);
    setLetterType(isAdditional ? 'additional' : 'countdown');
    setDayNumber(isAdditional ? Math.max(14, letters.length + 1) : letters.length + 1);
    setDateString(new Date().toISOString().split('T')[0]);
    setTitle(isAdditional ? 'Surprise Letter for ink' : '');
    setContent('');
    setQuote('');
    setPhotoUrl('/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg');
    setFlowerTheme('soft-pink');
    setNotifyRecipient(true);
  };

  const handleEditDailyLetter = (letter: DailyLetter) => {
    setEditingLetterId(letter.id);
    setLetterType(letter.dayNumber > 13 ? 'additional' : 'countdown');
    setDayNumber(letter.dayNumber);
    setDateString(letter.dateString);
    setTitle(letter.title);
    setContent(letter.content);
    setQuote(letter.quote || '');
    setPhotoUrl(letter.photoUrl || '/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg');
    setFlowerTheme(letter.flowerTheme || 'soft-pink');
    setNotifyRecipient(false);
    setActiveTab('write');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isFor16: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (isFor16) {
            setLetter16Photo(reader.result);
          } else {
            setPhotoUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDailyLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setStatusMessage('Please provide both a title and letter message.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await onSaveLetter({
        id: editingLetterId || undefined,
        dayNumber,
        dateString,
        title: title.trim(),
        content: content.trim(),
        quote: quote.trim() || undefined,
        photoUrl: photoUrl.trim() || '/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg',
        flowerTheme,
        notifySent: notifyRecipient
      });

      setStatusMessage(
        editingLetterId
          ? 'Letter updated successfully!'
          : `${letterType === 'additional' ? 'Additional letter' : 'Daily letter'} published! Notification sent.`
      );
      resetDailyForm();
    } catch {
      setStatusMessage('Failed to save letter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save App Features & 16 Letters Visibility
  const handleSaveFeatures = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateSettings({
        show16Letters,
        show16LettersDate: new Date(show16LettersDate).toISOString(),
        enableBloomIntro,
        enableFallingPetals,
        petalSpeed,
        petalDensity,
        enableAudio,
        heroMessage,
        additionalFeatures
      });
      setStatusMessage('App features & petal shower settings updated successfully!');
    } catch {
      setStatusMessage('Failed to update app features.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;
    const newFeature: AppFeature = {
      id: `feature-${Date.now()}`,
      name: newFeatureName.trim(),
      description: newFeatureDesc.trim() || 'Custom app feature for ink',
      enabled: true
    };
    setAdditionalFeatures([...additionalFeatures, newFeature]);
    setNewFeatureName('');
    setNewFeatureDesc('');
  };

  const handleToggleCustomFeature = (id: string) => {
    setAdditionalFeatures(prev =>
      prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    );
  };

  const handleDeleteCustomFeature = (id: string) => {
    setAdditionalFeatures(prev => prev.filter(f => f.id !== id));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateSettings({
        recipientName: recipientNameInput,
        authorName: authorNameInput,
        birthdayDate: new Date(birthdayDateInput).toISOString(),
        authorPin: pinInput,
        testModeUnlocked
      });
      setStatusMessage('Birthday settings saved successfully!');
    } catch {
      setStatusMessage('Failed to save settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAuthorPhoneUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'author');
    url.searchParams.set('pin', settings.authorPin || 'drigorry');
    return url.toString();
  };

  const getRecipientUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    url.searchParams.delete('author');
    url.searchParams.delete('pin');
    return url.toString();
  };

  const copyToClipboard = (text: string, type: 'author' | 'recipient') => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl my-6 bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#D0DDD1] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#263B2D] text-[#FAF7F2] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#E26887] text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-semibold">Author Studio for ink</h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync Active
                </span>
              </div>
              <p className="text-xs text-[#D0DDD1]">Publish letters & customize settings — updates reflect online instantly for ink</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#D0DDD1] hover:text-white transition-colors cursor-pointer"
            aria-label="Close Author Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#D0DDD1] bg-[#F4F7F4] px-4 pt-2 shrink-0 overflow-x-auto gap-1 sm:gap-2">
          {[
            { id: 'write', label: editingLetterId ? 'Edit Letter' : 'Pen a Letter', icon: PenTool },
            { id: 'letters16', label: '16 Letters', icon: FolderHeart },
            { id: 'features', label: 'Features & Visibility', icon: Sliders },
            { id: 'manage', label: `Archive (${letters.length})`, icon: Calendar },
            { id: 'music', label: 'Choose Song', icon: Music },
            { id: 'settings', label: 'Settings & Phone App', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#E26887] text-[#1F2E24] bg-[#FAF7F2] rounded-t-xl font-semibold shadow-2xs'
                    : 'border-transparent text-[#52775C] hover:text-[#1F2E24]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E26887]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#E6ECE6] border border-[#46684F]/30 text-xs text-[#263B2D] flex items-center justify-between">
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-[#52775C] hover:text-[#1F2E24] ml-2 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* TAB 1: DAILY & ADDITIONAL LETTER WRITER */}
          {activeTab === 'write' && (
            <form onSubmit={handleSubmitDailyLetter} className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EAF1EB]/70 border border-[#D0DDD1]">
                <div>
                  <h4 className="text-sm font-semibold text-[#1F2E24]">
                    {editingLetterId ? 'Editing Letter' : 'Pen a New Letter for ink'}
                  </h4>
                  <p className="text-xs text-[#52775C]">
                    Create countdown letters (Days 1–13) or additional bonus letters (Day 14+)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => resetDailyForm(false)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      letterType === 'countdown' ? 'bg-[#46684F] text-white shadow-2xs' : 'bg-white text-[#52775C] border border-[#D0DDD1]'
                    }`}
                  >
                    Countdown Letter
                  </button>
                  <button
                    type="button"
                    onClick={() => resetDailyForm(true)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      letterType === 'additional' ? 'bg-[#E26887] text-white shadow-2xs' : 'bg-white text-[#52775C] border border-[#D0DDD1]'
                    }`}
                  >
                    + Additional Letter
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                    Day Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={dayNumber}
                    onChange={(e) => setDayNumber(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#46684F]"
                    required
                  />
                  <p className="text-[11px] text-[#688D73] mt-1">
                    {dayNumber <= 13 ? `Countdown Day ${dayNumber}` : `Additional Bonus Letter (Day ${dayNumber})`}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                    Unfolding Date (PHT)
                  </label>
                  <input
                    type="date"
                    value={dateString}
                    onChange={(e) => setDateString(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#46684F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                    Flower Theme
                  </label>
                  <select
                    value={flowerTheme}
                    onChange={(e) => setFlowerTheme(e.target.value as FlowerTheme)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#46684F]"
                  >
                    <option value="soft-pink">🌸 Soft Blush Pink</option>
                    <option value="blush-rose">🌹 Deep Blush Rose</option>
                    <option value="matcha-sage">🌿 Sage Matcha Green</option>
                    <option value="golden-core">✨ Golden Chrysanthemum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                  Letter Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Day 1: The Countdown Begins, or A Surprise Memory"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#46684F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                  Letter Message for ink
                </label>
                <textarea
                  rows={6}
                  placeholder="Write your heartfelt letter here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D0DDD1] bg-white text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#46684F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                  Featured Poetic Quote or Song Lyric (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. “You are the home in a noisy world.”"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#46684F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                  Letter Photo (Default Keepsake Photo Included)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, false)}
                    className="w-full sm:w-auto text-xs text-[#52775C] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#46684F] file:text-white cursor-pointer"
                  />
                  <input
                    type="url"
                    placeholder="or custom photo URL..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#D0DDD1] bg-white text-xs focus:outline-none"
                  />
                </div>

                {photoUrl && (
                  <div className="mt-3 relative w-32 h-24 rounded-xl overflow-hidden border border-[#D0DDD1] group">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg')}
                      className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black"
                      title="Reset to default keepsake photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#E6ECE6] border border-[#46684F]/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#263B2D]">Notify ink with Chime & Alert</p>
                  <p className="text-[11px] text-[#52775C]">Sends in-app notification & browser chime when letter blooms</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyRecipient}
                  onChange={(e) => setNotifyRecipient(e.target.checked)}
                  className="w-5 h-5 text-[#46684F] rounded-md focus:ring-[#46684F] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                {editingLetterId && (
                  <button
                    type="button"
                    onClick={() => resetDailyForm()}
                    className="px-5 py-2.5 rounded-full text-xs font-medium text-[#52775C] hover:bg-[#E6ECE6] cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-full bg-[#E26887] hover:bg-[#D45575] text-white text-sm font-semibold flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>{editingLetterId ? 'Update Letter' : 'Publish Letter for ink'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: 16 LETTERS (NOV 13) */}
          {activeTab === 'letters16' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#FFE6EB]/60 border border-[#E26887]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#1F2E24] flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#E26887] fill-current" />
                    <span>The 16 Birthday Keepsake Letters</span>
                  </h3>
                  <p className="text-xs text-[#8C233E]">
                    Editable keepsakes celebrating ink on November 13th.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('features')}
                  className="px-3.5 py-1.5 rounded-full bg-white text-[#A6304C] border border-[#F7ADC0] text-xs font-semibold hover:bg-[#FFF5F7] cursor-pointer"
                >
                  Manage 16 Letters Visibility ⚙️
                </button>
              </div>

              {/* Grid of 16 Letter Buttons */}
              <div>
                <label className="block text-xs font-bold text-[#1F2E24] mb-2 uppercase tracking-wider">
                  Select Letter to Edit (1 to 16):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const isSelected = selectedLetter16Index === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectLetter16(idx)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E26887] text-white shadow-sm ring-2 ring-[#E26887]/40'
                            : 'bg-white border border-[#D0DDD1] text-[#52775C] hover:bg-[#FFE6EB]'
                        }`}
                      >
                        #{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSaveLetter16} className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#A6304C] bg-[#FFE6EB] px-3 py-1 rounded-full">
                    Editing Letter #{selectedLetter16Index + 1} of 16
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                    Letter Title
                  </label>
                  <input
                    type="text"
                    value={letter16Title}
                    onChange={(e) => setLetter16Title(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-white text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                    Letter Content for ink
                  </label>
                  <textarea
                    rows={6}
                    value={letter16Content}
                    onChange={(e) => setLetter16Content(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#D0DDD1] bg-white text-sm leading-relaxed focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                    Poetic Quote or Sentiment
                  </label>
                  <input
                    type="text"
                    value={letter16Quote}
                    onChange={(e) => setLetter16Quote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                    Attach Photo
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, true)}
                      className="w-full sm:w-auto text-xs text-[#52775C] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#46684F] file:text-white cursor-pointer"
                    />
                    <input
                      type="url"
                      placeholder="or photo URL..."
                      value={letter16Photo}
                      onChange={(e) => setLetter16Photo(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#D0DDD1] bg-white text-xs"
                    />
                  </div>

                  {letter16Photo && (
                    <div className="mt-3 relative w-32 h-24 rounded-xl overflow-hidden border border-[#D0DDD1]">
                      <img src={letter16Photo} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setLetter16Photo('/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg')}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white"
                        title="Reset to default photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-full bg-[#E26887] hover:bg-[#D45575] text-white text-sm font-semibold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-white" />
                    <span>Save Letter #{selectedLetter16Index + 1}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: APP FEATURES & 16 LETTERS VISIBILITY */}
          {activeTab === 'features' && (
            <form onSubmit={handleSaveFeatures} className="space-y-6">
              {/* 16 Letters Visibility Control */}
              <div className="p-5 rounded-2xl bg-[#FFF5F7] border border-[#F7ADC0] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderHeart className="w-5 h-5 text-[#E26887]" />
                    <h3 className="font-serif text-lg font-semibold text-[#1F2E24]">
                      16 Birthday Letters Visibility
                    </h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    is16LettersCurrentlyVisible ? 'bg-[#E6ECE6] text-[#263B2D]' : 'bg-[#FFE6EB] text-[#A6304C]'
                  }`}>
                    {is16LettersCurrentlyVisible ? <Eye className="w-3.5 h-3.5 text-[#46684F]" /> : <EyeOff className="w-3.5 h-3.5 text-[#E26887]" />}
                    <span>{is16LettersCurrentlyVisible ? 'Currently Visible to ink' : 'Currently Hidden from ink'}</span>
                  </span>
                </div>

                <p className="text-xs text-[#52775C] leading-relaxed">
                  You can keep the 16 letters hidden from ink's view until a specific date/time, or toggle them to be immediately visible whenever you wish.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white border border-[#D0DDD1] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1F2E24]">Show 16 Letters to ink Now</p>
                      <p className="text-[11px] text-[#688D73]">Overrides date and makes them visible immediately</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={show16Letters}
                      onChange={(e) => setShow16Letters(e.target.checked)}
                      className="w-5 h-5 text-[#E26887] rounded-md focus:ring-[#E26887] cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#D0DDD1]">
                    <label className="block text-xs font-bold text-[#1F2E24] mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#688D73]" />
                      <span>When to Automatically Reveal</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={show16LettersDate}
                      onChange={(e) => setShow16LettersDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#D0DDD1] text-xs bg-[#FAF7F2]"
                    />
                    <p className="text-[10px] text-[#688D73] mt-1">Default: November 13, 2026 (Philippine Time)</p>
                  </div>
                </div>
              </div>

              {/* Botanical Hero Message Editor */}
              <div className="p-5 rounded-2xl bg-white border border-[#D0DDD1] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#1F2E24] uppercase tracking-wider">
                    Hero Botanical Paragraph
                  </label>
                  <button
                    type="button"
                    onClick={() => setHeroMessage("November is a very special month for all of the people around you. It is a gift from God, you are a Gift from God. Our heaven sent, my heaven sent.")}
                    className="text-[11px] text-[#E26887] hover:underline cursor-pointer"
                  >
                    Reset to Default Poem
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={heroMessage}
                  onChange={(e) => setHeroMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-[#FAF7F2] text-xs sm:text-sm leading-relaxed focus:outline-none"
                  placeholder="Hero opening paragraph..."
                />
                <p className="text-[11px] text-[#688D73]">
                  This paragraph appears prominently in the hero section below the title.
                </p>
              </div>

              {/* Core App Feature Toggles */}
              <div className="p-5 rounded-2xl bg-white border border-[#D0DDD1] space-y-4">
                <h4 className="text-xs font-bold text-[#1F2E24] uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#46684F]" />
                  <span>Core App Visual & Audio Features</span>
                </h4>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6ECE6] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1F2E24]">Blooming Chrysanthemum Opening Intro</p>
                      <p className="text-[11px] text-[#52775C]">Interactive 72-petal animated blossom on app launch</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableBloomIntro}
                      onChange={(e) => setEnableBloomIntro(e.target.checked)}
                      className="w-5 h-5 text-[#E26887] rounded-md focus:ring-[#E26887] cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6ECE6] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#FFE6EB] text-[#E26887]">
                          <Flower2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1F2E24]">Drifting Chrysanthemum Petal Shower</p>
                          <p className="text-[11px] text-[#52775C]">Ambient pink & sage flower petals falling gently across screen</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={enableFallingPetals}
                        onChange={(e) => setEnableFallingPetals(e.target.checked)}
                        className="w-5 h-5 text-[#E26887] rounded-md focus:ring-[#E26887] cursor-pointer"
                      />
                    </div>

                    {enableFallingPetals && (
                      <div className="pt-2 border-t border-[#D0DDD1]/60 space-y-4">
                        {/* Preset Moods */}
                        <div>
                          <p className="text-[11px] font-bold text-[#263B2D] uppercase tracking-wider mb-2">
                            Quick Atmosphere Presets
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { label: '🌸 Serene Whisper', speed: 0.6, density: 10 },
                              { label: '🍃 Autumn Breeze', speed: 1.0, density: 18 },
                              { label: '💖 Lush Garden', speed: 0.9, density: 32 },
                              { label: '✨ Whirlwind', speed: 1.6, density: 44 }
                            ].map((preset) => {
                              const isSelected = petalSpeed === preset.speed && petalDensity === preset.density;
                              return (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => {
                                    setPetalSpeed(preset.speed);
                                    setPetalDensity(preset.density);
                                  }}
                                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#E26887] text-white border-[#E26887] shadow-xs'
                                      : 'bg-white text-[#263B2D] border-[#D0DDD1] hover:bg-[#FFE6EB]/50'
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Sliders Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                          {/* Speed Slider */}
                          <div className="p-3.5 rounded-xl bg-white border border-[#D0DDD1] space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-[#1F2E24] flex items-center gap-1.5">
                                <Wind className="w-3.5 h-3.5 text-[#46684F]" />
                                <span>Petal Speed</span>
                              </label>
                              <span className="px-2 py-0.5 rounded-md bg-[#E6ECE6] text-[#263B2D] text-xs font-mono font-bold">
                                {petalSpeed.toFixed(1)}x
                              </span>
                            </div>

                            <input
                              type="range"
                              min="0.5"
                              max="2.0"
                              step="0.1"
                              value={petalSpeed}
                              onChange={(e) => setPetalSpeed(parseFloat(e.target.value))}
                              className="w-full accent-[#E26887] cursor-pointer"
                            />

                            <div className="flex justify-between text-[10px] text-[#688D73]">
                              <span>Slow & Dreamy (0.5x)</span>
                              <span>Swift Breeze (2.0x)</span>
                            </div>

                            <p className="text-[11px] text-[#A6304C] font-medium pt-0.5">
                              {petalSpeed <= 0.7
                                ? '🍃 Gentle & slow drift'
                                : petalSpeed <= 1.2
                                ? '🌸 Natural balanced float (Default)'
                                : petalSpeed <= 1.6
                                ? '💨 Lively fluttering breeze'
                                : '🍂 Swift playful gust'}
                            </p>
                          </div>

                          {/* Density Slider */}
                          <div className="p-3.5 rounded-xl bg-white border border-[#D0DDD1] space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-[#1F2E24] flex items-center gap-1.5">
                                <Flower2 className="w-3.5 h-3.5 text-[#E26887]" />
                                <span>Petal Density</span>
                              </label>
                              <span className="px-2 py-0.5 rounded-md bg-[#FFE6EB] text-[#A6304C] text-xs font-mono font-bold">
                                {petalDensity} petals
                              </span>
                            </div>

                            <input
                              type="range"
                              min="6"
                              max="48"
                              step="2"
                              value={petalDensity}
                              onChange={(e) => setPetalDensity(parseInt(e.target.value, 10))}
                              className="w-full accent-[#E26887] cursor-pointer"
                            />

                            <div className="flex justify-between text-[10px] text-[#688D73]">
                              <span>Minimal (6)</span>
                              <span>Shower (48)</span>
                            </div>

                            <p className="text-[11px] text-[#46684F] font-medium pt-0.5">
                              {petalDensity <= 10
                                ? '✨ Subtle & delicate'
                                : petalDensity <= 22
                                ? '🌿 Balanced garden petals (Default)'
                                : petalDensity <= 34
                                ? '🌸 Lush romantic blossom shower'
                                : '🌺 Festive chrysanthemum blizzard'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6ECE6] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1F2E24]">Random Playlist Music & Flower Chimes</p>
                      <p className="text-[11px] text-[#52775C]">Plays random songs and soothing pentatonic chimes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableAudio}
                      onChange={(e) => setEnableAudio(e.target.checked)}
                      className="w-5 h-5 text-[#E26887] rounded-md focus:ring-[#E26887] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Additional App Features */}
              <div className="p-5 rounded-2xl bg-white border border-[#D0DDD1] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#1F2E24] uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#E26887]" />
                      <span>Additional App Features for ink</span>
                    </h4>
                    <p className="text-[11px] text-[#52775C]">Add special surprises, milestone markers, or custom app tags</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {additionalFeatures.map((feat) => (
                    <div
                      key={feat.id}
                      className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6ECE6] flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#1F2E24]">{feat.name}</p>
                        <p className="text-[11px] text-[#52775C]">{feat.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="checkbox"
                          checked={feat.enabled}
                          onChange={() => handleToggleCustomFeature(feat.id)}
                          className="w-4 h-4 text-[#46684F] rounded-md cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomFeature(feat.id)}
                          className="p-1 rounded-lg hover:bg-[#FFE6EB] text-[#A6304C]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="New Feature Name (e.g. Polaroid Gallery)"
                    value={newFeatureName}
                    onChange={(e) => setNewFeatureName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#D0DDD1] bg-[#FAF7F2] text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Brief description..."
                    value={newFeatureDesc}
                    onChange={(e) => setNewFeatureDesc(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#D0DDD1] bg-[#FAF7F2] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFeature}
                    className="px-4 py-2 rounded-xl bg-[#46684F] text-white text-xs font-semibold shrink-0 hover:bg-[#334E3A] cursor-pointer"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-full bg-[#46684F] hover:bg-[#334E3A] text-white text-sm font-semibold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#F7ADC0]" />
                  <span>Save Features & Visibility</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: ARCHIVE & LETTERS MANAGER */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-[#D0DDD1] gap-2">
                <p className="text-xs text-[#52775C]">
                  {letters.length} letter{letters.length === 1 ? '' : 's'} in archive
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      resetDailyForm(false);
                      setActiveTab('write');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#46684F] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Countdown Letter</span>
                  </button>
                  <button
                    onClick={() => {
                      resetDailyForm(true);
                      setActiveTab('write');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#E26887] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Additional Letter</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {letters.map((letter) => {
                  const isBonus = letter.dayNumber > 13;
                  return (
                    <div
                      key={letter.id}
                      className="p-4 rounded-2xl bg-white border border-[#D0DDD1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            isBonus ? 'bg-[#FFE6EB] text-[#A6304C]' : 'bg-[#E6ECE6] text-[#263B2D]'
                          }`}>
                            {isBonus ? `Additional Day ${letter.dayNumber}` : `Countdown Day ${letter.dayNumber}`}
                          </span>
                          <span className="text-xs text-[#688D73]">{letter.dateString}</span>
                        </div>
                        <h4 className="font-serif text-base font-semibold text-[#1F2E24]">
                          {letter.title}
                        </h4>
                        <p className="text-xs text-[#52775C] line-clamp-1 mt-0.5">{letter.content}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleEditDailyLetter(letter)}
                          className="p-2 rounded-xl hover:bg-[#E6ECE6] text-[#46684F] cursor-pointer"
                          title="Edit letter"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteLetter(letter.id)}
                          className="p-2 rounded-xl hover:bg-[#FFE6EB] text-[#A6304C] cursor-pointer"
                          title="Delete letter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: CHOOSE SONG / MUSIC PREVIEW */}
          {activeTab === 'music' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#EAF1EB] border border-[#D0DDD1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#1F2E24] flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#1DB954]" />
                    <span>Choose Songs from Our Playlist</span>
                  </h3>
                  <p className="text-xs text-[#52775C]">
                    Select any song to play for both of you right now.
                  </p>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-[#688D73] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search song or artist..."
                    value={musicSearch}
                    onChange={(e) => setMusicSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-full border border-[#D0DDD1] bg-white text-xs text-[#1F2E24] focus:outline-none"
                  />
                </div>
              </div>

              {currentTrack && (
                <div className="p-3.5 rounded-xl bg-white border-2 border-[#E26887]/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentTrack.cover}
                      alt={currentTrack.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#A6304C]">Currently Playing:</p>
                      <p className="text-sm font-semibold text-[#1F2E24]">{currentTrack.name} — {currentTrack.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#E26887] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Live
                  </span>
                </div>
              )}

              <div className="divide-y divide-[#D0DDD1]/60 rounded-2xl bg-white border border-[#D0DDD1] overflow-hidden max-h-[380px] overflow-y-auto">
                {filteredTracks.map((track, idx) => {
                  const isCurrent = currentTrack?.id === track.id;
                  return (
                    <div
                      key={track.id || idx}
                      className={`p-3 flex items-center justify-between gap-3 transition-colors ${
                        isCurrent ? 'bg-[#FFE6EB]/50' : 'hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono text-[#688D73] w-5 text-center">{idx + 1}</span>
                        <img
                          src={track.cover}
                          alt={track.name}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-[#A6304C]' : 'text-[#1F2E24]'}`}>
                            {track.name}
                          </p>
                          <p className="text-[11px] text-[#52775C] truncate">{track.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectTrack) onSelectTrack(track);
                            setStatusMessage(`Now playing: ${track.name} 🎵`);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                            isCurrent
                              ? 'bg-[#E26887] text-white shadow-2xs'
                              : 'bg-[#E6ECE6] text-[#263B2D] hover:bg-[#FFE6EB] hover:text-[#A6304C]'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isCurrent ? 'Playing' : 'Play Song'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & PHONE APP */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={recipientNameInput}
                      onChange={(e) => setRecipientNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-white text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                      Author Password / PIN
                    </label>
                    <input
                      type="password"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-white text-sm font-mono"
                      required
                    />
                    <p className="text-[11px] text-[#688D73] mt-1">Keep your author password private</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2E24] mb-1 uppercase tracking-wider">
                    Target Birthday Date (November 13 PHT)
                  </label>
                  <input
                    type="datetime-local"
                    value={birthdayDateInput}
                    onChange={(e) => setBirthdayDateInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D0DDD1] bg-white text-sm"
                    required
                  />
                </div>

                {/* Preview / Test Mode Toggle */}
                <div className="p-4 rounded-2xl bg-[#FFE6EB]/60 border border-[#E26887]/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#A6304C]">Preview / Test Mode (Unlock All Letters)</p>
                    <p className="text-[11px] text-[#8C233E]">
                      Allows author to preview and read all letters regardless of unlock dates
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={testModeUnlocked}
                    onChange={(e) => setTestModeUnlocked(e.target.checked)}
                    className="w-5 h-5 text-[#E26887] rounded-md focus:ring-[#E26887] cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-full bg-[#46684F] hover:bg-[#334E3A] text-white text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4 text-[#F7ADC0]" />
                    <span>Save Account Settings</span>
                  </button>
                </div>
              </form>

              {/* Push notification test */}
              <div className="p-4 rounded-2xl bg-[#E6ECE6] border border-[#46684F]/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#263B2D]">Test Notification to ink</p>
                  <p className="text-[11px] text-[#52775C]">Send a test chime & alert to ink's device</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSendTestNotification(
                    "🌸 A letter has bloomed for ink!",
                    "Check today's chrysanthemum flower for your daily note."
                  )}
                  className="px-4 py-2 rounded-full bg-[#46684F] text-white text-xs font-semibold hover:bg-[#334E3A] cursor-pointer"
                >
                  Send Test Alert
                </button>
              </div>

              {/* Android App & APK Distribution */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16241B] to-[#2B4434] text-white shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#E26887] text-white">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold text-[#FAF7F2]">
                        Android App & Phone Distribution
                      </h4>
                      <p className="text-xs text-white/75">
                        Install on ink's Android phone with custom icon & real-time notifications
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E26887] text-white">
                    Android Ready
                  </span>
                </div>

                <p className="text-xs text-white/80 leading-relaxed">
                  "for ink" is optimized for Android with WebAPK installation, native full-screen mode, and offline caching. You can launch the install guide or download the standalone .APK package.
                </p>

                <div className="pt-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAndroidModal) onOpenAndroidModal();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E26887] hover:bg-[#C94D6D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Open Android Install & QR Guide</span>
                  </button>

                  <a
                    href="/APK_DOWNLOAD/app-debug.apk"
                    download="for-ink.apk"
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Download .APK Package</span>
                  </a>
                </div>
              </div>

              {/* Phone app link bookmarks */}
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D0DDD1] space-y-2">
                  <h4 className="font-serif text-base font-semibold text-[#1F2E24] flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#E26887]" />
                    <span>Add to Your Phone's Home Screen</span>
                  </h4>
                  <p className="text-xs text-[#52775C]">
                    Bookmark this author link on your iPhone or Android home screen to write letters anytime like a native app.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D0DDD1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#1F2E24]">Your Secret Author Phone Link</p>
                    <p className="text-[11px] text-[#688D73]">Direct phone bookmark for daily writing</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(getAuthorPhoneUrl(), 'author')}
                    className="px-4 py-2 rounded-full bg-[#46684F] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink === 'author' ? <Check className="w-3.5 h-3.5 text-[#F7ADC0]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink === 'author' ? 'Copied!' : 'Copy Author Link'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D0DDD1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#1F2E24]">Recipient Link for ink</p>
                    <p className="text-[11px] text-[#688D73]">The clean garden view for ink</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(getRecipientUrl(), 'recipient')}
                    className="px-4 py-2 rounded-full bg-[#E26887] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink === 'recipient' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink === 'recipient' ? 'Copied!' : 'Copy ink\'s Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
