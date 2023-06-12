<template>
  <section class="player">
    <h2 class="song-title">{{ current.title }} - <span>{{ current.artist }}</span></h2>
    <div class="controls">
      <button class="prev" @click="prev">Prev</button>
      <button class="play" v-if="!isPlaying" @click="play">Play</button>
      <button class="pause" v-else @click="pause">Pause</button>
      <button class="next" @click="next">Next</button>
    </div>
  </section>
  <section class="playlist">
    <h3>The Playlist</h3>
    <button class="playlistbutton" v-for="song in songs" :key="song.src" @click="play(song)" :class="(song.src == current.src) ? 'song playing' : 'song'">
      {{ song.title }} - {{ song.artist }}
    </button>
  </section>
</template>

<script>
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
      songs: [
        {
          title: 'Electronic Future Beats',
          artist: 'QubeSounds',
          src: ElectronicFutureBeats
        },
        {
          title: 'TheBlackestBouquet',
          artist: 'LeonellCassio',
          src: LeonellCassioTheBlackestBouquet118766
        },
        {
          title: 'MazaphonkMusic',
          artist: 'AlexiAction',
          src: MazaphonkMusicBy0to8AlexiActionInfraction128845
        },
        {
          title: 'Password Infinity',
          artist: 'Evgeny_Bardyuzha',
          src: PasswordInfinity123276
        },
        {
          title: 'Powerful Energetic Sport Rock Trailer',
          artist: 'QubeSounds',
          src: PowerfulEnergeticSportRockTrailer122077
        },
        {
          title: 'SciFi Cyberpunk Trailer',
          artist: 'Stringer Bell',
          src: SciFiCyberpunkTrailer110587
        },
      ],
      player: new Audio()
    };
  },
  methods: {
    play(song) {
      if (typeof song.src != 'undefined') {
        this.current = song;
        this.player.src = this.current.src;
      }
      this.player.play();
      this.player.addEventListener('ended', () => {
        this.index++;
        if (this.index > this.songs.length - 1) {
          this.index = 0;
        }
        this.current = this.songs[this.index];
        this.play(this.current);
      });
      this.isPlaying = true;
    },
    pause() {
      this.player.pause();
      this.isPlaying = false;
    },
    next() {
      this.index++;
      if (this.index > this.songs.length - 1) {
        this.index = 0;
      }
      this.current = this.songs[this.index];
      this.play(this.current);
    },
    prev() {
      this.index--;
      if (this.index < 0) {
        this.index = this.songs.length - 1;
      }
      this.current = this.songs[this.index];
      this.play(this.current);
    }
  },
  created() {
    this.current = this.songs[this.index];
    this.player.src = this.current.src;
  },
  beforeUnmount() {
    this.pause();
  }
};
</script>

<style scoped>
.song-title {
  color: #53565A;
  font-size: 32px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
}
.song-title span {
  font-weight: 400;
  font-style: italic;
}
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 15px;
}
.playlistbutton {
  appearance: none;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}
.playlistbutton:hover {
  opacity: 0.8;
}
.play, .pause {
  font-size: 20px;
  font-weight: 700;
  padding: 15px 25px;
  margin: 0px 15px;
  border-radius: 8px;
  color: #FFF;
  background-color: #CC2E5D;
}
.next, .prev {
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  margin: 0px 15px;
  border-radius: 6px;
  color: #FFF;
  background-color: #FF5858;
}
.playlist {
  padding: 0px 30px;
}
.playlist h3 {
  color: #212121;
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 30px;
  text-align: center;
}
.playlist .song {
  display: block;
  width: 100%;
  padding: 15px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}
.playlist .song:hover {
  color: #FF5858;
}
.playlist .song.playing {
  color: #FFF;
  background-image: linear-gradient(to right, #CC2E5D, #FF5858);
}
</style>
