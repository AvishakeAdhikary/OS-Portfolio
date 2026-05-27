<template>
  <div class="fe">
    <div class="fe-toolbar">
      <div class="nav">
        <button class="nav-btn" :disabled="historyIdx <= 0" @click="goBack" aria-label="Back">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button class="nav-btn" :disabled="historyIdx >= history.length - 1" @click="goForward" aria-label="Forward">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button class="nav-btn" :disabled="!pathSegments.length" @click="goUp" aria-label="Up">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 14l6-6 6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <div class="breadcrumb">
        <button class="crumb" @click="navigateTo([])">Computer</button>
        <template v-for="(seg, i) in pathSegments" :key="i">
          <span class="sep">›</span>
          <button class="crumb" @click="navigateTo(pathSegments.slice(0, i + 1))">{{ seg }}</button>
        </template>
      </div>
      <div class="search">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="M15 15l5 5" stroke-linecap="round" />
        </svg>
        <input v-model="filter" placeholder="Search current folder" />
      </div>
    </div>

    <div class="fe-body">
      <aside class="sidebar">
        <div class="side-label">Quick Access</div>
        <button class="side-btn" @click="navigateTo(['Local Disk (C:)', 'Users', 'Avishake', 'Desktop'])">
          <img :src="iconDesktop" alt="" /> Desktop
        </button>
        <button class="side-btn" @click="navigateTo(['Local Disk (C:)', 'Users', 'Avishake', 'Documents'])">
          <img :src="iconDocs" alt="" /> Documents
        </button>
        <button class="side-btn" @click="navigateTo(['Local Disk (C:)', 'Users', 'Avishake', 'Downloads'])">
          <img :src="iconDownloads" alt="" /> Downloads
        </button>
        <button class="side-btn" @click="navigateTo(['Local Disk (C:)', 'Users', 'Avishake', 'Pictures'])">
          <img :src="iconPictures" alt="" /> Pictures
        </button>
        <button class="side-btn" @click="navigateTo(['Local Disk (C:)', 'Users', 'Avishake', 'Music'])">
          <img :src="iconMusic" alt="" /> Music
        </button>

        <div class="side-label">Drives</div>
        <button
          v-for="drive in fsStore.drives"
          :key="drive.label"
          class="side-btn"
          @click="navigateTo([drive.name])"
        >
          <img :src="drive.icon" alt="" /> {{ drive.label }}
        </button>
      </aside>

      <div class="content">
        <template v-if="!current">
          <div class="empty">
            <div class="empty-icon">⚠️</div>
            <div>Path not found.</div>
            <button class="btn" @click="navigateTo([])">Back to Computer</button>
          </div>
        </template>
        <template v-else-if="current.type === 'root'">
          <div class="section-h">Drives</div>
          <div class="drives">
            <div
              v-for="drive in fsStore.drives"
              :key="drive.label"
              class="drive-card"
              @dblclick="navigateTo([drive.name])"
            >
              <img :src="drive.icon" alt="" />
              <div class="info">
                <div class="title">{{ drive.name }}</div>
                <div class="bar">
                  <div class="bar-fill" :style="{ width: `${pct(drive)}%` }"></div>
                </div>
                <div class="meta">{{ drive.freeSpace }} GB free of {{ drive.totalSpace }} GB</div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="current.type === 'file' && current.action?.kind === 'text'">
          <div class="file-view">
            <div class="file-header">
              <img :src="current.icon" />
              <h3>{{ current.name }}</h3>
            </div>
            <pre>{{ current.action.body }}</pre>
          </div>
        </template>
        <template v-else>
          <div class="grid" v-if="visibleChildren.length">
            <button
              v-for="(child, i) in visibleChildren"
              :key="child.name + i"
              class="item"
              @click.stop="selectedName = child.name"
              @dblclick.stop="openChild(child)"
              @touchend.stop="onItemTouch(child)"
              :class="{ selected: selectedName === child.name }"
            >
              <img :src="child.icon" alt="" />
              <span>{{ child.name }}</span>
            </button>
          </div>
          <div v-else class="empty">
            <div class="empty-icon">📂</div>
            <div>This folder is empty.</div>
          </div>
        </template>
      </div>
    </div>

    <div class="fe-status">
      <span>{{ statusText }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFsStore, FS_ICONS } from '@/stores/fs';
