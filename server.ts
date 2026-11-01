import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure public static directory is served cleanly
app.use(express.static(path.resolve(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.webmanifest')) {
      res.setHeader('Content-Type', 'application/manifest+json');
    }
  }
}));

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getDefault16Letters() {
  const titles = [
    "To the one who holds my heart",
    "On your quiet, captivating laughter",
    "A memory of our sweetest afternoon",
    "Why your smile makes the world pause",
    "The playlist songs that belong to you",
    "A promise to stay through all seasons",
    "On how you inspire me every single day",
    "The little things about you nobody else notices",
    "Remembering our meaningful silences",
    "A whisper of gratitude for your existence",
    "My favorite version of us together",
    "When I look into your gentle eyes",
    "The way you turn simple moments into poetry",
    "A secret wish for your 16th birthday",
    "For all the sunrises yet to come",
    "Happy 16th Birthday, my dearest ink"
  ];

  const defaultQuotes = [
    "“Ikaw ang tahanan sa mundong maingay.”",
    "“Your voice is the gentle melody I seek in every song.”",
    "“With you, even quiet moments feel like holy ground.”",
    "“You are my favorite thought before I fall asleep.”",
    "“Every lyric in our playlist reminds me of your grace.”",
    "“Through rain or sunshine, I will choose you every time.”",
    "“You teach me what it means to love with kindness.”",
    "“The world is softer because you walk upon it.”",
    "“In our meaningful silence, we speak a language only we know.”",
    "“Thank you for being born, and thank you for being mine.”",
    "“We were written in the stars long before we met.”",
    "“Your eyes hold galaxies of gentleness.”",
    "“A thousand chrysanthemums cannot match your bloom.”",
    "“May every dream in your heart unfold with ease.”",
    "“The best chapter of our lives is always the next one.”",
    "“Happy birthday, ink. My love for you has no end.”"
  ];

  return titles.map((title, idx) => ({
    id: `letter-16-${idx + 1}`,
    letterNumber: idx + 1,
    title,
    content: `Dearest ink,\n\nThis is letter #${idx + 1} of your sixteen birthday keepsakes. Written with all my devotion to celebrate who you are on this special 13th of November.\n\nEvery day with you has been a blessing beyond words. May your birthday be as luminous and radiant as your soul.`,
    quote: defaultQuotes[idx] || "“With love, always.”",
    photoUrl: "/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg",
    theme: (idx % 2 === 0 ? "soft-pink" : "blush-rose") as "soft-pink" | "blush-rose",
    isOpened: false
  }));
}

function getDefaultChatMessages() {
  return [
    {
      id: "chat-msg-1",
      sender: "zzy",
      senderRole: "zzy",
      message: "Happy birthday month, my love! 🌸 Welcome to your special garden.",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      flowerEmoji: "🌸",
      likes: 5
    },
    {
      id: "chat-msg-2",
      sender: "ink",
      senderRole: "ink",
      message: "This is the most heartwarming and lovely surprise ever 🥹❤️ I can't wait for each day!",
      timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
      flowerEmoji: "💌",
      likes: 8
    },
    {
      id: "chat-msg-3",
      sender: "zzy",
      senderRole: "zzy",
      message: "November 13 will be unforgettable. You deserve every ounce of love and gentleness in this universe ✨",
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      flowerEmoji: "✨",
      likes: 12
    }
  ];
}

