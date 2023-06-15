<template>
  <div class="taskbar">
    <div class="time-widget">
      <span class="time">{{ currentTime }}</span>
      <span class="date">{{ currentDate }}</span>
    </div>
    <div class="taskbar-icons">
      <img src="@/assets/icons/3d.ico" class="taskbar-icon" alt="Windows" @click="focusWindowsIcon" />
      <img v-for="window in openWindows" :key="window.app.name" class="taskbar-icon" :src="window.app.iconSrc" :alt="window.app.name" @click="focusWindow(window)" />
    </div>
  </div>
  <!-- Windows Menu -->
  <div v-if="windowsMenuOpen" class="windows-menu">
    <!-- Add menu content here -->
    <img class="powericon" :src="powerIconSrc" @click="handlePowerIconClick" />
  </div>
</template>

<script>
import AppIcon from './AppIcon.vue';

import pcIcon from '@/assets/icons/pc.ico';
import musicIcon from '@/assets/icons/music.ico';
import picturesIcon from '@/assets/icons/pictures 2.ico';
import internetIcon from '@/assets/icons/internet.ico';
import githubIcon from '@/assets/icons/github.ico';
import emailIcon from '@/assets/icons/email.ico';
import controlPanelIcon from '@/assets/icons/control panel.ico';
import userIcon from '@/assets/icons/account.ico';

import powerIcon from '@/assets/icons/power.ico';

export default {
  emits: ['open-window', 'close-window'],
  props: {
    openWindows: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentTime: '',
      currentDate: '',
      windowsMenuOpen: false,
      powerIconSrc: powerIcon,
    };
  },
  methods: {
    requireIcon(fileName) {
      return require(`@/assets/icons/${fileName}`);
    },
    openWindow(window) {
      const existingWindow = this.openWindows.find((win) => win.app.name === window.app.name);
      if (!existingWindow) {
        this.openWindows.push(window);
      }
    },
    closeWindow(window) {
      const index = this.openWindows.findIndex((win) => win.app.name === window.app.name);
      if (index !== -1) {
        this.openWindows.splice(index, 1);
      }
    },
    focusWindow(window) {
      // Your logic to bring the corresponding window to the front/focus it
    },
    focusWindowsIcon() {
      // Implement the logic for what happens when the Windows icon is clicked
      this.windowsMenuOpen = !this.windowsMenuOpen;
    },
    updateTime() {
      const now = new Date();
      const options = { hour: 'numeric', minute: 'numeric' };
      this.currentTime = now.toLocaleTimeString([], options);
      this.currentDate = now.toLocaleDateString();
    },
    handlePowerIconClick() {
      // Redirect the browser to the LinkedIn profile link
      window.location.href = 'https://www.linkedin.com/in/avishakeadhikary/';
    },
  },
  created() {
    this.updateTime();
    setInterval(this.updateTime, 1000); // Update time every second
  },
};
</script>


<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  right: 0; /* Updated: position it at the bottom right */
  width: 100%;
  height: 50px;
  background-color: #0F0F0F;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-widget {
  position: fixed;
  bottom: 0;
  right: 10px; /* Updated: position it at the bottom right with a right margin of 10 pixels */
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Updated: align the text to the right */
  justify-content: center;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: bold;
}

.taskbar-icons {
  display: flex;
  align-items: center;
  justify-content: center;
}

.taskbar-icon {
  width: 30px;
  height: 30px;
  margin: 0 10px;
}

.windows-menu {
  position: absolute;
  top: calc(100% - 104px);
  width: 300px;
  left: calc(50% - 150px);
  background-color: #0f0f0f;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
}

.powericon{
  width: 30px;
  height: 30px;
}
</style>

