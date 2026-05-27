<template>
  <button
    type="button"
    class="desktop-icon"
    :class="{ selected }"
    @click="onClick"
    @dblclick.stop.prevent="onOpen"
    @touchend.stop.prevent="onTouch"
    @contextmenu.stop.prevent="onContext"
  >
    <img :src="icon" :alt="label" draggable="false" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';

defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  selected: { type: Boolean, default: false },
});

const emit = defineEmits(['open', 'select', 'context']);

const tapCount = ref(0);
const tapTimer = ref(null);
const TAP_GAP = 320;

function onClick() {
  emit('select');
  tapCount.value += 1;
  if (tapCount.value === 1) {
    clearTimeout(tapTimer.value);
    tapTimer.value = setTimeout(() => {
      tapCount.value = 0;
    }, TAP_GAP);
  } else if (tapCount.value >= 2) {
    clearTimeout(tapTimer.value);
    tapCount.value = 0;
    emit('open');
  }
}

function onOpen() {
  clearTimeout(tapTimer.value);
  tapCount.value = 0;
  emit('open');
}

function onTouch() {
  onClick();
}

function onContext(e) {
  emit('select');
  emit('context', e);
}

onBeforeUnmount(() => clearTimeout(tapTimer.value));
</script>

<style scoped>
.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 90px;
  padding: 8px 4px;
  border-radius: 6px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  transition: background 120ms ease, transform 120ms ease;
  position: relative;
  z-index: 1;
  cursor: pointer;
  background: transparent;
  border: none;
}
.desktop-icon:hover { background: rgba(255, 255, 255, 0.08); }
.desktop-icon.selected {
  background: rgba(108, 140, 255, 0.25);
  outline: 1px solid rgba(108, 140, 255, 0.55);
}
.desktop-icon:active { transform: scale(0.97); }
.desktop-icon img {
  width: 44px;
  height: 44px;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
  pointer-events: none;
}
.desktop-icon span {
  font-size: 12px;
  text-align: center;
  line-height: 1.25;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  pointer-events: none;
}
</style>
