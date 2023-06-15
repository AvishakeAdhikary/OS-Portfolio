<template>
  <section class="player">
    <h2 class="song-title">{{ current.title }} - <span>{{ current.artist }}</span></h2>
    <div class="visuals">
      <canvas ref="visualizer" class="visualizer"></canvas>
    </div>
    <div class="controls">
      <div>
        <input type="range" class="seek-bar" v-model="currentTime" @input="seek" />
      </div>
      <div class="controlbuttons">
        <button class="playlist-button" @click="prev">
          <img :src="prevIcon" alt="Previous" class="button-icon">
        </button>
        <button class="playlist-button" @click="playPause">
          <img :src="isPlaying ? pauseIcon : playIcon" alt="Play/Pause" class="button-icon">
        </button>
        <button class="playlist-button" @click="next">
          <img :src="nextIcon" alt="Next" class="button-icon">
        </button>
        <button class="playlist-button" @click="stop">
          <img :src="stopIcon" alt="Stop" class="button-icon">
        </button>
      </div>
    </div>
  </section>
  <section class="playlist">
    <h3>The Playlist</h3>
    <button
      class="playlist-button"
      v-for="(song, songIndex) in songs"
      :key="song.src"
      @click="selectSong(songIndex)"
      :class="(song.src === current.src) ? 'song playing' : 'song'"
    >
      {{ song.title }} - {{ song.artist }}
    </button>
  </section>
</template>

<script>
import playIcon from '@/assets/svg_icons/play.svg';
import pauseIcon from '@/assets/svg_icons/pause.svg';
import stopIcon from '@/assets/svg_icons/stop.svg';
import nextIcon from '@/assets/svg_icons/next.svg';
import prevIcon from '@/assets/svg_icons/prev.svg';

import ElectronicFutureBeats from '@/assets/music/electronic-future-beats-117997.mp3';
import LeonellCassioTheBlackestBouquet118766 from '@/assets/music/leonell-cassio-the-blackest-bouquet-118766.mp3';
import MazaphonkMusicBy0to8AlexiActionInfraction128845 from '@/assets/music/mazaphonk-music-by-0to8-alexi-action-infraction-128845.mp3'
import PasswordInfinity123276 from '@/assets/music/password-infinity-123276.mp3'
import PowerfulEnergeticSportRockTrailer122077 from '@/assets/music/powerful-energetic-sport-rock-trailer-122077.mp3'
import SciFiCyberpunkTrailer110587 from '@/assets/music/sci-fi-cyberpunk-trailer-110587.mp3'

