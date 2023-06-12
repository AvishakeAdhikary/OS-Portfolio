<template>
  <div class="app-grid">
    <AppIcon
      v-for="app in apps"
      :key="app.name"
      :icon-src="app.iconSrc"
      :app-name="app.name"
      @dblclick="openWindow(app)"
    />
    <Window
      v-for="window in windows"
      :key="window.app.name"
      :app-name="window.app.name"
      :icon-src="window.app.iconSrc"
      @close="closeWindow(window)"
    />
  </div>
</template>

<script>
import AppIcon from './AppIcon.vue';
import Window from './Window.vue';

import pcIcon from '@/assets/icons/pc.ico';
import musicIcon from '@/assets/icons/music.ico';
import picturesIcon from '@/assets/icons/pictures 2.ico';
import internetIcon from '@/assets/icons/internet.ico';
import githubIcon from '@/assets/icons/github.ico';
import emailIcon from '@/assets/icons/email.ico';
import controlPanelIcon from '@/assets/icons/control panel.ico';
import userIcon from '@/assets/icons/user.ico';

export default {
  components: {
    AppIcon,
    Window
  },
  data() {
    return {
      apps: [
        { iconSrc: pcIcon, name: 'This PC' },
        { iconSrc: musicIcon, name: 'Music' },
        { iconSrc: picturesIcon, name: 'Photos' },
        { iconSrc: internetIcon, name: 'Browser' },
        { iconSrc: userIcon, name: 'CV' },
        { iconSrc: githubIcon, name: 'Github' },
        { iconSrc: emailIcon, name: 'Email' },
        { iconSrc: controlPanelIcon, name: 'Settings' },
      ],
      windows: [],
    };
  },
  methods: {
    openWindow(app) {
      const existingWindow = this.windows.find((window) => window.app.name === app.name);
      if (!existingWindow) {
        this.windows.push({ app });
        this.$emit('open-window', { app });
      }
    },
    closeWindow(window) {
      const index = this.windows.findIndex((win) => win.app.name === window.app.name);
      if (index !== -1) {
        this.windows.splice(index, 1);
        this.$emit('close-window', { app: window.app });
      }
    },
  },
};
</script>

<style scoped>
.app-grid {
  position: fixed;
  top: 0;
  left: 0;
  max-width: 100%;
  padding: 10px;
  height: 98vh;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
</style>
