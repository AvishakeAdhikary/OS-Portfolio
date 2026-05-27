<template>
  <div class="boot">
    <div class="boot-stage">
      <OsLogo class="logo" />
      <div class="brand">Avishake&nbsp;OS</div>
      <div class="tagline">Portfolio Edition</div>

      <div class="progress-wrap" :aria-valuenow="Math.round(osStore.bootProgress * 100)" role="progressbar">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPct }"></div>
        </div>
        <div class="progress-meta">
          <span class="msg">{{ osStore.bootMessage }}</span>
          <span class="pct">{{ Math.round(osStore.bootProgress * 100) }}%</span>
        </div>
      </div>
    </div>

    <div class="boot-footer">{{ skipHint }}</div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useOsStore } from '@/stores/os';
import OsLogo from './OsLogo.vue';

const osStore = useOsStore();

const progressPct = computed(() => `${Math.round(osStore.bootProgress * 100)}%`);
const skipHint = computed(() => (osStore.bootedOnce ? 'Resuming session…' : 'Press any key to continue once ready'));

async function preload(url) {
  return new Promise((resolve) => {
    const ext = url.split('.').pop().toLowerCase();
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) {
      const a = new Audio();
      a.preload = 'auto';
      a.oncanplaythrough = () => resolve();
      a.onerror = () => resolve();
      a.src = url;
      setTimeout(resolve, 2500);
    } else if (['mp4', 'webm'].includes(ext)) {
      const v = document.createElement('video');
      v.preload = 'auto';
      v.muted = true;
      v.oncanplay = () => resolve();
      v.onerror = () => resolve();
      v.src = url;
      setTimeout(resolve, 2500);
    } else if (['pdf'].includes(ext)) {
      fetch(url, { method: 'HEAD' }).catch(() => {}).finally(resolve);
    } else {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = url;
      setTimeout(resolve, 2000);
    }
  });
}

async function gatherAssets() {
  const modules = import.meta.glob([
    '/src/assets/icons/*.ico',
    '/src/assets/photos/*.{jpg,jpeg,png}',
    '/src/assets/cetificates/*.{jpg,jpeg,png}',
    '/src/assets/timelinephotos/*.{jpg,jpeg,png}',
    '/src/assets/svg_icons/*.svg',
    '/src/assets/AvishakeAdhikaryDP.png',
    '/src/assets/lockscreen.jpg',
    '/src/assets/banner.gif',
    '/src/assets/wallpaper.mp4',
  ], { eager: true, query: '?url', import: 'default' });
  return Object.values(modules);
}

async function boot() {
  const stages = [
    { p: 0.05, msg: 'Powering on…', delay: 350 },
    { p: 0.15, msg: 'Initializing kernel…', delay: 300 },
    { p: 0.25, msg: 'Mounting virtual file system…', delay: 250 },
  ];
  for (const stage of stages) {
    osStore.setBoot(stage.p, stage.msg);
    await wait(stage.delay);
  }

  osStore.setBoot(0.3, 'Loading system assets…');
  const assets = await gatherAssets();
  const total = assets.length || 1;
  let loaded = 0;
  await Promise.all(
    assets.map((url) =>
      preload(url).then(() => {
        loaded += 1;
        const ratio = loaded / total;
        osStore.setBoot(0.3 + ratio * 0.55, `Loading assets (${loaded}/${total})…`);
      }),
    ),
  );

  osStore.setBoot(0.9, 'Starting window manager…');
  await wait(350);
  osStore.setBoot(0.97, 'Almost ready…');
  await wait(250);
  osStore.setBoot(1, 'Welcome');
  await wait(450);
  osStore.setPhase('lock');
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

onMounted(boot);
</script>

<style scoped>
.boot {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at 50% 30%, #0c1130 0%, #02030a 75%);
  color: #e6e8ff;
  overflow: hidden;
  animation: os-fade-in 600ms ease;
}
.boot::before,
.boot::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  pointer-events: none;
}
.boot::before {
  top: -20%;
  left: -20%;
  width: 60vmin;
  height: 60vmin;
  background: #4d6cff;
  animation: bootPulse 7s ease-in-out infinite alternate;
}
.boot::after {
  bottom: -20%;
  right: -20%;
  width: 70vmin;
  height: 70vmin;
  background: #9d5dff;
  animation: bootPulse 9s ease-in-out infinite alternate-reverse;
}
@keyframes bootPulse {
  to { transform: scale(1.15); opacity: 0.7; }
}

.boot-stage {
  position: relative;
  text-align: center;
  z-index: 1;
}

.logo {
  width: 92px;
  height: 92px;
  margin: 0 auto 22px;
  filter: drop-shadow(0 4px 22px rgba(108, 140, 255, 0.55));
  animation: floaty 4s ease-in-out infinite alternate;
}
@keyframes floaty {
  to { transform: translateY(-4px) rotate(2deg); }
}

.brand {
  font-size: 28px;
  letter-spacing: 0.22em;
  font-weight: 300;
  text-transform: uppercase;
}
.tagline {
  font-size: 12px;
  letter-spacing: 0.4em;
  color: rgba(230, 232, 255, 0.55);
  margin-top: 6px;
  text-transform: uppercase;
}

.progress-wrap {
  width: min(360px, 70vw);
  margin: 40px auto 0;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6c8cff, #9d5dff);
  transition: width 200ms ease;
  box-shadow: 0 0 12px rgba(108, 140, 255, 0.6);
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(230, 232, 255, 0.6);
}
.pct {
  font-variant-numeric: tabular-nums;
}

.boot-footer {
  position: absolute;
  bottom: 28px;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: rgba(230, 232, 255, 0.35);
  text-transform: uppercase;
}
</style>
