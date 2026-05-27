<template>
  <div class="qp glass" @click.stop>
    <div class="row tiles">
      <button
        class="tile"
        :class="{ on: osStore.theme === 'dark' }"
        @click="toggleTheme"
      >
        <svg v-if="osStore.theme === 'dark'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
        </svg>
        <span>{{ osStore.theme === 'dark' ? 'Dark' : 'Light' }}</span>
      </button>
      <button class="tile on">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path :d="wifiPath" /></svg>
        <span>Wi‑Fi</span>
      </button>
      <button class="tile" :class="{ on: !osStore.muted }" @click="osStore.setMuted(!osStore.muted)">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path :d="osStore.muted ? mutePath : volumePath" />
        </svg>
        <span>{{ osStore.muted ? 'Muted' : 'Sound' }}</span>
      </button>
      <button class="tile" @click="openSettings">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="12" cy="12" r="3" />
          <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.5-2.4.9a7 7 0 0 0-2-1.2l-.5-2.5h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.4-.9-2 3.5 2 1.6A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.6 2 3.5 2.4-.9a7 7 0 0 0 2 1.2l.5 2.5h4l.5-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.5-2-1.6A7 7 0 0 0 19 12z" />
        </svg>
        <span>Settings</span>
      </button>
    </div>

    <div class="row sliders">
      <label class="slider">
        <span>Volume</span>
        <input type="range" min="0" max="1" step="0.01" :value="osStore.volume" @input="(e) => osStore.setVolume(+e.target.value)" />
        <span class="val">{{ Math.round(osStore.volume * 100) }}</span>
      </label>
      <label class="slider">
        <span>Brightness</span>
        <input type="range" min="0.3" max="1" step="0.01" :value="osStore.brightness" @input="(e) => osStore.setBrightness(+e.target.value)" />
        <span class="val">{{ Math.round(osStore.brightness * 100) }}</span>
      </label>
    </div>

    <div class="row footer">
      <div class="battery">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <rect x="2" y="7" width="18" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.4" />
          <rect x="3.5" y="8.5" width="13" height="7" />
          <rect x="20" y="10" width="2" height="4" />
        </svg>
        <span>92%</span>
      </div>
      <div class="time">{{ time }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useOsStore } from '@/stores/os';
import { useWindowsStore } from '@/stores/windows';

const osStore = useOsStore();
const windowsStore = useWindowsStore();

const volumePath = 'M3 9h4l5-5v16l-5-5H3V9zm12 3a4 4 0 0 0-2-3.5v7A4 4 0 0 0 15 12z';
const mutePath = 'M3 9h4l5-5v16l-5-5H3V9zm17 1.4L18.6 9 17 10.6 15.4 9 14 10.4l1.6 1.6L14 13.6 15.4 15l1.6-1.6L18.6 15l1.4-1.4-1.6-1.6z';
const wifiPath = 'M12 18a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0-4a4 4 0 0 1 3.6 2.3l-1.7 1A2 2 0 0 0 12 16a2 2 0 0 0-1.9 1.3l-1.7-1A4 4 0 0 1 12 14zm0-4a8 8 0 0 1 7 4l-1.7 1A6 6 0 0 0 12 12a6 6 0 0 0-5.3 3l-1.7-1A8 8 0 0 1 12 10zm0-4a12 12 0 0 1 10.4 6l-1.7 1A10 10 0 0 0 12 8a10 10 0 0 0-8.7 5l-1.7-1A12 12 0 0 1 12 6z';

function toggleTheme() {
  osStore.setTheme(osStore.theme === 'dark' ? 'light' : 'dark');
}
function openSettings() {
  windowsStore.open('settings');
  osStore.toggleQuickPanel(false);
}

const time = computed(() =>
  osStore.now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
);
</script>

<style scoped>
.qp {
  position: absolute;
  right: 10px;
  bottom: calc(var(--taskbar-height) + 8px);
  width: 320px;
  border-radius: 14px;
  padding: 16px;
  z-index: 30000;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: os-scale-in 160ms ease;
  transform-origin: bottom right;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
}
.row {
  display: flex;
}
.tiles {
  flex-wrap: wrap;
  gap: 8px;
}
.tile {
  flex: 1 1 calc(50% - 4px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  color: var(--text);
  transition: background 0.15s ease;
}
.tile:hover {
  background: rgba(255, 255, 255, 0.1);
}
.tile.on {
  background: var(--accent);
  border-color: transparent;
  color: white;
}
.tile span {
  font-size: 11px;
  letter-spacing: 0.05em;
}

.sliders {
  flex-direction: column;
  gap: 12px;
}
.slider {
  display: grid;
  grid-template-columns: 80px 1fr 36px;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.slider input[type='range'] {
  width: 100%;
  accent-color: var(--accent);
}
.val {
  font-size: 11px;
  color: var(--text-dim);
  text-align: right;
}

.footer {
  justify-content: space-between;
  align-items: center;
  color: var(--text-dim);
  font-size: 12px;
}
.battery {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
