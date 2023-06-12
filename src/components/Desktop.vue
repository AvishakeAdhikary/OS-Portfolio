<template>
  <div class="desktop">
    <BackgroundWallpaper />
    <Taskbar :open-windows="openWindows" @open-window="addTaskbarIcon" @close-window="removeTaskbarIcon" />
    <AppGrid @open-window="addWindow" @close-window="removeWindow" />
  </div>
</template>

<script>
import BackgroundWallpaper from './Desktop/BackgroundWallpaper.vue';
import Taskbar from './Desktop/Taskbar.vue';
import AppGrid from './Desktop/AppGrid.vue';

export default {
  components: {
    BackgroundWallpaper,
    Taskbar,
    AppGrid,
  },
  data() {
    return {
      openWindows: [],
    };
  },
  methods: {
    addTaskbarIcon({ app }) {
      const existingWindow = this.openWindows.find((win) => win.app.name === app.name);
      if (!existingWindow) {
        this.openWindows.push({ app });
      }
    },
    removeTaskbarIcon({ app }) {
      const index = this.openWindows.findIndex((win) => win.app.name === app.name);
      if (index !== -1) {
        this.openWindows.splice(index, 1);
      }
    },
    addWindow({ app }) {
      const existingWindow = this.openWindows.find((win) => win.app.name === app.name);
      if (!existingWindow) {
        this.openWindows.push({ app });
      }
    },
    removeWindow({ app }) {
      const index = this.openWindows.findIndex((win) => win.app.name === app.name);
      if (index !== -1) {
        this.openWindows.splice(index, 1);
      }
    },
  },
};
</script>
