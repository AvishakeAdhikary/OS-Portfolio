<template>
  <div
    v-if="menu"
    class="ctx-menu glass"
    :style="style"
    @mousedown.stop
    @click.stop
    @contextmenu.stop.prevent
    data-allow-context
  >
    <template v-for="(item, i) in menu.items" :key="i">
      <div v-if="item.divider" class="divider"></div>
      <div
        v-else-if="item.children"
        class="item parent"
        @mouseenter="hovered = i"
        @mouseleave="hovered === i && (hovered = null)"
      >
        <img v-if="item.icon" :src="item.icon" alt="" class="icon" />
        <span class="label">{{ item.label }}</span>
        <span class="caret">›</span>
        <div v-if="hovered === i" class="submenu glass">
          <button
            v-for="(child, j) in item.children"
            :key="j"
            type="button"
            class="item"
            :disabled="child.disabled"
            @click="run(child, $event)"
          >
            <img v-if="child.icon" :src="child.icon" alt="" class="icon" />
            <span class="label">{{ child.label }}</span>
            <span v-if="child.shortcut" class="shortcut">{{ child.shortcut }}</span>
          </button>
        </div>
      </div>
      <button
        v-else
        type="button"
        class="item"
        :disabled="item.disabled"
        @click="run(item, $event)"
      >
        <img v-if="item.icon" :src="item.icon" alt="" class="icon" />
        <span class="label">{{ item.label }}</span>
        <span v-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
      </button>
    </template>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useOsStore } from '@/stores/os';

const osStore = useOsStore();
const menu = computed(() => osStore.contextMenu);
const hovered = ref(null);

const style = computed(() => {
  if (!menu.value) return {};
  const padding = 8;
  const x = Math.min(window.innerWidth - 260, menu.value.x);
  const y = Math.min(window.innerHeight - 100, menu.value.y);
  return { left: `${Math.max(padding, x)}px`, top: `${Math.max(padding, y)}px` };
});

function run(item, e) {
  if (item.disabled) return;
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const action = item.onClick;
  osStore.hideContextMenu();
  if (typeof action === 'function') {
    setTimeout(() => action(), 0);
  }
}

function onOutsidePointer(e) {
  if (e.target.closest('.ctx-menu')) return;
  osStore.hideContextMenu();
}

function onScroll() {
  osStore.hideContextMenu();
}

onMounted(() => {
  document.addEventListener('mousedown', onOutsidePointer);
  window.addEventListener('blur', osStore.hideContextMenu);
  window.addEventListener('resize', osStore.hideContextMenu);
  window.addEventListener('scroll', onScroll, true);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onOutsidePointer);
  window.removeEventListener('blur', osStore.hideContextMenu);
  window.removeEventListener('resize', osStore.hideContextMenu);
  window.removeEventListener('scroll', onScroll, true);
});
</script>

<style scoped>
.ctx-menu {
  position: fixed;
  min-width: 230px;
  padding: 6px;
  border-radius: 10px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.55);
  z-index: 100000;
  animation: os-scale-in 120ms ease;
  transform-origin: top left;
  background: var(--surface-strong);
  border: 1px solid var(--glass-border-strong);
}
.item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  text-align: left;
  color: var(--text);
  background: transparent;
  border: none;
  font: inherit;
  cursor: pointer;
  position: relative;
}
.item:hover:not(:disabled),
.parent:hover { background: var(--accent-soft); }
.item:disabled { opacity: 0.45; cursor: not-allowed; }
.icon { width: 16px; height: 16px; pointer-events: none; }
.label { flex: 1; pointer-events: none; }
.shortcut, .caret {
  font-size: 11px;
  color: var(--text-faint);
  letter-spacing: 0.04em;
  pointer-events: none;
}
.divider {
  height: 1px;
  background: var(--glass-border);
  margin: 4px 6px;
}
.submenu {
  position: absolute;
  top: -6px;
  left: 100%;
  margin-left: 4px;
  min-width: 220px;
  padding: 6px;
  border-radius: 10px;
  background: var(--surface-strong);
  border: 1px solid var(--glass-border-strong);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.55);
  z-index: 1;
}
</style>
