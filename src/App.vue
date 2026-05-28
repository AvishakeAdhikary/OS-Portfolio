<template>
  <div class="os-root" :style="osStyle" :data-phase="osStore.phase">
    <ShutdownScreen v-if="osStore.phase === 'shutdown'" />
    <template v-else>
      <BootScreen v-if="osStore.phase === 'boot'" />
      <LockScreen v-else-if="osStore.phase === 'lock'" @unlock="goToLogin" />
      <LoginScreen v-else-if="osStore.phase === 'login'" />
      <Desktop v-else />
      <Spotlight v-if="osStore.spotlightOpen && osStore.phase === 'desktop'" />
      <ContextMenu v-if="osStore.contextMenu" />
      <NotificationCenter />
    </template>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { useOsStore } from '@/stores/os';
import { useWindowsStore } from '@/stores/windows';

import BootScreen from '@/components/os/BootScreen.vue';
import LockScreen from '@/components/os/LockScreen.vue';
import LoginScreen from '@/components/os/LoginScreen.vue';
import Desktop from '@/components/os/Desktop.vue';
import Spotlight from '@/components/os/Spotlight.vue';
import ContextMenu from '@/components/os/ContextMenu.vue';
import NotificationCenter from '@/components/os/NotificationCenter.vue';
import ShutdownScreen from '@/components/os/ShutdownScreen.vue';

const osStore = useOsStore();
const windowsStore = useWindowsStore();

const osStyle = computed(() => ({
  filter: osStore.brightness < 1 ? `brightness(${osStore.brightness})` : undefined,
}));

let clockTimer = null;

function goToLogin() {
  osStore.setPhase('login');
}

function onContextMenu(e) {
  if (e.target.closest('[data-allow-context]')) return;
  e.preventDefault();
}

function onKey(e) {
  if (e.key === 'Escape') {
    osStore.hideContextMenu();
    osStore.toggleStartMenu(false);
    osStore.toggleQuickPanel(false);
    osStore.toggleSpotlight(false);
  }
  if (osStore.phase === 'desktop' && (e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    osStore.toggleSpotlight(true);
  }
  if (osStore.phase === 'desktop' && e.key === ' ' && (e.metaKey || e.altKey)) {
    e.preventDefault();
    osStore.toggleSpotlight(true);
  }
}

watch(
  () => osStore.phase,
  (p, prev) => {
    if (prev === 'desktop' && p !== 'desktop') {
      windowsStore.closeAll();
    }
  },
);

onMounted(() => {
  osStore.applyTheme();
  clockTimer = setInterval(() => osStore.tickClock(), 1000);
  document.addEventListener('contextmenu', onContextMenu);
  window.addEventListener('keydown', onKey);
});

onBeforeUnmount(() => {
  if (clockTimer) clearInterval(clockTimer);
  document.removeEventListener('contextmenu', onContextMenu);
  window.removeEventListener('keydown', onKey);
});
</script>

<style>
.os-root {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg-0);
  transition: filter 0.4s ease;
  isolation: isolate;
}
</style>
