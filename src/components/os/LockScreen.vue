<template>
  <div class="lock" @click="bump" @keydown="bump" tabindex="0">
    <div class="lock-bg" :style="{ backgroundImage: `url(${bg})` }"></div>
    <div class="lock-veil"></div>
    <div class="lock-content" :class="{ lifted: lifted }">
      <div class="time">{{ time }}</div>
      <div class="date">{{ date }}</div>
      <div class="hint">Click anywhere or press a key to sign in</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useOsStore } from '@/stores/os';
import bg from '@/assets/lockscreen.jpg';

const emit = defineEmits(['unlock']);
const osStore = useOsStore();
const lifted = ref(false);

const time = computed(() =>
  osStore.now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
);
const date = computed(() =>
  osStore.now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }),
);

function bump() {
  if (lifted.value) return;
  lifted.value = true;
  setTimeout(() => emit('unlock'), 350);
}

onMounted(() => {
  window.addEventListener('keydown', bump, { once: true });
});
</script>

<style scoped>
.lock {
  position: absolute;
  inset: 0;
  overflow: hidden;
  cursor: pointer;
  animation: os-fade-in 400ms ease;
}
.lock-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.5) saturate(1.1);
}
.lock-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.55) 100%);
}
.lock-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45);
  transition: transform 0.35s ease, opacity 0.35s ease;
}
.lock-content.lifted {
  transform: translateY(-30vh);
  opacity: 0;
}
.time {
  font-size: clamp(72px, 14vw, 160px);
  font-weight: 200;
  letter-spacing: -0.04em;
  line-height: 1;
}
.date {
  font-size: 22px;
  font-weight: 300;
  letter-spacing: 0.04em;
  margin-top: 10px;
}
.hint {
  position: absolute;
  bottom: 56px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  animation: bobIt 2.4s ease-in-out infinite alternate;
}
@keyframes bobIt {
  to { transform: translateY(-6px); opacity: 1; }
}
</style>
