<template>
  <div class="term" @click="focusInput">
    <div class="lines" ref="linesEl">
      <div v-for="(line, i) in lines" :key="i" class="line" :class="line.kind">
        <pre v-if="line.kind === 'output'">{{ line.text }}</pre>
        <span v-else><span class="prompt">{{ prompt }}</span>{{ line.text }}</span>
      </div>
      <div class="line current">
        <span class="prompt">{{ prompt }}</span>
        <input
          ref="inputEl"
          v-model="input"
          @keydown.enter="submit"
          @keydown.up.prevent="historyUp"
          @keydown.down.prevent="historyDown"
          @keydown.tab.prevent="autocomplete"
          autocomplete="off"
          spellcheck="false"
        />
        <span class="caret"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useWindowsStore } from '@/stores/windows';
import { useOsStore } from '@/stores/os';
import { useFsStore } from '@/stores/fs';
import { appRegistry } from '@/apps/registry';

const windowsStore = useWindowsStore();
const osStore = useOsStore();
const fsStore = useFsStore();

const cwd = ref(['Local Disk (C:)', 'Users', 'Avishake']);
const lines = ref([]);
const input = ref('');
const inputEl = ref(null);
const linesEl = ref(null);
const cmdHistory = ref([]);
const historyIdx = ref(-1);

const prompt = computed(() => `avishake@portfolio ~ ${cwd.value.slice(-1)[0] || '/'}> `);

const banner = `Avishake OS Terminal · v1.0
Type "help" to see available commands.`;

const commands = {
  help() {
    return `Available commands:
  help              Show this message
  about             Open the About app
  ls                List items in current folder
  cd <name>         Change folder (".." goes up, "/" to root)
  pwd               Print current path
  cat <file>        Print contents of a text file
  open <app|file>   Open an app or shortcut (e.g. "open musicPlayer")
  apps              List apps
  whoami            Identity
  date              Current date/time
  echo <text>       Print text
  clear             Clear the screen
  neofetch          Show system info
  social            Print social links
  exit              Close terminal`;
  },
  about() {
    windowsStore.open('about');
    return 'Opening About…';
  },
  pwd() {
    return '/' + cwd.value.join('/');
  },
  ls() {
    const node = currentNode();
    if (!node || !node.children) return 'Not a folder.';
    return node.children.map((c) => {
      const tag = c.type === 'folder' || c.type === 'drive' ? '📁' : c.type === 'shortcut' ? '🔗' : '📄';
      return `  ${tag} ${c.name}`;
    }).join('\n');
  },
  cd(arg) {
    if (!arg) return 'Usage: cd <name>';
    if (arg === '/') {
      cwd.value = [];
      return '';
    }
    if (arg === '..') {
      cwd.value = cwd.value.slice(0, -1);
      return '';
    }
    const node = currentNode();
    const child = node?.children?.find((c) => c.name === arg);
    if (!child || (child.type !== 'folder' && child.type !== 'drive')) {
      return `cd: ${arg}: No such directory`;
    }
    cwd.value = [...cwd.value, child.name];
    return '';
  },
  cat(arg) {
    if (!arg) return 'Usage: cat <file>';
    const node = currentNode();
    const child = node?.children?.find((c) => c.name === arg);
    if (!child) return `cat: ${arg}: not found`;
    if (child.action?.kind === 'text') return child.action.body;
    if (child.action?.kind === 'link') return `→ ${child.action.href}`;
    return `cat: ${arg}: binary or unsupported`;
  },
  open(arg) {
    if (!arg) return 'Usage: open <appId>';
    if (appRegistry[arg]) {
      windowsStore.open(arg);
      return `Opening ${appRegistry[arg].name}…`;
    }
    const node = currentNode();
    const child = node?.children?.find((c) => c.name === arg);
    if (child?.type === 'shortcut' && child.action?.kind === 'openApp') {
      windowsStore.open(child.action.appId);
      return `Opening ${appRegistry[child.action.appId]?.name ?? child.action.appId}…`;
    }
    return `open: ${arg}: not found`;
  },
  apps() {
    return Object.values(appRegistry).map((a) => `  ${a.id.padEnd(16)}  ${a.name}`).join('\n');
  },
  whoami() {
    return 'Avishake Adhikary · Full‑Stack Developer · ML Engineer';
  },
  date() {
    return new Date().toString();
  },
  echo(arg) {
    return arg ?? '';
  },
  clear() {
    lines.value = [];
    return null;
  },
  social() {
    return `  GitHub    : https://github.com/AvishakeAdhikary
  LinkedIn  : https://www.linkedin.com/in/avishakeadhikary/
  Twitter   : https://twitter.com/Avhishek007
  YouTube   : https://www.youtube.com/@avishakeadhikary
  Email     : avhishe.adhikary11@gmail.com`;
  },
  neofetch() {
    const ua = navigator.userAgent;
    return `       ┌──────────────┐    avishake@portfolio
       │  Avishake OS │    -----------------
       │      v1.0    │    OS:       Portfolio Edition
       └──────────────┘    Shell:     vsh 1.0
                            CPU:       ${navigator.hardwareConcurrency || '?'} cores
                            Memory:    ${navigator.deviceMemory ? navigator.deviceMemory + ' GB' : '—'}
                            Display:   ${window.innerWidth}×${window.innerHeight}
                            Renderer:  ${ua.split(') ')[0].split('(').slice(-1)[0] || 'web'}
                            Uptime:    ${Math.round(performance.now() / 1000)}s`;
  },
  exit() {
    osStore.notify({ title: 'Terminal closed', message: 'See you soon!' });
    const id = windowsStore.focusedId;
    if (id) windowsStore.close(id);
    return null;
  },
};

