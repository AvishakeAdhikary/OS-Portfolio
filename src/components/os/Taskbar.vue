<template>
  <div
    class="taskbar glass"
    @click.stop
    @mousedown.stop
    @contextmenu.self.stop.prevent="onBgContext"
  >
    <div class="left">
      <button
        type="button"
        class="tb-btn start"
        :class="{ active: osStore.startMenuOpen }"
        @click="onStartClick"
        aria-label="Start"
      >
        <OsLogo class="start-logo" />
      </button>
      <button
        type="button"
        class="tb-btn search"
        @click="onSearchClick"
        aria-label="Search (Ctrl+K)"
        title="Search (Ctrl+K)"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15 15l5 5" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div class="center">
      <button
        v-for="item in taskbarItems"
        :key="item.appId + (item.windowId || '')"
        type="button"
        class="tb-app"
        :class="{
          active: item.windowId === windowsStore.focusedId,
          running: !!item.windowId,
        }"
        @click="onTaskbarClick(item)"
        @contextmenu.stop.prevent="onAppContext($event, item)"
      >
        <img :src="item.icon" :alt="item.name" />
        <span class="indicator" v-if="item.windowId"></span>
      </button>
    </div>

    <div class="right">
      <button
        type="button"
        class="tray"
        @click="osStore.toggleQuickPanel()"
        @contextmenu.stop.prevent="onTrayContext"
        :aria-pressed="osStore.quickPanelOpen"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path :d="wifiPath" /></svg>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path :d="volumePath" /></svg>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M21 18H3v-2h18v2zM21 13H3v-2h18v2zM21 8H3V6h18v2z" />
        </svg>
      </button>
      <button
        type="button"
        class="clock"
        @click="onClockClick"
        @contextmenu.stop.prevent="onClockContext"
      >
        <div class="time">{{ time }}</div>
        <div class="date">{{ date }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useOsStore } from '@/stores/os';
import { useWindowsStore } from '@/stores/windows';
import { taskbarPinned, appRegistry } from '@/apps/registry';
import OsLogo from './OsLogo.vue';

const osStore = useOsStore();
const windowsStore = useWindowsStore();

const taskbarItems = computed(() => {
  const pinnedMap = new Map(
    taskbarPinned.map((a) => [a.id, { appId: a.id, name: a.name, icon: a.icon, windowId: null }]),
  );
  for (const w of windowsStore.openWindows) {
    const app = appRegistry[w.appId];
    pinnedMap.set(w.appId, {
      appId: w.appId,
      name: app?.name ?? w.title,
      icon: app?.icon ?? w.icon,
      windowId: w.id,
    });
  }
  return Array.from(pinnedMap.values());
});

function onStartClick() {
  osStore.toggleStartMenu();
}

function onSearchClick() {
  osStore.toggleSpotlight(true);
}

function onTaskbarClick(item) {
  if (item.windowId) {
    windowsStore.toggleMinimize(item.windowId);
  } else {
    windowsStore.open(item.appId);
  }
}

function onAppContext(e, item) {
  const app = appRegistry[item.appId];
  const items = [
    { label: item.windowId ? 'Bring to front' : 'Open', icon: app?.icon, onClick: () => onTaskbarClick(item) },
    item.windowId && {
      label: 'Minimize',
      onClick: () => windowsStore.minimize(item.windowId),
    },
    item.windowId && {
      label: 'Maximize / Restore',
      onClick: () => windowsStore.maximize(item.windowId),
    },
    { divider: true },
    item.windowId && {
      label: 'Close window',
      icon: appRegistry.fileExplorer.icon,
      onClick: () => windowsStore.close(item.windowId),
    },
    !item.windowId && {
      label: 'Open new window',
      onClick: () => windowsStore.open(item.appId),
    },
  ].filter(Boolean);
  osStore.showContextMenu({ x: e.clientX, y: e.clientY - 8, items });
}

function onBgContext(e) {
  osStore.showContextMenu({
    x: e.clientX,
    y: e.clientY - 8,
    items: [
      {
        label: 'Search…',
        shortcut: 'Ctrl+K',
        icon: appRegistry.browser.icon,
        onClick: () => osStore.toggleSpotlight(true),
      },
      {
        label: 'Show desktop',
        onClick: minimizeAll,
      },
      { divider: true },
      {
        label: 'Task Manager',
        onClick: () => {
          const list = windowsStore.openWindows
            .map((w) => `${appRegistry[w.appId]?.name ?? w.title} · z=${w.z}`)
            .join('\n');
          osStore.notify({
            title: `Open windows · ${windowsStore.openWindows.length}`,
            message: list || 'No windows open.',
            timeout: 5000,
          });
        },
      },
      {
        label: 'Taskbar settings',
        icon: appRegistry.settings.icon,
        onClick: () => windowsStore.open('settings', { props: { initialTab: 'personalization' } }),
      },
    ],
  });
}

