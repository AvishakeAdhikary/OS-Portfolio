<template>
  <div class="window-header" @mousedown="startDrag">
    <img class="window-icon" :src="iconSrc" :alt="appName" />
    <span class="window-title">{{ appName }}</span>
    <div class="window-buttons">
      <button class="window-minimize" @click="minimizeWindow">-</button>
      <button class="window-maximize" @click="maximizeWindow">&#9744;</button>
      <button class="window-close" @click="closeWindow">×</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    appName: {
      type: String,
      required: true,
    },
    iconSrc: {
      type: String,
      required: true,
    },
  },
  methods: {
    startDrag(event) {
      this.$emit('start-drag', event);
    },
    minimizeWindow() {
      this.$emit('minimize');
    },
    maximizeWindow() {
      this.$emit('maximize');
    },
    closeWindow() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.window-header {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: move;
}

.window-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.window-title {
  flex-grow: 1;
  font-size: 14px;
  font-weight: bold;
  color: black;
}

.window-buttons {
  display: flex;
}

.window-minimize,
.window-maximize,
.window-close {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
