<template>
  <div class="shutdown">
    <div class="shutdown-glow"></div>
    <div class="content">
      <OsLogo class="logo" />
      <p class="msg">{{ message }}</p>
      <div class="spinner-ring"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useOsStore } from '@/stores/os';
import OsLogo from './OsLogo.vue';

const osStore = useOsStore();
const message = ref('Shutting down…');

const STAGES = [
  { delay: 0,    text: 'Saving session…' },
  { delay: 800,  text: 'Closing applications…' },
  { delay: 1800, text: 'Shutting down…' },
  { delay: 3000, text: 'Goodbye!' },
];

onMounted(() => {
  STAGES.forEach(({ delay, text }) => {
    setTimeout(() => { message.value = text; }, delay);
  });

  // After animation finishes redirect (or just fade to black if no URL)
  setTimeout(() => {
    const url = osStore._shutdownRedirect;
    if (url) {
      window.location.href = url;
    } else {
      osStore.setPhase('lock');
    }
  }, 4200);
});
</script>

<style scoped>
.shutdown {
  position: fixed;
  inset: 0;
  background: #000;
  display: grid;
  place-items: center;
  z-index: 200000;
  animation: fadeIn 400ms ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.shutdown-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(108, 140, 255, 0.12) 0%, transparent 65%);
  animation: pulse 2s ease-in-out infinite alternate;
  pointer-events: none;
}

@keyframes pulse {
  to { opacity: 0.4; }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  color: rgba(255, 255, 255, 0.85);
  animation: rise 500ms ease forwards;
}

@keyframes rise {
  from { transform: translateY(10px); opacity: 0; }
  to   { transform: none; opacity: 1; }
}

.logo {
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 0 24px rgba(108, 140, 255, 0.5));
}

.msg {
  margin: 0;
  font-size: 14px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  min-height: 20px;
  transition: opacity 0.3s ease;
}

.spinner-ring {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent, #6c8cff);
  animation: os-spin 1s linear infinite;
}
</style>
