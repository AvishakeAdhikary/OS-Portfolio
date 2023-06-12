<template>
  <div class="window" :style="windowStyle" ref="windowElement">
    <div class="window-header" @mousedown="startDrag" ref="windowHeader">
      <img class="window-icon" :src="iconSrc" :alt="appName" />
      <span class="window-title">{{ appName }}</span>
      <div class="window-buttons">
        <button class="window-minimize" @click="minimizeWindow">-</button>
        <button class="window-maximize" @click="maximizeWindow">&#9744;</button>
        <button class="window-close" @click="closeWindow">×</button>
      </div>
    </div>
    <div class="window-content" :style="windowContentStyle" ref="contentElement">
      <ThisPC v-if="currentIframe === 'This PC'" />
      <MusicPlayer v-if="currentIframe === 'Music'" />
      <Photos v-else-if="currentIframe === 'Photos'" />
      <iframe :style="contentInnerStyle" v-else-if="currentIframe === 'Browser'" src="https://www.google.com?igu=1"></iframe>
      <iframe :style="contentInnerStyle" v-else-if="currentIframe === 'CV'" :src="cvPath"></iframe>
      <Github v-else-if="currentIframe === 'Github'" />
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

export default {
  components: {
    ThisPC,
    Photos,
    MusicPlayer,
    Github,
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
    this.adjustContentHeight();
    window.addEventListener('mousemove', this.handleDrag);
    window.addEventListener('mouseup', this.stopDrag);
    this.adjustWindowSize();
    this.adjustWindowContentHeight();
    this.adjustContentHeight();
    window.addEventListener('resize', this.adjustContentHeight);
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('mouseup', this.stopDrag);
    window.removeEventListener('resize', this.adjustContentHeight);
  },
  methods: {
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
        this.windowStyle.width = '400px';
        this.windowStyle.height = '300px';
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
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  width: 400px;
  height: 300px;
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

.window-content {
  padding: 0;
  flex-grow: 1;
  overflow: hidden;
  height:100%;
/*  background-color: rgba(255, 0, 0, 1.0);*/
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
/*  overflow: auto;*/
}
</style>
