<script lang="ts" setup>
import { usePlayerStore } from '../../../stores/player';
import { useAudioStore } from '../../../stores/audio'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { watch } from 'vue'
const playerStore = usePlayerStore();
const playedAnimation = ref<number | null>(null)
const defaultLyrics = computed(() => playerStore.currentSong?.lyric || '')
const defaultLyricsT = computed(() => playerStore.currentSong?.tlyric || '')
// Props 定义
const props = defineProps({
    lyricsString: {
        type: String,
        default: ''
    },
    lyricsTString: {
        type: String,
        default: ''
    },
    lyricColor: {
        type: String,
        default: '#FFFFFF'
    },
    lyricActiveColor: {

        type: String,
        default: '#FFFFFF'
    },
    lyricTColor: {
        type: String,
        default: '#FFFFFFB0'
    },
    lyricTActiveColor: {
        type: String,
        default: '#FFFFFFB0'
    },
    lyricOpacity: {
        type: Number,
        default: 50
    },
    lyricActiveOpacity: {
        type: Number,
        default: 100
    },
    lyricSize: {
        type: Number,
        default: 26.5
    },
    lyricTSize: {
        type: Number,
        default: 20
    },
    lyricScale: {
        type: Number,
        default: 80
    },
    lyricActiveScale: {
        type: Number,
        default: 90
    },
    lyricPadding: {
        type: Number,
        default: 16
    },
    listPadding: {
        type: Number,
        default: 32
    },
    lyricTop: {
        type: Number,
        default: 150
    },
    lyricSpeed: {
        type: Number,
        default: 800
    },
    lyricCenter: {
        type: Boolean,
        default: false
    },
    lyricBlur: {
        type: Boolean,
        default: false
    },
    lyricBold: {
        type: Boolean,
        default: false
    },
    lyricTBold: {
        type: Boolean,
        default: false
    },
    lyricShadow: {
        type: String,
        default: '0 0 16px #FFFFFF80'
    }
})

// 修改弹性动画函数，专注位移效果
function elasticBounce(element: HTMLElement, callback?: () => void) {
    let start = performance.now();
    let duration = 650; // 动画持续时间
    
    // 获取初始位置
    const style = window.getComputedStyle(element);
    const currentTransform = style.transform;
    let initialY = 0;
    
    // 解析当前的 translateY 值
    if (currentTransform && currentTransform !== 'none') {
        const values = currentTransform.match(/translateY$([^)]+)$/);
        if (values && values.length > 1) {
            initialY = parseFloat(values[1]);
        }
    }

    function animate(time: number) {
        let progress = Math.min((time - start) / duration, 1);
        let ease = 1 - Math.pow(1 - progress, 4);
        let translateY = -10 * ease + 3 * Math.pow(ease, 2) * Math.sin(ease * Math.PI);

        element.style.transform = `translateY(${translateY}px)`;
        
        // 添加防卡顿机制
        if (!isAnimationActive) {
            element.style.transform = `translateY(0px)`;
            callback?.();
            return;
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.transform = 'translateY(0px)';
            callback?.();
        }
    }

    let isAnimationActive = true;
    
    // 添加自动清理机制防止内存泄漏
    if (element) {
        element.addEventListener('transitionend', () => {
            isAnimationActive = false;
        }, { once: true });
    }
    
    requestAnimationFrame(animate);
}

const emit = defineEmits(['clickLyric'])
const parsedLyrics = ref<Array<{ time: string, text: string, trans: string }>>([])
// 添加 missing 的 lyricListRef 声明
const lyricListRef = ref<HTMLElement | null>(null)

// 解析状态
const isParseSuccess = ref(false)
const parseError = ref<string | null>(null)
const lyricRefs = ref<Record<number, HTMLElement>>({})
const currentLyricIndex = ref<number>(0)

// 弹簧动画状态
const springState = ref<{ position: number, velocity: number }>({ position: 0, velocity: 0 });

