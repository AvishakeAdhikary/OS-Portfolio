<template>
  <div class="photos">
    <div class="photos-toolbar">
      <div class="title">Gallery · {{ photos.length }} photos</div>
      <div class="actions">
        <button class="seg" :class="{ on: layout === 'grid' }" @click="layout = 'grid'">Grid</button>
        <button class="seg" :class="{ on: layout === 'masonry' }" @click="layout = 'masonry'">Masonry</button>
      </div>
    </div>

    <div class="grid" :class="layout">
      <button
        v-for="(photo, i) in photos"
        :key="photo"
        class="card"
        :style="masonryStyle(i)"
        @click="open(i)"
      >
        <img :src="photo" loading="lazy" alt="" />
      </button>
    </div>

    <transition name="lightbox">
      <div v-if="selectedIdx !== null" class="lightbox" @click.self="close">
        <button class="lb-close" @click="close" aria-label="Close">×</button>
        <button class="lb-prev" @click="prev" :disabled="selectedIdx === 0" aria-label="Previous">‹</button>
        <button class="lb-next" @click="next" :disabled="selectedIdx === photos.length - 1" aria-label="Next">›</button>
        <img :src="photos[selectedIdx]" class="lb-img" alt="" />
        <div class="lb-counter">{{ selectedIdx + 1 }} / {{ photos.length }}</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const photoModules = import.meta.glob('/src/assets/photos/*.{jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const photos = Object.entries(photoModules)
  .sort(([a], [b]) => {
    const na = +(a.match(/photo(\d+)/)?.[1] ?? 0);
    const nb = +(b.match(/photo(\d+)/)?.[1] ?? 0);
    return na - nb;
  })
  .map(([, url]) => url);

const selectedIdx = ref(null);
const layout = ref('grid');

function open(i) {
  selectedIdx.value = i;
}
function close() {
  selectedIdx.value = null;
}
function next() {
  if (selectedIdx.value === null) return;
  if (selectedIdx.value < photos.length - 1) selectedIdx.value++;
}
function prev() {
  if (selectedIdx.value === null) return;
  if (selectedIdx.value > 0) selectedIdx.value--;
}

function masonryStyle(i) {
  if (layout.value !== 'masonry') return null;
  const spans = [22, 30, 26, 36, 24, 32];
  return { '--span': `${spans[i % spans.length]}rem` };
}

function onKey(e) {
  if (selectedIdx.value === null) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
}

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<style scoped>
.photos {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-2);
}
.photos-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--glass-border);
}
.title {
  font-size: 13px;
  color: var(--text-dim);
}
.seg {
  padding: 4px 12px;
  border-radius: 100px;
  color: var(--text-dim);
  background: rgba(255, 255, 255, 0.04);
  font-size: 12px;
  margin-left: 4px;
}
.seg.on {
  background: var(--accent);
  color: white;
}

.grid {
  padding: 12px;
  overflow: auto;
  flex: 1;
}
.grid.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}
.grid.masonry {
  column-count: 3;
  column-gap: 10px;
}
@media (max-width: 720px) {
  .grid.masonry { column-count: 2; }
}

.card {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  margin-bottom: 10px;
  break-inside: avoid;
}
.grid.grid .card { height: 180px; margin-bottom: 0; }
.grid.masonry .card { height: var(--span, 24rem); }
.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
}
.card:hover img {
  transform: scale(1.04);
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: grid;
  place-items: center;
  z-index: 200000;
}
.lb-img {
  max-width: 92%;
  max-height: 86%;
  object-fit: contain;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border-radius: 6px;
}
.lb-close, .lb-prev, .lb-next {
  position: absolute;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 26px;
  font-weight: 300;
  transition: background 0.15s ease;
}
.lb-close { top: 18px; right: 18px; }
.lb-prev { left: 18px; top: 50%; transform: translateY(-50%); }
.lb-next { right: 18px; top: 50%; transform: translateY(-50%); }
.lb-close:hover, .lb-prev:hover:not(:disabled), .lb-next:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.18);
}
.lb-prev:disabled, .lb-next:disabled { opacity: 0.25; cursor: not-allowed; }
.lb-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }
.lightbox-enter-active, .lightbox-leave-active { transition: opacity 200ms ease; }
</style>
