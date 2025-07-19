<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { usePlayerStore } from '../../../stores/player';
import Lyrics from './Lyrics.vue';
import { useUIStore } from '../../../stores/ui';
import { onBeforeUnmount } from 'vue';

const playerStore = usePlayerStore();
const backgroundimg = ref(playerStore.currentSong?.picUrl || '');
const dominantColor = ref('#ffffff'); // 默认白色
const adjustedColor = ref('#ffffff'); // 调整后的颜色
const themeColor = '#1DB954'; // 假设的主题色(Spotify绿)

// 创建一个隐藏的 canvas 用于取色
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// 提取并调整主色（使用前端 Canvas 方式）

// 提取并调整主色（使用前端 Canvas 方式）
const extractAndAdjustColor = (imgUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // 支持跨域图片
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData?.data;

        if (!pixelData) {
            console.error('无法获取图像像素数据');
            return;
        }

        // 简单平均取色法（可替换为更复杂的算法）
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let i = 0; i < pixelData.length; i += 4) {
            rSum += pixelData[i];
            gSum += pixelData[i + 1];
            bSum += pixelData[i + 2];
            count++;
        }
        const avgR = Math.round(rSum / count);
        const avgG = Math.round(gSum / count);
        const avgB = Math.round(bSum / count);

        const color = rgbToHex(avgR, avgG, avgB);
        dominantColor.value = color;

        // 改为调亮处理

        adjustedColor.value = increaseBrightness(color, 0.8); // 固定调亮系数为 0.5
        console.log('dominantColor', dominantColor.value);
        console.log('adjustedColor', adjustedColor.value);
    };
    img.src = imgUrl;
};

// 新增：颜色调亮函数（仅增加亮度）
function increaseBrightness(color: string, factor: number): string {
    const [r, g, b] = hexToRgb(color);
    return rgbToHex(
        Math.min(255, r + (255 - r) * factor),
        Math.min(255, g + (255 - g) * factor),
        Math.min(255, b + (255 - b) * factor)
    );
}

// 删除原来的 lightenColor 函数

// 辅助函数: hex转rgb
function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

// 辅助函数: rgb转hex
function rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}
const uiStore = useUIStore();

// 接收 props
const props = defineProps<{
    backgroundopen: boolean;
}>(); Deleted: ;

// 定义 emit
const emit = defineEmits<{
    (e: 'update:backgroundopen', value: boolean): void;
}>(); Deleted: ;

// 当前封面图 URL

// 监听 currentSong 变化，自动更新图片地址
watch(() => playerStore.currentSong, (newSong) => {
    if (newSong && newSong.picUrl) {
        backgroundimg.value = newSong.picUrl;
    }
}); Deleted: ;

// 流体动画状态
const fluidAnimation = ref({
    rotate: 0,
    skewX: 0,
    skewY: 0,
    scale: 1
}); Deleted: ;

let animationId: number | null = null; Deleted: ;

// 流体动画循环
const startFluidAnimation = () => {
    if (animationId) cancelAnimationFrame(animationId);

    let lastTime = performance.now();
    const duration = 15000; // 缩短周期为15秒

    const animate = (time: number) => {
        const elapsed = time - lastTime;
        const progress = (elapsed % duration) / duration;

        // 增强旋转幅度和扭曲效果
        fluidAnimation.value = {
            rotate: Math.sin(progress * Math.PI * 2) * 8, // 增大到-8到8度的旋转
            skewX: Math.sin(progress * Math.PI * 3) * 10, // 增大到-10到10度的X轴扭曲
            skewY: Math.cos(progress * Math.PI * 1.5) * 6, // 增大到-6到6度的Y轴扭曲
            scale: 1 + Math.sin(progress * Math.PI * 4) * 0.05 // 轻微放大波动范围
        };

        animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
}; Deleted: ;

function BackgroundOpen() {
    emit('update:backgroundopen', !props.backgroundopen);
    uiStore.togglePanel();
} Deleted: ;

watch(() => backgroundimg.value, (newVal) => {
    if (newVal) {
        extractAndAdjustColor(newVal);
        startFluidAnimation();
    } else if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}, { immediate: true }); Deleted: ;

onBeforeUnmount(() => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}); Deleted: ;
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
                    <svg style="transform: scale(0.9);" xmlns='http://www.w3.org/2000/svg' width='24' height='24'
                        viewBox='0 0 24 24'>
                        <title>歌词模式</title>
                        <g id="message_4_fill" fill='none' fill-rule='evenodd'>
                            <path
                                d='M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z' />
                            <path fill='currentColor'
                                d='M19 3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7.333L4 21.5c-.824.618-2 .03-2-1V6a3 3 0 0 1 3-3zm-8 9H8a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2m5-4H8a1 1 0 0 0-.117 1.993L8 10h8a1 1 0 0 0 .117-1.993z' />
                        </g>
                    </svg>
                    <span style="transform: translateY(-0.5px);" class="bottom-right-text">演示模式</span>
                </div>
            </div>

            <div class="background-container">
                <Lyrics :lyric-active-color="dominantColor"  />
            </div>

        </div>
        <img loading="lazy" decoding="async" class="background-img" :src="backgroundimg" alt="" :style="{
            transform: `
                 scale(${1 + fluidAnimation.scale * 0.45}) 
                 rotate(${fluidAnimation.rotate * 3.5}deg)
                
               `,
            opacity: backgroundopen ? 1 : 0,
            display: backgroundopen ? 'block' : 'none'
        }">
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
    background-color: rgba(0, 0, 0, 0.603);
    z-index: 1;
    backdrop-filter: blur(60px);
    transition: transform 12s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
    transform-origin: center center;
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
    transition: transform 8s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
    transform-origin: center center;
}
</style>