<template>
  <div class="desktop">
    <Wallpaper :key="bgVersion" />
    <div
      class="desktop-area"
      @click="onAreaClick"
      @contextmenu.self.prevent="onAreaContext"
      @contextmenu.prevent="onAreaContext"
    >
      <div class="icon-grid" @click.self="clearSelection" @contextmenu.self.prevent="onAreaContext">
        <DesktopIcon
          v-for="app in desktopApps"
          :key="app.id"
          :icon="app.icon"
          :label="app.name"
          :selected="selectedAppId === app.id"
          @select="selectedAppId = app.id"
          @open="openApp(app.id)"
          @context="onIconContext($event, app)"
        />
      </div>
    </div>

    <WindowManager />

    <StartMenu v-if="osStore.startMenuOpen" />
    <QuickPanel v-if="osStore.quickPanelOpen" />

    <Taskbar />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Wallpaper from './Wallpaper.vue';
import Taskbar from './Taskbar.vue';
import StartMenu from './StartMenu.vue';
import QuickPanel from './QuickPanel.vue';
import WindowManager from './WindowManager.vue';
import DesktopIcon from './DesktopIcon.vue';

import { desktopApps, appRegistry } from '@/apps/registry';
import { useOsStore } from '@/stores/os';
import { useWindowsStore } from '@/stores/windows';

const osStore = useOsStore();
const windowsStore = useWindowsStore();
const route = useRoute();
const router = useRouter();

const selectedAppId = ref(null);
const bgVersion = ref(0);

function applyRoute() {
  if (route.name === 'app' && route.params.appId) {
    const appId = route.params.appId;
    if (appRegistry[appId]) windowsStore.open(appId);
  } else if (route.name === 'computer') {
    const segments = (route.params.path || []).filter(Boolean);
    windowsStore.open('fileExplorer', { props: { initialPath: segments } });
  }
}

function openApp(appId) {
  windowsStore.open(appId);
}

function clearSelection() {
  selectedAppId.value = null;
}

function refreshDesktop() {
  clearSelection();
  bgVersion.value += 1;
  osStore.notify({
    title: 'Desktop refreshed',
    message: 'Wallpaper and icons reloaded.',
    timeout: 1800,
  });
}

function onAreaClick(e) {
  if (e.target.closest('.desktop-icon')) return;
  osStore.toggleStartMenu(false);
  osStore.toggleQuickPanel(false);
  osStore.hideContextMenu();
  clearSelection();
}

function onAreaContext(e) {
  if (e.target.closest('.desktop-icon')) return;
  osStore.showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      {
        label: 'View',
        children: [
          { label: 'Open Spotlight', shortcut: '⌘K', onClick: () => osStore.toggleSpotlight(true) },
          { label: 'Show all open windows', onClick: showAllWindows },
        ],
      },
      { divider: true },
      {
        label: 'Refresh',
        shortcut: 'F5',
        icon: appRegistry.fileExplorer.icon,
        onClick: refreshDesktop,
      },
      { divider: true },
      {
        label: 'Open File Explorer',
        icon: appRegistry.fileExplorer.icon,
        onClick: () => windowsStore.open('fileExplorer'),
      },
      {
        label: 'Open Terminal',
        icon: appRegistry.terminal.icon,
        onClick: () => windowsStore.open('terminal'),
      },
      {
        label: 'Open Spotlight',
        shortcut: '⌘K',
        icon: appRegistry.browser.icon,
        onClick: () => osStore.toggleSpotlight(true),
      },
      { divider: true },
      {
        label: 'Personalize',
        icon: appRegistry.settings.icon,
        onClick: () => windowsStore.open('settings', { props: { initialTab: 'personalization' } }),
      },
      {
        label: 'About this PC',
        icon: appRegistry.about.icon,
        onClick: () => windowsStore.open('about'),
      },
    ],
  });
}

function onIconContext(e, app) {
  selectedAppId.value = app.id;
  osStore.showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      { label: 'Open', icon: app.icon, onClick: () => openApp(app.id) },
      {
        label: 'Open in File Explorer',
        icon: appRegistry.fileExplorer.icon,
        onClick: () =>
          windowsStore.open('fileExplorer', {
            props: { initialPath: ['Local Disk (C:)', 'Program Files'] },
          }),
      },
      { divider: true },
      {
        label: 'Copy app id',
        onClick: () => {
          if (navigator.clipboard) navigator.clipboard.writeText(app.id).catch(() => {});
          osStore.notify({ title: 'Copied', message: app.id, icon: app.icon, timeout: 1600 });
        },
      },
      {
        label: 'Properties',
        icon: app.icon,
        onClick: () =>
          osStore.notify({
            title: `${app.name}`,
            message: `Default size ${app.defaultSize?.w ?? 800}×${app.defaultSize?.h ?? 600}`,
            icon: app.icon,
          }),
      },
    ],
  });
}

function showAllWindows() {
  const list = windowsStore.openWindows;
  if (!list.length) {
    osStore.notify({ title: 'No open windows', message: 'Open something from the Start menu.' });
    return;
  }
  list.forEach((w, i) => {
    windowsStore.restore(w.id);
    if (!w.maximized) {
      windowsStore.setBounds(w.id, { x: 40 + i * 24, y: 40 + i * 18 });
    }
  });
}

watch(
  () => route.fullPath,
  () => applyRoute(),
);

onMounted(() => {
  applyRoute();
});

defineExpose({ router });
</script>

<style scoped>
.desktop {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.desktop-area {
  position: absolute;
  inset: 0 0 var(--taskbar-height) 0;
  padding: 18px;
  overflow: hidden;
}
.icon-grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(auto-fill, 96px);
  grid-auto-columns: 96px;
  gap: 4px;
  align-content: start;
  height: 100%;
}
@media (max-width: 720px) {
  .icon-grid {
    grid-auto-flow: row;
    grid-template-rows: none;
    grid-template-columns: repeat(auto-fill, 88px);
    grid-auto-rows: 96px;
  }
}
</style>
