<template>
  <div class="window-content" ref="contentElement">
    <div class="content-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.adjustContentHeight();
    window.addEventListener('resize', this.adjustContentHeight);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustContentHeight);
  },
  methods: {
    adjustContentHeight() {
      this.$nextTick(() => {
        const contentElement = this.$refs.contentElement;
        const contentInnerElement = contentElement.querySelector('.content-inner');
        if (contentElement && contentInnerElement) {
          const headerElement = contentElement.previousElementSibling;
          const headerHeight = headerElement.offsetHeight;
          const windowHeight = contentElement.offsetHeight;
          contentInnerElement.style.height = `${windowHeight - headerHeight}px`;
        }
      });
    },
  },
};
</script>

<style scoped>
.window-content {
  padding: 0;
  flex-grow: 1;
  overflow: hidden;
}

.content-inner {
  height: 100%;
}
</style>
