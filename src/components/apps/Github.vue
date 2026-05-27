<template>
  <div class="gh">
    <header class="gh-header">
      <img :src="avatar" class="avatar" alt="" />
      <div class="who">
        <h2>Avishake Adhikary</h2>
        <p>@AvishakeAdhikary · Full-Stack Developer · ML Engineer</p>
        <div class="links">
          <a href="https://github.com/AvishakeAdhikary" target="_blank" rel="noopener">GitHub</a>
          <a href="https://www.linkedin.com/in/avishakeadhikary/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://twitter.com/Avhishek007" target="_blank" rel="noopener">Twitter</a>
          <a href="https://www.youtube.com/@avishakeadhikary" target="_blank" rel="noopener">YouTube</a>
          <a href="https://avhishek.blogspot.com/" target="_blank" rel="noopener">Blog</a>
        </div>
      </div>
    </header>

    <section class="grid">
      <div class="card">
        <h3>About</h3>
        <ul>
          <li>🔭 Currently working on <a href="https://github.com/AvishakeAdhikary/Text-To-Image-Generator" target="_blank" rel="noopener">Text-To-Image-Generator</a></li>
          <li>🌱 Learning Large Language Models &amp; LLM integration</li>
          <li>👯 Collaborating on <a href="https://github.com/AvishakeAdhikary/Python-Code-Generator" target="_blank" rel="noopener">Python-Code-Generator</a></li>
          <li>👨‍💻 Sandbox at <a href="https://hj8d5.csb.app/" target="_blank" rel="noopener">hj8d5.csb.app</a></li>
        </ul>
      </div>

      <div class="card">
        <h3>Languages &amp; Tools</h3>
        <div class="badges">
          <span v-for="t in tools" :key="t">{{ t }}</span>
        </div>
      </div>

      <div class="card span-2">
        <h3>Stats</h3>
        <div class="stats">
          <img loading="lazy" src="https://github-readme-stats.vercel.app/api?username=avishakeadhikary&show_icons=true&locale=en&theme=tokyonight&hide_border=true&bg_color=00000000" alt="Stats" />
          <img loading="lazy" src="https://github-readme-stats.vercel.app/api/top-langs?username=avishakeadhikary&show_icons=true&layout=compact&theme=tokyonight&hide_border=true&bg_color=00000000" alt="Top Languages" />
          <img loading="lazy" src="https://github-readme-streak-stats.herokuapp.com/?user=avishakeadhikary&theme=tokyonight&hide_border=true&background=00000000" alt="Streak" />
        </div>
      </div>

      <div class="card">
        <h3>Support</h3>
        <p class="card-text">If you enjoy what I build, you can support me:</p>
        <div class="support">
          <a class="btn" href="https://www.buymeacoffee.com/avishake69" target="_blank" rel="noopener">☕ Buy me a coffee</a>
          <a class="btn alt" href="https://ko-fi.com/avishakeadhikary" target="_blank" rel="noopener">Ko-fi</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import avatar from '@/assets/AvishakeAdhikaryDP.png';

const tools = [
  'Python', 'TypeScript', 'JavaScript', 'Vue', 'React', 'Node.js',
  'Java', 'C', 'C++', 'C#', 'Kotlin', 'Swift', 'Go', 'Dart', 'Flutter',
  'TensorFlow', 'PyTorch', 'scikit-learn', 'OpenCV',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB',
  'Firebase', 'Tailwind', 'Linux', 'Blender', 'Photoshop',
];
</script>

<style scoped>
.gh {
  height: 100%;
  overflow: auto;
  background: linear-gradient(180deg, #0a0d1f 0%, #0d1117 100%);
  color: var(--text);
}
.gh-header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: radial-gradient(70% 100% at 10% 0%, rgba(108, 140, 255, 0.18), transparent 60%);
}
.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 22px rgba(0,0,0,0.4);
}
.who h2 { margin: 0 0 4px; font-size: 22px; }
.who p { margin: 0; color: var(--text-dim); font-size: 13px; }
.links {
  display: flex;
  gap: 14px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.links a {
  color: var(--accent);
  font-size: 12px;
  text-decoration: none;
}
.links a:hover { text-decoration: underline; }

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 18px 24px 28px;
}
.card {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 16px;
}
.card.span-2 { grid-column: 1 / -1; }
.card h3 {
  margin: 0 0 10px;
  font-size: 14px;
  letter-spacing: 0.04em;
}
.card ul {
  margin: 0;
  padding-left: 18px;
  line-height: 1.7;
  font-size: 13px;
}
.card ul a { color: var(--accent); text-decoration: none; }
.card-text { margin: 0 0 12px; color: var(--text-dim); font-size: 12px; }

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.badges span {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--glass-border);
  color: var(--text);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.stats img {
  width: 100%;
  border-radius: 8px;
}

.support { display: flex; gap: 10px; }
.btn {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 100px;
  background: var(--accent);
  color: white;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
}
.btn.alt { background: rgba(255,255,255,0.06); }

@media (max-width: 720px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
