<template>
  <div class="mp">
    <div class="mp-stage">
      <canvas ref="canvasEl" class="visualizer"></canvas>
      <div class="now-playing">
        <div class="np-art" :class="{ playing: isPlaying }">
          <div class="art-bg" :style="{ background: artGradient }"></div>
          <svg class="art-disc" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="rgba(0,0,0,0.7)" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
            <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
            <circle cx="50" cy="50" r="6" fill="var(--accent)" />
          </svg>
        </div>
        <div class="np-meta">
          <div class="np-title">{{ current.title || 'Nothing playing' }}</div>
          <div class="np-artist">{{ current.artist || '—' }}</div>
        </div>
      </div>
    </div>

    <div class="mp-controls">
      <div class="seek-row">
        <span class="t">{{ fmt(currentSeconds) }}</span>
        <input
          type="range"
          class="seek"
          min="0"
          :max="duration || 1"
          step="0.1"
          :value="currentSeconds"
          @input="onSeek"
          @change="onSeek"
        />
        <span class="t">{{ fmt(duration) }}</span>
      </div>
      <div class="btns">
        <button class="ctrl" @click="toggleShuffle" :class="{ on: shuffle }" aria-label="Shuffle">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <path d="M16 4l4 4-4 4" /><path d="M20 8H6.5a4 4 0 0 0-3.5 6" />
            <path d="M16 20l4-4-4-4" /><path d="M20 16h-4a4 4 0 0 1-3.5-2" />
          </svg>
        </button>
        <button class="ctrl" @click="prev" aria-label="Previous">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M6 5h2v14H6zM20 5v14L8 12z" />
          </svg>
        </button>
        <button class="ctrl big" @click="playPause" :aria-label="isPlaying ? 'Pause' : 'Play'">
          <svg v-if="!isPlaying" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M7 4l13 8L7 20z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
          </svg>
        </button>
        <button class="ctrl" @click="next" aria-label="Next">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M4 5l12 7-12 7zM16 5h2v14h-2z" />
          </svg>
        </button>
        <button class="ctrl" @click="toggleRepeat" :class="{ on: repeat !== 'none' }" aria-label="Repeat">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          <span v-if="repeat === 'one'" class="repeat-one">1</span>
        </button>
      </div>

      <div class="vol-row">
        <button class="ctrl small" @click="toggleMute" aria-label="Mute">
          <svg v-if="!muted" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 9h4l5-5v16l-5-5H3V9z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 9h4l5-5v16l-5-5H3V9zm17 1.4L18.6 9 17 10.6 15.4 9 14 10.4l1.6 1.6L14 13.6 15.4 15l1.6-1.6L18.6 15l1.4-1.4-1.6-1.6z" />
          </svg>
        </button>
        <input
          type="range"
          class="vol"
          min="0"
          max="1"
          step="0.01"
          :value="muted ? 0 : volume"
          @input="onVolume"
        />
        <div class="viz-toggle">
          <button :class="{ on: vizMode === 'bars' }" @click="vizMode = 'bars'">Bars</button>
          <button :class="{ on: vizMode === 'wave' }" @click="vizMode = 'wave'">Wave</button>
          <button :class="{ on: vizMode === 'orb' }" @click="vizMode = 'orb'">Orb</button>
        </div>
      </div>
    </div>

    <div class="mp-playlist">
      <div class="pl-header">Playlist · {{ songs.length }} tracks</div>
      <div class="pl-list">
        <button
          v-for="(song, i) in songs"
          :key="song.src"
          class="track"
          :class="{ playing: i === index && isPlaying, current: i === index }"
          @click="selectSong(i)"
        >
          <span class="track-i">{{ i + 1 }}</span>
          <div class="track-meta">
            <div class="t1">{{ song.title }}</div>
            <div class="t2">{{ song.artist }}</div>
          </div>
          <span class="track-eq" aria-hidden="true">
            <i></i><i></i><i></i>
          </span>
        </button>
      </div>
    </div>

    <audio ref="audioEl" preload="metadata" @timeupdate="onTimeUpdate" @loadedmetadata="onLoaded" @ended="onEnded" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useOsStore } from '@/stores/os';

