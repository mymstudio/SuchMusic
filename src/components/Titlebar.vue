<script setup lang="ts">
import { Window } from '@tauri-apps/api/window';
const appWindow = new Window('main');

function minimizeWindow() {
  appWindow.minimize().then(() => {
    console.log("Window minimized");
  }).catch((error) => {
    console.error("Failed to minimize window:", error);
  });
}
function maximizeWindow() {
  appWindow.maximize().then(() => {
    console.log("Window minimized");
  }).catch((error) => {
    console.error("Failed to minimize window:", error);
  });
}

function closeWindow() {
  appWindow.close().then(() => {
    console.log("Window closed");
  }).catch((error) => {
    console.error("Failed to close window:", error);
  });
}

</script>

<template>
  <div class="titlebar">
    <div style="gap: 2px;align-items: center; display: flex; height: 100%;;">

      <div class="titlebar-button" @click="minimizeWindow">
        <img src="../assets/min.svg" alt="minimize" height="18px" />
      </div>
      <div class="titlebar-button" @click="maximizeWindow">
        <img src="../assets/max.svg" alt="maximize" height="14px" />
      </div>
      <div class="titlebar-button-close" @click="closeWindow">
        <img height="18px" src="../assets/close.svg" alt="close" />
      </div>
    </div>
  </div>


</template>

<style scoped>
.titlebar {
  position: relative;
  user-select: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
  padding: 6px 12px;
}

.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  user-select: none;
  transition: all 0.2s ease-in-out;
  border-radius: 6px;
  -webkit-user-select: none;
}

.titlebar-button:hover {
  background: #bbbbbb67;
}

.titlebar-button-close {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  user-select: none;
  transition: all 0.1s ease-in-out;
  border-radius: 6px;
  -webkit-user-select: none;

  img {
    filter: brightness(1);
    transition: all 0.1s ease-in-out;
  }


}

.titlebar-button-close:hover {
  background: #ff3636d5;

  img {
    filter: brightness(10);
  }

}
</style>
