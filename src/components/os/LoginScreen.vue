<template>
  <div class="login">
    <div class="login-bg" :style="{ backgroundImage: `url(${bg})` }"></div>
    <div class="login-veil"></div>

    <div class="login-card" :class="{ shake: shaking }">
      <img :src="avatar" alt="Avishake Adhikary" class="avatar" />
      <div class="user-name">Avishake Adhikary</div>
      <div class="user-handle">avishake@portfolio</div>

      <form class="login-form" @submit.prevent="submit">
        <div class="pin-row">
          <input
            v-for="i in 4"
            :key="i"
            class="pin"
            :class="{ filled: !!pin[i - 1] }"
            type="password"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="1"
            v-model="pin[i - 1]"
            :ref="(el) => setRef(el, i - 1)"
            @input="onInput(i - 1, $event)"
            @keydown.delete="onBackspace(i - 1, $event)"
            :disabled="checking"
            autocomplete="off"
          />
        </div>
        <div class="login-hint" :class="{ error: errored }">
          {{ hint }}
        </div>

        <div class="login-actions">
          <button type="submit" class="primary" :disabled="checking">
            <span v-if="!checking">Sign in</span>
            <span v-else class="spinner"></span>
          </button>
          <button type="button" class="ghost" :disabled="checking" @click="guest">
            Skip — Sign in as Guest
          </button>
        </div>
      </form>

      <div class="login-foot">
        <span>{{ time }}</span>
        <span class="dot">•</span>
        <span>{{ date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useOsStore } from '@/stores/os';
import bg from '@/assets/lockscreen.jpg';
import avatar from '@/assets/AvishakeAdhikaryDP.png';

const VALID_PIN = '2026';

const emit = defineEmits(['signin']);
const osStore = useOsStore();
const pin = reactive(['', '', '', '']);
const refs = [];
const checking = ref(false);
const errored = ref(false);
const shaking = ref(false);
const attempts = ref(0);

function setRef(el, i) {
  refs[i] = el;
}

function clearPin() {
  for (let i = 0; i < 4; i++) pin[i] = '';
  refs[0]?.focus();
}

function onInput(i, e) {
  errored.value = false;
  const v = (e.target.value || '').replace(/\D/g, '').slice(0, 1);
  pin[i] = v;
  e.target.value = v;
  if (v && i < 3) refs[i + 1]?.focus();
  if (i === 3 && v) submit();
}

function onBackspace(i, e) {
  if (!pin[i] && i > 0) {
    refs[i - 1]?.focus();
    pin[i - 1] = '';
    e.preventDefault();
  }
}

async function submit() {
  if (checking.value) return;
  const v = pin.join('');
  if (v.length < 4) {
    fail('Enter all 4 digits.');
    return;
  }
  checking.value = true;
  await new Promise((r) => setTimeout(r, 420));
  if (v === VALID_PIN) {
    osStore.signIn({ guest: false });
    emit('signin');
  } else {
    checking.value = false;
    attempts.value += 1;
    fail(`Wrong PIN. ${4 - attempts.value > 0 ? 'Try again or use Guest.' : 'Use Guest to enter.'}`);
    clearPin();
  }
}

function fail(msg) {
  errored.value = true;
  hintOverride.value = msg;
  shaking.value = true;
  setTimeout(() => (shaking.value = false), 500);
}

async function guest() {
  if (checking.value) return;
  checking.value = true;
  await new Promise((r) => setTimeout(r, 320));
  osStore.signIn({ guest: true });
  emit('signin');
}

const hintOverride = ref('');
const hint = computed(() => hintOverride.value || 'Enter PIN to sign in — try 2026, or click Skip for Guest');

const time = computed(() =>
  osStore.now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
);
const date = computed(() =>
  osStore.now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
);

onMounted(() => {
  refs[0]?.focus();
});
</script>

<style scoped>
.login {
  position: absolute;
  inset: 0;
  overflow: hidden;
  animation: os-fade-in 350ms ease;
}
.login-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(28px) brightness(0.45) saturate(1.1);
  transform: scale(1.06);
}
.login-veil {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 30%, rgba(108, 140, 255, 0.18), rgba(0, 0, 0, 0.5));
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: white;
}
.login-card.shake { animation: shake 0.4s ease; }
@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
  40%, 60% { transform: translate3d(6px, 0, 0); }
}

.avatar {
  width: 124px;
  height: 124px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.45), 0 0 0 4px rgba(255, 255, 255, 0.12);
  margin-bottom: 18px;
}

.user-name {
  font-size: 22px;
  letter-spacing: 0.02em;
  font-weight: 500;
}
.user-handle {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 22px;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.pin-row {
  display: flex;
  gap: 10px;
}
.pin {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 12px;
  outline: none;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}
.pin.filled { background: rgba(108, 140, 255, 0.25); }
.pin:focus {
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

.login-hint {
  font-size: 12px;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.65);
  height: 16px;
  text-align: center;
}
.login-hint.error {
  color: var(--danger);
}

.login-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin-top: 6px;
}
.primary,
.ghost {
  min-width: 180px;
  padding: 10px 18px;
  border-radius: 22px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: background 0.2s, transform 0.1s;
}
.primary {
  background: var(--accent);
  border-color: var(--accent);
}
.primary:hover { background: var(--accent-strong); }
.ghost { background: rgba(255, 255, 255, 0.05); }
.ghost:hover { background: rgba(255, 255, 255, 0.12); }
.primary:disabled,
.ghost:disabled { opacity: 0.6; cursor: progress; }

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: white;
  animation: os-spin 0.8s linear infinite;
}

.login-foot {
  position: absolute;
  bottom: 32px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  letter-spacing: 0.08em;
}
.dot { margin: 0 8px; }
</style>
