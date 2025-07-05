<template>
    <Background :class="{
        'background-hide': !backgroundopen,
        'background-open': backgroundopen,
    }" v-model:backgroundopen="backgroundopen"/>
    <div class="bottom">
        <audio ref="hiddenAudio" :src="currentSongUrl" @ended="onAudioEnded" style="display: none;"
            preload="auto"></audio>

        <n-slider style="position: absolute; top:-8px; left: 0; width: 100vw; height: 6px;" v-model:value="progress"
            :step="1" @update:value="onProgressChange">
            <template #thumb>
                <div class="thumb"></div>
            </template>
        </n-slider>


        <div class="bottom-left">
            <!-- 使用可选链 ?. 防止 null 访问错误 -->
            <img @click="BackgroundOpen" v-if="playerStore.currentSong"
                style="position: relative; top: 2px; border-radius: 10px;"
                :src="playerStore.currentSong?.picUrl || defaultCover" alt="" height="50px">
            <div class="bottom-left-text">

                <div v-if="playerStore.currentSong" class="bottom-left-text-title">{{ playerStore.currentSong.name }}
                </div>

                <div v-else class="bottom-left-text-title">欢迎来到 Such Music
                </div>

                <div v-if="playerStore.currentSong" class="bottom-left-text-artist">{{
                    formatArtists(playerStore.currentSong.artists) }}</div>


                <div v-else class="bottom-left-text-artist">
                    在上方搜索框搜索歌曲，专辑，歌手</div>
            </div>
        </div>

        <div class="bottom-center">

            <div style="display: flex; align-items: center; justify-content: center; color: black;">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24"
                    height="28" viewBox="0 0 24 24" version="1.1">
                    <title>Public/ic_public_play_last</title>
                    <defs>
                        <path
                            d="M19.2659255,6.65608891 C19.4195201,6.92212253 19.5003811,7.22389975 19.5003811,7.53108891 L19.5003811,16.4689111 C19.5003811,17.4354094 18.7168794,18.2189111 17.7503811,18.2189111 C17.4431919,18.2189111 17.1414147,18.1380501 16.8753811,17.9844555 L9.135,13.5155445 C8.29798791,13.0322953 8.01120639,11.9620121 8.49445554,11.125 C8.64805012,10.8589664 8.86896638,10.6380501 9.135,10.4844555 L16.8753811,6.01554446 C17.7123931,5.5322953 18.7826764,5.81907682 19.2659255,6.65608891 Z M5,6.25 C5.55228475,6.25 6,6.69771525 6,7.25 L6,7.25 L6,16.75 C6,17.3022847 5.55228475,17.75 5,17.75 C4.44771525,17.75 4,17.3022847 4,16.75 L4,16.75 L4,7.25 C4,6.69771525 4.44771525,6.25 5,6.25 Z"
                            id="_path-1" />
                    </defs>
                    <g id="_Public/ic_public_play_last" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <mask id="_mask-2" fill="white">
                            <use xlink:href="#_path-1" />
                        </mask>
                        <use id="_形状结合" fill="currentColor" xlink:href="#_path-1" />
                    </g>
                </svg>
            </div>

            <div style="
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            
            border-radius: 100000px;
            background-color: var(--thumb-color);
            " @click="togglePlay">
                <svg v-if="!pause" style="transform: scale(0.82) translateX(1px);" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24">
                    <rect width="24" height="24" opacity="0"></rect>
                    <g>
                        <path
                            d="M6.65 2.54Q5.88 2.11 5.09 2.26Q4.3 2.4 3.77 3.02Q3.24 3.65 3.24 4.51L3.24 19.46Q3.24 20.33 3.77 20.95Q4.3 21.58 5.09 21.73Q5.88 21.89 6.65 21.46L19.61 13.97Q20.38 13.54 20.65 12.77Q20.93 12 20.65 11.23Q20.38 10.46 19.61 10.03L6.65 2.54Z"
                            fill="currentColor"></path>
                    </g>
                </svg>

                <svg v-if="pause" style="transform: scale(0.98) translateX(0px);" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <title>pause_line</title>
                    <g id="pause_line" fill='none'>
                        <path
                            d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z' />
                        <path fill='currentColor'
                            d='M8 4a1 1 0 0 1 .993.883L9 5v14a1 1 0 0 1-1.993.117L7 19V5a1 1 0 0 1 1-1m8 0a1 1 0 0 1 .993.883L17 5v14a1 1 0 0 1-1.993.117L15 19V5a1 1 0 0 1 1-1' />
                    </g>
                </svg>

            </div>

            <div style="display: flex; align-items: center; justify-content: center; color: black;">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24"
                    height="24" viewBox="0 0 24 24" version="1.1">
                    <title>Public/ic_public_play_next</title>
                    <defs>
                        <path
                            d="M4.73445554,6.65608891 C5.2177047,5.81907682 6.28798791,5.5322953 7.125,6.01554446 L7.125,6.01554446 L14.8653811,10.4844555 C15.1314147,10.6380501 15.3523309,10.8589664 15.5059255,11.125 C15.9891747,11.9620121 15.7023931,13.0322953 14.8653811,13.5155445 L14.8653811,13.5155445 L7.125,17.9844555 C6.85896638,18.1380501 6.55718916,18.2189111 6.25,18.2189111 C5.28350169,18.2189111 4.5,17.4354094 4.5,16.4689111 L4.5,16.4689111 L4.5,7.53108891 C4.5,7.22389975 4.58086096,6.92212253 4.73445554,6.65608891 Z M18.25,6.25 C18.8022847,6.25 19.25,6.69771525 19.25,7.25 L19.25,16.75 C19.25,17.3022847 18.8022847,17.75 18.25,17.75 C17.6977153,17.75 17.25,17.3022847 17.25,16.75 L17.25,7.25 C17.25,6.69771525 17.6977153,6.25 18.25,6.25 Z"
                            id="_path-2" />
                    </defs>
                    <g id="_Public/ic_public_play_next" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <mask id="_mask-2" fill="white">
                            <use xlink:href="#_path-2" />
                        </mask>
                        <use id="_形状结合1" fill="currentColor" xlink:href="#_path-2" />
                    </g>
                </svg>
            </div>
        </div>

        <div class="bottom-right">

            <div class="bottom-right-text">{{ formattedCurrentTime }} / {{ formattedDuration }}</div>

            <div class="flex-center-center bottom-right-button">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24"
                    height="24" viewBox="0 0 24 24" version="1.1">
                    <title>随机播放</title>
                    <defs>
                        <path
                            d="M22.5428932,17 C22.6755015,17 22.8026784,17.0526784 22.8964466,17.1464466 C23.0917088,17.3417088 23.0917088,17.6582912 22.8964466,17.8535534 L22.8964466,17.8535534 L20.6035534,20.1464466 C20.5097852,20.2402148 20.3826082,20.2928932 20.25,20.2928932 C19.9738576,20.2928932 19.75,20.0690356 19.75,19.7928932 L19.75,19.7928932 L19.75,18.4971068 L19.5715331,18.4936768 C18.2268663,18.4305831 16.9465051,17.8973966 15.9545082,16.9874231 L15.7600201,16.8004323 L12.768,13.785 L13.829,12.725 L16.8246907,15.7437978 C17.5656306,16.4903728 18.5548505,16.9336053 19.5993305,16.9931152 L19.8412575,17 Z M20.25,3.70710678 C20.3826082,3.70710678 20.5097852,3.7597852 20.6035534,3.85355339 L22.8964466,6.14644661 C23.0917088,6.34170876 23.0917088,6.65829124 22.8964466,6.85355339 C22.8026784,6.94732158 22.6755015,7 22.5428932,7 L19.8412575,7 C18.7085073,7 17.622626,7.45219834 16.8246907,8.25620224 L8.34495239,16.8004323 C7.26539288,17.8882022 5.7962594,18.5 4.26371502,18.5 L1.75,18.5 C1.33578644,18.5 1,18.1642136 1,17.75 C1,17.3357864 1.33578644,17 1.75,17 L4.26371502,17 C5.39646521,17 6.48234648,16.5478017 7.28028177,15.7437978 L15.7600201,7.19956774 C16.8181766,6.13336357 18.250613,5.52444573 19.7501835,5.50072036 L19.75,4.20710678 C19.75,3.93096441 19.9738576,3.70710678 20.25,3.70710678 Z M4.26371502,5.5 C5.70610973,5.5 7.09233423,6.0419385 8.15046426,7.01257686 L8.34495239,7.19956774 L11.364,10.242 L10.303,11.302 L7.28028177,8.25620224 C6.53934186,7.50962719 5.550122,7.06639469 4.50564197,7.00688482 L4.26371502,7 L1.75,7 C1.33578644,7 1,6.66421356 1,6.25 C1,5.87030423 1.28215388,5.55650904 1.64822944,5.50684662 L1.75,5.5 L4.26371502,5.5 Z"
                            id="_path-3" />
                    </defs>
                    <g id="_Public/ic_public_random" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <mask id="_mask-2" fill="white">
                            <use xlink:href="#_path-3" />
                        </mask>
                        <use id="_合并形状" fill="currentColor" fill-rule="nonzero" xlink:href="#_path-3" />
                    </g>
                </svg>
            </div>
            <div class="flex-center-center bottom-right-button">
                <svg t="1748098099438" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="2635" width="32" height="32">
                    <path
                        d="M260.256 356.576l204.288-163.968a32 32 0 0 1 52.032 24.96v610.432a32 32 0 0 1-51.968 24.992l-209.92-167.552H96a32 32 0 0 1-32-32v-264.864a32 32 0 0 1 32-32h164.256zM670.784 720.128a32 32 0 0 1-44.832-45.664 214.08 214.08 0 0 0 64.32-153.312 213.92 213.92 0 0 0-55.776-144.448 32 32 0 1 1 47.36-43.04 277.92 277.92 0 0 1 72.416 187.488 278.08 278.08 0 0 1-83.488 198.976zM822.912 858.88a32 32 0 1 1-45.888-44.608A419.008 419.008 0 0 0 896 521.152c0-108.704-41.376-210.848-114.432-288.384a32 32 0 0 1 46.592-43.872c84.16 89.28 131.84 207.04 131.84 332.256 0 127.84-49.76 247.904-137.088 337.728z"
                        fill="currentColor" p-id="2636"></path>
                </svg>
            </div>
            <n-badge style="transform: scale(1);" value="3" color="grey">
                <div class="flex-center-center bottom-right-button">

                    <svg t="1748098178548" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="3641" width="32" height="32">
                        <path
                            d="M85.333333 768h426.666667v85.333333H85.333333v-85.333333z m0-298.666667h597.333334v85.333334H85.333333v-85.333334z m0-298.666666h853.333334v85.333333H85.333333V170.666667z m725.333334 476.586666V384h213.333333v85.333333h-128v298.666667a128 128 0 1 1-85.333333-120.746667z"
                            fill="currentColor" p-id="3642"></path>
                    </svg>

                </div>
            </n-badge>
        </div>
    </div>
    <Spectrum style="display: none;" />
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import Spectrum from './Spectrum.vue';
import { useThemeVars } from 'naive-ui';
import { usePlayerStore } from '../stores/player';
import { useAudioStore } from '../stores/audio';
import Background from './views/SonusLyrics/Background.vue';
const themeVars = useThemeVars();
const playerStore = usePlayerStore();
const audioStore = useAudioStore();
const pause = ref(false);
const hiddenAudio = ref<HTMLAudioElement | null>(null);
document.documentElement.style.setProperty('--thumb-color', themeVars.value.primaryColor);

