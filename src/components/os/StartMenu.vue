<template>
  <div
    class="start-menu glass"
    @click.stop
    @mousedown.stop
    @contextmenu.stop.prevent="onBgContext"
  >
    <div class="search-box" @contextmenu.stop>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6">
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="M15 15l5 5" stroke-linecap="round" />
      </svg>
      <input
        ref="searchEl"
        v-model="q"
        type="text"
        placeholder="Search apps and shortcuts…"
        @keydown.enter="openTop"
      />
    </div>

    <div class="section-label">Pinned</div>
    <div class="grid">
      <button
        v-for="app in filteredApps"
        :key="app.id"
        type="button"
        class="tile"
        @click="open(app.id)"
        @contextmenu.stop.prevent="onTileContext($event, app)"
      >
        <img :src="app.icon" :alt="app.name" />
        <span>{{ app.name }}</span>
      </button>
    </div>

    <div class="section-label">Recommended</div>
    <div class="list">
      <button
        v-for="item in recommended"
        :key="item.title"
        type="button"
        class="list-item"
        @click="item.onClick"
      >
        <img :src="item.icon" :alt="item.title" />
        <div class="info">
          <div class="t">{{ item.title }}</div>
          <div class="d">{{ item.detail }}</div>
        </div>
      </button>
    </div>

    <div class="user-row">
      <button class="user" type="button" @click="openAbout" :title="osStore.isGuest ? 'Signed in as Guest' : 'Account'">
        <img :src="avatar" alt="" />
        <span>{{ osStore.username }}<small v-if="osStore.isGuest"> · Guest</small></span>
      </button>
      <div class="user-actions">
        <button class="action" type="button" @click="signOut" title="Sign out of session">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
        <button class="action danger" type="button" @click="powerOff" title="Open LinkedIn">
          <img :src="powerIcon" alt="LinkedIn" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useOsStore } from '@/stores/os';
import { useWindowsStore } from '@/stores/windows';
import { appRegistry } from '@/apps/registry';
import avatar from '@/assets/AvishakeAdhikaryDP.png';
import powerIcon from '@/assets/icons/power.ico';

const osStore = useOsStore();
const windowsStore = useWindowsStore();
const q = ref('');
const searchEl = ref(null);

const apps = computed(() => Object.values(appRegistry));
const filteredApps = computed(() => {
  const needle = q.value.trim().toLowerCase();
  if (!needle) return apps.value.filter((a) => a.pinToDesktop || a.pinToTaskbar);
  return apps.value.filter((a) => a.name.toLowerCase().includes(needle));
});

const recommended = computed(() => [
  {
    title: 'Resume.pdf',
    detail: 'View my resume',
    icon: appRegistry.resume.icon,
    onClick: () => open('resume'),
  },
  {
    title: 'Terminal',
    detail: 'Try “help” or “neofetch”',
    icon: appRegistry.terminal.icon,
    onClick: () => open('terminal'),
  },
  {
    title: 'Timeline',
    detail: 'Browse my journey',
    icon: appRegistry.timeline.icon,
    onClick: () => open('timeline'),
  },
  {
    title: 'Settings — Personalization',
    detail: 'Theme, accent, wallpaper',
    icon: appRegistry.settings.icon,
    onClick: () => {
      windowsStore.open('settings', { props: { initialTab: 'personalization' } });
      osStore.toggleStartMenu(false);
    },
  },
]);

function open(appId) {
  windowsStore.open(appId);
  osStore.toggleStartMenu(false);
}

function openTop() {
  const top = filteredApps.value[0];
  if (top) open(top.id);
}

function openAbout() {
  windowsStore.open('about');
  osStore.toggleStartMenu(false);
}

function signOut() {
  osStore.signOut();
}

function powerOff() {
  osStore.toggleStartMenu(false);
  osStore.shutdown('https://www.linkedin.com/in/avishakeadhikary/');
}

function onTileContext(e, app) {
  osStore.showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      { label: 'Open', icon: app.icon, onClick: () => open(app.id) },
      { label: 'Open file location', icon: appRegistry.fileExplorer.icon, onClick: () => {
          windowsStore.open('fileExplorer', { props: { initialPath: ['Local Disk (C:)', 'Program Files'] } });
          osStore.toggleStartMenu(false);
        } },
      { divider: true },
      { label: 'Properties', icon: app.icon, onClick: () => {
          osStore.notify({ title: app.name, message: `App ID: ${app.id}`, icon: app.icon });
        } },
    ],
  });
}

function onBgContext(e) {
  osStore.showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      { label: 'Refresh start menu', icon: appRegistry.settings.icon, onClick: () => {
          q.value = '';
          nextTick(() => searchEl.value?.focus());
        } },
      { label: 'Customize…', icon: appRegistry.settings.icon, onClick: () => {
          windowsStore.open('settings');
          osStore.toggleStartMenu(false);
        } },
    ],
  });
}

onMounted(() => {
  nextTick(() => searchEl.value?.focus());
});
</script>

<style scoped>
.start-menu {
  position: absolute;
  bottom: calc(var(--taskbar-height) + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: min(640px, 92vw);
  max-height: calc(100vh - var(--taskbar-height) - 24px);
  border-radius: 14px;
  padding: 22px 22px 0;
  display: flex;
  flex-direction: column;
  z-index: 30000;
  animation: os-scale-in 180ms ease;
  transform-origin: bottom center;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 8px 14px;
  color: var(--text-dim);
  border: 1px solid var(--glass-border);
}
.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
}

.section-label {
  margin: 18px 4px 8px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--text-faint);
}

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 6px;
  border-radius: 10px;
  transition: background 0.15s ease, transform 0.1s ease;
  color: var(--text);
  cursor: pointer;
  position: relative;
  z-index: 1;
}
.tile img {
  width: 34px;
  height: 34px;
  pointer-events: none;
}
.tile span {
  font-size: 11px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  pointer-events: none;
}
.tile:hover { background: var(--accent-soft); }
.tile:active { transform: scale(0.96); }

.list {
  display: flex;
  flex-direction: column;
  margin: 4px 0;
  max-height: 200px;
  overflow: auto;
}
.list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background 0.15s ease;
  text-align: left;
  color: var(--text);
  cursor: pointer;
}
.list-item img { width: 28px; height: 28px; pointer-events: none; }
.list-item .info { flex: 1; pointer-events: none; }
.list-item .t { font-size: 13px; }
.list-item .d { font-size: 11px; color: var(--text-dim); }
.list-item:hover { background: var(--accent-soft); }

.user-row {
  margin-top: 14px;
  border-top: 1px solid var(--glass-border);
  padding: 12px 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.user {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  padding: 6px 8px;
  border-radius: 6px;
  color: var(--text);
}
.user:hover { background: rgba(255,255,255,0.05); }
.user img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}
.user small {
  color: var(--text-dim);
  margin-left: 4px;
}
.user-actions { display: flex; gap: 6px; }
.action {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  transition: background 0.15s ease;
  color: var(--text);
}
.action:hover { background: rgba(255,255,255,0.08); }
.action.danger:hover { background: rgba(255, 90, 100, 0.18); }
.action img { width: 18px; height: 18px; }

@media (max-width: 720px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}
</style>
