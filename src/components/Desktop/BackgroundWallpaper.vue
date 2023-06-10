 <template>
  <div class="background-wallpaper">
    <video
      ref="video"
      class="background-video"
      autoplay
      muted
      loop
      :playsinline="true"
      :controls="false"
      @ended="restartVideo"
      @click="preventDefault"
    >
      <source src="@/assets/wallpaper.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  methods: {
    restartVideo() {
      this.$refs.video.currentTime = 0;
      this.$refs.video.play();
    },
    preventDefault(event) {
      event.preventDefault();
    },
  },
};
</script>

<style scoped>
.background-wallpaper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
</style>