// 弹簧算法函数
function springAnimation(
    current: number,
    target: number,
    velocity: number,
    stiffness: number = 150,
    damping: number = 20,
    dt: number = 1 / 60
): { position: number, velocity: number } {
    const force = -stiffness * (current - target);
    const damper = -damping * velocity;
    const acceleration = (force + damper) / 1;
    velocity += acceleration * dt;
    const position = current + velocity * dt;
    return { position, velocity };
}
// 使用弹簧动画实现歌词滚动
function scrollToCurrentLyricWithSpring() {
    console.log('[scrollToCurrentLyricWithSpring] 开始滚动到当前歌词');

    const lyricList = lyricListRef.value;
    const lyricItem = lyricRefs.value[currentLyricIndex.value];

    if (!lyricList || !lyricItem) {
        console.warn('[scrollToCurrentLyricWithSpring] DOM 元素不存在');
        return;
    }

    console.log(`[scrollToCurrentLyricWithSpring] 当前歌词索引: ${currentLyricIndex.value}`);

    const containerHeight = lyricList.clientHeight;
    const itemTop = lyricItem.offsetTop;
    const itemHeight = lyricItem.clientHeight;

    // 增加固定偏移值 (例如 +20)
    const targetScrollTop = itemTop - containerHeight / 2 + itemHeight / 2 + 500 - 80; 

    console.log(`[scrollToCurrentLyricWithSpring] 容器高度: ${containerHeight}, 歌词项顶部位置: ${itemTop}, 歌词项高度: ${itemHeight}`);
    console.log(`[scrollToCurrentLyricWithSpring] 目标滚动位置: ${targetScrollTop}`);

    // 初始化弹簧状态为当前滚动位置
    springState.value.position = lyricList.scrollTop;

    let lastTime = performance.now();

    function animate(currentTime: number) {
        const dt = currentTime - lastTime;
        lastTime = currentTime;

        const { position, velocity } = springAnimation(
            springState.value.position,
            targetScrollTop,
            springState.value.velocity,
            150, // stiffness
            20,  // damping
            dt / 1000
        );

        springState.value = { position, velocity };

        lyricList.scrollTop = position;

        console.log(`[scrollToCurrentLyricWithSpring] 弹簧动画位置: ${position}, 速度: ${velocity}`);

        if (Math.abs(position - targetScrollTop) > 1 || Math.abs(velocity) > 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);

    // 获取当前滚动容器的位置
    const containerRect = lyricList.getBoundingClientRect();

    // 为每个歌词项添加延迟动画
    Object.entries(lyricRefs.value).forEach(([indexStr, ref]) => {
        const index = parseInt(indexStr);

        // 跳过当前激活的歌词项
        if (index === currentLyricIndex.value || !ref) {
            return;
        }

        // 计算该歌词项在可视区域中的位置
        const itemRect = ref.getBoundingClientRect();
        const containerRect = lyricListRef.value?.getBoundingClientRect() || {
            top: 0,
            bottom: window.innerHeight
        };

        const isInView = (
            itemRect.top >= containerRect.top &&
            itemRect.bottom <= containerRect.bottom
        );

        console.log(`[scrollToCurrentLyricWithSpring] 歌词项 ${index} 是否在可视区域: ${isInView}`);

        // 只对可视区域内的歌词项应用动画
        if (isInView) {
            // 根据与当前歌词的距离计算延迟时间（每层间隔30ms，最大200ms）
            const distance = Math.abs(index - currentLyricIndex.value);
            const delay = Math.min(distance * 40, 200); // 最大延迟200ms

            // 增加调试信息显示容器尺寸
            const containerHeight = lyricListRef.value?.clientHeight || window.innerHeight;
            const itemTop = ref.offsetTop;
            const itemHeight = ref.clientHeight;

            // 更精确的目标位置计算，并添加偏移量避免负值
            const baseOffset = 100; // 基础偏移量
            const targetScrollTop = itemTop - (containerHeight / 2) + (itemHeight / 2) + baseOffset + 20; // 偏移 +20


            // 使用规范推荐的弹性动画方式
            setTimeout(() => {
                elasticBounce(ref)
            }, delay);
        }
    });

}

// 替换原有的滚动逻辑
watch(currentLyricIndex, (newIndex) => {
    scrollToCurrentLyricWithSpring(); // 触发弹簧滚动

    
    const lyricItem = lyricRefs.value[newIndex];
    if (lyricItem) {
        elasticBounce(lyricItem); // 触发当前歌词弹性动画
    }

    playedAnimation.value = newIndex;
    setTimeout(() => {
        playedAnimation.value = null;
    }, 500);
});

let animationFrameId: number | null = null
const audioStore = useAudioStore()
// 在 onMounted 内部保持初始化结构不变
onMounted(() => {
    // 不立即解析歌词
    parsedLyrics.value = []
})

// 在 setup 中添加
onBeforeUnmount(() => {
    stopLyricUpdate()
})

// 添加 effectiveLyricsString 的定义
const effectiveLyricsString = computed(() => {
    return props.lyricsString || defaultLyrics.value
})

// 添加 effectiveLyricsStringT 的定义
const effectiveLyricsStringT = computed(() => {
    return props.lyricsTString || defaultLyricsT.value
})

// 监听歌曲播放状态，触发歌词解析和监听
watch(
    () => audioStore.isPlaying,
    (isPlaying) => {
        if (isPlaying && playerStore.currentSong) {
            // 解析歌词
            parsedLyrics.value = parseLyrics()
            // 启动时间监听

        } else {
            // 停止时间监听
            stopLyricUpdate()
        }
    },
    { immediate: true }
)

// 动态更新 currentLyricIndex
watch(() => audioStore.currentTime, (newTime) => {
    const index = parsedLyrics.value.findIndex((lyric) => convertToSeconds(lyric.time) > newTime);
    if (index !== -1) {
        currentLyricIndex.value = Math.max(0, index - 1);
    }
});

// 确保 lyricRefs 正确绑定 DOM 元素
function setLyricRef(el: HTMLElement | null, index: number) {
    if (el) {
        lyricRefs.value[index] = el;
    }
}

// 动态计算歌词样式
function getLyricStyle(index: number) {
    const isVisible = isLyricVisible(index)
    const isActive = index === currentLyricIndex.value

    let opacity = 1
    let blur = 0
    let fontSize = isActive ? props.lyricSize * props.lyricActiveScale : props.lyricSize

    if (!isActive && isVisible) {
        // 增加模糊度：距离越远，模糊越大（最大 6px）
        const distance = Math.abs(index - currentLyricIndex.value)
        blur = Math.min(6, distance * 1.2) // 每增加一个歌词行，模糊度 +1.2px
        opacity = Math.max(0.3, 1 - distance * 0.15) // 距离越远，透明度越低
    }

    return {
        opacity,
        fontSize: `${fontSize}px`,
        filter: `blur(${blur}px)`
    }
}
// 判断歌词是否在可视区域内
function isLyricVisible(index: number): boolean {
    const lyricList = lyricListRef.value
    const lyricItem = lyricRefs.value[index]

    if (!lyricList || !lyricItem) return false

    const listRect = lyricList.getBoundingClientRect()
    const itemRect = lyricItem.getBoundingClientRect()

    return (
        itemRect.top >= listRect.top &&
        itemRect.bottom <= listRect.bottom
    )
}

// 解析歌词的方法
function parseLyrics(): Array<{ time: string, text: string, trans: string }> {
    const lyricsToParse = effectiveLyricsString.value
    const lyricsToParseT = effectiveLyricsStringT.value
    if (lyricsToParse === '') {
        isParseSuccess.value = false
        parseError.value = '歌词内容为空'
        console.warn('歌词内容为空')
        return []
    }

    try {
        const newLyrics: string = lyricsToParse.replace(/\\n/g, '\n')
        const newLyricsT: string = lyricsToParseT.replace(/\\n/g, '\n')

        const regex = /\[(\d{2}:\d{2}\.\d{2,3})\](.*)/g

        const lyricsMap: { [key: string]: { time: string, text: string, trans: string } } = {}
        const matches = [...newLyrics.matchAll(regex), ...newLyricsT.matchAll(regex)]
        matches.forEach(([match, timestemp, text]) => {
            if (lyricsMap[timestemp]) {
                lyricsMap[timestemp].trans = text.trim()
            } else {
                lyricsMap[timestemp] = { time: timestemp, text: text.trim(), trans: '' }
            }
        })

        // 过滤掉文本和翻译都为空的行
        const filteredLyrics = Object.values(lyricsMap) // 不过滤

        isParseSuccess.value = true
        parseError.value = null
        console.log('解析歌词成功', filteredLyrics)
        return filteredLyrics
    } catch (error) {
        isParseSuccess.value = false
        parseError.value = error instanceof Error ? error.message : '未知错误'
        console.error('解析歌词出错:', error)
        return []
    }
}




function stopLyricUpdate() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }
}

