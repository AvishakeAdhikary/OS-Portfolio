<template>
  <div class="window" :style="windowStyle" ref="windowElement">
    <WindowHeader :appName="appName" :iconSrc="iconSrc" @start-drag="startDrag" @minimize="minimizeWindow" @maximize="maximizeWindow" @close="closeWindow" />
    <WindowContent>
      <slot></slot>
    </WindowContent>
  </div>
</template>

<script>
import WindowHeader from './Window/WindowHeader.vue';
import WindowContent from './Window/WindowContent.vue';

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
  data() {
    return {
      isDragging: false,
      startPosition: { x: 0, y: 0 },
      windowPosition: { x: 0, y: 0 },
      isMaximized: false,
    };
  },
  computed: {
    windowStyle() {
      if (this.isMaximized) {
        return {
          left: '0',
          top: '0',
          width: '100vw',
          height: '100vh',
        };
      } else {
        return {
          left: `${this.windowPosition.x}px`,
          top: `${this.windowPosition.y}px`,
        };
      }
    },
  },
  mounted() {
    window.addEventListener('mousemove', this.handleDrag);
    window.addEventListener('mouseup', this.stopDrag);
    this.adjustWindowSize();
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('mouseup', this.stopDrag);
  },
  methods: {
    startDrag(event) {
      event.preventDefault();
      this.isDragging = true;
      this.startPosition = {
        x: event.clientX,
        y: event.clientY,
      };
    },
    handleDrag(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.startPosition.x;
        const deltaY = event.clientY - this.startPosition.y;
        this.windowPosition = {
          x: this.windowPosition.x + deltaX,
          y: this.windowPosition.y + deltaY,
        };
        this.startPosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }
    },
    stopDrag() {
      this.isDragging = false;
    },
    closeWindow() {
      this.$emit('close');
    },
    minimizeWindow() {
      this.$emit('minimize');
    },
    maximizeWindow() {
      this.isMaximized = !this.isMaximized;

      if (this.isMaximized) {
        const taskbarHeight = 50; // Adjust this value according to your taskbar height
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        this.windowPosition = { x: 0, y: 0 };
        this.windowStyle.width = `${screenWidth}px`;
        this.windowStyle.height = `${screenHeight - taskbarHeight}px`;
        this.adjustContentHeight();
      } else {
        this.windowPosition = { x: 0, y: 0 };
        this.windowStyle.width = '400px';
        this.windowStyle.height = '300px';
      }
    },
    adjustWindowSize() {
      this.$nextTick(() => {
        const windowElement = this.$refs.windowElement;
        const contentElement = windowElement.querySelector('.window-content');
        const headerElement = windowElement.querySelector('.window-header');
        const contentHeight = windowElement.offsetHeight - headerElement.offsetHeight;
        contentElement.style.height = `${contentHeight}px`;
      });
    },
  },
  components: {
    WindowHeader,
    WindowContent,
  },
};
</script>

<style scoped>
.window {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  width: 400px;
  height: 300px;
}

.window-content {
  height: calc(100% - 30px); /* Subtract header height */
  overflow: auto;
}

.content-inner {
  padding: 10px;
}

</style>