const backgroundopen = ref(false);

const BackgroundOpen = () => {
    backgroundopen.value = !backgroundopen.value;
};




// 获取当前歌曲 URL
const currentSongUrl = computed(() => {
    return playerStore.currentSong?.mp3Url || '';
});

// 格式化艺术家信息
const formatArtists = (artists: any[]) => {
    if (!artists || !Array.isArray(artists) || artists.length === 0) {
        return '未知艺术家';
    }
    return artists.map(artist => artist?.name || '未知').join(' / ');
};

// 进度条相关计算属性和方法
const progress = computed({
    get: () => {
        if (audioStore.duration === 0) return 0;
        return (audioStore.currentTime / audioStore.duration) * 100;
    },
    set: (value) => {
        const newTime = (value / 100) * audioStore.duration;
        audioStore.seekTo(newTime);
    }
});

// 时间格式化函数
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 格式化显示时间
const formattedCurrentTime = computed(() => formatTime(audioStore.currentTime));
const formattedDuration = computed(() => formatTime(audioStore.duration));

// 播放/暂停切换
function togglePlay() {
    audioStore.togglePlayPause();
    if (audioStore.isPlaying) {
            pause.value = false;
        } else {
            pause.value = true;
        }
}

// 拖动进度条跳转播放位置
function onProgressChange(value: number) {
    const newTime = (value / 100) * audioStore.duration;
    audioStore.seekTo(newTime);
}

