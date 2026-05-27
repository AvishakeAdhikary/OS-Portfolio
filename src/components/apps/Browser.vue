<template>
  <div class="browser">
    <div class="bar">
      <div class="nav-btns">
        <button :disabled="historyIdx <= 0" @click="goBack" aria-label="Back">‹</button>
        <button :disabled="historyIdx >= history.length - 1" @click="goForward" aria-label="Forward">›</button>
        <button @click="reload" aria-label="Reload">⟳</button>
      </div>
      <form class="addr-form" @submit.prevent="go">
        <span class="lock">🔒</span>
        <input
          v-model="address"
          type="text"
          spellcheck="false"
          @focus="$event.target.select()"
        />
      </form>
      <div class="tabs">
        <button
          v-for="b in bookmarks"
          :key="b.url"
          class="bm"
          :class="{ on: address === b.url }"
          @click="goTo(b.url)"
          :title="b.url"
        >
          {{ b.label }}
        </button>
      </div>
    </div>

    <div class="frame">
      <div v-if="loading" class="loading-bar"></div>
      <iframe
        ref="frameEl"
        :src="currentUrl"
        :title="address"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerpolicy="no-referrer"
        @load="onLoad"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  url: { type: String, default: 'https://duckduckgo.com/?q=Avishake+Adhikary' },
});

const bookmarks = [
  { label: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=Avishake+Adhikary' },
  { label: 'GitHub', url: 'https://github.com/AvishakeAdhikary' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/avishakeadhikary/' },
  { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Random' },
];

const address = ref(props.url);
const history = ref([props.url]);
const historyIdx = ref(0);
const currentUrl = ref(props.url);
const loading = ref(false);
const frameEl = ref(null);

function commit(url) {
  if (historyIdx.value < history.value.length - 1) {
    history.value.splice(historyIdx.value + 1);
  }
  history.value.push(url);
  historyIdx.value = history.value.length - 1;
  currentUrl.value = url;
  loading.value = true;
}

function go() {
  let v = address.value.trim();
  if (!v) return;
  if (!/^https?:\/\//i.test(v)) {
    if (v.includes('.') && !v.includes(' ')) v = 'https://' + v;
    else v = 'https://duckduckgo.com/?q=' + encodeURIComponent(v);
  }
  address.value = v;
  commit(v);
}

function goTo(url) {
  address.value = url;
  commit(url);
}

function goBack() {
  if (historyIdx.value <= 0) return;
  historyIdx.value -= 1;
  address.value = history.value[historyIdx.value];
  currentUrl.value = address.value;
  loading.value = true;
}

function goForward() {
  if (historyIdx.value >= history.value.length - 1) return;
  historyIdx.value += 1;
  address.value = history.value[historyIdx.value];
  currentUrl.value = address.value;
  loading.value = true;
}

function reload() {
  if (!frameEl.value) return;
  loading.value = true;
  frameEl.value.src = currentUrl.value + (currentUrl.value.includes('#') ? '' : '#r' + Date.now());
}

function onLoad() {
  loading.value = false;
}
</script>

<style scoped>
.browser {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-2);
}
.bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--bg-3);
  border-bottom: 1px solid var(--glass-border);
}
.nav-btns {
  display: flex;
  gap: 4px;
}
.nav-btns button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--text);
  font-size: 16px;
  display: grid;
  place-items: center;
  transition: background 0.15s ease;
}
.nav-btns button:hover:not(:disabled) { background: rgba(255,255,255,0.08); }
.nav-btns button:disabled { opacity: 0.25; cursor: not-allowed; }

.addr-form {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(0,0,0,0.25);
  border: 1px solid var(--glass-border);
  border-radius: 100px;
}
.lock { font-size: 11px; opacity: 0.6; }
.addr-form input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 12px;
}

.tabs {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
  overflow-x: auto;
  max-width: 40%;
}
.bm {
  white-space: nowrap;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 11px;
  color: var(--text-dim);
  background: rgba(255,255,255,0.04);
  transition: background 0.15s ease;
}
.bm:hover { background: rgba(255,255,255,0.1); color: var(--text); }
.bm.on { background: var(--accent); color: white; }

.frame {
  flex: 1;
  position: relative;
  background: white;
}
.frame iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
.loading-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  background-size: 200% 100%;
  animation: load 0.9s linear infinite;
  z-index: 1;
}
@keyframes load {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

@media (max-width: 720px) {
  .tabs { display: none; }
}
</style>
