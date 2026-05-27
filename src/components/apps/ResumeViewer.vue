<template>
  <div class="resume">
    <div class="bar">
      <div class="info">
        <strong>Avishake_Adhikary_Resume.pdf</strong>
        <span>PDF · 1 page</span>
      </div>
      <div class="actions">
        <a class="btn" :href="pdf" target="_blank" rel="noopener">Open in new tab</a>
        <a class="btn primary" :href="pdf" download>Download</a>
      </div>
    </div>
    <iframe :src="pdf" class="frame" title="Resume"></iframe>
  </div>
</template>

<script setup>
import pdf from '@/assets/Avishake_Adhikary_Resume.pdf';
</script>

<style scoped>
.resume {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-2);
}
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid var(--glass-border);
  background: var(--bg-3);
}
.info { display: flex; flex-direction: column; }
.info strong { font-size: 13px; }
.info span { font-size: 11px; color: var(--text-dim); }
.actions { display: flex; gap: 8px; }
.btn {
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 12px;
  text-decoration: none;
  color: var(--text);
  background: rgba(255,255,255,0.06);
}
.btn.primary { background: var(--accent); color: white; }
.btn.primary:hover { background: var(--accent-strong); }
.frame {
  flex: 1;
  border: none;
  background: #525659;
}
</style>
