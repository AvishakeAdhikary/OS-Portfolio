<template>
  <div class="photos">
    <!-- Thumbnail view -->
    <div v-if="!selectedPhoto" class="gallery">
      <img
        v-for="(photo, index) in photos"
        :key="index"
        :src="photo"
        class="thumbnail"
        alt="Photo Thumbnail"
        @click="selectPhoto(photo)"
      />
    </div>

    <!-- Full photo view -->
    <div v-else class="full-photo-container">
      <div class="full-photo-wrapper">
        <img :src="selectedPhoto" class="full-photo" alt="Selected Photo" />
        <button @click="goBack" class="back-button">
          &#8592; <!-- UTF-8 arrow character for left arrow -->
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import photo1 from '@/assets/photos/photo1.jpg';
import photo2 from '@/assets/photos/photo2.jpeg';
import photo3 from '@/assets/photos/photo3.jpg';
import photo4 from '@/assets/photos/photo4.jpg';
import photo5 from '@/assets/photos/photo5.jpg';
import photo6 from '@/assets/photos/photo6.jpeg';
import photo7 from '@/assets/photos/photo7.jpg';
import photo8 from '@/assets/photos/photo8.jpg';
import photo9 from '@/assets/photos/photo9.jpg';
import photo10 from '@/assets/photos/photo10.jpg';
import photo11 from '@/assets/photos/photo11.jpg';
import photo12 from '@/assets/photos/photo12.jpg';
import photo13 from '@/assets/photos/photo13.jpg';
import photo14 from '@/assets/photos/photo14.jpg';
import photo15 from '@/assets/photos/photo15.jpg';
import photo16 from '@/assets/photos/photo16.jpg';
import photo17 from '@/assets/photos/photo17.jpg';
import photo18 from '@/assets/photos/photo18.jpg';



export default {
  name: 'Photos',
  data() {
    return {
      photos: [
        photo1,
        photo2,
        photo3,
        photo4,
        photo5,
        photo6,
        photo7,
        photo8,
        photo9,
        photo10,
        photo11,
        photo12,
        photo13,
        photo14,
        photo15,
        photo16,
        photo17,
        photo18,
      ],
      selectedPhoto: null,
    };
  },
  methods: {
    selectPhoto(photo) {
      this.selectedPhoto = photo;
    },
    goBack() {
      this.selectedPhoto = null;
    },
  },
};
</script>

<style>
.gallery {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  height: 100%;
}

.thumbnail {
  min-width: 100px;
  min-height: 100px;
  max-width: 800px;
  max-height: 800px;
  width: 200px;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  margin: 10px;
}

.full-photo-container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: auto;
}

.full-photo-wrapper {
  position: relative;
  max-width: 100%;
  max-height: calc(100vh - 100px);
}

.full-photo {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: black;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 50%;
}
</style>
