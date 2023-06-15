<template>
  <div class="window" :style="windowStyle" ref="windowElement">
    <div class="window-header" @mousedown="startDrag" @mousedown.right="startResize"  ref="windowHeader">
      <img class="window-icon" :src="iconSrc" :alt="appName" />
      <span class="window-title">{{ appName }}</span>
      <div class="window-buttons">
        <button class="window-minimize" @click="minimizeWindow">-</button>
        <button class="window-maximize" @click="maximizeWindow">&#9744;</button>
        <button class="window-close" @click="closeWindow">×</button>
      </div>
    </div>
    <div class="resize-handle top-left" @mousedown="startResize"></div>
    <div class="resize-handle top-right" @mousedown="startResize"></div>
    <div class="resize-handle bottom-left" @mousedown="startResize"></div>
    <div class="resize-handle bottom-right" @mousedown="startResize"></div>
    <div class="window-content" :style="windowContentStyle" ref="contentElement">
      <ThisPC v-if="currentIframe === 'This PC'" />
      <MusicPlayer v-if="currentIframe === 'Music'" />
      <Photos v-else-if="currentIframe === 'Photos'" />
      <iframe :style="contentInnerStyle" v-else-if="currentIframe === 'Browser'" src="https://www.google.com?igu=1"></iframe>
      <iframe :style="contentInnerStyle" v-else-if="currentIframe === 'CV'" :src="cvPath"></iframe>
      <Github v-else-if="currentIframe === 'Github'" />
      <Certificates v-else-if="currentIframe === 'Certificates'" />
      <Timeline v-else-if="currentIframe === 'Timeline'" />
      <Email v-else-if="currentIframe === 'Email'" />
      <Settings v-else-if="currentIframe === 'Settings'" />
    </div>
  </div>
</template>

<script>
import cvPath from '@/assets/Avishake_Adhikary_Resume.pdf';
import MusicPlayer from '@/components/Desktop/Applications/MusicPlayer.vue';
import ThisPC from '@/components/Desktop/Applications/ThisPC.vue';
import Email from '@/components/Desktop/Applications/Email.vue';
import Photos from '@/components/Desktop/Applications/Photos.vue';
import Settings from '@/components/Desktop/Applications/Settings.vue';
import Github from '@/components/Desktop/Applications/Github.vue';
import Certificates from '@/components/Desktop/Applications/Certificates.vue';
import Timeline from '@/components/Desktop/Applications/Timeline.vue';

