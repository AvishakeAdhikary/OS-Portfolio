<template>
  <div class="certs">
    <div class="toolbar">
      <div class="title">Certificates · {{ filteredCerts.length }} of {{ certs.length }}</div>
      <div class="search">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15 15l5 5" stroke-linecap="round" />
        </svg>
        <input v-model="q" placeholder="Filter certificates…" />
      </div>
    </div>

    <div class="grid">
      <button
        v-for="cert in filteredCerts"
        :key="cert.url"
        class="card"
        @click="selected = cert"
      >
        <img :src="cert.url" loading="lazy" :alt="cert.label" />
        <div class="label">{{ cert.label }}</div>
      </button>
    </div>

    <transition name="fade">
      <div v-if="selected" class="lightbox" @click.self="selected = null">
        <button class="lb-close" @click="selected = null">×</button>
        <img :src="selected.url" :alt="selected.label" class="lb-img" />
        <div class="lb-label">{{ selected.label }}</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const certModules = import.meta.glob('/src/assets/cetificates/*.{jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const certs = Object.entries(certModules).map(([path, url]) => {
  const fileName = path.split('/').pop().replace(/\.[^.]+$/, '');
  return { url, label: fileName.replace(/_/g, ' ') };
});

const selected = ref(null);
const q = ref('');
const filteredCerts = computed(() => {
  const needle = q.value.trim().toLowerCase();
  if (!needle) return certs;
  return certs.filter((c) => c.label.toLowerCase().includes(needle));
});
</script>

<style scoped>
.certs {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-2);
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--glass-border);
  gap: 12px;
}
.title {
  font-size: 13px;
  color: var(--text-dim);
}
.search {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.25);
  border: 1px solid var(--glass-border);
  border-radius: 100px;
  padding: 4px 12px;
  width: 220px;
  color: var(--text-dim);
}
.search input {
  background: transparent;
  border: none;
  outline: none;
  flex: 1;
  color: var(--text);
  font-size: 12px;
}

.grid {
  flex: 1;
  overflow: auto;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.card {
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  overflow: hidden;
  text-align: left;
  transition: transform 0.18s ease, border-color 0.18s ease;
  color: var(--text);
}
.card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}
.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  background: #fff;
}
.card .label {
  padding: 10px 12px;
  font-size: 12px;
  color: var(--text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  display: grid;
  place-items: center;
  z-index: 200000;
  padding: 20px;
}
.lb-img {
  max-width: 92%;
  max-height: 80%;
  object-fit: contain;
  background: white;
  border-radius: 6px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}
.lb-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,0.08);
  color: white;
  border-radius: 50%;
  font-size: 26px;
}
.lb-close:hover { background: rgba(255,255,255,0.18); }
.lb-label {
  position: absolute;
  bottom: 28px;
  color: white;
  font-size: 12px;
  padding: 0 20px;
  text-align: center;
}

.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 180ms ease; }
</style>
