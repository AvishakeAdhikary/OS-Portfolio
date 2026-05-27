<template>
  <div class="spotlight-backdrop" @mousedown.self="close" @click.self="close">
    <div class="spotlight glass" @click.stop @mousedown.stop>
      <div class="search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15 15l5 5" stroke-linecap="round" />
        </svg>
        <input
          ref="inputEl"
          v-model="q"
          type="text"
          spellcheck="false"
          autocomplete="off"
          placeholder="Spotlight Search"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="runActive"
          @keydown.escape="close"
        />
        <span class="kbd">Esc</span>
      </div>

      <div v-if="results.length" class="results">
        <button
          v-for="(r, i) in results"
          :key="r.key"
          class="row"
          :class="{ active: i === active }"
          @mouseenter="active = i"
          @click="runIndex(i)"
        >
          <img v-if="r.icon" :src="r.icon" alt="" class="row-icon" />
          <div v-else class="row-glyph">{{ r.glyph || '◎' }}</div>
          <div class="row-text">
            <div class="row-title">{{ r.title }}</div>
            <div class="row-sub">{{ r.subtitle }}</div>
          </div>
          <span class="row-kind">{{ r.kind }}</span>
        </button>
      </div>
      <div v-else-if="q.trim()" class="empty">
        No results for &ldquo;{{ q }}&rdquo;
      </div>
      <div v-else class="hints">
        <div class="hint-title">Try searching for</div>
        <div class="hint-chips">
          <button class="chip" v-for="s in suggestions" :key="s" @click="q = s">{{ s }}</button>
        </div>
        <div class="kb">
          <span><kbd>↑↓</kbd> Move</span>
          <span><kbd>Return</kbd> Open</span>
          <span><kbd>Esc</kbd> Dismiss</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useOsStore } from '@/stores/os';
import { useWindowsStore } from '@/stores/windows';
import { useFsStore } from '@/stores/fs';
import { appRegistry } from '@/apps/registry';

const osStore = useOsStore();
const windowsStore = useWindowsStore();
const fsStore = useFsStore();

const inputEl = ref(null);
const q = ref('');
const active = ref(0);

const suggestions = ['Resume', 'Music Player', 'Photos', 'Terminal', 'Github', 'Settings'];

function walk(node, trail, acc) {
  if (!node) return;
  if (node.children) {
    for (const c of node.children) {
      acc.push({ node: c, trail: [...trail, c.name] });
      walk(c, [...trail, c.name], acc);
    }
  }
}

const allFsItems = computed(() => {
  const out = [];
  walk(fsStore.tree, [], out);
  return out;
});

const results = computed(() => {
  const needle = q.value.trim().toLowerCase();
  if (!needle) return [];
  const out = [];

  for (const a of Object.values(appRegistry)) {
    const score = scoreMatch(a.name.toLowerCase(), needle) + scoreMatch(a.id.toLowerCase(), needle) * 0.5;
    if (score > 0) {
      out.push({
        key: 'app:' + a.id,
        title: a.name,
        subtitle: 'Application',
        kind: 'App',
        icon: a.icon,
        score,
        run: () => windowsStore.open(a.id),
      });
    }
  }

  for (const entry of allFsItems.value) {
    const score = scoreMatch(entry.node.name.toLowerCase(), needle);
    if (score > 0) {
      out.push({
        key: 'fs:' + entry.trail.join('/'),
        title: entry.node.name,
        subtitle: '/' + entry.trail.slice(0, -1).join('/'),
        kind: entry.node.type === 'folder' || entry.node.type === 'drive' ? 'Folder' : entry.node.type === 'shortcut' ? 'Shortcut' : 'File',
        icon: entry.node.icon,
        score: score * 0.85,
        run: () => {
          if (entry.node.type === 'folder' || entry.node.type === 'drive') {
            windowsStore.open('fileExplorer', { props: { initialPath: entry.trail } });
          } else if (entry.node.type === 'shortcut' && entry.node.action?.kind === 'openApp') {
            windowsStore.open(entry.node.action.appId);
          } else if (entry.node.action?.kind === 'link') {
            window.open(entry.node.action.href, '_blank', 'noopener');
          } else {
            windowsStore.open('fileExplorer', { props: { initialPath: entry.trail } });
          }
        },
      });
    }
  }

  const systemCmds = [
    { name: 'Sign out', kind: 'System', glyph: '⏻', action: () => osStore.signOut() },
    { name: 'Lock screen', kind: 'System', glyph: '🔒', action: () => osStore.setPhase('lock') },
    { name: 'About this PC', kind: 'System', glyph: 'ℹ', action: () => windowsStore.open('about') },
    { name: 'Settings', kind: 'System', glyph: '⚙', action: () => windowsStore.open('settings') },
    { name: 'Personalization', kind: 'System', glyph: '🎨', action: () => windowsStore.open('settings', { props: { initialTab: 'personalization' } }) },
  ];
  for (const c of systemCmds) {
    const score = scoreMatch(c.name.toLowerCase(), needle);
    if (score > 0) {
      out.push({
        key: 'sys:' + c.name,
        title: c.name,
        subtitle: 'System command',
        kind: c.kind,
        glyph: c.glyph,
        score: score * 0.95,
        run: c.action,
      });
    }
  }

  if (needle.length > 1) {
    out.push({
      key: 'web:' + needle,
      title: `Search the web for “${q.value}”`,
      subtitle: 'duckduckgo.com',
      kind: 'Web',
      icon: appRegistry.browser.icon,
      score: 0.1,
      run: () => {
        windowsStore.open('browser', {
          props: { url: `https://duckduckgo.com/?q=${encodeURIComponent(q.value)}` },
        });
      },
    });
  }

  return out
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
});

