<template>
  <div id="app">
    <SignIn v-if="showSignIn" @switch-to-desktop="showSignIn = false" />
    <Desktop v-else />
  </div>
</template>

<script>
import Desktop from './components/Desktop.vue';
import SignIn from './components/SignIn.vue';

export default {
  name: 'App',
  components: {
    Desktop,
    SignIn,
  },
  data() {
    return {
      showSignIn: true
    };
  }
}
</script>

<style scoped>
/* Component styles go here */
</style>
