<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { usePlayerStore } from '../../../stores/player';
import Lyrics from './Lyrics.vue';
const playerStore = usePlayerStore();

// 接收 props
const props = defineProps<{
  backgroundopen: boolean;
}>();

// 定义 emit
const emit = defineEmits<{
  (e: 'update:backgroundopen', value: boolean): void;
}>();

// 当前封面图 URL
const backgroundimg = ref(playerStore.currentSong?.picUrl || '');

// 监听 currentSong 变化，自动更新图片地址
watch(
  () => playerStore.currentSong,
  (newSong) => {
    if (newSong && newSong.picUrl) {
      backgroundimg.value = newSong.picUrl;
    }
  }
);

function BackgroundOpen() {
  emit('update:backgroundopen', !props.backgroundopen);
}
</script>

<template>

    <div class="background">
        <div class="background-overlay">

            <div class="background-top-container">
                <div @click="BackgroundOpen()" class="flex-center-center bottom-right-button">
                    <svg style="transform: scale(1.35);" xmlns='http://www.w3.org/2000/svg' width='24' height='24'
                        viewBox='0 0 24 24'>
                        <title>收起播放页</title>
                        <g id="down_line" fill='none' fill-rule='evenodd'>
                            <path
                                d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z' />
                            <path fill='currentColor'
                                d='M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414l-5.657 5.657Z' />
                        </g>
                    </svg>
                </div>
                <div @click="BackgroundOpen()" class="flex-center-center bottom-right-button-text">
                    <svg style="transform: scale(0.9);" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                        <title>歌词模式</title>
                        <g id="message_4_fill" fill='none' fill-rule='evenodd'>
                            <path
                                d='M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z' />
                            <path fill='currentColor'
                                d='M19 3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7.333L4 21.5c-.824.618-2 .03-2-1V6a3 3 0 0 1 3-3zm-8 9H8a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2m5-4H8a1 1 0 0 0-.117 1.993L8 10h8a1 1 0 0 0 .117-1.993z' />
                        </g>
                    </svg>
                    <span style="transform: translateY(-0.5px);" class="bottom-right-text">正常歌词模式（Debug）</span>
                </div>
            </div>

            <div class="background-container">
                <Lyrics />
            </div>

        </div>
        <img loading="lazy" decoding="async" class="background-img" :src="backgroundimg" alt="">
    </div>


</template>


<style scoped>
.background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 8px 8px 0 0;
}

.background-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
}

.background-top-container {
    display: flex;
    width: 100%;
    gap: 10px;
}

.background-overlay {
    position: absolute;
    border-radius: 8px 8px 0 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 16px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    backdrop-filter: blur(70px);
}

.flex-center-center {
    display: flex;
    align-items: center;
    justify-content: center;
}


.bottom-right-button {
    width: 20px;
    height: 20px;
    padding: 8px;
    border-radius: 8px;
    background-color: #ffffff00;
    transition: all 0.3s ease;
    color: #FFFFFF;
}

.bottom-right-button-text {
    height: 20px;
    padding: 8px;
    border-radius: 8px;
    background-color: #ffffff00;
    transition: all 0.3s ease;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    gap: 8px;
}

.bottom-right-button-text:hover {
    height: 20px;
    background-color: #ffffff48;
    transition: all 0.3s ease;
}

.bottom-right-button:hover {
    width: 20px;
    height: 20px;
    background-color: #ffffff48;
    transition: all 0.3s ease;
}

.bottom-right-text {
    transform: translateY(1px);
    margin-right: 8px;
}

.background-img {
    width: 100%;
    height: 100%;
    border-radius: 8px 8px 0 0;
    object-fit: cover;
}
</style>