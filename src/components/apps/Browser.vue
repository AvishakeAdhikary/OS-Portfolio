<template>
  <div class="browser">
    <div class="bar">
      <div class="nav-btns">
        <button type="button" :disabled="historyIdx <= 0" @click="goBack" aria-label="Back">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <button type="button" :disabled="historyIdx >= history.length - 1" @click="goForward" aria-label="Forward">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <button type="button" @click="reload" aria-label="Reload">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4v6h6" stroke-linecap="round" stroke-linejoin="round" /><path d="M4 10a8 8 0 1 1 .72 3.4" stroke-linecap="round" /></svg>
        </button>
        <button type="button" @click="goHome" aria-label="Home" title="Google">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l9-9 9 9" stroke-linecap="round" stroke-linejoin="round" /><path d="M9 21V12h6v9" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
      </div>

      <form class="addr-form" @submit.prevent="go">
        <svg class="lock-icon" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="5" y="11" width="14" height="11" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        <input
          v-model="address"
          type="text"
          spellcheck="false"
          @focus="$event.target.select()"
          @keydown.enter="go"
        />
      </form>

      <div class="bookmarks">
        <button
          v-for="b in bookmarks"
          :key="b.url"
          type="button"
          class="bm"
          :class="{ on: currentUrl === b.url }"
          @click="goTo(b.url)"
          :title="b.label"
        >
{{ b.label }}
</button>
      </div>
    </div>

    <div class="frame-wrap">
      <!-- Loading bar -->
      <div v-if="loading" class="loading-bar"></div>

      <!-- Blocked / error state -->
      <div v-if="blocked" class="blocked">
        <div class="blocked-inner">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="12" cy="12" r="10" />
            <path d="M4.93 4.93l14.14 14.14" stroke-linecap="round" />
          </svg>
          <h3>Can't display this page</h3>
          <p>
            <strong>{{ blockedHost }}</strong> doesn't allow itself to be shown in a frame
            (X-Frame-Options / CSP frame-ancestors).
          </p>
          <div class="blocked-actions">
            <button type="button" class="btn-primary" @click="openExternal">
              Open in real browser
            </button>
            <button type="button" class="btn-ghost" @click="goHome">
              Go to Google
            </button>
          </div>
          <p class="blocked-tip">
            Most major sites (Google, GitHub, LinkedIn) block embedding for security reasons.
          </p>
        </div>
      </div>

      <!-- Iframe (hidden while blocked so it doesn't flash) -->
      <iframe
        v-show="!blocked"
        ref="frameEl"
        :src="currentUrl"
        :title="address"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        referrerpolicy="no-referrer"
        @load="onLoad"
        @error="onError"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

defineProps({
  url: { type: String, default: '' },
});

const HOME = 'https://www.google.com/webhp?igu=1';
const SEARCH_ENGINE = (q) => `https://www.google.com/search?igu=1&q=${encodeURIComponent(q)}`;

const bookmarks = [
  { label: 'Google', url: HOME },
  { label: 'Blog', url: 'https://avishakeadhikary.github.io/blog' },
  { label: 'Portfolio', url: 'https://avishakeadhikary.github.io' },
  { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Random' },
];

const address = ref(HOME);
const history = ref([HOME]);
const historyIdx = ref(0);
const currentUrl = ref(HOME);
const loading = ref(false);
const blocked = ref(false);
const frameEl = ref(null);

// Detect sites that block framing by checking if the iframe loads an empty document
// within a timeout — we can't read cross-origin content but we can detect stalls.
let blockTimer = null;

const blockedHost = computed(() => {
  try { return new URL(currentUrl.value).hostname; } catch { return currentUrl.value; }
});

function commit(url) {
  if (historyIdx.value < history.value.length - 1) {
    history.value.splice(historyIdx.value + 1);
  }
  history.value.push(url);
  historyIdx.value = history.value.length - 1;
  currentUrl.value = url;
  address.value = url;
  loading.value = true;
  blocked.value = false;
  clearTimeout(blockTimer);
  // If the iframe fires no load event in 8 s or fires a CSP/X-Frame error the
  // browser replaces content with chrome-error:// — detect by checking the
  // contentDocument href after a short settle time.
  blockTimer = setTimeout(detectBlock, 4000);
}

function detectBlock() {
  if (!frameEl.value) return;
  try {
    const href = frameEl.value.contentWindow?.location?.href;
    // Blocked iframes end up at about:blank or chrome-error://
    if (!href || href === 'about:blank' || href.startsWith('chrome-error')) {
      blocked.value = true;
      loading.value = false;
    }
  } catch {
    // cross-origin access throws — that means the page DID load successfully
  }
}

function go() {
  let v = address.value.trim();
  if (!v) return;
  if (!/^https?:\/\//i.test(v)) {
    v = v.includes('.') && !v.includes(' ')
      ? 'https://' + v
      : SEARCH_ENGINE(v);
  }
  commit(v);
}

function goTo(url) {
  commit(url);
}

function goHome() {
  commit(HOME);
}

function goBack() {
  if (historyIdx.value <= 0) return;
  historyIdx.value--;
  const url = history.value[historyIdx.value];
  address.value = url;
  currentUrl.value = url;
  blocked.value = false;
  loading.value = true;
  clearTimeout(blockTimer);
  blockTimer = setTimeout(detectBlock, 4000);
}

function goForward() {
  if (historyIdx.value >= history.value.length - 1) return;
  historyIdx.value++;
  const url = history.value[historyIdx.value];
  address.value = url;
  currentUrl.value = url;
  blocked.value = false;
  loading.value = true;
  clearTimeout(blockTimer);
  blockTimer = setTimeout(detectBlock, 4000);
}

function reload() {
  blocked.value = false;
  loading.value = true;
  clearTimeout(blockTimer);
  blockTimer = setTimeout(detectBlock, 4000);
  if (frameEl.value) {
    // Force reload by briefly blanking then restoring
    const url = currentUrl.value;
    frameEl.value.src = 'about:blank';
    setTimeout(() => {
      if (frameEl.value) frameEl.value.src = url;
    }, 50);
  }
}

function onLoad() {
  clearTimeout(blockTimer);
  loading.value = false;
  // check immediately after load event to catch chrome-error://
  setTimeout(detectBlock, 100);
}

function onError() {
  clearTimeout(blockTimer);
  loading.value = false;
  blocked.value = true;
}

function openExternal() {
  window.open(currentUrl.value, '_blank', 'noopener');
}
</script>

<style scoped>
.browser {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-2);
  color: var(--text);
}

/* ── toolbar ─────────────────────────────────── */
.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: var(--bg-3);
  border-bottom: 1px solid var(--glass-border);
  flex-shrink: 0;
}
.nav-btns {
  display: flex;
  gap: 2px;
}
.nav-btns button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  color: var(--text);
  transition: background 0.12s ease;
}
.nav-btns button:hover:not(:disabled) { background: var(--accent-soft); }
.nav-btns button:disabled { opacity: 0.25; cursor: not-allowed; }