// 处理点击歌词事件
function handleLyricClick(time: string) {
    emit('clickLyric', convertToSeconds(time))
}



function easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3;
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return Math.max(0, Math.min(1, Math.pow(2, -9 * x) * Math.sin((x * 10 - 0.75) * c4) + 1));
}

function createBounceEffect(element: HTMLElement, finalPosition: number) {
    let bounceStart = performance.now();
    const bounceDuration = 200; // 震动持续时间
    const startPos = finalPosition;

    function bounceAnimation(time: number) {
        const elapsed = time - bounceStart;
        const bounceProgress = Math.min(elapsed / bounceDuration, 1);

        // 简单的震动函数
        const bounceOffset = Math.sin(bounceProgress * Math.PI * 2) * (1 - bounceProgress) * 4;
        element.scrollTop = startPos + bounceOffset;

        if (bounceProgress < 1) {
            requestAnimationFrame(bounceAnimation);
        }
    }

    requestAnimationFrame(bounceAnimation);
}


// 平滑滚动函数（带偏移量和延迟）
function smoothScrollTo(
    element: HTMLElement,
    targetPosition: number,
    duration: number,
    delay: number = 0
) {
    console.log(`[smoothScrollTo] 开始滚动元素，目标位置: ${targetPosition}, 持续时间: ${duration}ms, 延迟: ${delay}ms`);

    // 确保目标位置不小于0
    const safeTargetPosition = Math.max(targetPosition, 0);

    const startTime = performance.now() + delay; // 添加延迟时间
    const startPosition = element.scrollTop;
    const distance = safeTargetPosition - startPosition;

    function animateScroll(currentTime: number) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        if (progress < 0) {
            console.log(`[smoothScrollTo] 等待延迟时间，当前进度: ${progress}`);
            return; // 等待延迟时间
        }

        // 使用弹性缓动函数
        const easedProgress = easeOutElastic(progress);

        // 计算当前位置并应用
        const newPosition = startPosition + distance * easedProgress;
        element.scrollTop = newPosition;

        console.log(`[smoothScrollTo] 动画进度: ${progress.toFixed(2)}, 滚动位置: ${element.scrollTop}`);

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        } else {
            // 确保最终位置精确
            element.scrollTop = safeTargetPosition;
            console.log(`[smoothScrollTo] 滚动完成，最终位置: ${safeTargetPosition}`);

            
        }
    }

    try {
        requestAnimationFrame(animateScroll);
    } catch (e) {
        console.error("平滑滚动出错", e);
    }
}

