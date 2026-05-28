import { defineStore } from 'pinia';

const STORAGE_KEY = 'avishake-os::settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export const useOsStore = defineStore('os', {
  state: () => {
    const saved = loadSettings();
    return {
      phase: 'boot',
      bootProgress: 0,
      bootMessage: 'Preparing kernel…',
      bootedOnce: false,
      now: new Date(),
      isGuest: false,
      _shutdownRedirect: null,
      username: 'Avishake Adhikary',
      wallpaperIndex: saved.wallpaperIndex ?? 0,
      theme: saved.theme ?? 'dark',
      accent: saved.accent ?? '#6c8cff',
      volume: saved.volume ?? 0.7,
      muted: saved.muted ?? false,
      brightness: saved.brightness ?? 1,
      reduceMotion: saved.reduceMotion ?? false,
      notifications: [],
      contextMenu: null,
      startMenuOpen: false,
      quickPanelOpen: false,
      spotlightOpen: false,
    };
  },
  getters: {
    isDesktopReady: (s) => s.phase === 'desktop',
    accentSoft: (s) => s.accent + '2e',
  },
  actions: {
    setPhase(phase) {
      this.phase = phase;
      if (phase === 'desktop') this.bootedOnce = true;
      if (phase !== 'desktop') {
        this.startMenuOpen = false;
        this.quickPanelOpen = false;
        this.spotlightOpen = false;
        this.contextMenu = null;
      }
    },
    setBoot(progress, message) {
      this.bootProgress = progress;
      if (message) this.bootMessage = message;
    },
    tickClock() {
      this.now = new Date();
    },
    signIn({ guest = false } = {}) {
      this.isGuest = guest;
      this.username = guest ? 'Guest' : 'Avishake Adhikary';
      this.setPhase('desktop');
    },
    signOut() {
      this.startMenuOpen = false;
      this.quickPanelOpen = false;
      this.spotlightOpen = false;
      this.contextMenu = null;
      this.setPhase('lock');
    },
    shutdown(redirectUrl) {
      this.startMenuOpen = false;
      this.quickPanelOpen = false;
      this.spotlightOpen = false;
      this.contextMenu = null;
      this._shutdownRedirect = redirectUrl || null;
      this.setPhase('shutdown');
    },
    setWallpaper(index) {
      this.wallpaperIndex = index;
      this.persist();
    },
    setTheme(theme) {
      this.theme = theme;
      this.applyTheme();
      this.persist();
    },
    setAccent(color) {
      this.accent = color;
      this.applyTheme();
      this.persist();
    },
    setVolume(v) {
      this.volume = Math.max(0, Math.min(1, v));
      this.persist();
    },
    setMuted(m) {
      this.muted = m;
      this.persist();
    },
    setBrightness(b) {
      this.brightness = Math.max(0.3, Math.min(1, b));
      this.persist();
    },
    setReduceMotion(v) {
      this.reduceMotion = v;
      this.persist();
    },
    applyTheme() {
      document.documentElement.dataset.theme = this.theme;
      document.documentElement.style.setProperty('--accent', this.accent);
      document.documentElement.style.setProperty('--accent-strong', this.accent);
    },
    persist() {
      try {
        const data = {
          wallpaperIndex: this.wallpaperIndex,
          theme: this.theme,
          accent: this.accent,
          volume: this.volume,
          muted: this.muted,
          brightness: this.brightness,
          reduceMotion: this.reduceMotion,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        /* ignore */
      }
    },
    notify(notification) {
      const id = Math.random().toString(36).slice(2);
      const payload = { id, ts: Date.now(), ...notification };
      this.notifications.unshift(payload);
      if (this.notifications.length > 50) this.notifications.length = 50;
      if (notification.timeout !== 0) {
        setTimeout(() => this.dismiss(id), notification.timeout ?? 4500);
      }
      return id;
    },
    dismiss(id) {
      const i = this.notifications.findIndex((n) => n.id === id);
      if (i !== -1) this.notifications.splice(i, 1);
    },
    clearNotifications() {
      this.notifications = [];
    },
    showContextMenu(payload) {
      this.contextMenu = payload;
      this.startMenuOpen = false;
      this.quickPanelOpen = false;
    },
    hideContextMenu() {
      this.contextMenu = null;
    },
    toggleStartMenu(force) {
      this.startMenuOpen = force ?? !this.startMenuOpen;
      if (this.startMenuOpen) {
        this.quickPanelOpen = false;
        this.spotlightOpen = false;
        this.contextMenu = null;
      }
    },
    toggleQuickPanel(force) {
      this.quickPanelOpen = force ?? !this.quickPanelOpen;
      if (this.quickPanelOpen) {
        this.startMenuOpen = false;
        this.spotlightOpen = false;
        this.contextMenu = null;
      }
    },
    toggleSpotlight(force) {
      this.spotlightOpen = force ?? !this.spotlightOpen;
      if (this.spotlightOpen) {
        this.startMenuOpen = false;
        this.quickPanelOpen = false;
        this.contextMenu = null;
      }
    },
  },
});
