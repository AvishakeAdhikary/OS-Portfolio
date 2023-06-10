<template>
  <div class="taskbar">
    <div class="taskbar-icons">
      <img src="@/assets/icons/3d.ico" class="taskbar-icon" alt="Windows" @click="focusWindowsIcon" />
      <img v-for="window in openWindows" :key="window.app.name" class="taskbar-icon" :src="window.app.iconSrc" :alt="window.app.name" @click="focusWindow(window)" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    openWindows: {
      type: Array,
      required: true,
    },
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
    },
  },
};
</script>


<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: #0F0F0F;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
