<template>
  <div>
    <!-- Thumbnail view -->
    <div v-if="!selectedPhoto" class="gallery">
      <div v-for="photo in photos" :key="photo" @click="selectPhoto(photo)">
        <img :src="photo" class="thumbnail" alt="Photo Thumbnail" />
      </div>
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

export default {
  name: 'Photos',
  data() {
    return {
      photos: [],
      selectedPhoto: null,
    };
  },
  mounted() {
    this.getPhotosFromDirectory();
  },
  methods: {
    getPhotosFromDirectory() {
      // Example photos to populate the 'photos' array
      const fetchedPhotos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9 ,photo10, photo11, photo12];

      this.photos = fetchedPhotos;
    },
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
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
}

.full-photo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.full-photo-wrapper {
  position: relative;
  max-width: 100%;
  max-height: calc(100vh - 100px); /* Subtract the height of the back button */
}

.full-photo {
  width: 100%;
  height: auto;
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
  cursor: pointer;
}
</style>