function getDefaultAppreciationLetters() {
  return [
    {
      id: "apprec-1",
      author: "zzy",
      authorRole: "zzy",
      title: "Why You Are My Safe Haven",
      content: "Dearest ink,\n\nWhenever the world gets loud and chaotic, just hearing your laughter or seeing your radiant smile grounds me completely. You have this unmatched, delicate warmth that makes anyone lucky enough to know you feel cared for.\n\nThank you for being born, and thank you for being you.",
      stampTheme: "chrysanthemum" as const,
      pinnedDate: "2026-11-01",
      likes: 24,
      photoUrl: "/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg"
    },
    {
      id: "apprec-2",
      author: "ink",
      authorRole: "ink",
      title: "A Letter of Pure Gratitude",
      content: "To zzy,\n\nI never knew love could feel this gentle and enduring. Every song in our playlist, every letter you wrote, and every moment we share is a treasure I hold close to my heart. Thank you for making my 16th birthday feel so magical.",
      stampTheme: "blush-rose" as const,
      pinnedDate: "2026-11-02",
      likes: 31,
      photoUrl: "/assets/aistudio/photo_6201466797702187888_y_ad526240.jpg"
    },
    {
      id: "apprec-3",
      author: "zzy",
      authorRole: "zzy",
      title: "To the Light in Every Room",
      content: "Just a reminder: Chrysanthemums bloom gracefully in late autumn when other flowers begin to fade. You are exactly like that — resilient, beautiful, and deeply radiant across all seasons of life.",
      stampTheme: "golden-core" as const,
      pinnedDate: "2026-11-03",
      likes: 19
    }
  ];
}

function getInitialData() {
  const bdayPHT = "2026-11-13T00:00:00+08:00";
  const startPHT = "2026-11-01T00:00:00+08:00";

  const dailyLetters = [
    {
      id: "daily-nov-1",
      dayNumber: 1,
      dateString: "2026-11-01",
      title: "Day 1: The Countdown Begins",
      content: "Happy November 1st, ink.\n\nToday marks the beginning of our countdown toward your birthday on November 13th. Every single day until your celebration, a new chrysanthemum flower will open with a letter written just for you.\n\nWelcome to your garden.",
      quote: "“Ating dalawa ang buong mundo simula ngayon.”",
      flowerTheme: "soft-pink",
      photoUrl: "/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg",
      isRead: false,
      createdAt: new Date().toISOString(),
      notifySent: true
    },
    {
      id: "daily-nov-2",
      dayNumber: 2,
      dateString: "2026-11-02",
      title: "Day 2: Listening to Our Songs",
      content: "Good morning, ink.\n\nI was listening to our playlist today and 'love.' by wave to earth came on. Every time the chords play, I imagine sitting beside you with nothing else to rush for.\n\nYou bring a rare and gentle calm into my days.",
      quote: "“You make the quiet moments feel like home.”",
      flowerTheme: "blush-rose",
      photoUrl: "/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg",
      isRead: false,
      createdAt: new Date().toISOString(),
      notifySent: true
    },
    {
      id: "daily-nov-3",
      dayNumber: 3,
      dateString: "2026-11-03",
      title: "Day 3: The Way You Smile",
      content: "Dearest ink,\n\nDid you know that whenever you smile, your entire face lights up in a way that makes everything around you feel warmer? That is my favorite sight in the world.",
      quote: "“In your smile, I see something more beautiful than the stars.”",
      flowerTheme: "golden-core",
      photoUrl: "/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg",
      isRead: false,
      createdAt: new Date().toISOString(),
      notifySent: false
    }
  ];

  return {
    settings: {
      recipientName: "ink",
      authorName: "zzy",
      birthdayDate: bdayPHT,
      countdownStartDate: startPHT,
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
        { id: "random_song_player", name: "Automatic Random Playlist Player", description: "Plays songs when opening app and reading letters", enabled: true },
        { id: "live_chat", name: "Live Chat with ink & zzy", description: "Real-time chat room with cute stickers & audio", enabled: true },
        { id: "appreciation_wall", name: "Appreciation Wall & Keepsake Letters", description: "Interactive keepsake board where she can add heartfelt letters", enabled: true }
      ]
    },
    letters: dailyLetters,
    letters16: getDefault16Letters(),
    chatMessages: getDefaultChatMessages(),
    appreciationLetters: getDefaultAppreciationLetters(),
    notifications: [
      {
        id: "notif-1",
        title: "Welcome to for ink 🌸",
        body: "Your birthday countdown has begun with blooming chrysanthemums and daily letters!",
        timestamp: new Date().toISOString(),
        letterId: "daily-nov-1",
        isRead: false
      }
    ]
  };
}

