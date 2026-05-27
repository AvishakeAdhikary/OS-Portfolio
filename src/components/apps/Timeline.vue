<template>
  <div class="timeline">
    <div class="toolbar">
      <div class="title">My Journey</div>
      <div class="modes">
        <button :class="{ on: mode === 'horizontal' }" @click="mode = 'horizontal'">Horizontal</button>
        <button :class="{ on: mode === 'vertical' }" @click="mode = 'vertical'">Vertical</button>
      </div>
    </div>

    <div class="track" :class="mode">
      <div class="rail"></div>
      <div
        v-for="(item, i) in items"
        :key="i"
        class="entry"
        :class="{ left: mode === 'vertical' && i % 2 === 0 }"
      >
        <div class="dot"></div>
        <div class="year">{{ item.year }}</div>
        <div class="card">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-sub">{{ item.subtitle }}</div>
          <p class="card-text">{{ item.detail }}</p>
          <div v-if="item.media" class="media">
            <img v-if="item.media.type === 'image'" :src="item.media.src" :alt="item.title" />
            <iframe
              v-else-if="item.media.type === 'video'"
              :src="item.media.src"
              frameborder="0"
              allowfullscreen
            ></iframe>
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
  {
    year: '2005',
    title: 'Kendriya Vidyalaya No.2, Salt Lake',
    subtitle: 'Primary School',
    detail:
      'Started primary schooling at Kendriya Vidyalaya No.2, Salt Lake under the CBSE board.',
    media: { type: 'image', src: photo1 },
  },
  {
    year: '2011',
    title: 'Kendriya Vidyalaya No.2, Salt Lake',
    subtitle: 'Mid School',
    detail:
      'Mid school years studying Science, Maths, English, Hindi, P.E., History, Geography, Social Studies and Political Science.',
    media: { type: 'image', src: photo2 },
  },
  {
    year: '2016',
    title: 'Kendriya Vidyalaya No.1, Salt Lake',
    subtitle: 'High School',
    detail:
      'Picked Computer Science as the core subject and switched campuses for high school.',
    media: { type: 'image', src: photo3 },
  },
  {
    year: '2018',
    title: 'Kendriya Vidyalaya No.1, Salt Lake',
    subtitle: 'Graduated High School',
    detail: 'Wrapped up schooling and started looking for the right college.',
    media: { type: 'image', src: photo4 },
  },
  {
    year: '2018',
    title: 'Amity University Kolkata',
    subtitle: 'Bachelor of Computer Applications',
    detail:
      'Joined BCA at Amity University Kolkata with C/C++, Java, Python, DSA, image processing and mathematics in the core curriculum.',
    media: { type: 'image', src: photo5 },
  },
  {
    year: '2018',
    title: 'Fresher\'s Party',
    subtitle: 'VH1 × Engage',
    detail: 'Got a fresher\'s party from VH1 and Engage featuring the Progressive Brothers — what a blast.',
    media: { type: 'video', src: 'https://www.youtube.com/embed/OaCQOybf6DM' },
  },
  {
    year: '2020',
    title: 'Amiphoria 2020',
    subtitle: 'Live on stage with Loathe',
    detail:
      'Performed Wonderful Life by Bring Me The Horizon and Gustaakh by The Local Train in front of the entire university — huge response.',
    media: { type: 'video', src: 'https://www.youtube.com/embed/3EmTaiHGMqk' },
  },
  {
    year: '2021',
    title: 'Bachelor\'s Completed',
    subtitle: 'BCA, Amity University Kolkata',
    detail: 'Wrapped up my undergraduate degree with memories that will last a lifetime.',
    media: { type: 'image', src: photo13 },
  },
  {
    year: '2021',
    title: 'Master of Computer Applications',
    subtitle: 'Amity University Kolkata',
    detail:
      'Started MCA with Java, AI, DSA, computer graphics and machine learning as the core subjects.',
    media: { type: 'image', src: photo6 },
  },
  {
    year: '2022',
    title: 'Amiphoria 2022',
    subtitle: 'Volunteer',
    detail: 'Volunteered at the biggest event of the university — an unforgettable experience.',
    media: { type: 'image', src: photo7 },
  },
  {
    year: '2023',
    title: 'Master\'s Completed',
    subtitle: 'MCA, Amity University Kolkata',
    detail: 'Finished my master\'s degree and moved into the industry.',
    media: { type: 'image', src: photo17 },
  },
];
</script>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg, #0a0d1f, #06080f);
  color: var(--text);
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--glass-border);
}
.title {
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-dim);
}
.modes {
  display: flex;
  background: rgba(255,255,255,0.04);
  border-radius: 100px;
  padding: 2px;
}
.modes button {
  padding: 4px 12px;
  font-size: 11px;
  border-radius: 100px;
  color: var(--text-dim);
}
.modes button.on {
  background: var(--accent);
  color: white;
}

.track {
  flex: 1;
  overflow: auto;
  position: relative;
  padding: 24px;
}

.track.vertical {
  --rail-x: 50%;
}
.track.vertical .rail {
  position: absolute;
  top: 24px;
  bottom: 24px;
  left: 50%;
  width: 2px;
  background: linear-gradient(180deg, transparent, var(--accent), transparent);
  transform: translateX(-1px);
}
.track.vertical .entry {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  align-items: center;
  margin-bottom: 28px;
}
.track.vertical .entry .dot {
  grid-column: 2;
  justify-self: center;
  position: relative;
  z-index: 1;
}
.track.vertical .entry .year {
  grid-column: 2;
  text-align: center;
  font-size: 12px;
  color: var(--accent);
  letter-spacing: 0.16em;
  font-weight: 700;
  margin-top: 6px;
}
.track.vertical .entry .card {
  grid-column: 3;
  margin-left: 12px;
}
.track.vertical .entry.left .card {
  grid-column: 1;
  margin-left: 0;
  margin-right: 12px;
  text-align: right;
}

.track.horizontal {
  display: flex;
  align-items: flex-start;
  gap: 0;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 24px 24px 12px;
}
.track.horizontal .rail {
  position: absolute;
  top: 50%;
  left: 24px;
  right: 24px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
}
.track.horizontal .entry {
  position: relative;
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-right: 16px;
}
.track.horizontal .entry:nth-child(odd) .card { order: -1; margin-bottom: 16px; }
.track.horizontal .entry:nth-child(even) .card { margin-top: 16px; }
.track.horizontal .entry .year {
  position: relative;
  z-index: 1;
  margin: 6px 0;
  font-size: 13px;
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 0.16em;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px rgba(108, 140, 255, 0.18);
}

.card {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 14px;
  text-align: left;
  transition: transform 0.18s ease, border-color 0.18s ease;
}
.card:hover {
  border-color: var(--accent);
}
.card-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}
.card-sub {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 8px;
}
.card-text {
  font-size: 12px;
  color: var(--text);
  margin: 0 0 8px;
  line-height: 1.55;
}
.media img,
.media iframe {
  width: 100%;
  max-height: 180px;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  display: block;
  background: black;
}
.media iframe {
  aspect-ratio: 16/9;
  height: auto;
}

@media (max-width: 720px) {
  .track.vertical .entry {
    grid-template-columns: 36px 1fr;
  }
  .track.vertical .rail { left: 18px; transform: none; }
  .track.vertical .entry .dot,
  .track.vertical .entry .year { grid-column: 1; justify-self: center; }
  .track.vertical .entry .card,
  .track.vertical .entry.left .card {
    grid-column: 2;
    margin: 0;
    text-align: left;
  }
}
</style>
