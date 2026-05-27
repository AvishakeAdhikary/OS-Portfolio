<template>
  <div
    class="window"
    :class="{ focused: isFocused, minimized: win.minimized, maximized: win.maximized, closing: win.closed }"
    :style="windowStyle"
    @mousedown="focus"
    @touchstart.passive="focus"
  >
    <div
      class="title-bar"
      @mousedown="startDrag"
      @touchstart.passive="startDrag"
      @dblclick="toggleMaximize"
    >
      <img :src="win.icon" class="t-icon" alt="" />
      <span class="t-title">{{ win.title }}</span>
      <div class="t-buttons" data-allow-context>
        <button class="t-btn min" @click.stop="windowsStore.minimize(win.id)" aria-label="Minimize">
          <svg viewBox="0 0 12 12"><path d="M2 6h8" /></svg>
        </button>
        <button class="t-btn max" @click.stop="toggleMaximize" aria-label="Maximize">
          <svg v-if="!win.maximized" viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" /></svg>
          <svg v-else viewBox="0 0 12 12">
            <rect x="2" y="3.5" width="6.5" height="6.5" />
            <rect x="3.5" y="2" width="6.5" height="6.5" fill="none" />
          </svg>
        </button>
        <button class="t-btn close" @click.stop="windowsStore.close(win.id)" aria-label="Close">
          <svg viewBox="0 0 12 12">
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      </div>
    </div>

    <div class="window-body">
      <div v-if="win.loading" class="window-loading">
        <div class="loader-ring"></div>
        <div class="loader-msg">{{ win.bootMessage }}</div>
        <div class="loader-bar">
          <div class="loader-bar-fill" :style="{ width: `${Math.round(win.bootProgress * 100)}%` }"></div>
        </div>
      </div>
      <Suspense v-else>
        <template #default>
          <component :is="component" v-bind="win.props" :window="win" />
        </template>
        <template #fallback>
          <div class="window-loading">
            <div class="loader-ring"></div>
            <div class="loader-msg">Loading…</div>
          </div>
        </template>
      </Suspense>
    </div>

    <template v-if="win.resizable && !win.maximized">
      <div class="resize n" @mousedown.stop="startResize('n', $event)" @touchstart.stop.passive="startResize('n', $event)"></div>
      <div class="resize s" @mousedown.stop="startResize('s', $event)" @touchstart.stop.passive="startResize('s', $event)"></div>
      <div class="resize e" @mousedown.stop="startResize('e', $event)" @touchstart.stop.passive="startResize('e', $event)"></div>
      <div class="resize w" @mousedown.stop="startResize('w', $event)" @touchstart.stop.passive="startResize('w', $event)"></div>
      <div class="resize ne" @mousedown.stop="startResize('ne', $event)" @touchstart.stop.passive="startResize('ne', $event)"></div>
      <div class="resize nw" @mousedown.stop="startResize('nw', $event)" @touchstart.stop.passive="startResize('nw', $event)"></div>
      <div class="resize se" @mousedown.stop="startResize('se', $event)" @touchstart.stop.passive="startResize('se', $event)"></div>
      <div class="resize sw" @mousedown.stop="startResize('sw', $event)" @touchstart.stop.passive="startResize('sw', $event)"></div>
    </template>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onBeforeUnmount, ref } from 'vue';
import { appRegistry } from '@/apps/registry';
import { useWindowsStore } from '@/stores/windows';

const props = defineProps({
  win: { type: Object, required: true },
});

const windowsStore = useWindowsStore();
const component = computed(() => {
  const app = appRegistry[props.win.appId];
  return app ? defineAsyncComponent(app.component) : null;
});

const isFocused = computed(() => windowsStore.focusedId === props.win.id);

const windowStyle = computed(() => {
  if (props.win.maximized) {
    return {
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      borderRadius: '0',
      zIndex: props.win.z,
    };
  }
  return {
    left: `${props.win.bounds.x}px`,
    top: `${props.win.bounds.y}px`,
    width: `${props.win.bounds.width}px`,
    height: `${props.win.bounds.height}px`,
    zIndex: props.win.z,
  };
});

function focus() {
  windowsStore.focus(props.win.id);
}

function toggleMaximize() {
  windowsStore.maximize(props.win.id);
}

// drag
const dragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

function startDrag(e) {
  if (e.target.closest('.t-buttons')) return;
  if (props.win.maximized) return;
  focus();
  dragging.value = true;
  const point = pointer(e);
  dragStart.value = { x: point.x, y: point.y };
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('touchend', stopDrag);
}
function onDragMove(e) {
  if (!dragging.value) return;
  if (e.cancelable) e.preventDefault();
  const point = pointer(e);
  const dx = point.x - dragStart.value.x;
  const dy = point.y - dragStart.value.y;
  windowsStore.move(props.win.id, dx, dy);
  dragStart.value = point;
}
function stopDrag() {
  dragging.value = false;
  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchmove', onDragMove);
  window.removeEventListener('touchend', stopDrag);
}