import ElectronicFutureBeats from '@/assets/music/electronic-future-beats-117997.mp3';
import LeonellCassio from '@/assets/music/leonell-cassio-the-blackest-bouquet-118766.mp3';
import Mazaphonk from '@/assets/music/mazaphonk-music-by-0to8-alexi-action-infraction-128845.mp3';
import PasswordInfinity from '@/assets/music/password-infinity-123276.mp3';
import PowerfulRock from '@/assets/music/powerful-energetic-sport-rock-trailer-122077.mp3';
import SciFi from '@/assets/music/sci-fi-cyberpunk-trailer-110587.mp3';

const osStore = useOsStore();

const songs = [
  { title: 'Electronic Future Beats', artist: 'QubeSounds', src: ElectronicFutureBeats, accent: '#6c8cff' },
  { title: 'The Blackest Bouquet', artist: 'Leonell Cassio', src: LeonellCassio, accent: '#ff6b9d' },
  { title: 'Mazaphonk Music', artist: 'Alexi Action', src: Mazaphonk, accent: '#9d5dff' },
  { title: 'Infinity', artist: 'Password', src: PasswordInfinity, accent: '#3ad29f' },
  { title: 'Energetic Rock Trailer', artist: 'Pink Zebra', src: PowerfulRock, accent: '#f6c453' },
  { title: 'Sci-Fi Cyberpunk', artist: 'MaxKoMusic', src: SciFi, accent: '#ff5d6c' },
];

const audioEl = ref(null);
const canvasEl = ref(null);
const index = ref(0);
const isPlaying = ref(false);
const currentSeconds = ref(0);
const duration = ref(0);
const volume = ref(osStore.volume);
const muted = ref(osStore.muted);
const shuffle = ref(false);
const repeat = ref('none');
const vizMode = ref('bars');

const current = computed(() => songs[index.value] ?? {});
const artGradient = computed(() => {
  const a = current.value.accent || '#6c8cff';
  return `radial-gradient(circle at 30% 30%, ${a}, transparent 70%), radial-gradient(circle at 70% 70%, #9d5dff, transparent 70%)`;
});

let audioContext = null;
let analyser = null;
let dataArray = null;
let sourceNode = null;
let rafId = null;
let resizeObs = null;

function ensureContext() {
  if (audioContext) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  audioContext = new AC();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.78;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  if (audioEl.value) {
    sourceNode = audioContext.createMediaElementSource(audioEl.value);
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
  }
}

