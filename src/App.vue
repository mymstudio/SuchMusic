<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/core";
import Titlebar from "./components/Titlebar.vue";
import Silder from "./components/Silder.vue";
import { NConfigProvider } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import Header from "./components/Header.vue";
import axios from "axios";
import Bottom from "./components/Bottom.vue";
import { useUIStore } from './stores/ui';
const uiStore = useUIStore();

import Background from './components/views/SonusLyrics/Background.vue';
import { useThemeVars } from 'naive-ui'
const themeVars = useThemeVars()
const isDarkMode = ref(false)
const darkThemeOverrides = {
  common: {
    borderRadius: '10px',
    primaryColor: '#A4E0F1',
  }
}






const lightThemeOverrides = {
  common: {
    borderRadius: '10px',
    primaryColor: '#3080FF',
  }
}

const themeOverrides = ref({
  common: {
    borderRadius: '10px',
    primaryColor: '#3080FF',
    primaryColorHover: '#5F9CFEFF'
  },
  Menu: {
    itemColorActive: '#3080FF',
    itemTextColorActive: '#FFFFFF',
    itemIconColorActive: '#FFFFFF',
    itemIconColorActiveHover: '#FFFFFF',
    itemTextColorActiveHover: '#FFFFFF',
    itemColorActiveHover: 'rgba(48, 128, 255, 0.56)'
  },
})
// 切换主题的方法
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  themeOverrides.value = isDarkMode.value ? darkThemeOverrides : lightThemeOverrides
}



</script>

<template>


  <n-config-provider :theme="isDarkMode ? darkTheme : undefined" :theme-overrides="themeOverrides">
    <n-message-provider placement="top-right">
      <n-notification-provider>
        <div :class="{ 'scaled-down': uiStore.isPanelOpen }" class="app">
          <Silder />


          <main class="container">
            <div data-tauri-drag-region class="tuodong">
              <Header data-tauri-drag-region />
              <div class="titlebar-container">
                <Titlebar />
              </div>
            </div>




            <div class="content">

              <router-view class="main-content" v-slot="{ Component }">
                <transition name="fade">
                  <component :is="Component" />
                </transition>
              </router-view>

            </div>


          </main>
        </div>
        <Bottom class="bottom-bar" />

        <!-- 遮罩层 -->
        <Transition name="fadeA">
          <div v-show="uiStore.isPanelOpen" class="overlay" @click="uiStore.closePanel"></div>
        </Transition>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #aaaaaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}

.main-content {
  flex: 1;
  /* 自动填充剩余空间 */
  overflow: hidden;
  /* 主体内容可滚动 */
  /* 避免内容被底栏遮挡 */
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

/* 缩小动画 */
.scaled-down {
  transform: scale(0.9);
  opacity: 0.8;
  transition: all 0.4s ease-in-out;
  filter: blur(2px);
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.781);
  z-index: 9998;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.top-albums {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  padding: 14px;
  padding-left: 0;
  padding-bottom: 0px;
  gap: 12px;
  overflow-y: auto;
  height: calc(100vh - 210px);
  width: calc(100vw - 306px);
}


/* 滚动条整体样式 */
.content::-webkit-scrollbar {
  width: 5px;
  /* 设置竖向滚动条宽度 */
  height: 8px;
  /* 设置横向滚动条高度（可选） */
}

/* 滚动条轨道 */
.content::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 滚动条滑块 */
.content::-webkit-scrollbar-thumb {
  background-color: #b8b8b8;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

/* 滚动条滑块悬停效果 */
.content::-webkit-scrollbar-thumb:hover {
  background-color: #6b6b6b;
}

/* 可选：滚动条两端按钮 */
.content::-webkit-scrollbar-button {
  display: none;
}

.album-info {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  margin: 10px;
  margin-top: 10px;

  h2 {
    margin: 0;
    font-size: 1.14em;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
    /* 溢出部分用省略号表示 */
    max-width: 150px;
  }

  p {
    margin: 0;
    font-size: 0.96em;
    color: #999999;
    word-wrap: break-word;
    width: 100%;
    max-width: 150px;
  }

}

.album-item {
  display: flex;
  width: 170px;
  flex-direction: column;
  align-items: start;

  justify-content: center;
  margin-top: 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.album-item:hover {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  margin-top: 20px;
  border-radius: 10px;
  background-color: var(--hover-color);
  transition: all 0.3s ease;

  img {
    transform: scale(1.1);
    transition: all 0.3s ease;

  }


}

.album-cover {
  width: 170px;
  height: 170px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;

  /* 确保图片不会超出 */
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
}



.tuodong {
  position: absolute;
  top: 0;
  left: 266px;
  width: calc(100% - 266px);
  height: 50px;
  background-color: rgba(0, 0, 0, 0);

  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.content {
  padding: 26px 30px;
  padding-bottom: 0px;
  padding-top: 4px;
  flex: 1;
  width: calc(100% - 60px);
  /* 关键属性，表示该元素将填充可用空间 */
  min-height: 0;
  /* 防止 flex 溢出 */
  display: flex;
  flex-direction: column;
  /* 如果内部内容过高，允许滚动 */
  height: calc(100vw - 181px);
  margin-bottom: 81px;
  overflow: hidden;
  font-family: HarmonyOS_Sans_SC, sans-serif;
}

.app {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  transition: all 0.4s ease-in-out;
  overflow: hidden;
  background-color: #F6F6F6;
  font-family: HarmonyOS_Sans_SC, sans-serif;
}

.titlebar-container {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff00;

}

.container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  height: calc(100vh - 46px);
  width: 100vw;
  overflow: hidden;
  padding-top: 46px;
}
</style>
<style>
/* 定义过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  transform: translate(30%, 0%);
  opacity: 0;
}

@font-face {
  font-family: 'HarmonyOS_Sans_SC';
  src: url('./assets/HarmonyOS_Sans_SC_Medium.ttf');
}

@font-face {
  font-family: 'HarmonyOS_Sans_SC_Bold';
  src: url('./assets/HarmonyOS_Sans_SC_Bold.ttf');
}

:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  overflow: hidden;

  color: #0f0f0f;
  background-color: #ffffff;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}


/* 滚动条整体样式 */
:root::-webkit-scrollbar {
  width: 5px;
  /* 设置竖向滚动条宽度 */
  height: 8px;
  /* 设置横向滚动条高度（可选） */
}

/* 滚动条轨道 */
:root::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 滚动条滑块 */
:root::-webkit-scrollbar-thumb {
  background-color: #b8b8b8;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

/* 滚动条滑块悬停效果 */
:root::-webkit-scrollbar-thumb:hover {
  background-color: #6b6b6b;
}

/* 可选：滚动条两端按钮 */
:root::-webkit-scrollbar-button {
  display: none;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }
}
</style>