function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const store = JSON.parse(content);
      let changed = false;

      if (store.settings.authorName !== 'zzy') {
        store.settings.authorName = 'zzy';
        changed = true;
      }
      if (store.settings.recipientName !== 'ink') {
        store.settings.recipientName = 'ink';
        changed = true;
      }
      if (store.settings.authorPin !== 'drigorry') {
        store.settings.authorPin = 'drigorry';
        changed = true;
      }
      if (typeof store.settings.show16Letters !== 'boolean') {
        store.settings.show16Letters = false;
        changed = true;
      }
      if (!store.settings.show16LettersDate) {
        store.settings.show16LettersDate = "2026-11-13T00:00:00+08:00";
        changed = true;
      }
      if (!store.settings.heroMessage || store.settings.heroMessage.startsWith("Starting November 1")) {
        store.settings.heroMessage = "November is a very special month for all of the people around you. It is a gift from God, you are a Gift from God. Our heaven sent, my heaven sent.";
        changed = true;
      }
      if (!Array.isArray(store.settings.additionalFeatures)) {
        store.settings.additionalFeatures = [
          { id: "bloom_intro", name: "Blooming Chrysanthemum Opening", description: "Plays the blossoming flower greeting when the app opens", enabled: true },
          { id: "ambient_petals", name: "Falling Petal Shower", description: "Serene drifting chrysanthemum petals across the screen", enabled: true },
          { id: "random_song_player", name: "Automatic Random Playlist Player", description: "Plays songs when opening app and reading letters", enabled: true },
          { id: "live_chat", name: "Live Chat with ink & zzy", description: "Real-time chat room with cute stickers & audio", enabled: true },
          { id: "appreciation_wall", name: "Appreciation Wall & Keepsake Letters", description: "Interactive keepsake board where she can add heartfelt letters", enabled: true }
        ];
        changed = true;
      }

      if (!store.letters16 || !Array.isArray(store.letters16) || store.letters16.length < 16) {
        store.letters16 = getDefault16Letters();
        changed = true;
      }
      if (!store.chatMessages || !Array.isArray(store.chatMessages)) {
        store.chatMessages = getDefaultChatMessages();
        changed = true;
      }
      if (!store.appreciationLetters || !Array.isArray(store.appreciationLetters)) {
        store.appreciationLetters = getDefaultAppreciationLetters();
        changed = true;
      }
      if (changed) {
        saveStore(store);
      }
      return store;
    }
  } catch (err) {
    console.error('Error reading store file, creating fresh store', err);
  }
  const initial = getInitialData();
  saveStore(initial);
  return initial;
}

// Connected SSE clients for instant multi-device synchronization
const sseClients = new Set<express.Response>();

function broadcastUpdate(type: string, data: unknown) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

function saveStore(data: unknown) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Broadcast live state immediately to all connected browsers & mobile devices
    broadcastUpdate('update', data);
  } catch (err) {
    console.error('Error saving store:', err);
  }
}

// API Routes
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Push immediate state to client on connection
  const current = loadStore();
  res.write(`event: init\ndata: ${JSON.stringify(current)}\n\n`);

  sseClients.add(res);

  // Keep-alive heartbeat every 15s to keep mobile connections open
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

app.get('/api/data', (_req, res) => {
  const store = loadStore();
  res.json(store);
});