export default {
  components: {
    ThisPC,
    Photos,
    MusicPlayer,
    Github,
    Certificates,
    Timeline,
    Email,
    Settings
  },
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
      currentIframe: this.appName, // Default iframe
      startResizePosition: { x: 0, y: 0 },
      windowSize: { width: 300, height: 200 },
      resize: this.isResizing ? 'both' : 'none',
    };
  },
  computed: {
    cvPath() {
      return cvPath;
    },
    windowContentStyle() {
      const headerElement = this.$refs.windowHeader;
      if (headerElement) {
        if (this.isMaximized) {
          return {
            height: `calc(100% - ${this.getHeaderHeight(headerElement)}px)`,
            // height: `100vh`,
          };
        } else {
          return {
            height: `calc(100% - ${this.getHeaderHeight(headerElement)}px)`,
            // height: `100vh`,
          };
        }
      }
      return {};
    },
    contentInnerStyle() {
      const headerElement = this.$refs.windowHeader;
      if (headerElement) {
        if (this.isMaximized) {
          return {
            height: `calc(100% - ${this.getHeaderHeight(headerElement)}px)`,
            // height: `100vh`,
          };
        } else {
          return {
            height: `calc(100% - ${this.getHeaderHeight(headerElement)}px)`,
            // height: `100vh`,
          };
        }
      }
      return {};
    },
    windowStyle() {
      if (this.isMaximized) {
        return {
          left: '0',
          top: '0',
          width: '100vw',
          height: '100vh',
          minWidth: '300px', // Minimum width
          minHeight: '200px', // Minimum height
        };
      } else {
        return {
          left: `${this.windowPosition.x}px`,
          top: `${this.windowPosition.y}px`,
          width: `${this.windowSize.width}px`,
          height: `${this.windowSize.height}px`,
          minWidth: '300px', // Minimum width
          minHeight: '200px', // Minimum height
        };
      }
    },
  },
  mounted() {
    this.adjustContentHeight();
    window.addEventListener('mousemove', this.handleDrag);
    window.addEventListener('mouseup', this.stopDrag);
    this.adjustWindowSize();
    this.adjustWindowContentHeight();
    this.adjustContentHeight();
    window.addEventListener('resize', this.adjustContentHeight);
    window.addEventListener('mousemove', this.handleResize);
    window.addEventListener('mouseup', this.stopResize);
    window.addEventListener('touchmove', this.handleDrag);
    window.addEventListener('touchend', this.stopDrag);
    window.addEventListener('touchmove', this.handleResize);
    window.addEventListener('touchend', this.stopResize);
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('mouseup', this.stopDrag);
    window.removeEventListener('resize', this.adjustContentHeight);
    window.removeEventListener('mousemove', this.handleResize);
    window.removeEventListener('mouseup', this.stopResize);
    window.removeEventListener('touchmove', this.handleDrag);
    window.removeEventListener('touchend', this.stopDrag);
    window.removeEventListener('touchmove', this.handleResize);
    window.removeEventListener('touchend', this.stopResize);
  },
  methods: {
    startResize(event) {
      event.preventDefault();
      this.isResizing = true;
      this.startResizePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      this.adjustWindowContentHeight();
      this.adjustContentHeight();
    },
    handleResize(event) {
      if (this.isResizing) {
        const deltaX = event.clientX - this.startResizePosition.x;
        const deltaY = event.clientY - this.startResizePosition.y;
        this.windowSize = {
          width: Math.max(this.windowSize.width + deltaX, 100),
          height: Math.max(this.windowSize.height + deltaY, 100),
        };
        this.startResizePosition = {
          x: event.clientX,
          y: event.clientY,
        };
        this.adjustWindowContentHeight();
        this.adjustContentHeight();
      }
    },
    stopResize() {
      this.isResizing = false;
      this.adjustWindowContentHeight();
      this.adjustContentHeight();
    },
    getHeaderHeight() {
      const headerElement = this.$refs.windowHeader;
      if (headerElement) {
        return headerElement.offsetHeight;
      }
      return 0;
    },
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
      this.adjustWindowContentHeight();
      this.adjustContentHeight();
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
        this.adjustWindowContentHeight();
        this.adjustContentHeight();
      } else {
        this.windowPosition = { x: 0, y: 0 };
        this.windowStyle.width = '300px';
        this.windowStyle.height = '200px';
        this.adjustWindowContentHeight();
        this.adjustContentHeight();
      }
    },
    adjustWindowSize() {
      this.$nextTick(() => {
        const windowElement = this.$refs.windowElement;
        const contentElement = windowElement.querySelector('.window-content');
        const headerElement = windowElement.querySelector('.window-header');
        const contentHeight = windowElement.offsetHeight - headerElement.offsetHeight;
        contentElement.style.height = `${contentHeight}px`;
        this.adjustContentHeight();
      });
    },
    adjustWindowContentHeight() {
      this.$nextTick(() => {
        const windowElement = this.$refs.windowElement;
        const contentElement = this.$refs.contentElement;
        const headerElement = this.$refs.windowHeader;
        if (windowElement && contentElement && headerElement) {
          const windowHeight = windowElement.offsetHeight;
          const headerHeight = headerElement.offsetHeight;
          const contentHeight = windowHeight - headerHeight;
          contentElement.style.height = `${contentHeight}px`;
        }
      });
    },
    adjustContentHeight() {
      this.$nextTick(() => {
        const contentElement = this.$refs.contentElement;
        const headerElement = this.$refs.windowHeader;
        if (contentElement && headerElement) {
          const windowHeight = contentElement.offsetHeight;
          const headerHeight = headerElement.offsetHeight;
          const contentHeight = windowHeight //- headerHeight;
          contentElement.style.height = `${contentHeight}px`;
        }
      });
    },
  },
};
</script>

<style scoped>
.window {
  position: absolute;
  background-color: #181818;
/*  border: 1px solid #ccc;*/
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  width: 300px;
  height: 200px;
  min-width: 300px; /* Minimum width */
  min-height: 200px; /* Minimum height */
  border-radius: 10px;
}

/* Media query for smaller devices */
@media (max-width: 600px) {
  .window {
    width: 100%;
    height: 100%;
    min-width: 300; /* Reset minimum width */
    min-height: 200; /* Reset minimum height */
  }
}

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
  color: white;
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
  color: white;
}

.window-content {
  padding: 0;
  flex-grow: 1;
  overflow: hidden;
  height:100%;
  border-radius: 10px;
/*  background-color: rgba(255, 0, 0, 1.0);*/
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
/*  overflow: auto;*/
}

.resize-handle {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: #ddd;
  cursor: nwse-resize;
}

.resize-handle.top-left {
  top: -4px;
  left: -4px;
}

.resize-handle.top-right {
  top: -4px;
  right: -4px;
}

.resize-handle.bottom-left {
  bottom: -4px;
  left: -4px;
}

.resize-handle.bottom-right {
  bottom: -4px;
  right: -4px;
}
</style>
