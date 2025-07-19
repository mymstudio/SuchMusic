// d:\EX Music PC\sonusmusic-pc-new\src\stores\recentlyPlayed.ts
import { defineStore } from 'pinia';
import { Song } from './player';

export const useRecentlyPlayedStore = defineStore('recentlyPlayed', {
  state: () => ({
    songs: [] as Song[],
    maxCount: 50
  }),

  actions: {
    loadFromStorage() {
      const stored = localStorage.getItem('recentlyPlayed');
      if (stored) {
        try {
          this.songs = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse recently played songs', e);
          this.songs = [];
        }
      }
    },

    saveToStorage() {
      localStorage.setItem('recentlyPlayed', JSON.stringify(this.songs));
    },

    addSong(song: Song) {
      // Remove duplicates
      this.songs = this.songs.filter(s => s.id !== song.id);
      
      // Add to beginning
      this.songs.unshift({
        ...song,
        lastPlayed: new Date().toISOString() // Add timestamp
      });
      
      // Limit count
      if (this.songs.length > this.maxCount) {
        this.songs.pop();
      }
      
      this.saveToStorage();
    },

    clearAll() {
      this.songs = [];
      this.saveToStorage();
    },

    removeSong(id: number) {
      this.songs = this.songs.filter(s => s.id !== id);
      this.saveToStorage();
    }
  },

  getters: {
    allSongs: (state) => state.songs,
    
    count: (state) => state.songs.length,
    
    filteredSongs: (state) => (query: string) => {
      if (!query) return state.songs;
      const q = query.toLowerCase();
      return state.songs.filter(song => 
        song.name.toLowerCase().includes(q) ||
        song.artists.some(a => a.name.toLowerCase().includes(q))
      );
    }
  }
});