function currentNode() {
  return fsStore.findByPath(cwd.value).node;
}

function autocomplete() {
  const text = input.value;
  const parts = text.split(' ');
  if (parts.length === 1) {
    const match = Object.keys(commands).filter((k) => k.startsWith(parts[0]));
    if (match.length === 1) input.value = match[0] + ' ';
    return;
  }
  const node = currentNode();
  if (!node?.children) return;
  const prefix = parts[parts.length - 1];
  const matches = node.children.filter((c) => c.name.toLowerCase().startsWith(prefix.toLowerCase()));
  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0].name;
    input.value = parts.join(' ');
  }
}

function focusInput() {
  inputEl.value?.focus();
}

function submit() {
  const raw = input.value.trim();
  lines.value.push({ kind: 'input', text: raw });
  if (raw) cmdHistory.value.unshift(raw);
  historyIdx.value = -1;

  if (raw) {
    const [name, ...rest] = raw.split(/\s+/);
    const fn = commands[name];
    if (fn) {
      const out = fn(rest.join(' '));
      if (out !== null && out !== undefined) lines.value.push({ kind: 'output', text: out });
    } else {
      lines.value.push({ kind: 'output', text: `${name}: command not found. Type "help".` });
    }
  }

  input.value = '';
  nextTick(() => {
    if (linesEl.value) linesEl.value.scrollTop = linesEl.value.scrollHeight;
  });
}

function historyUp() {
  if (historyIdx.value < cmdHistory.value.length - 1) {
    historyIdx.value++;
    input.value = cmdHistory.value[historyIdx.value];
  }
}
function historyDown() {
  if (historyIdx.value > 0) {
    historyIdx.value--;
    input.value = cmdHistory.value[historyIdx.value];
  } else {
    historyIdx.value = -1;
    input.value = '';
  }
}

onMounted(() => {
  lines.value.push({ kind: 'output', text: banner });
  focusInput();
});
</script>

<style scoped>
.term {
  height: 100%;
  background: #06070d;
  color: #c8d6ff;
  font-family: 'Cascadia Mono', 'JetBrains Mono', Consolas, 'Courier New', monospace;
  font-size: 13px;
  padding: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.lines {
  flex: 1;
  overflow: auto;
  white-space: pre-wrap;
  line-height: 1.5;
  user-select: text;
}
.line { display: block; }
.line.input { color: #f1f3ff; }
.line.output pre {
  margin: 0;
  white-space: pre-wrap;
  color: #b8c2e0;
  font: inherit;
}
.prompt {
  color: var(--accent);
  margin-right: 4px;
}
.current {
  display: flex;
  align-items: center;
}
.current input {
  background: transparent;
  border: none;
  outline: none;
  flex: 1;
  color: #f1f3ff;
  font: inherit;
  caret-color: transparent;
}
.caret {
  display: inline-block;
  width: 7px;
  height: 14px;
  background: var(--accent);
  animation: blink 1s steps(2) infinite;
  vertical-align: middle;
  margin-left: -2px;
}
@keyframes blink {
  to { opacity: 0; }
}
</style>