// 把 00:00 转换为 秒 格式
function convertToSeconds(timeString: string) {
    const [minutes, seconds] = timeString.split(':')
    return parseInt(minutes) * 60 + parseInt(seconds)
}



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

// 格式化艺术家信息
const formatArtists = (artists: any[] | undefined) => {
    if (!artists || !Array.isArray(artists) || artists.length === 0) {
        return '未知艺术家';
    }
    return artists.map(artist => artist?.name || '未知').join(' / ');
};
</script>

<template>
    <div class="lyrics-view">
          
        <img style="
        border-radius: 16px;
        transform: translateY(-3%);
        box-shadow:  0px 0px 24px rgba(0, 0, 0, 0.2);
        " :src="backgroundimg" alt="" height="55%">
    
    <div style="flex: 0.7;">
        <div class="text-center">
            <h3>{{ playerStore.currentSong?.name }}</h3>
            <span>{{ formatArtists(playerStore.currentSong?.artists) }}</span>

        </div>
        <div v-if="!isParseSuccess && parseError" class="error-message">
            {{ parseError }}
        </div>
        <div class="lyrics-container" :class="{ show: lyricsString !== '' }">
            <div class="lyric-list" ref="lyricListRef">
                <div v-show="item.text || item.trans" v-for="(item, index) in parsedLyrics" :key="index"
                    class="lyric-item"
                    :class="{ active: index === currentLyricIndex, 'elastic-rebound': index === playedAnimation }"
                    :style="{
                        ...getLyricStyle(index)
                    }" @click="handleLyricClick(item.time)" :ref="(el) => setLyricRef(el, index)">
                    <div class="text">{{ item.text }}</div>
                    <div class="trans">{{ item.trans }}</div>
                </div>
            </div>
        </div>
    </div> 
    </div>
 
