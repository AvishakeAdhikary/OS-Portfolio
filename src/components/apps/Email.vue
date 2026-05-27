<template>
  <div class="email">
    <div class="email-shell">
      <header class="bar">
        <div class="dots"><i></i><i></i><i></i></div>
        <div class="title">New message</div>
        <div class="account">Avishake Adhikary</div>
      </header>

      <form class="form" @submit.prevent="send">
        <label class="field">
          <span>From</span>
          <input v-model="from" type="email" placeholder="your.email@example.com" required />
        </label>
        <label class="field">
          <span>To</span>
          <input v-model="to" type="email" readonly />
        </label>
        <label class="field">
          <span>Subject</span>
          <input v-model="subject" type="text" placeholder="Reaching out about…" required />
        </label>
        <label class="field body">
          <span>Body</span>
          <textarea v-model="body" rows="8" placeholder="Hi Avishake," required></textarea>
        </label>

        <div class="actions">
          <button type="button" class="ghost" @click="reset">Clear</button>
          <button type="submit" class="primary">Send via Mail App</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useOsStore } from '@/stores/os';

const osStore = useOsStore();

const from = ref('');
const to = ref('avhishe.adhikary11@gmail.com');
const subject = ref('');
const body = ref('');

function send() {
  const link = `mailto:${to.value}?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(body.value)}`;
  window.location.href = link;
  osStore.notify({
    title: 'Opening Mail',
    message: 'Your default email app should appear.',
  });
}

function reset() {
  from.value = '';
  subject.value = '';
  body.value = '';
}
</script>

<style scoped>
.email {
  height: 100%;
  display: grid;
  place-items: center;
  padding: 20px;
  background: linear-gradient(180deg, #0a0d1f, #050810);
}
.email-shell {
  width: 100%;
  max-width: 640px;
  background: var(--surface-strong);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 18px 50px rgba(0,0,0,0.45);
}
.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid var(--glass-border);
}
.dots { display: flex; gap: 6px; }
.dots i {
  width: 10px; height: 10px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
}
.title {
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.04em;
  flex: 1;
}
.account {
  font-size: 11px;
  color: var(--text-dim);
}

.form {
  padding: 18px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.field {
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid var(--glass-border);
}
.field span {
  font-size: 12px;
  color: var(--text-dim);
}
.field input,
.field textarea {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 13px;
  width: 100%;
  resize: none;
  padding: 4px 0;
}
.field input[readonly] { color: var(--text-dim); }
.field.body {
  grid-template-columns: 70px 1fr;
  align-items: start;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
}
.primary,
.ghost {
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 12px;
  letter-spacing: 0.05em;
  font-weight: 600;
  border: 1px solid var(--glass-border);
}
.primary { background: var(--accent); color: white; border-color: transparent; }
.primary:hover { background: var(--accent-strong); }
.ghost { background: transparent; color: var(--text-dim); }
.ghost:hover { background: rgba(255,255,255,0.05); color: var(--text); }
</style>