watch(
    () => audioStore.isPlaying,
    (newIsPlaying) => {
        console.log('isPlaying', newIsPlaying);
        if (newIsPlaying) {
            pause.value = false;
        } else {
            pause.value = true;
        }
    
    }
);

// 歌曲变化时自动播放
watch(
    () => playerStore.currentSong,
    async (newSong) => {
        if (newSong && newSong.mp3Url) {
            audioStore.playAudio(newSong.mp3Url, hiddenAudio.value); // 传入隐藏的 <audio> 元素
            audioStore.setMediaSessionMetadata(
                newSong.name,
                formatArtists(newSong.artists),
                'EX Music',
                newSong.picUrl
            );
        }
    }
);
</script>

<style scoped>
.flex-center-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.background-open {
    position: fixed;
    border-radius: 10px 10px 10px 10px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    transition: all 0.35s ease;
}

.background-hide {
    opacity: 0;
    top: 100vh;
    transition: all 0.5s ease;
    z-index: 9999;
}

.thumb {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: var(--thumb-color);
    position: relative;
    left: -5px;
    transition: all 0.3s ease;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.151);
}

.bottom-right-button {
    width: 20px;
    height: 20px;
    padding: 8px;
    border-radius: 8px;
    background-color: #fff;
    transition: all 0.3s ease;
}

.bottom-right-button:hover {
    width: 20px;
    height: 20px;
    background-color: var(--hover-color);
    transition: all 0.3s ease;
}

.bottom-right-text {
    transform: translateY(1px);
    margin-right: 8px;
}

.thumb:hover {
    width: 9px;
    transform: scale(1.2);
    height: 9px;
    border-radius: 50%;
    background-color: var(--thumb-color);
    position: relative;
    left: -5px;
}

.bottom-left {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 8px);
    padding-left: 16px;
    gap: 13px;
    color: #313131;
    font-size: 16px;
    font-family: HarmonyOS_Sans_SC_Bold, sans-serif;
    font-weight: bold;
}

.bottom-center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    position: relative;
    left: 4px;
}

.bottom-right {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    gap: 8px;
    padding-right: 32px;
}

.bottom-left-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    position: relative;
    top: 2px;
}

.bottom-left-text-title {
    font-size: 17px;
    font-weight: bold;
    line-height: 1.2;
}

.bottom-left-text-artist {
    font-size: 14px;
    font-family: HarmonyOS_Sans_SC;
    font-weight: 500;
    color: #999999;
    line-height: 1.2;
}

.bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 80px;
    background-color: #ffffff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #555;
}
</style>