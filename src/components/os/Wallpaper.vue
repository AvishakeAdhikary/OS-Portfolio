<template>
  <div class="wallpaper" :data-kind="current.kind">
    <video
      v-if="current.kind === 'video'"
      ref="videoEl"
      class="layer"
      autoplay
      muted
      loop
      playsinline
    >
      <source :src="current.src" :type="current.mime || 'video/mp4'" />
    </video>
    <img v-else-if="current.kind === 'image'" class="layer" :src="current.src" alt="" />
    <div v-else class="layer animated" :style="current.style"></div>
    <div class="vignette"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useOsStore } from '@/stores/os';
import { wallpapers } from './wallpapers';

const osStore = useOsStore();
const videoEl = ref(null);

const current = computed(() => wallpapers[osStore.wallpaperIndex % wallpapers.length]);

watch(current, () => {
  if (current.value.kind === 'video') {
    requestAnimationFrame(() => videoEl.value?.play().catch(() => {}));
  }
});

onMounted(() => {
  if (current.value.kind === 'video') {
    videoEl.value?.play().catch(() => {});
  }
});
</script>

<style scoped>
.wallpaper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}
.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.animated {
  animation: drift 22s ease-in-out infinite alternate;
}
@keyframes drift {
  to { transform: scale(1.08) translate(-1.5%, -1.5%); }
}
.vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(120% 80% at 50% 30%, transparent 60%, rgba(0, 0, 0, 0.45) 100%);
}
</style>
