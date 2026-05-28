<template>
  <div class="timeline">
    <div class="toolbar">
      <div class="title">My Journey</div>
      <div class="modes">
        <button type="button" :class="{ on: mode === 'vertical' }" @click="mode = 'vertical'">Vertical</button>
        <button type="button" :class="{ on: mode === 'horizontal' }" @click="mode = 'horizontal'">Horizontal</button>
      </div>
    </div>

    <!-- ── VERTICAL ─────────────────────────────────────────── -->
    <div v-if="mode === 'vertical'" class="v-track">
      <div class="v-rail"></div>
      <div
        v-for="(item, i) in items"
        :key="'v' + i"
        class="v-entry"
        :class="i % 2 === 0 ? 'v-right' : 'v-left'"
      >
        <!-- card side -->
        <div class="v-card-wrap">
          <div class="v-card card">
            <div class="card-year">{{ item.year }}</div>
            <div class="card-title">{{ item.title }}</div>
            <div class="card-sub">{{ item.subtitle }}</div>
            <p class="card-text">{{ item.detail }}</p>
            <div v-if="item.media" class="media">
              <img v-if="item.media.type === 'image'" :src="item.media.src" :alt="item.title" />
              <iframe v-else-if="item.media.type === 'video'" :src="item.media.src" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>
        </div>
        <!-- spine -->
        <div class="v-spine">
          <div class="dot"></div>
        </div>
        <!-- empty opposite -->
        <div class="v-spacer"></div>
      </div>
    </div>

    <!-- ── HORIZONTAL ───────────────────────────────────────── -->
    <div v-else class="h-track">
      <div class="h-scroll">
        <!-- The rail spans the full scroll width, pinned to the connector row -->
        <div class="h-rail"></div>
        <div
          v-for="(item, i) in items"
          :key="'h' + i"
          class="h-entry"
          :class="i % 2 === 0 ? 'h-top' : 'h-bottom'"
        >
          <!-- top half -->
          <div class="h-half top">
            <div v-if="i % 2 === 0" class="card h-card">
              <div class="card-year">{{ item.year }}</div>
              <div class="card-title">{{ item.title }}</div>
              <div class="card-sub">{{ item.subtitle }}</div>
              <p class="card-text">{{ item.detail }}</p>
              <div v-if="item.media" class="media">
                <img v-if="item.media.type === 'image'" :src="item.media.src" :alt="item.title" />
                <iframe v-else-if="item.media.type === 'video'" :src="item.media.src" frameborder="0" allowfullscreen></iframe>
              </div>
            </div>
          </div>
          <!-- connector -->
          <div class="h-connector">
            <div class="h-stem" :class="i % 2 === 0 ? 'stem-down' : 'stem-up'"></div>
            <div class="dot"></div>
          </div>
          <!-- bottom half -->
          <div class="h-half bottom">
            <div v-if="i % 2 !== 0" class="card h-card">
              <div class="card-year">{{ item.year }}</div>
              <div class="card-title">{{ item.title }}</div>
              <div class="card-sub">{{ item.subtitle }}</div>
              <p class="card-text">{{ item.detail }}</p>
              <div v-if="item.media" class="media">
                <img v-if="item.media.type === 'image'" :src="item.media.src" :alt="item.title" />
                <iframe v-else-if="item.media.type === 'video'" :src="item.media.src" frameborder="0" allowfullscreen></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import photo1 from '@/assets/timelinephotos/KV-Kolkata.png';
import photo2 from '@/assets/timelinephotos/KV2.jpg';
import photo3 from '@/assets/timelinephotos/KV1.jpg';
import photo4 from '@/assets/timelinephotos/KV1Grad.png';
import photo5 from '@/assets/timelinephotos/Amity_University,_Kolkata.jpg';
import photo6 from '@/assets/timelinephotos/Amity.jpg';
import photo7 from '@/assets/timelinephotos/Amiphoria.png';
import photo13 from '@/assets/photos/photo13.jpg';
import photo17 from '@/assets/photos/photo17.jpg';

const mode = ref('vertical');

const items = [
  { year: '2005', title: 'Kendriya Vidyalaya No.2, Salt Lake', subtitle: 'Primary School',
    detail: 'Started primary schooling at Kendriya Vidyalaya No.2, Salt Lake under the CBSE board.',
    media: { type: 'image', src: photo1 } },
  { year: '2011', title: 'Kendriya Vidyalaya No.2, Salt Lake', subtitle: 'Mid School',
    detail: 'Mid school years: Science, Maths, English, Hindi, P.E., History, Geography, Social Studies and Political Science.',
    media: { type: 'image', src: photo2 } },
  { year: '2016', title: 'Kendriya Vidyalaya No.1, Salt Lake', subtitle: 'High School',
    detail: 'Picked Computer Science as core subject and switched campuses.',
    media: { type: 'image', src: photo3 } },
  { year: '2018', title: 'Kendriya Vidyalaya No.1', subtitle: 'Graduated High School',
    detail: 'Wrapped up schooling and started looking for the right college.',
    media: { type: 'image', src: photo4 } },
  { year: '2018', title: 'Amity University Kolkata', subtitle: 'Bachelor of Computer Applications',
    detail: 'BCA with C/C++, Java, Python, DSA, image processing and mathematics.',
    media: { type: 'image', src: photo5 } },
  { year: '2018', title: "Fresher's Party", subtitle: 'VH1 × Engage',
    detail: "Got a fresher's party from VH1 and Engage featuring the Progressive Brothers.",
    media: { type: 'video', src: 'https://www.youtube.com/embed/OaCQOybf6DM' } },
  { year: '2020', title: 'Amiphoria 2020', subtitle: 'Live on stage with Loathe',
    detail: 'Performed Wonderful Life (BMTH) and Gustaakh (The Local Train) in front of the entire university.',
    media: { type: 'video', src: 'https://www.youtube.com/embed/3EmTaiHGMqk' } },
  { year: '2021', title: "Bachelor's Completed", subtitle: 'BCA, Amity University Kolkata',
    detail: 'Wrapped up undergraduate degree — memories for life.',
    media: { type: 'image', src: photo13 } },
  { year: '2021', title: 'Master of Computer Applications', subtitle: 'Amity University Kolkata',
    detail: 'MCA with Java, AI, DSA, computer graphics and machine learning.',
    media: { type: 'image', src: photo6 } },
  { year: '2022', title: 'Amiphoria 2022', subtitle: 'Volunteer',
    detail: 'Volunteered at the biggest event of the university.',
    media: { type: 'image', src: photo7 } },
  { year: '2023', title: "Master's Completed", subtitle: 'MCA, Amity University Kolkata',
    detail: "Finished master's degree and moved into the industry.",
    media: { type: 'image', src: photo17 } },
];
</script>

