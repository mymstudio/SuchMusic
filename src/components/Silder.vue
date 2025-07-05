<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { h, ref } from 'vue'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        'a',
        {
          href: 'https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F',
          target: '_blank',
          rel: 'noopenner noreferrer'
        },
        '为我推荐'
      ),
    key: 'hear-the-wind-sing',
    icon: renderIcon(BookIcon)
  },
  {
    label: '发现音乐',
    key: 'pinball-1973',
    icon: renderIcon(BookIcon),
  },
  {
    label: '本地歌曲',
    key: 'a-wild-sheep-chase',
    icon: renderIcon(BookIcon),
  },
  {
    label: '最近播放',
    key: 'dance-dance-dance',
    icon: renderIcon(BookIcon),
  }
]

const activeKey = ref('pinball-1973')

</script>

<template>

  <div class="slider">
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