// resize
const resizing = ref(null);
const resizeStart = ref({ x: 0, y: 0, bounds: null });

function startResize(dir, e) {
  if (props.win.maximized) return;
  focus();
  resizing.value = dir;
  const point = pointer(e);
  resizeStart.value = { x: point.x, y: point.y, bounds: { ...props.win.bounds } };
  window.addEventListener('mousemove', onResizeMove);
  window.addEventListener('mouseup', stopResize);
  window.addEventListener('touchmove', onResizeMove, { passive: false });
  window.addEventListener('touchend', stopResize);
}
function onResizeMove(e) {
  if (!resizing.value) return;
  if (e.cancelable) e.preventDefault();
  const point = pointer(e);
  const dx = point.x - resizeStart.value.x;
  const dy = point.y - resizeStart.value.y;
  const start = resizeStart.value.bounds;
  const dir = resizing.value;
  let { x, y, width, height } = start;

  const minW = 320;
  const minH = 220;

  if (dir.includes('e')) width = Math.max(minW, start.width + dx);
  if (dir.includes('s')) height = Math.max(minH, start.height + dy);
  if (dir.includes('w')) {
    width = Math.max(minW, start.width - dx);
    x = start.x + (start.width - width);
  }
  if (dir.includes('n')) {
    height = Math.max(minH, start.height - dy);
    y = start.y + (start.height - height);
  }
  windowsStore.setBounds(props.win.id, { x, y, width, height });
}
function stopResize() {
  resizing.value = null;
  window.removeEventListener('mousemove', onResizeMove);
  window.removeEventListener('mouseup', stopResize);
  window.removeEventListener('touchmove', onResizeMove);
  window.removeEventListener('touchend', stopResize);
}

function pointer(e) {
  if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.changedTouches && e.changedTouches[0])
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

onBeforeUnmount(() => {
  stopDrag();
  stopResize();
});
</script>

<style scoped>
.window {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: var(--surface-strong);
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--radius-window);
  box-shadow: var(--shadow-window);
  overflow: hidden;
  pointer-events: auto;
  animation: winOpen 220ms ease;
  transition: opacity 220ms ease, transform 220ms ease;
}
.window.maximized {
  border-radius: 0;
}
.window.minimized {
  opacity: 0;
  transform: translateY(80px) scale(0.85);
  pointer-events: none;
}
.window.closing {
  opacity: 0;
  transform: scale(0.94) translateY(20px);
  pointer-events: none;
}
.window.focused {
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.65), 0 0 0 1px var(--glass-border-strong);
}
.window:not(.focused) {
  filter: brightness(0.92);
}

@keyframes winOpen {
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.title-bar {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 0 0 12px;
  gap: 8px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
  border-bottom: 1px solid var(--glass-border);
  cursor: grab;
  flex-shrink: 0;
}
.title-bar:active {
  cursor: grabbing;
}
.t-icon {
  width: 16px;
  height: 16px;
}
.t-title {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.t-buttons {
  display: flex;
  height: 36px;
}
.t-btn {
  width: 44px;
  height: 36px;
  display: grid;
  place-items: center;
  color: var(--text-dim);
  transition: background 120ms ease, color 120ms ease;
}
.t-btn svg {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
}
.t-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
}
.t-btn.close:hover {
  background: var(--danger);
  color: white;
}

.window-body {
  flex: 1;
  position: relative;
  overflow: auto;
  color: var(--text);
}

.window-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: var(--surface-strong);
}
.loader-ring {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent);
  animation: os-spin 0.9s linear infinite;
}
.loader-msg {
  font-size: 12px;
  letter-spacing: 0.18em;
  color: var(--text-dim);
  text-transform: uppercase;
}
.loader-bar {
  width: min(220px, 60%);
  height: 3px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
}
.loader-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #9d5dff);
  transition: width 120ms ease;
}

.resize {
  position: absolute;
  z-index: 2;
}
.resize.n { top: -3px; left: 8px; right: 8px; height: 6px; cursor: ns-resize; }
.resize.s { bottom: -3px; left: 8px; right: 8px; height: 6px; cursor: ns-resize; }
.resize.e { top: 8px; bottom: 8px; right: -3px; width: 6px; cursor: ew-resize; }
.resize.w { top: 8px; bottom: 8px; left: -3px; width: 6px; cursor: ew-resize; }
.resize.ne { top: -3px; right: -3px; width: 12px; height: 12px; cursor: nesw-resize; }
.resize.nw { top: -3px; left: -3px; width: 12px; height: 12px; cursor: nwse-resize; }
.resize.se { bottom: -3px; right: -3px; width: 12px; height: 12px; cursor: nwse-resize; }
.resize.sw { bottom: -3px; left: -3px; width: 12px; height: 12px; cursor: nesw-resize; }

@media (max-width: 720px) {
  .window {
    border-radius: 0;
    border: none;
  }
  .resize { display: none; }
}
</style>