function onClockClick() {
  osStore.toggleQuickPanel();
}

function onClockContext(e) {
  osStore.showContextMenu({
    x: e.clientX,
    y: e.clientY - 8,
    items: [
      {
        label: 'Show calendar',
        onClick: () =>
          osStore.notify({
            title: osStore.now.toLocaleDateString([], {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            message: osStore.now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          }),
      },
      {
        label: 'Adjust date & time',
        icon: appRegistry.settings.icon,
        onClick: () => windowsStore.open('settings', { props: { initialTab: 'system' } }),
      },
      { divider: true },
      {
        label: 'Notifications',
        onClick: () => osStore.toggleQuickPanel(true),
      },
    ],
  });
}

function onTrayContext(e) {
  osStore.showContextMenu({
    x: e.clientX,
    y: e.clientY - 8,
    items: [
      {
        label: osStore.muted ? 'Unmute' : 'Mute',
        onClick: () => osStore.setMuted(!osStore.muted),
      },
      {
        label: 'Sound settings',
        icon: appRegistry.settings.icon,
        onClick: () => windowsStore.open('settings', { props: { initialTab: 'sound' } }),
      },
      { divider: true },
      {
        label: 'Open quick panel',
        onClick: () => osStore.toggleQuickPanel(true),
      },
    ],
  });
}

function minimizeAll() {
  windowsStore.openWindows.forEach((w) => windowsStore.minimize(w.id));
}

const time = computed(() => osStore.now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
const date = computed(() => osStore.now.toLocaleDateString([], { month: 'short', day: 'numeric' }));

const volumePath = computed(() => {
  if (osStore.muted || osStore.volume === 0) return 'M3 9h4l5-5v16l-5-5H3V9zm14 8.5l-3-3V9.5l3-3v11z';
  if (osStore.volume < 0.33) return 'M3 9h4l5-5v16l-5-5H3V9z';
  if (osStore.volume < 0.66) return 'M3 9h4l5-5v16l-5-5H3V9zm12 3a4 4 0 0 0-2-3.5v7A4 4 0 0 0 15 12z';
  return 'M3 9h4l5-5v16l-5-5H3V9zm12 3a4 4 0 0 0-2-3.5v7A4 4 0 0 0 15 12zm3.5 0a7.5 7.5 0 0 0-3-6v12a7.5 7.5 0 0 0 3-6z';
});

const wifiPath = 'M12 18a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0-4a4 4 0 0 1 3.6 2.3l-1.7 1A2 2 0 0 0 12 16a2 2 0 0 0-1.9 1.3l-1.7-1A4 4 0 0 1 12 14zm0-4a8 8 0 0 1 7 4l-1.7 1A6 6 0 0 0 12 12a6 6 0 0 0-5.3 3l-1.7-1A8 8 0 0 1 12 10zm0-4a12 12 0 0 1 10.4 6l-1.7 1A10 10 0 0 0 12 8a10 10 0 0 0-8.7 5l-1.7-1A12 12 0 0 1 12 6z';
</script>

<style scoped>
.taskbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--taskbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: var(--surface);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border-top: 1px solid var(--glass-border);
  z-index: 20000;
}
.left, .center, .right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
}
.tb-btn {
  width: 40px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  color: var(--text);
  transition: background 0.15s ease;
}
.tb-btn:hover, .tb-btn.active { background: var(--accent-soft); }
.start-logo { width: 22px; height: 22px; pointer-events: none; }

.tb-app {
  position: relative;
  width: 44px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  margin: 0 2px;
  transition: background 0.15s ease;
}
.tb-app img {
  width: 22px;
  height: 22px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  transition: transform 0.15s ease;
  pointer-events: none;
}
.tb-app:hover img { transform: translateY(-1px) scale(1.05); }
.tb-app:hover { background: rgba(255, 255, 255, 0.08); }
.tb-app.active { background: var(--accent-soft); }
.tb-app .indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 3px;
  border-radius: 100px;
  background: var(--accent);
}
.tb-app.active .indicator { width: 18px; }

.right { gap: 6px; }
.tray {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 6px 10px;
  border-radius: 6px;
  color: var(--text-dim);
  transition: background 0.15s ease, color 0.15s ease;
}
.tray:hover { background: rgba(255, 255, 255, 0.08); color: var(--text); }

.clock {
  text-align: right;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}
.clock:hover { background: rgba(255, 255, 255, 0.08); }
.clock .time { font-size: 12px; font-weight: 600; line-height: 1.15; }
.clock .date { font-size: 11px; color: var(--text-dim); line-height: 1.15; }

@media (max-width: 720px) {
  .center {
    position: static;
    transform: none;
    overflow-x: auto;
    max-width: 50vw;
  }
  .clock .date { display: none; }
}
</style>
