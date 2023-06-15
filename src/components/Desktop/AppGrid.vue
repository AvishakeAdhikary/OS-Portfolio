<template>
  <div class="app-grid">
    <AppIcon
      v-for="app in apps"
      :key="app.name"
      :icon-src="app.iconSrc"
      :app-name="app.name"
      @dblclick="openWindow(app)"
      @touchstart="handleTouchStart(app)"
      @touchend="handleTouchEnd(app)"
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
import userIcon from '@/assets/icons/account.ico';
import favouriteIcon from '@/assets/icons/favorites.ico';
import timelineIcon from '@/assets/icons/archive 2.ico';

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
        { iconSrc: favouriteIcon, name: 'Certificates' },
        { iconSrc: timelineIcon, name: 'Timeline' },
        { iconSrc: emailIcon, name: 'Email' },
        { iconSrc: controlPanelIcon, name: 'Settings' },
      ],
      windows: [],
      touchStartTime: 0,
      touchApp: null,
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
    handleTouchStart(app) {
      this.touchStartTime = Date.now();
      this.touchApp = app;
    },
    handleTouchEnd(app) {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - this.touchStartTime;
      const DOUBLE_TOUCH_THRESHOLD = 300; // Adjust this threshold as needed

      if (app === this.touchApp && touchDuration < DOUBLE_TOUCH_THRESHOLD) {
        this.openWindow(app);
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
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
/*  background-color: rgba(255, 0, 0, 1.0);*/
}
</style>