function setupCanvas() {
  const canvas = canvasEl.value;
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, rect.width * dpr);
  canvas.height = Math.max(1, rect.height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw() {
  const canvas = canvasEl.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const W = rect.width;
  const H = rect.height;
  ctx.clearRect(0, 0, W, H);

  if (analyser) {
    if (vizMode.value === 'wave') analyser.getByteTimeDomainData(dataArray);
    else analyser.getByteFrequencyData(dataArray);
  }

  const accent = current.value.accent || '#6c8cff';

  if (vizMode.value === 'bars') {
    const bars = 64;
    const step = Math.floor((dataArray?.length || 0) / bars) || 1;
    const barW = W / bars;
    for (let i = 0; i < bars; i++) {
      const v = dataArray ? dataArray[i * step] / 255 : 0.1 + Math.sin((Date.now() / 400) + i) * 0.05 + 0.1;
      const h = Math.max(2, v * H * 0.85);
      const x = i * barW + 1;
      const y = H - h;
      const grad = ctx.createLinearGradient(0, y, 0, H);
      grad.addColorStop(0, accent);
      grad.addColorStop(1, '#9d5dff');
      ctx.fillStyle = grad;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8;
      const r = Math.min(3, barW / 3);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barW - 2, h, [r, r, 0, 0]);
      else ctx.rect(x, y, barW - 2, h);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  } else if (vizMode.value === 'wave') {
    ctx.lineWidth = 2;
    ctx.strokeStyle = accent;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    const len = dataArray?.length || 0;
    if (len) {
      const slice = W / len;
      for (let i = 0; i < len; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * H) / 2;
        const x = i * slice;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    } else {
      for (let x = 0; x < W; x++) {
        const y = H / 2 + Math.sin(x / 20 + Date.now() / 300) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  } else if (vizMode.value === 'orb') {
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) * 0.22;
    const points = 96;
    ctx.lineWidth = 2;
    ctx.strokeStyle = accent;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const v = dataArray ? dataArray[i % dataArray.length] / 255 : 0.15;
      const r = radius + v * radius * 0.9;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  rafId = requestAnimationFrame(draw);
}

function play() {
  if (!audioEl.value) return;
  ensureContext();
  if (audioContext?.state === 'suspended') audioContext.resume();
  audioEl.value.src = current.value.src;
  audioEl.value.volume = muted.value ? 0 : volume.value;
  audioEl.value
    .play()
    .then(() => {
      isPlaying.value = true;
    })
    .catch(() => {
      isPlaying.value = false;
    });
}

function pause() {
  audioEl.value?.pause();
  isPlaying.value = false;
}

function playPause() {
  if (isPlaying.value) pause();
  else play();
}

function next() {
  if (shuffle.value) {
    index.value = Math.floor(Math.random() * songs.length);
  } else {
    index.value = (index.value + 1) % songs.length;
  }
  play();
}

function prev() {
  if (currentSeconds.value > 3 && audioEl.value) {
    audioEl.value.currentTime = 0;
    return;
  }
  index.value = (index.value - 1 + songs.length) % songs.length;
  play();
}

function selectSong(i) {
  index.value = i;
  play();
}

function toggleShuffle() {
  shuffle.value = !shuffle.value;
}

function toggleRepeat() {
  repeat.value = repeat.value === 'none' ? 'all' : repeat.value === 'all' ? 'one' : 'none';
}

function toggleMute() {
  muted.value = !muted.value;
  osStore.setMuted(muted.value);
  if (audioEl.value) audioEl.value.volume = muted.value ? 0 : volume.value;
}

function onVolume(e) {
  volume.value = +e.target.value;
  muted.value = volume.value === 0;
  osStore.setVolume(volume.value);
  osStore.setMuted(muted.value);
  if (audioEl.value) audioEl.value.volume = muted.value ? 0 : volume.value;
}

function onTimeUpdate() {
  currentSeconds.value = audioEl.value?.currentTime ?? 0;
}

function onLoaded() {
  duration.value = audioEl.value?.duration ?? 0;
}

function onEnded() {
  if (repeat.value === 'one') {
    audioEl.value.currentTime = 0;
    audioEl.value.play();
  } else if (repeat.value === 'all') {
    next();
  } else if (index.value < songs.length - 1) {
    next();
  } else {
    isPlaying.value = false;
  }
}

function onSeek(e) {
  if (!audioEl.value) return;
  audioEl.value.currentTime = +e.target.value;
}

function fmt(s) {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

watch(
  () => osStore.muted,
  (v) => {
    muted.value = v;
    if (audioEl.value) audioEl.value.volume = v ? 0 : volume.value;
  },
);
watch(
  () => osStore.volume,
  (v) => {
    volume.value = v;
    if (audioEl.value && !muted.value) audioEl.value.volume = v;
  },
);

onMounted(() => {
  setupCanvas();
  resizeObs = new ResizeObserver(setupCanvas);
  resizeObs.observe(canvasEl.value);
  rafId = requestAnimationFrame(draw);
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  resizeObs?.disconnect();
  audioEl.value?.pause();
  if (audioContext) audioContext.close();
});
</script>

<style scoped>
.mp {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-1);
  color: var(--text);
}
.mp-stage {
  position: relative;
  flex: 1 1 220px;
  min-height: 180px;
  overflow: hidden;
}
.visualizer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-1);
}
.now-playing {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: linear-gradient(180deg, transparent, var(--surface-strong));
}
.np-art {
  position: relative;
  width: 78px;
  height: 78px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
}
.art-bg {
  position: absolute;
  inset: 0;
  filter: blur(6px);
}
.art-disc {
  position: absolute;
  inset: 0;
  animation: spin 18s linear infinite;
  animation-play-state: paused;
}
.np-art.playing .art-disc {
  animation-play-state: running;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.np-meta { min-width: 0; }
.np-title {
  font-size: 18px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.np-artist {
  font-size: 13px;
  color: var(--text-dim);
}

.mp-controls {
  padding: 12px 16px;
  border-top: 1px solid var(--glass-border);
  background: var(--bg-2);
}
.seek-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.seek-row .t {
  font-size: 11px;
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
  width: 38px;
  text-align: center;
}
.seek {
  flex: 1;
  accent-color: var(--accent);
}

.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
}
.ctrl {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--text);
  background: var(--bg-3);
  border: 1px solid var(--glass-border);
  transition: background 0.15s ease, transform 0.1s ease;
  position: relative;
}
.ctrl:hover {
  background: var(--accent-soft);
}
.ctrl.on {
  color: var(--accent);
  background: var(--accent-soft);
}
.ctrl.big {
  width: 52px;
  height: 52px;
  background: var(--accent);
  color: white;
  box-shadow: 0 6px 16px rgba(108, 140, 255, 0.45);
}
.ctrl.big:hover {
  background: var(--accent-strong);
  transform: translateY(-1px);
}
.ctrl.small { width: 28px; height: 28px; }
.repeat-one {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 9px;
  font-weight: 700;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  display: grid;
  place-items: center;
}

.vol-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}
.vol {
  flex: 1;
  max-width: 180px;
  accent-color: var(--accent);
}
.viz-toggle {
  margin-left: auto;
  display: flex;
  background: var(--bg-3);
  border: 1px solid var(--glass-border);
  border-radius: 100px;
  padding: 2px;
}
.viz-toggle button {
  padding: 4px 12px;
  font-size: 11px;
  border-radius: 100px;
  color: var(--text-dim);
  transition: background 0.15s, color 0.15s;
}
.viz-toggle button.on {
  background: var(--accent);
  color: white;
}

