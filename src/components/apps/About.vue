<template>
  <div class="about">
    <div class="hero">
      <OsLogo class="logo" />
      <div>
        <h1>Avishake OS</h1>
        <p>Portfolio Edition · v1.0</p>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="row"><span class="k">Device</span><span class="v">Avishake-PC</span></div>
        <div class="row"><span class="k">Edition</span><span class="v">Portfolio · v1.0</span></div>
        <div class="row"><span class="k">Built with</span><span class="v">Vue 3, Vite 5, Pinia</span></div>
        <div class="row"><span class="k">User</span><span class="v">Avishake Adhikary</span></div>
      </div>
      <div class="card">
        <div class="row"><span class="k">CPU threads</span><span class="v">{{ cpuThreads }}</span></div>
        <div class="row"><span class="k">Memory</span><span class="v">{{ memory }}</span></div>
        <div class="row"><span class="k">Display</span><span class="v">{{ display }}</span></div>
        <div class="row"><span class="k">Pixel ratio</span><span class="v">{{ dpr }}×</span></div>
        <div class="row"><span class="k">Uptime</span><span class="v">{{ uptime }}</span></div>
      </div>
    </div>

    <div class="callout">
      Tip: Press <kbd>Esc</kbd> to dismiss menus. Right-click the desktop for shortcuts. Open Terminal and try <code>neofetch</code>.
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import OsLogo from '@/components/os/OsLogo.vue';

const cpuThreads = navigator.hardwareConcurrency || '—';
const memory = navigator.deviceMemory ? navigator.deviceMemory + ' GB' : '—';
const dpr = window.devicePixelRatio.toFixed(1);
const display = `${window.innerWidth}×${window.innerHeight}`;

const now = ref(Date.now());
let timer = null;
const start = performance.timeOrigin || performance.now();
onMounted(() => {
  timer = setInterval(() => (now.value = Date.now()), 1000);
});
onBeforeUnmount(() => clearInterval(timer));

const uptime = computed(() => {
  const ms = now.value - start;
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h) return `${h}h ${m}m ${s}s`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
});
</script>

<style scoped>
.about {
  height: 100%;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: linear-gradient(180deg, var(--bg-2), var(--bg-1));
  color: var(--text);
  overflow: auto;
}
.hero {
  display: flex;
  align-items: center;
  gap: 18px;
}
.logo {
  width: 64px;
  height: 64px;
}
.hero h1 { margin: 0; font-size: 22px; }
.hero p { margin: 4px 0 0; color: var(--text-dim); font-size: 13px; }

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.card {
  padding: 14px 16px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}
.row + .row { border-top: 1px solid var(--glass-border); }
.k { color: var(--text-dim); }
.v { font-weight: 500; font-variant-numeric: tabular-nums; }

.callout {
  font-size: 12px;
  color: var(--text-dim);
  padding: 12px 16px;
  background: var(--accent-soft);
  border-radius: 10px;
  border-left: 3px solid var(--accent);
}
kbd {
  background: rgba(255,255,255,0.08);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  padding: 1px 6px;
  font-family: 'Cascadia Mono', monospace;
  font-size: 11px;
}
code {
  background: rgba(255,255,255,0.06);
  border-radius: 4px;
  padding: 1px 6px;
  font-family: 'Cascadia Mono', monospace;
  font-size: 12px;
}

@media (max-width: 720px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