// Direct APK download route for Android devices
app.get('/APK_DOWNLOAD/app-debug.apk', (_req, res) => {
  const p1 = path.resolve(__dirname, 'APK_DOWNLOAD', 'app-debug.apk');
  const p2 = path.resolve(__dirname, 'public', 'APK_DOWNLOAD', 'app-debug.apk');
  const p3 = path.resolve(__dirname, '.build-outputs', 'app-debug.apk');
  const filePath = [p1, p2, p3].find(p => fs.existsSync(p));
  if (filePath) {
    res.download(filePath, 'for-ink.apk');
  } else {
    res.status(404).json({ error: 'APK is being generated, please try again shortly.' });
  }
});

// Update or add a daily countdown letter
app.post('/api/letters', (req, res) => {
  const store = loadStore();
  const letter = req.body;
  if (!letter || !letter.title || !letter.content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const existingIndex = store.letters.findIndex((l: { id: string }) => l.id === letter.id);
  if (existingIndex >= 0) {
    store.letters[existingIndex] = { ...store.letters[existingIndex], ...letter };
  } else {
    const newLetter = {
      id: letter.id || `letter-${Date.now()}`,
      dayNumber: letter.dayNumber || store.letters.length + 1,
      dateString: letter.dateString || new Date().toISOString().split('T')[0],
      title: letter.title,
      content: letter.content,
      quote: letter.quote || '',
      photoUrl: letter.photoUrl || '/assets/aistudio/photo_6127375197347187989_y_dc2e5816.jpg',
      flowerTheme: letter.flowerTheme || 'soft-pink',
      isRead: false,
      createdAt: new Date().toISOString(),
      notifySent: letter.notifySent || false
    };
    store.letters.push(newLetter);

    if (letter.notifySent) {
      store.notifications.unshift({
        id: `notif-${Date.now()}`,
        title: `A new chrysanthemum letter has bloomed for ink! 💌`,
        body: `Day ${newLetter.dayNumber}: "${newLetter.title}" is ready to be opened.`,
        timestamp: new Date().toISOString(),
        letterId: newLetter.id,
        isRead: false
      });
    }
  }

  saveStore(store);
  res.json({ success: true, store });
});

// Update one of the 16 Birthday Letters
app.post('/api/letters16', (req, res) => {
  const store = loadStore();
  const letter = req.body;
  if (!letter || !letter.id) {
    return res.status(400).json({ error: 'Letter ID is required' });
  }

  const idx = store.letters16.findIndex((l: { id: string }) => l.id === letter.id);
  if (idx >= 0) {
    store.letters16[idx] = { ...store.letters16[idx], ...letter };
  } else {
    store.letters16.push(letter);
  }

  saveStore(store);
  res.json({ success: true, letters16: store.letters16 });
});

app.delete('/api/letters/:id', (req, res) => {
  const store = loadStore();
  const { id } = req.params;
  store.letters = store.letters.filter((l: { id: string }) => l.id !== id);
  saveStore(store);
  res.json({ success: true, store });
});

app.post('/api/settings', (req, res) => {
  const store = loadStore();
  const newSettings = req.body;
  store.settings = { ...store.settings, ...newSettings };
  saveStore(store);
  res.json({ success: true, settings: store.settings });
});

app.post('/api/notify', (req, res) => {
  const store = loadStore();
  const { title, body, letterId } = req.body;
  const newNotif = {
    id: `notif-${Date.now()}`,
    title: title || 'A new letter has bloomed for ink! 🌸',
    body: body || 'Check today\'s flower envelope for a sweet surprise.',
    timestamp: new Date().toISOString(),
    letterId,
    isRead: false
  };
  store.notifications.unshift(newNotif);
  if (store.notifications.length > 20) {
    store.notifications = store.notifications.slice(0, 20);
  }
  saveStore(store);
  res.json({ success: true, notification: newNotif, notifications: store.notifications });
});

app.post('/api/notifications/ack', (_req, res) => {
  const store = loadStore();
  store.notifications = store.notifications.map((n: { isRead: boolean }) => ({ ...n, isRead: true }));
  saveStore(store);
  res.json({ success: true, notifications: store.notifications });
});

// Live Chat Endpoints
app.get('/api/chat', (_req, res) => {
  const store = loadStore();
  res.json({ success: true, chatMessages: store.chatMessages || [] });
});

app.post('/api/chat', (req, res) => {
  const store = loadStore();
  const { sender, senderRole, message, flowerEmoji } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const cleanSender = (sender && sender.trim()) || 'ink';
  const role = senderRole || (cleanSender.toLowerCase().includes('zzy') ? 'zzy' : cleanSender.toLowerCase().includes('ink') ? 'ink' : 'guest');

  const newMsg = {
    id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sender: cleanSender,
    senderRole: role,
    message: message.trim(),
    timestamp: new Date().toISOString(),
    flowerEmoji: flowerEmoji || '🌸',
    likes: 0
  };

  if (!Array.isArray(store.chatMessages)) {
    store.chatMessages = [];
  }
  store.chatMessages.push(newMsg);
  if (store.chatMessages.length > 200) {
    store.chatMessages = store.chatMessages.slice(-200);
  }

  saveStore(store);
  res.json({ success: true, message: newMsg, chatMessages: store.chatMessages });
});

app.post('/api/chat/:id/like', (req, res) => {
  const store = loadStore();
  const { id } = req.params;
  const msg = (store.chatMessages || []).find((m: { id: string }) => m.id === id);
  if (msg) {
    msg.likes = (msg.likes || 0) + 1;
    saveStore(store);
    return res.json({ success: true, message: msg });
  }
  res.status(404).json({ error: 'Message not found' });
});

// Appreciation Wall Endpoints
app.get('/api/appreciation', (_req, res) => {
  const store = loadStore();
  res.json({ success: true, appreciationLetters: store.appreciationLetters || [] });
});

app.post('/api/appreciation', (req, res) => {
  const store = loadStore();
  const { author, authorRole, title, content, stampTheme, photoUrl } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Letter content cannot be empty' });
  }

  const cleanAuthor = (author && author.trim()) || 'ink';
  const role = authorRole || (cleanAuthor.toLowerCase().includes('zzy') ? 'zzy' : cleanAuthor.toLowerCase().includes('ink') ? 'ink' : 'friend');

  const newLetter = {
    id: `apprec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    author: cleanAuthor,
    authorRole: role,
    title: title?.trim() || 'A Letter of Love & Appreciation',
    content: content.trim(),
    stampTheme: stampTheme || 'chrysanthemum',
    pinnedDate: new Date().toISOString().split('T')[0],
    likes: 1,
    photoUrl: photoUrl || undefined
  };

  if (!Array.isArray(store.appreciationLetters)) {
    store.appreciationLetters = [];
  }
  store.appreciationLetters.unshift(newLetter);

  // Add in-app notification
  store.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: `💌 New Letter Pinned by ${newLetter.author}!`,
    body: `"${newLetter.title}" has been added to the Appreciation Wall.`,
    timestamp: new Date().toISOString(),
    isRead: false
  });

  saveStore(store);
  res.json({ success: true, letter: newLetter, appreciationLetters: store.appreciationLetters });
});

app.post('/api/appreciation/:id/like', (req, res) => {
  const store = loadStore();
  const { id } = req.params;
  const item = (store.appreciationLetters || []).find((l: { id: string }) => l.id === id);
  if (item) {
    item.likes = (item.likes || 0) + 1;
    saveStore(store);
    return res.json({ success: true, letter: item });
  }
  res.status(404).json({ error: 'Letter not found' });
});

app.delete('/api/appreciation/:id', (req, res) => {
  const store = loadStore();
  const { id } = req.params;
  store.appreciationLetters = (store.appreciationLetters || []).filter((l: { id: string }) => l.id !== id);
  saveStore(store);
  res.json({ success: true, appreciationLetters: store.appreciationLetters });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 for ink · Birthday Applet running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