</template>




<style scoped>
.text-center {
    text-align: start;
    font-family: HarmonyOS_Sans_SC_Bold;

    h3 {
        font-size: 28px;
        margin-top: 8px;
        font-weight: bolder;
        color: rgba(255, 255, 255, 0.938);
        margin-bottom: 0px;
    }


    span {
        position: relative;
        top: -3px;
        left: 0px;
        margin-top: 0px;
        transform: translateY(-3px);
        font-weight: 500;
        font-size: 15px;
        color: rgba(255, 255, 255, 0.781);
    }

}

.lyrics-view {
    width: 100%;
    height: 92%;
    flex-direction: row;
    align-items: center;
    display: flex;
    justify-content: space-evenly;
}

.lyrics-container {
    width: 100%;
    height: calc(100vh - 150px);
    overflow-y: auto;
    transition: all 0.8s cubic-bezier(.25, .90, .35, 1);
    transform: translateY(16px) translateX(-33px);
}

.lyrics-container::-webkit-scrollbar {
    display: none !important;
}

.lyric-list::-webkit-scrollbar {
    display: none !important;
}

.show {
    transform: translateY(0);
    opacity: 1;
}

.lyric-list {
    font-family: HarmonyOS_Sans_SC_Bold;
    height: calc(100vh - 150px);
    -webkit-mask-image: linear-gradient(to bottom, white 0%, transparent 20%, transparent 80%, white 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, white 5%, white 80%, transparent 100%);
    overflow-y: auto;
    padding: 0px v-bind("listPadding + 'px'") 500px v-bind("listPadding + 'px'");
}



.lyric-item {
    margin-bottom: v-bind("lyricPadding + 'px'");
    transition: all v-bind("lyricSpeed + 'ms'") cubic-bezier(.25, .90, .35, 1);
    transform-origin: v-bind("lyricCenter ? '50% 50%' : '0% 50%'");
    transform: scale(v-bind("lyricScale / 100"));
    opacity: v-bind("lyricOpacity / 100");
    text-align: v-bind("lyricCenter ? 'center' : 'left'");
}

.lyric-item .text {
    filter: blur(v-bind("lyricBlur ? '2px' : '0px'"));
    color: v-bind("lyricColor");

    font-size: v-bind("lyricSize * lyricActiveScale / 100 + 'px'");
    font-weight: v-bind("lyricBold ? 'bold' : 'normal'");
    transition: all v-bind("lyricSpeed + 'ms'") cubic-bezier(.25, .90, .35, 1);
}

.lyric-item .trans {
    color: v-bind("lyricTColor");
    font-size: v-bind("lyricTSize + 'px'");
    font-weight: v-bind("lyricTBold ? 'bold' : 'normal'");
    transition: all v-bind("lyricSpeed + 'ms'") cubic-bezier(.25, .90, .35, 1);
}

.lyric-item.active {
    transition: all v-bind("lyricSpeed + 'ms'") cubic-bezier(.25, .90, .35, 1);
    transform: scale(v-bind("lyricActiveScale / 100"));
    opacity: v-bind("lyricActiveOpacity / 100");
    filter: blur(0px);
}

.lyric-item.active .text {
    color: v-bind("lyricActiveColor");
    text-shadow: v-bind("lyricShadow");
    font-size: v-bind("lyricSize + 'px'");
    filter: blur(0px);
}

.lyric-item.active .trans {
    color: v-bind("lyricTActiveColor");
    filter: blur(0px);
}

.error-message {
    color: rgba(255, 255, 255, 0.774);
    font-weight: bold;
    font-size: 24px;
    transform: translateX(3px);
    text-align: center;
    margin-top: 50%;
}
</style>