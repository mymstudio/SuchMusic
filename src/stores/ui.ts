// src/stores/ui.ts
import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({
    isPanelOpen: false, // 控制是否展开面板
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
    }
  }
});