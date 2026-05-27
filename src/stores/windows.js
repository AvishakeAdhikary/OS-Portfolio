import { defineStore } from 'pinia';
import { appRegistry } from '@/apps/registry';

let nextZ = 100;
let nextId = 1;

function viewportSize() {
  return {
    w: window.innerWidth || 1280,
    h: window.innerHeight || 720,
  };
}

function defaultBounds(app) {
  const { w, h } = viewportSize();
  const width = Math.min(app.defaultSize?.w ?? 900, Math.max(360, w - 80));
  const height = Math.min(app.defaultSize?.h ?? 600, Math.max(280, h - 120));
  const x = Math.max(20, Math.round((w - width) / 2 + (Math.random() - 0.5) * 80));
  const y = Math.max(20, Math.round((h - height) / 2 + (Math.random() - 0.5) * 60));
  return { x, y, width, height };
}

export const useWindowsStore = defineStore('windows', {
  state: () => ({
    windows: [],
    focusedId: null,
  }),
  getters: {
    openWindows: (s) => s.windows.filter((w) => !w.closed),
    visibleWindows: (s) => s.windows.filter((w) => !w.closed && !w.minimized),
    focusedWindow: (s) => s.windows.find((w) => w.id === s.focusedId) || null,
  },
  actions: {
    open(appId, options = {}) {
      const app = appRegistry[appId];
      if (!app) return null;

      if (app.singleton !== false) {
        const existing = this.windows.find((w) => w.appId === appId && !w.closed);
        if (existing) {
          this.restore(existing.id);
          this.focus(existing.id);
          if (options.props) existing.props = { ...existing.props, ...options.props };
          return existing.id;
        }
      }

      const bounds = options.bounds ?? defaultBounds(app);
      const id = `win-${nextId++}`;
      const win = {
        id,
        appId,
        title: options.title ?? app.name,
        icon: app.icon,
        bounds,
        prevBounds: bounds,
        minimized: false,
        maximized: app.startMaximized ?? false,
        closed: false,
        z: ++nextZ,
        loading: app.bootDelayMs ? true : false,
        bootMessage: app.bootMessage ?? `Starting ${app.name}…`,
        bootProgress: 0,
        props: options.props ?? {},
        createdAt: Date.now(),
        resizable: app.resizable !== false,
      };
      this.windows.push(win);
      this.focusedId = id;

      if (app.bootDelayMs) {
        this._simulateAppBoot(id, app.bootDelayMs);
      }
      return id;
    },
    _simulateAppBoot(id, totalMs) {
      const start = performance.now();
      const tick = () => {
        const win = this.windows.find((w) => w.id === id);
        if (!win || win.closed) return;
        const elapsed = performance.now() - start;
        const p = Math.min(1, elapsed / totalMs);
        win.bootProgress = p;
        if (p >= 1) {
          win.loading = false;
        } else {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    },
    close(id) {
      const win = this.windows.find((w) => w.id === id);
      if (!win) return;
      win.closed = true;
      if (this.focusedId === id) {
        const next = this.openWindows.sort((a, b) => b.z - a.z)[0];
        this.focusedId = next?.id ?? null;
      }
      setTimeout(() => {
        const i = this.windows.findIndex((w) => w.id === id);
        if (i !== -1) this.windows.splice(i, 1);
      }, 250);
    },
    focus(id) {
      const win = this.windows.find((w) => w.id === id);
      if (!win) return;
      win.z = ++nextZ;
      win.minimized = false;
      this.focusedId = id;
    },
    minimize(id) {
      const win = this.windows.find((w) => w.id === id);
      if (!win) return;
      win.minimized = true;
      if (this.focusedId === id) {
        const next = this.openWindows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
        this.focusedId = next?.id ?? null;
      }
    },
    restore(id) {
      const win = this.windows.find((w) => w.id === id);
      if (!win) return;
      win.minimized = false;
      win.z = ++nextZ;
      this.focusedId = id;
    },
    toggleMinimize(id) {
      const win = this.windows.find((w) => w.id === id);
      if (!win) return;
      if (win.minimized) {
        this.restore(id);
      } else if (this.focusedId === id) {
        this.minimize(id);
      } else {
        this.focus(id);
      }
    },
    maximize(id) {
      const win = this.windows.find((w) => w.id === id);
      if (!win) return;
      if (!win.maximized) {
        win.prevBounds = { ...win.bounds };
        win.maximized = true;
      } else {
        win.maximized = false;
        win.bounds = { ...win.prevBounds };
      }
      this.focus(id);
    },
    move(id, dx, dy) {
      const win = this.windows.find((w) => w.id === id);
      if (!win || win.maximized) return;
      const { w, h } = viewportSize();
      win.bounds.x = Math.max(-win.bounds.width + 80, Math.min(w - 40, win.bounds.x + dx));
      win.bounds.y = Math.max(0, Math.min(h - 40, win.bounds.y + dy));
    },
    setBounds(id, bounds) {
      const win = this.windows.find((w) => w.id === id);
      if (!win) return;
      win.bounds = { ...win.bounds, ...bounds };
    },
    closeAll() {
      this.windows.forEach((w) => (w.closed = true));
      setTimeout(() => (this.windows = []), 250);
      this.focusedId = null;
    },
  },
});