.addr-form {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid var(--glass-border);
  border-radius: 100px;
  min-width: 0;
}
[data-theme='light'] .addr-form { background: rgba(0, 0, 0, 0.06); }
.lock-icon { opacity: 0.5; flex-shrink: 0; }
.addr-form input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 12px;
  min-width: 0;
}

.bookmarks {
  display: flex;
  gap: 3px;
  flex-wrap: nowrap;
  overflow-x: auto;
  max-width: 35%;
}
.bm {
  white-space: nowrap;
  padding: 5px 11px;
  border-radius: 100px;
  font-size: 11px;
  color: var(--text-dim);
  background: rgba(255, 255, 255, 0.04);
  transition: background 0.12s ease;
}
[data-theme='light'] .bm { background: rgba(0, 0, 0, 0.05); }
.bm:hover { background: var(--accent-soft); color: var(--text); }
.bm.on { background: var(--accent); color: white; }

/* ── frame area ─────────────────────────────── */
.frame-wrap {
  flex: 1;
  position: relative;
  background: white;
  overflow: hidden;
}
iframe {
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
  animation: loadbar 0.9s linear infinite;
  z-index: 2;
}
@keyframes loadbar {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

/* ── blocked state ──────────────────────────── */
.blocked {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--bg-2);
  z-index: 1;
  padding: 24px;
}
.blocked-inner {
  max-width: 480px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.blocked-inner svg { color: var(--danger); opacity: 0.8; }
.blocked-inner h3 { margin: 0; font-size: 18px; }
.blocked-inner p { margin: 0; font-size: 13px; color: var(--text-dim); line-height: 1.6; }
.blocked-tip { font-size: 11px !important; color: var(--text-faint) !important; }
.blocked-actions { display: flex; gap: 10px; }
.btn-primary {
  padding: 9px 20px;
  border-radius: 100px;
  background: var(--accent);
  color: white;
  font-size: 12px;
  font-weight: 600;
}
.btn-primary:hover { background: var(--accent-strong); }
.btn-ghost {
  padding: 9px 20px;
  border-radius: 100px;
  border: 1px solid var(--glass-border);
  font-size: 12px;
  color: var(--text-dim);
}
.btn-ghost:hover { background: var(--accent-soft); color: var(--text); }

@media (max-width: 720px) {
  .bookmarks { display: none; }
}
</style>
