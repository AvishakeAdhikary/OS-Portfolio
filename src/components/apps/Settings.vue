<template>
  <div class="settings">
    <aside class="side">
      <button
        v-for="t in tabs"
        :key="t.id"
        class="tab"
        :class="{ on: active === t.id }"
        @click="active = t.id"
      >
        <span class="ico">{{ t.icon }}</span>
        <span>{{ t.label }}</span>
      </button>
    </aside>

    <div class="content">
      <section v-if="active === 'system'">
        <h2>System</h2>
        <div class="card-row">
          <div class="stat">
            <div class="stat-label">Device</div>
            <div class="stat-value">Avishake-PC</div>
          </div>
          <div class="stat">
            <div class="stat-label">Edition</div>
            <div class="stat-value">Portfolio OS · v1.0</div>
          </div>
          <div class="stat">
            <div class="stat-label">Uptime</div>
            <div class="stat-value">{{ uptime }}</div>
          </div>
        </div>
        <div class="setting">
          <label>Reduce motion</label>
          <input type="checkbox" :checked="osStore.reduceMotion" @change="(e) => osStore.setReduceMotion(e.target.checked)" />
        </div>
        <div class="setting">
          <label>Brightness</label>
          <input type="range" min="0.3" max="1" step="0.01" :value="osStore.brightness" @input="(e) => osStore.setBrightness(+e.target.value)" />
        </div>
      </section>

      <section v-else-if="active === 'personalization'">
        <h2>Personalization</h2>
        <div class="row">
          <label>Theme</label>
          <div class="seg">
            <button :class="{ on: osStore.theme === 'dark' }" @click="osStore.setTheme('dark')">Dark</button>
            <button :class="{ on: osStore.theme === 'light' }" @click="osStore.setTheme('light')">Light</button>
          </div>
        </div>

        <div class="row">
          <label>Accent</label>
          <div class="accent-row">
            <button
              v-for="color in accentColors"
              :key="color"
              class="swatch"
              :style="{ background: color }"
              :class="{ on: osStore.accent === color }"
              @click="osStore.setAccent(color)"
            ></button>
          </div>
        </div>

        <div class="row">
          <label>Wallpaper</label>
          <div class="wp-grid">
            <button
              v-for="(wp, i) in wallpapers"
              :key="i"
              class="wp"
              :class="{ on: osStore.wallpaperIndex === i }"
              @click="osStore.setWallpaper(i)"
            >
              <div class="wp-preview" :style="previewStyle(wp)"></div>
              <span>{{ wp.label }}</span>
            </button>
          </div>
        </div>
      </section>

      <section v-else-if="active === 'sound'">
        <h2>Sound</h2>
        <div class="row">
          <label>Master Volume</label>
          <input type="range" min="0" max="1" step="0.01" :value="osStore.volume" @input="(e) => osStore.setVolume(+e.target.value)" />
          <span class="val">{{ Math.round(osStore.volume * 100) }}%</span>
        </div>
        <div class="row">
          <label>Mute</label>
          <input type="checkbox" :checked="osStore.muted" @change="(e) => osStore.setMuted(e.target.checked)" />
        </div>
      </section>

      <section v-else-if="active === 'about'">
        <h2>About</h2>
        <div class="about">
          <img :src="avatar" class="avatar" alt="" />
          <h3>Avishake Adhikary</h3>
          <p>Full‑Stack Developer · Machine Learning enthusiast</p>
          <p class="about-handles">
            <a href="https://github.com/AvishakeAdhikary" target="_blank" rel="noopener">github</a>
            ·
            <a href="https://www.linkedin.com/in/avishakeadhikary/" target="_blank" rel="noopener">linkedin</a>
            ·
            <a href="mailto:avhishe.adhikary11@gmail.com">email</a>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useOsStore } from '@/stores/os';
import { wallpapers } from '@/components/os/wallpapers';
import avatar from '@/assets/AvishakeAdhikaryDP.png';

const props = defineProps({
  initialTab: { type: String, default: 'system' },
});

const osStore = useOsStore();
const active = ref(props.initialTab);

const tabs = [
  { id: 'system', label: 'System', icon: '🖥' },
  { id: 'personalization', label: 'Personalization', icon: '🎨' },
  { id: 'sound', label: 'Sound', icon: '🔊' },
  { id: 'about', label: 'About', icon: 'ℹ' },
];

const accentColors = [
  '#6c8cff',
  '#9d5dff',
  '#ff6b9d',
  '#3ad29f',
  '#f6c453',
  '#ff5d6c',
  '#37c8e2',
];

const startTime = Date.now();
const uptime = computed(() => {
  const ms = Date.now() - startTime;
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}m ${s}s`;
});

function previewStyle(wp) {
  if (wp.kind === 'animated') return wp.style;
  if (wp.kind === 'image') return { backgroundImage: `url(${wp.src})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  return { background: 'linear-gradient(135deg, #112, #225)' };
}
</script>

<style scoped>
.settings {
  display: flex;
  height: 100%;
  background: var(--bg-2);
  color: var(--text);
}
.side {
  width: 220px;
  border-right: 1px solid var(--glass-border);
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
}
.tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--text);
  text-align: left;
  font-size: 13px;
  transition: background 0.15s ease;
}
.tab .ico {
  width: 22px;
  text-align: center;
}
.tab:hover { background: rgba(255,255,255,0.06); }
.tab.on { background: var(--accent-soft); color: var(--text); border-left: 3px solid var(--accent); padding-left: 9px; }

.content {
  flex: 1;
  padding: 24px 32px;
  overflow: auto;
}
section h2 {
  margin: 0 0 18px;
  font-weight: 600;
  font-size: 22px;
}
section h3 { margin: 4px 0; }

.row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--glass-border);
}
.row label {
  width: 160px;
  font-size: 13px;
  color: var(--text-dim);
}
.row .val {
  font-variant-numeric: tabular-nums;
  color: var(--text-dim);
  font-size: 12px;
}
.seg {
  display: flex;
  background: rgba(255,255,255,0.05);
  border-radius: 100px;
  padding: 2px;
}
.seg button {
  padding: 5px 14px;
  font-size: 12px;
  border-radius: 100px;
  color: var(--text-dim);
}
.seg button.on { background: var(--accent); color: white; }

.accent-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.1);
  transition: transform 0.15s ease;
}
.swatch.on {
  border-color: white;
  transform: scale(1.1);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.wp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}
.wp {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
  border-radius: 8px;
  border: 2px solid transparent;
  background: rgba(255,255,255,0.03);
  color: var(--text);
  font-size: 11px;
  text-align: center;
}
.wp.on { border-color: var(--accent); }
.wp-preview {
  width: 100%;
  height: 70px;
  border-radius: 6px;
  overflow: hidden;
}

.card-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}
.stat {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 14px;
}
.stat-label {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 6px;
}
.stat-value {
  font-weight: 600;
}

.setting {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--glass-border);
}
.setting label {
  flex: 1;
  font-size: 13px;
  color: var(--text);
}

.about {
  text-align: center;
  padding: 20px;
}
.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 6px 22px rgba(0,0,0,0.4);
  margin-bottom: 10px;
}
.about-handles a {
  color: var(--accent);
  text-decoration: none;
  margin: 0 4px;
}
.about-handles a:hover { text-decoration: underline; }

input[type='range'] {
  flex: 1;
  accent-color: var(--accent);
}

@media (max-width: 720px) {
  .side { width: 64px; padding: 8px 4px; }
  .tab span:not(.ico) { display: none; }
  .row label { width: 100px; }
}
</style>