import { useWindowsStore } from '@/stores/windows';
import { useOsStore } from '@/stores/os';

const props = defineProps({
  initialPath: { type: Array, default: () => [] },
  window: { type: Object, default: null },
});

const fsStore = useFsStore();
const windowsStore = useWindowsStore();
const osStore = useOsStore();
const route = useRoute();
const router = useRouter();

const iconDesktop = FS_ICONS.desktop;
const iconDocs = FS_ICONS.documents;
const iconDownloads = FS_ICONS.downloads;
const iconPictures = FS_ICONS.pictures;
const iconMusic = FS_ICONS.music;

const pathSegments = ref([...props.initialPath]);
const history = ref([[...pathSegments.value]]);
const historyIdx = ref(0);
const filter = ref('');
const selectedName = ref(null);
const lastTap = ref(0);

const { node: currentNode } = fsStore.findByPath(pathSegments.value);
const current = ref(currentNode);

function refresh() {
  const r = fsStore.findByPath(pathSegments.value);
  current.value = r.node;
}

function navigateTo(segments) {
  pathSegments.value = segments;
  if (historyIdx.value < history.value.length - 1) {
    history.value.splice(historyIdx.value + 1);
  }
  history.value.push([...segments]);
  historyIdx.value = history.value.length - 1;
  refresh();
  syncRoute();
}

function goBack() {
  if (historyIdx.value <= 0) return;
  historyIdx.value -= 1;
  pathSegments.value = [...history.value[historyIdx.value]];
  refresh();
  syncRoute();
}

function goForward() {
  if (historyIdx.value >= history.value.length - 1) return;
  historyIdx.value += 1;
  pathSegments.value = [...history.value[historyIdx.value]];
  refresh();
  syncRoute();
}

function goUp() {
  if (!pathSegments.value.length) return;
  navigateTo(pathSegments.value.slice(0, -1));
}

function syncRoute() {
  router
    .replace({
      name: 'computer',
      params: { path: pathSegments.value },
    })
    .catch(() => {});
}

function openChild(child) {
  if (!child) return;
  if (child.type === 'folder' || child.type === 'drive') {
    navigateTo([...pathSegments.value, child.name]);
  } else if (child.type === 'shortcut' && child.action?.kind === 'openApp') {
    windowsStore.open(child.action.appId);
  } else if (child.type === 'file') {
    if (child.action?.kind === 'text') {
      navigateTo([...pathSegments.value, child.name]);
    } else if (child.action?.kind === 'link') {
      window.open(child.action.href, '_blank', 'noopener');
      osStore.notify({
        title: 'Link opened',
        message: child.action.href,
        icon: child.icon,
      });
    }
  }
}

function onItemTouch(child) {
  const now = Date.now();
  if (now - lastTap.value < 320 && selectedName.value === child.name) {
    openChild(child);
  } else {
    selectedName.value = child.name;
  }
  lastTap.value = now;
}

function pct(d) {
  return Math.round(((d.totalSpace - d.freeSpace) / d.totalSpace) * 100);
}

const visibleChildren = computed(() => {
  if (!current.value?.children) return [];
  const needle = filter.value.trim().toLowerCase();
  return current.value.children.filter((c) => !needle || c.name.toLowerCase().includes(needle));
});

const statusText = computed(() => {
  if (!current.value) return 'Path not found';
  if (current.value.type === 'drive') {
    return `${current.value.label} — ${current.value.freeSpace} GB free of ${current.value.totalSpace} GB`;
  }
  if (current.value.children) {
    return `${visibleChildren.value.length} item${visibleChildren.value.length === 1 ? '' : 's'}`;
  }
  return current.value.name;
});

