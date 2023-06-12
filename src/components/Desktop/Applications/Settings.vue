<template>
  <div class="settings">
    <div class="sidebar">
      <ul>
        <li v-for="section in sections" :key="section.id" @click="selectSection(section.id)" :class="{ active: section.id === activeSection }">
          <span>{{ section.name }}</span>
        </li>
      </ul>
    </div>
    <div class="content">
      <h2>{{ activeSection }}</h2>
      <div class="slider-container">
        <input
          type="range"
          v-model="sliderValue"
          :min="minValue"
          :max="maxValue"
          :step="stepSize"
          @input="updateSliderValue"
        />
        <p>Volume: {{ sliderValue }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sections: [
        { id: 'System', name: 'System' },
        { id: 'Display', name: 'Display' },
        { id: 'Sound', name: 'Sound' },
        // Add more sections as needed
      ],
      activeSection: 'System',
      sliderValue: 0,
      minValue: 0,
      maxValue: 100,
      stepSize: 1,
    };
  },
  methods: {
    selectSection(sectionId) {
      this.activeSection = sectionId;
    },
    updateSliderValue(event) {
      const newValue = event.target.value;
    },
  },
};
</script>

<style scoped>
.settings {
  display: flex;
  height:100%;
}

.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  border-right: 1px solid #ccc;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 10px;
  cursor: pointer;
  color: #000;
}

li.active {
  background-color: #0078d4;
  color: #fff;
}

.slider-container {
  width: 300px;
}

h2 {
  margin-top: 0;
  color: black;
}

p {
  color: #000;
}
</style>
