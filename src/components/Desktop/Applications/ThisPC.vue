<template>
  <div>
    <div class="drive" v-for="drive in drives" :key="drive.name">
      <img class="drive-icon" :src="drive.icon" alt="Drive Icon" />
      <div class="drive-info">
        <div class="drive-name">{{ drive.name }}</div>
        <div class="drive-progress">
          <div class="drive-progress-bar" :style="{ width: freeSpacePercentage(drive) }"></div>
          <div class="drive-progress-label">{{ drive.freeSpace }} GB free</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import driveIcon from '@/assets/icons/drive os.ico';
import usbDriveIcon from '@/assets/icons/usb 1.ico';

export default {
  name: 'ThisPC',
  data() {
    return {
      drives: [
        {
          name: 'C:',
          freeSpace: 120,
          totalSpace: 250,
          icon: driveIcon,
        },
        {
          name: 'D:',
          freeSpace: 250,
          totalSpace: 500,
          icon: driveIcon,
        },
        {
          name: 'F:',
          freeSpace: 250,
          totalSpace: 1000,
          icon: usbDriveIcon,
        },
        // Add more drives as needed
      ],
    };
  },
  methods: {
    freeSpacePercentage(drive) {
      const percentage = (drive.freeSpace / drive.totalSpace) * 100;
      return `${percentage}%`;
    },
  },
};
</script>

<style scoped>
.drive {
  display: flex;
  align-items: center;
  padding: 10px;
}

.drive-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.drive-info {
  display: flex;
  flex-direction: column;
}

.drive-name {
  font-weight: bold;
  color: #000;
}

.drive-progress {
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.drive-progress-bar {
  height: 100%;
  background-color: #4caf50;
}

.drive-progress-label {
  margin-top: 5px;
  color: #000;
}
</style>
