<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { h, ref } from 'vue'
import SvgIcon from './SvgIcon.vue'
import { RouterLink } from 'vue-router'
const router = useRouter()
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
 
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'TopAlbums',
            params: {
              lang: 'zh-CN'
            }
          }
        },
        { default: () => '发现' }
      ),
    key: '/',
    icon() {
      return h(SvgIcon, {
        scale: 0.95, path: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m4.243 5.757c-.354-.353-4.95.707-6.364 2.122-1.414 1.414-2.475 6.01-2.122 6.364.354.353 4.95-.707 6.364-2.122 1.415-1.414 2.475-6.01 2.122-6.364M12 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2', size: 22, style: {
          marginTop: '0px',
          marginRight: '0px'
        }
      })
    },
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'LocalSongs',
            params: {
              lang: 'zh-CN'
            }
          }
        },
        { default: () => '本地' }
      ),
    key: '/local',
    icon() {
      return h(SvgIcon, {
        scale: 0.9, path: 'M10.414 3.012A1.5 1.5 0 0 1 9.5 4.926 7.5 7.5 0 1 0 19.5 12c0-1.2-.28-2.33-.779-3.332a1.5 1.5 0 0 1 2.687-1.336A10.463 10.463 0 0 1 22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12c0-4.574 2.924-8.461 7-9.902a1.5 1.5 0 0 1 1.914.914m2.086.002a1.51 1.51 0 0 1 1.86-1.47l.128.037 2.986.996a1.5 1.5 0 0 1-.81 2.885l-.138-.039-1.026-.342V12l-.005.192a3.5 3.5 0 1 1-3.16-3.676l.165.02z', size: 22, style: {
          marginTop: '0px',
          marginRight: '0px'
        }
      })
    },
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'TimeSongs',
            params: {
              lang: 'zh-CN'
            }
          }
        },
        { default: () => '最近' }
      ),
    key: '/timesongs',
     icon() {
      return h(SvgIcon, {
        scale: 0.95, path: 'M17.758 5.591 19 5.281v2.938l-2 .5V6.562a1 1 0 0 1 .758-.97Zm1.727 4.568L17 10.782V17.5a3.5 3.5 0 1 1-2-3.163V6.562a3 3 0 0 1 2.272-2.91l1.864-.467A1.5 1.5 0 0 1 21 4.64v3.58a2 2 0 0 1-1.515 1.94ZM4 5a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2zm-1 7a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m0 6a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1', size: 22, style: {
          marginBottom: '1.25px',
          marginRight: '0px'
        }
      })
    },
  }
]

const activeKey = ref('/')

function handleMenuClick(key: string) {
  router.push(key)
}

</script>

<template>

  <div class="slider">
    <div  data-tauri-drag-region style="
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 36px;
    z-index: 9;
    background-color: rgba(255, 255, 255, 0);
    ">

    </div>
    <div class="slider-logo">
      <img style="transform: translateX(3px);" src="../assets/NewLogo.svg" width="190px" alt="logo">
    </div>
    <n-menu v-model:value="activeKey" mode="vertical" :options="menuOptions" responsive style="
        margin-top: 12px;
        width: 248px;
        position: absolute;
        left: 2px;
        top: 60px;
        " />
  </div>

</template>


<style scoped>
.slider {
  width: 280px;
  height: 100vh;
  display: flex;
  background-color: #ffffff;
  flex-direction: column;
  justify-content: start;
  padding: 0 20px;
  align-items: center;
}

.slider-logo {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-top: 25px;
  height: 40px;
  gap: 6px;
  width: 98.5%;
  transition: all 0.15s ease;
}

.slider-logo:hover {
  display: flex;
  justify-content: start;
  align-items: center;
  width: 98.5%;
  margin-top: 25px;
  height: 40px;
  transform: scale(1);
  transition: all 0.3s ease-in-out;
}
</style>