export default {
  name: 'MusicPlayer',
  data() {
    return {
      current: {},
      index: 0,
      isPlaying: false,
      audioContext: null,
      analyzer: null,
      currentTime: 0,
      playIcon: null,
      pauseIcon: null,
      stopIcon: null,
      nextIcon: null,
      prevIcon: null,
      songs: [
        {
          title: 'Electronic Future Beats',
          artist: 'QubeSounds',
          src: ElectronicFutureBeats
        },
        {
          title: 'The Blackest Bouquet',
          artist: 'Leonell Cassio',
          src: LeonellCassioTheBlackestBouquet118766
        },
        {
          title: 'Mazaphonk Music',
          artist: 'Alexi Action',
          src: MazaphonkMusicBy0to8AlexiActionInfraction128845
        },
        {
          title: 'Infinity',
          artist: 'Password',
          src: PasswordInfinity123276
        },
        {
          title: 'Powerful Energetic Sport Rock Trailer',
          artist: 'Pink Zebra',
          src: PowerfulEnergeticSportRockTrailer122077
        },
        {
          title: 'Sci-Fi Cyberpunk Trailer',
          artist: 'MaxKoMusic',
          src: SciFiCyberpunkTrailer110587
        }
      ]
    };
  },
  mounted() {
    this.loadIcons();
    this.loadAudioContext();
  },
  beforeUnmount() {
    this.stop();
    this.releaseAudioContext();
  },
  methods: {
    loadIcons() {
      this.playIcon = playIcon;
      this.pauseIcon = pauseIcon;
      this.stopIcon = stopIcon;
      this.nextIcon = nextIcon;
      this.prevIcon = prevIcon;
    },
    loadAudioContext() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 2048;
      this.visualize();
    },
    releaseAudioContext() {
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
    },
    visualize() {
      const visualizer = this.$refs.visualizer;
      const canvas = visualizer.getContext('2d');
      const bufferLength = this.analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        const WIDTH = visualizer.width;
        const HEIGHT = visualizer.height;

        this.analyzer.getByteTimeDomainData(dataArray);

        canvas.clearRect(0, 0, WIDTH, HEIGHT);

        const gradient = canvas.createLinearGradient(0, 0, WIDTH, 0);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(0.5, 'yellow');
        gradient.addColorStop(1, 'green');

        canvas.lineWidth = 2;
        canvas.strokeStyle = gradient;
        canvas.beginPath();

        const sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * HEIGHT / 2;

          if (i === 0) {
            canvas.moveTo(x, y);
          } else {
            canvas.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvas.lineTo(visualizer.width, visualizer.height / 2);
        canvas.stroke();

        requestAnimationFrame(draw);
      };

      draw();
    },
    playPause() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },

    play() {
      if (!this.current.src) {
        this.current = this.songs[this.index];
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      if (this.player && this.current.src === this.player.src) {
        // If the player exists and the current song is the same, simply resume playback
        if (!isNaN(this.current.currentTime) && isFinite(this.current.currentTime)) {
          this.player.currentTime = this.current.currentTime;
        }
        this.player.play();
      } else {
        // Otherwise, create a new player and set the necessary properties
        this.player = new Audio(this.current.src);
        this.player.onended = this.next;
        if (!isNaN(this.current.currentTime) && isFinite(this.current.currentTime)) {
          this.player.currentTime = this.current.currentTime;
        }

        const source = this.audioContext.createMediaElementSource(this.player);
        source.connect(this.analyzer);
        this.analyzer.connect(this.audioContext.destination);

        this.player.play();
      }

      this.isPlaying = true;
    },

    pause() {
      if (this.isPlaying) {
        if (this.player) {
          this.current.currentTime = this.player.currentTime; // Store the current playback position
        }
        this.player.pause();
        this.isPlaying = false;
      }
    },

    stop() {
      if (this.isPlaying) {
        this.player.pause();
        this.player.currentTime = 0;
        this.isPlaying = false;
        this.resetInput();
      }
    },

    prev() {
      this.stop();

      if (this.index === 0) {
        this.index = this.songs.length - 1;
      } else {
        this.index--;
      }

      this.current = this.songs[this.index];
      this.play();
    },

    next() {
      this.stop();

      if (this.index === this.songs.length - 1) {
        this.index = 0;
      } else {
        this.index++;
      }

      this.current = this.songs[this.index];
      this.play();
    },

    seek() {
      if (this.player && this.player.duration) {
        const seekTime = this.player.duration * (this.currentTime / 100);
        this.player.currentTime = seekTime;
      }
    },

    selectSong(songIndex) {
      if (songIndex === this.index && this.isPlaying) {
        // If the selected song is already playing, do nothing
        return;
      }

      this.stop();
      this.index = songIndex;
      this.current = this.songs[this.index];
      this.play();
    },
    resetInput() {
      this.currentTime = 0; // Reset the value of the currentTime data property
    },
  }
};
</script>

<style scoped>
.player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #282c34;
  color: #fff;
}

.song-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.song-title span {
  font-size: 1rem;
}

.visuals {
  position: relative;
  width: 100%;
  height: 8rem;
}

.visualizer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.seek-bar {
  width: 100%;
  margin-top: 0.5rem;
}

.controls {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  flex-direction: column;
}

.controlbuttons{
  display: flex;
  flex-direction: row;
}

.controlbuttons .playlist-button
{
  background-color: orange;
  color: black;
  margin: 2px;
  border-radius: 50px;
}

.controlbuttons .playlist-button:hover
{
  background-color: darkorange;
}

.playlist {
  margin-top: 2rem;
  text-align: center;
}

.playlist h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.playlist-button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: none;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  color: inherit;
  transition: all 0.3s ease;
}

.playlist-button:hover {
  color: #0000ff;
}

.song {
  color: inherit;
}

.song.playing {
  color: #0000ff;
}

.button-icon {
  width: 2rem;
  height: 2rem;
  vertical-align: middle;
}
</style>
