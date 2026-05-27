<template>
  <div class="window-manager">
    <OsWindow v-for="w in windowsStore.windows" :key="w.id" :win="w" />
  </div>
</template>

<script setup>
import OsWindow from './OsWindow.vue';
import { useWindowsStore } from '@/stores/windows';
const windowsStore = useWindowsStore();
</script>

<style scoped>
.window-manager {
  position: absolute;
  inset: 0 0 var(--taskbar-height) 0;
  pointer-events: none;
}
</style>
