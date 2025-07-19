// src/stores/player.ts
import { defineStore } from 'pinia';
import { useRecentlyPlayedStore } from './recentlyPlayed';

export interface Song {
  id: number;
  name: string;
  picUrl: string | null;
  artists: any[];
  album: any;
  mp3Url: string;
  lyric: string | null;
  tlyric: string | null;
}

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentSong: null as Song | null,
  }),
  actions: {
    playSong(song: Song) {
      this.currentSong = song;
      const recentlyPlayed = useRecentlyPlayedStore();
      recentlyPlayed.addSong(song);
    },
    stop() {
      this.currentSong = null;
    }
  }
});