function scoreMatch(haystack, needle) {
  if (!haystack) return 0;
  if (haystack === needle) return 100;
  if (haystack.startsWith(needle)) return 80;
  if (haystack.includes(needle)) return 50;
  let i = 0;
  for (const c of needle) {
    const found = haystack.indexOf(c, i);
    if (found === -1) return 0;
    i = found + 1;
  }
  return 20;
}

function move(delta) {
  if (!results.value.length) return;
  active.value = (active.value + delta + results.value.length) % results.value.length;
}

function runIndex(i) {
  const r = results.value[i];
  if (!r) return;
  r.run();
  close();
}
function runActive() {
  runIndex(active.value);
}

function close() {
  osStore.toggleSpotlight(false);
}

watch(q, () => { active.value = 0; });

onMounted(() => {
  nextTick(() => inputEl.value?.focus());
});

onBeforeUnmount(() => {
  q.value = '';
});
</script>

<style scoped>
.spotlight-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 14vh;
  z-index: 50000;
  animation: os-fade-in 140ms ease;
}
.spotlight {
  width: min(640px, 92vw);
  border-radius: 14px;
  overflow: hidden;
  background: var(--surface-strong);
  border: 1px solid var(--glass-border-strong);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.55);
  animation: os-scale-in 140ms ease;
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--glass-border);
  color: var(--text-dim);
}
.search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 18px;
}
.kbd {
  font-size: 10px;
  padding: 3px 6px;
  border-radius: 4px;
  border: 1px solid var(--glass-border);
  color: var(--text-faint);
}

.results {
  max-height: 50vh;
  overflow: auto;
  padding: 6px;
}
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--text);
  text-align: left;
  transition: background 0.12s ease;
}
.row.active,
.row:hover { background: var(--accent-soft); }
.row-icon { width: 28px; height: 28px; }
.row-glyph {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  font-size: 16px;
  color: var(--text-dim);
}
.row-text { flex: 1; min-width: 0; }
.row-title {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.row-sub {
  font-size: 11px;
  color: var(--text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.row-kind {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.empty {
  padding: 28px 14px;
  text-align: center;
  color: var(--text-faint);
  font-size: 13px;
}

.hints {
  padding: 14px 18px 18px;
}
.hint-title {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 8px;
}
.hint-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  color: var(--text-dim);
}
.chip:hover {
  background: var(--accent);
  color: white;
  border-color: transparent;
}
.kb {
  display: flex;
  gap: 14px;
  margin-top: 12px;
  font-size: 11px;
  color: var(--text-faint);
}
kbd {
  font-family: inherit;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--glass-border);
  margin-right: 6px;
}
</style>