onMounted(() => {
  if (route.name === 'computer' && route.params.path?.length && !props.initialPath.length) {
    pathSegments.value = route.params.path;
    history.value = [[...pathSegments.value]];
    historyIdx.value = 0;
    refresh();
  }
});

watch(
  () => route.params.path,
  (p) => {
    if (route.name !== 'computer') return;
    const next = p || [];
    if (JSON.stringify(next) !== JSON.stringify(pathSegments.value)) {
      pathSegments.value = [...next];
      refresh();
    }
  },
);
</script>

<style scoped>
.fe {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-2);
  color: var(--text);
}
.fe-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--bg-3);
  border-bottom: 1px solid var(--glass-border);
}
.nav {
  display: flex;
  gap: 4px;
}
.nav-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  color: var(--text);
  transition: background 0.15s ease;
}
.nav-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
.nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.breadcrumb {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(0,0,0,0.25);
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  padding: 4px 8px;
  overflow: hidden;
  font-size: 12px;
}
.crumb {
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text-dim);
  transition: background 0.15s ease, color 0.15s ease;
  white-space: nowrap;
}
.crumb:hover { background: var(--accent-soft); color: var(--text); }
.sep {
  color: var(--text-faint);
  font-size: 12px;
}

.search {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.25);
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  padding: 4px 8px;
  width: 200px;
  color: var(--text-dim);
}
.search input {
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  color: var(--text);
  font-size: 12px;
}

.fe-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.sidebar {
  width: 200px;
  border-right: 1px solid var(--glass-border);
  padding: 12px 8px;
  overflow: auto;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
}
.side-label {
  margin: 12px 8px 6px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.side-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--text);
  text-align: left;
  transition: background 0.15s ease;
}
.side-btn img { width: 18px; height: 18px; }
.side-btn:hover { background: var(--accent-soft); }

.content {
  flex: 1;
  padding: 14px;
  overflow: auto;
}
.section-h {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 12px;
}

.drives {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}
.drive-card {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.drive-card:hover {
  background: rgba(255,255,255,0.07);
  border-color: var(--accent);
}
.drive-card img { width: 48px; height: 48px; }
.drive-card .info { flex: 1; }
.drive-card .title { font-weight: 600; margin-bottom: 8px; }
.drive-card .bar {
  height: 6px;
  background: rgba(255,255,255,0.08);
  border-radius: 100px;
  overflow: hidden;
}
.drive-card .bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #9d5dff);
}
.drive-card .meta {
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-dim);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 4px;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 6px;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  color: var(--text);
  transition: background 0.12s ease, transform 0.12s ease;
}
.item img { width: 40px; height: 40px; }
.item span {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.item:hover { background: rgba(255,255,255,0.06); }
.item.selected {
  background: var(--accent-soft);
  outline: 1px solid rgba(108,140,255,0.4);
}

.file-view {
  padding: 12px;
}
.file-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.file-header img { width: 28px; height: 28px; }
pre {
  background: rgba(0,0,0,0.35);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 14px;
  font-family: 'Cascadia Mono', 'JetBrains Mono', Consolas, monospace;
  font-size: 12px;
  white-space: pre-wrap;
  user-select: text;
}

.empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-dim);
}
.empty-icon { font-size: 36px; }
.btn {
  margin-top: 6px;
  padding: 6px 14px;
  border-radius: 100px;
  background: var(--accent);
  color: white;
  font-size: 12px;
}

.fe-status {
  height: 26px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  font-size: 11px;
  color: var(--text-dim);
  background: var(--bg-3);
  border-top: 1px solid var(--glass-border);
}

@media (max-width: 720px) {
  .sidebar { display: none; }
  .search { width: 120px; }
}
</style>
