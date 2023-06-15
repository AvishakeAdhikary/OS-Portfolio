<template>
  <div class="signin-container">
    <div class="signin-content">
      <img src="@/assets/AvishakeAdhikaryDP.png" alt="Avishake Adhikary" class="signin-image">
      <h1 class="signin-text">{{ typedText }}</h1>
      <button class="signin-button" @click="switchToDesktop">Sign In</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "Avishake Adhikary",
      typedText: ""
    };
  },
  mounted() {
    this.type();
  },
  methods: {
    switchToDesktop() {
      this.$emit('switch-to-desktop');
    },
    type() {
      let index = 0;
      const typingSpeed = 150;
      
      const typeInterval = setInterval(() => {
        if (index < this.text.length) {
          this.typedText += this.text.charAt(index);
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, typingSpeed);
    }
  }
}
</script>

<style scoped>
.signin-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/lockscreen.jpg');
  background-size: cover;
}

.signin-content {
  text-align: center;
}

.signin-image {
  width: 200px;
  height: auto;
  border-radius: 50%;
}

.signin-text {
  margin: 20px 0;
  color: white;
  background-color: #3c3e3c;
  border-radius: 10px;
  padding: 10px;
}

.signin-button {
  padding: 10px 20px;
  background-color: #0000FF;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
</style>