<style scoped>
/* ── shell ──────────────────────────────────────── */
.timeline {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-1);
  color: var(--text);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--glass-border);
  flex-shrink: 0;
}
.title {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.modes {
  display: flex;
  background: var(--bg-3);
  border: 1px solid var(--glass-border);
  border-radius: 100px;
  padding: 2px;
  gap: 2px;
}
.modes button {
  padding: 5px 14px;
  font-size: 11px;
  border-radius: 100px;
  color: var(--text-dim);
  transition: background 0.15s, color 0.15s;
}
.modes button.on { background: var(--accent); color: #fff; }

/* ── shared card ────────────────────────────────── */
.card {
  background: var(--bg-3);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 14px 16px;
  transition: border-color 0.18s;
}
.card:hover { border-color: var(--accent); }
.card-year {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--accent);
  margin-bottom: 4px;
}
.card-title { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
.card-sub { font-size: 12px; color: var(--text-dim); margin-bottom: 8px; }
.card-text { font-size: 12px; color: var(--text); margin: 0 0 8px; line-height: 1.6; }

.media img,
.media iframe {
  width: 100%;
  max-height: 160px;
  border-radius: 8px;
  display: block;
  background: var(--bg-0);
  border: 1px solid var(--glass-border);
}
.media iframe { aspect-ratio: 16/9; height: auto; max-height: none; }

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  border: 3px solid var(--bg-1);
  box-shadow: 0 0 0 2px var(--accent);
  flex-shrink: 0;
}

/* ── VERTICAL layout ────────────────────────────── */
.v-track {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding: 28px 24px;
}

/* The actual centre rail */
.v-rail {
  position: absolute;
  top: 28px;
  bottom: 28px;
  left: calc(50% - 1px);
  width: 2px;
  background: linear-gradient(180deg, transparent 0%, var(--accent) 8%, var(--accent) 92%, transparent 100%);
  pointer-events: none;
}

.v-entry {
  display: grid;
  /* left card | spine | right card — spine column is 40px wide */
  grid-template-columns: 1fr 40px 1fr;
  align-items: start;
  margin-bottom: 32px;
  gap: 0;
}

/* spine column: dot centred */
.v-spine {
  grid-column: 2;
  display: flex;
  justify-content: center;
  padding-top: 18px;
  position: relative;
  z-index: 1;
}

/* right-side entry: card goes into column 3, spacer into column 1 */
.v-right .v-card-wrap { grid-column: 3; grid-row: 1; padding-left: 16px; }
.v-right .v-spacer    { grid-column: 1; grid-row: 1; }
.v-right .v-spine     { grid-column: 2; grid-row: 1; }

/* left-side entry: card goes into column 1, spacer into column 3 */
.v-left .v-card-wrap  { grid-column: 1; grid-row: 1; padding-right: 16px; }
.v-left .v-spacer     { grid-column: 3; grid-row: 1; }
.v-left .v-spine      { grid-column: 2; grid-row: 1; }

/* ── HORIZONTAL layout ──────────────────────────── */
.h-track {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.h-scroll {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: stretch;
  padding: 0 32px;
  position: relative;
}

/* The horizontal rail — absolutely positioned, spans full scroll width */
.h-rail {
  position: absolute;
  /* sits in the connector row, which is 28px tall and placed at top 50% */
  top: calc(50% - 1px);
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--accent) 4%, var(--accent) 96%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}

.h-entry {
  flex: 0 0 260px;
  display: grid;
  grid-template-rows: 1fr 28px 1fr;  /* top half | connector row | bottom half */
  margin-right: 8px;
}

/* Top half: even entries get card on top */
.h-half.top {
  grid-row: 1;
  display: flex;
  align-items: flex-end;
  padding-bottom: 8px;
}
/* Bottom half: odd entries get card on bottom */
.h-half.bottom {
  grid-row: 3;
  display: flex;
  align-items: flex-start;
  padding-top: 8px;
}
.h-card { width: 100%; }

/* Connector row: the dot + stem */
.h-connector {
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.h-stem {
  position: absolute;
  width: 2px;
  background: var(--accent);
}
.h-stem.stem-down  { top: 50%; bottom: 0; }
.h-stem.stem-up    { top: 0;   bottom: 50%; }

@media (max-width: 720px) {
  .v-entry { grid-template-columns: 28px 1fr; }
  .v-rail  { left: 14px; }
  .v-right .v-card-wrap, .v-left .v-card-wrap {
    grid-column: 2; grid-row: 1; padding: 0 0 0 12px;
  }
  .v-right .v-spacer, .v-left .v-spacer { display: none; }
  .v-right .v-spine, .v-left .v-spine   { grid-column: 1; }
}
</style>
