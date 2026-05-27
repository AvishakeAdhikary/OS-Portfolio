<template>
  <div class="notif-stack">
    <transition-group name="notif" tag="div">
      <div
        v-for="n in toasts"
        :key="n.id"
        class="toast glass"
        @click="osStore.dismiss(n.id)"
      >
        <img v-if="n.icon" :src="n.icon" class="icon" alt="" />
        <div class="body">
          <div class="title">{{ n.title }}</div>
          <div v-if="n.message" class="msg">{{ n.message }}</div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useOsStore } from '@/stores/os';

const osStore = useOsStore();
const toasts = computed(() => osStore.notifications.slice(0, 4));
</script>

<style scoped>
.notif-stack {
  position: fixed;
  right: 14px;
  bottom: calc(var(--taskbar-height) + 14px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9000;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 260px;
  max-width: 360px;
  padding: 12px 14px;
  border-radius: 12px;
  pointer-events: auto;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
.icon {
  width: 28px;
  height: 28px;
}
.body {
  flex: 1;
}
.title {
  font-weight: 600;
  font-size: 13px;
}
.msg {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 2px;
}
.notif-enter-from,
.notif-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.notif-enter-active,
.notif-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}
</style>