.mp-playlist {
  flex: 0 0 200px;
  border-top: 1px solid var(--glass-border);
  background: var(--bg-2);
  display: flex;
  flex-direction: column;
}
.pl-header {
  padding: 10px 16px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.pl-list {
  flex: 1;
  overflow: auto;
}
.track {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  color: var(--text);
  transition: background 0.15s ease;
}
.track:hover {
  background: var(--accent-soft);
}
.track.current {
  background: var(--accent-soft);
}
.track-i {
  width: 22px;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: var(--text-dim);
}
.track-meta { flex: 1; min-width: 0; }
.track-meta .t1 {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.track-meta .t2 {
  font-size: 11px;
  color: var(--text-dim);
}
.track-eq {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
  visibility: hidden;
}
.track-eq i {
  display: block;
  width: 3px;
  background: var(--accent);
  border-radius: 100px;
}
.track-eq i:nth-child(1) { animation: bar 0.7s ease infinite; }
.track-eq i:nth-child(2) { animation: bar 0.6s ease infinite 0.15s; }
.track-eq i:nth-child(3) { animation: bar 0.9s ease infinite 0.3s; }
.track.playing .track-eq { visibility: visible; }
@keyframes bar {
  0%, 100% { height: 4px; }
  50% { height: 14px; }
}

@media (max-width: 720px) {
  .vol { display: none; }
  .vol-row .ctrl.small { display: none; }
  .mp-playlist { flex: 0 0 160px; }
}
</style>
