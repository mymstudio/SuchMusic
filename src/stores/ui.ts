// src/stores/ui.ts
import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({
    isPanelOpen: false, // 控制是否展开面板
    isPlayListOpen: false, // 控制播放列表是否展开
  }),
  actions: {
    openPanel() {
      this.isPanelOpen = true;
    },
    closePanel() {
      this.isPanelOpen = false;
    },
    togglePanel() {
      this.isPanelOpen = !this.isPanelOpen;
    },
    // 以下是播放列表相关的操作
    openPlayList() {
      this.isPlayListOpen = true;
    },
    closePlayList() {
      this.isPlayListOpen = false;
    },
    togglePlayList() {
      this.isPlayListOpen = !this.isPlayListOpen;
    }
  }
});