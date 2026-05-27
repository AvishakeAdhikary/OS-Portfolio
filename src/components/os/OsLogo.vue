<template>
  <svg viewBox="0 0 64 64" fill="none" :aria-label="label" :role="label ? 'img' : 'presentation'">
    <defs>
      <linearGradient :id="gradId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" :stop-color="from" />
        <stop offset="100%" :stop-color="to" />
      </linearGradient>
    </defs>
    <circle cx="22" cy="22" r="13" :fill="`url(#${gradId})`" opacity="0.95" />
    <circle cx="42" cy="22" r="13" :fill="`url(#${gradId})`" opacity="0.7" />
    <circle cx="32" cy="42" r="13" :fill="`url(#${gradId})`" opacity="0.85" />
    <circle cx="32" cy="30" r="6" fill="#fff" opacity="0.92" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

defineProps({
  from: { type: String, default: 'var(--accent)' },
  to: { type: String, default: '#9d5dff' },
  label: { type: String, default: '' },
});

let counter = 0;
const gradId = computed(() => `os-logo-grad-${++counter}-${Math.random().toString(36).slice(2, 7)}`);
</script>

<style scoped>
svg {
  display: block;
}
</style>
