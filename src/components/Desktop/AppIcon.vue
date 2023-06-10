<template>
  <div class="fileicon" :class="{ 'hovered': isHovered, 'clicked': isClicked }">
    <img class="icon" :src="iconSrc" :alt="appName" @mouseover="hoverIcon(true)" @mouseleave="hoverIcon(false)" @mousedown="clickIcon(true)" @mouseup="clickIcon(false)" />
    <span class="appname">{{ appName }}</span>
  </div>
</template>

<script>
export default {
  props: {
    iconSrc: {
      type: String,
      required: true,
    },
    appName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isHovered: false,
      isClicked: false,
    };
  },
  methods: {
    hoverIcon(value) {
      this.isHovered = value;
    },
    clickIcon(value) {
      this.isClicked = value;
    },
  },
};
</script>

<style scoped>
.fileicon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40px;
  margin: 4px;
  transition: background-color 0.3s;
}

.fileicon.hovered {
  background-color: rgba(0, 0, 255, 0.1); /* Lighter blueish tint */
}

.fileicon.clicked {
  background-color: rgba(0, 0, 255, 0.3); /* Deeper bluish tint */
}

.appname {
  text-align: center;
  font-size: 12px;
  color: rgb(255, 255, 255);
}
</style>
