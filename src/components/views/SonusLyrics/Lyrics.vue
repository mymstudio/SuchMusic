<script lang="ts" setup>
import { usePlayerStore } from '../../../stores/player';
import { useAudioStore } from '../../../stores/audio'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import PlayerBottom from './PlayerBottom.vue';
import { watch } from 'vue'
const playerStore = usePlayerStore();
const playedAnimation = ref<number | null>(null)
const defaultLyrics = computed(() => playerStore.currentSong?.lyric || '')
const defaultLyricsT = computed(() => playerStore.currentSong?.tlyric || '')
/**
 * Sonus Lyrics 组件
 * Version: 1.0.0
 * 代码问题数量：14
 */
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
        default: '0 0 0px #FFFFFF80'
    }
})
const countdownScale = ref(1) // 恢复缩放比例变量
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
    const targetScrollTop = itemTop - 100; // 固定偏移量150px

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
            countdownScale.value = 1
            // 启动时间监听

        } else {
            // 停止时间监听
            stopLyricUpdate()
        }
    },
    { immediate: true }
)

// ... existing code ...
const showCountdown = ref(false)
const countdownTime = ref(0)
const countdownInterval = ref(null)
const nextLyricTime = ref(0) // 新增：存储下一句歌词时间
// ... existing code ...
// 监听当前时间变化，修改倒计时逻辑
watch(() => audioStore.currentTime, (newTime) => {
    const index = parsedLyrics.value.findIndex((lyric) => convertToSeconds(lyric.time) > newTime)
    if (index !== -1) {
        currentLyricIndex.value = Math.max(0, index - 1)
        nextLyricTime.value = convertToSeconds(parsedLyrics.value[index].time) // 存储下一句歌词时间

        // 计算距离下一句歌词的时间
        const timeUntilNext = nextLyricTime.value - newTime

        // 修改显示条件：距离下一句歌词还有8秒以上
        if (timeUntilNext > 8 && !isUserAtBottom()) {
            showCountdown.value = true
            countdownTime.value = timeUntilNext

            // 清除旧定时器
            if (countdownInterval.value) clearInterval(countdownInterval.value)

            // 启动新定时器
            countdownInterval.value = setInterval(() => {
                countdownTime.value = nextLyricTime.value - audioStore.currentTime
                // 只在距离歌词3秒内才隐藏
                if (countdownTime.value <= 0.01) {
                    showCountdown.value = false
                    clearInterval(countdownInterval.value)
                }
            }, 100)
        } else if (timeUntilNext <= 8 && timeUntilNext > 0.01) {
            // 在8秒到3秒之间保持显示
            showCountdown.value = true
            countdownTime.value = timeUntilNext
        } else if (timeUntilNext <= 0.01) {
            // 3秒内隐藏
            showCountdown.value = false
            if (countdownInterval.value) clearInterval(countdownInterval.value)
        } else {
            showCountdown.value = false
            if (countdownInterval.value) clearInterval(countdownInterval.value)
        }
    } else {
        showCountdown.value = false
        if (countdownInterval.value) clearInterval(countdownInterval.value)
    }
})
// ... existing code ...
// ... existing code ...

function isUserAtBottom(): boolean {
    const lyricList = lyricListRef.value
    if (!lyricList) return false

    const scrollTop = lyricList.scrollTop
    const scrollHeight = lyricList.scrollHeight
    const clientHeight = lyricList.clientHeight

    // 判断是否接近底部（允许误差 20px）
    return scrollHeight - scrollTop - clientHeight < 20
}

const showScrollHint = ref(false)
// 动态更新 currentLyricIndex
// 监听音频播放时间
watch(() => audioStore.currentTime, (newTime) => {
    const index = parsedLyrics.value.findIndex((lyric) => convertToSeconds(lyric.time) > newTime);
    if (index !== -1) {
        currentLyricIndex.value = Math.max(0, index - 1);

        // 判断是否要显示提示
        const nextLyricTime = convertToSeconds(parsedLyrics.value[index].time)
        const timeUntilNext = nextLyricTime - newTime

        // 如果距离下一句歌词还有超过 10 秒，并且用户未滚动到底部
        if (timeUntilNext > 10 && !isUserAtBottom()) {
            showScrollHint.value = true
        } else {
            showScrollHint.value = false
        }
    }
})

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
// ... existing code ...
// ... existing code ...
const countdownIndex = ref(-1) // 新增：倒计时项的索引位置
// ... existing code ...
function parseLyrics(): Array<{ time: string, text: string, trans: string, isCountdown?: boolean }> {
    // 确保 lyricsToParse 是字符串
    const lyricsToParse = typeof effectiveLyricsString.value === 'string'
        ? effectiveLyricsString.value
        : JSON.stringify(effectiveLyricsString.value);
    const lyricsToParseT = typeof effectiveLyricsStringT.value === 'string'
        ? effectiveLyricsStringT.value
        : JSON.stringify(effectiveLyricsStringT.value);

    if (!lyricsToParse || lyricsToParse.trim() === '') {
        isParseSuccess.value = false
        parseError.value = '歌词内容为空'
        console.warn('歌词内容为空')
        return []
    }

    try {
        // 确保处理的是字符串
        const newLyrics: string = typeof lyricsToParse === 'string'
            ? lyricsToParse.replace(/\\n/g, '\n')
            : '';
        const newLyricsT: string = typeof lyricsToParseT === 'string'
            ? lyricsToParseT.replace(/\\n/g, '\n')
            : '';

        // 改进正则表达式，处理不规范格式
        const regex = /\[(\d{2}:\d{2}\.\d{2,3})\]([^\[]*)/g

        const lyricsMap: { [key: string]: { time: string, text: string, trans: string, isCountdown?: boolean } } = {}

        // 清理特殊字符的函数
        const cleanText = (text: string) => {
            return text
                .replace(/["',]/g, '') // 去除引号、逗号等特殊字符
                .replace(/\s+/g, ' ')  // 合并多个空格
                .trim();
        };

        // 处理主歌词
        let match;
        while ((match = regex.exec(newLyrics)) !== null) {
            const [fullMatch, timestamp, text] = match;
            const cleanedText = cleanText(text);
            if (cleanedText) {
                lyricsMap[timestamp] = {
                    time: timestamp,
                    text: cleanedText,
                    trans: ''
                };
            }
        }

        // 处理翻译歌词
        regex.lastIndex = 0; // 重置正则表达式
        while ((match = regex.exec(newLyricsT)) !== null) {
            const [fullMatch, timestamp, trans] = match;
            const cleanedTrans = cleanText(trans);
            if (lyricsMap[timestamp]) {
                lyricsMap[timestamp].trans = cleanedTrans;
            } else if (cleanedTrans) {
                lyricsMap[timestamp] = {
                    time: timestamp,
                    text: '',
                    trans: cleanedTrans
                };
            }
        }

        // 过滤掉文本和翻译都为空的行并按时间排序
        const filteredLyrics = Object.values(lyricsMap)
            .filter(item => item.text || item.trans)
            .sort((a, b) => convertToSeconds(a.time) - convertToSeconds(b.time));

        // 在适当位置插入倒计时项
        if (filteredLyrics.length > 0) {
            countdownIndex.value = filteredLyrics.findIndex(
                (lyric, index) => index > 0 && convertToSeconds(lyric.time) - convertToSeconds(filteredLyrics[index - 1].time) > 8
            )

            if (countdownIndex.value !== -1) {
                filteredLyrics.splice(countdownIndex.value, 0, {
                    time: filteredLyrics[countdownIndex.value].time,
                    text: '__COUNTDOWN__',
                    trans: '',
                    isCountdown: true
                })
            }
        }

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
// ... existing code ...
// ... existing code ...
// ... existing code ...




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

// ... existing code ...
// ... existing code ...

const countdownAnimId = ref<number | null>(null) // 恢复动画ID

// 恢复缩放动画逻辑
const startPulseAnimation = () => {
    if (countdownAnimId.value) {
        cancelAnimationFrame(countdownAnimId.value)
    }

    let startTime: number | null = null
    const duration = 1500 // 动画周期1.5秒

    const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = (elapsed % duration) / duration

        // 使用正弦函数实现平滑的0.9-1.1缩放
        countdownScale.value = 0.9 + Math.sin(progress * Math.PI * 2) * 0.1

        if (showCountdown.value && countdownTime.value > 3) {
            countdownAnimId.value = requestAnimationFrame(animate)
        } else {
            // 临近3秒时触发放大消失动画
            if (countdownTime.value <= 1) {
                countdownScale.value = 1.5
                setTimeout(() => {
                    countdownScale.value = 0
                }, 200)
            }
        }
    }

    countdownAnimId.value = requestAnimationFrame(animate)
}

// 恢复watch监听
watch(showCountdown, (newVal) => {
    if (newVal) {
        countdownScale.value = 1
        startPulseAnimation()
    } else {
        if (countdownAnimId.value) {
            cancelAnimationFrame(countdownAnimId.value)
            countdownAnimId.value = null
        }
    }
}, { immediate: true })

// 恢复组件卸载清理
onBeforeUnmount(() => {
    if (countdownAnimId.value) {
        cancelAnimationFrame(countdownAnimId.value)
    }
})
// ... existing code ...
// ... existing code ...

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

const circleAnimations = computed(() => {
    const progress = countdownTime.value / 10;
    return [
        { opacity: progress > 0 ? 0.3 + (0.7 * progress) : 0.3 }, // 第一个圆圈初始不透明度30%
        { opacity: progress > 0.33 ? 0.3 + (0.7 * (progress - 0.33) / 0.67) : 0.3 },
        { opacity: progress > 0.66 ? 0.3 + (0.7 * (progress - 0.66) / 0.34) : 0.3 }
    ]
})

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
        <div style=" display: flex; flex-direction: column;transform: translateY(-10px);">
            <img style="
        border-radius: 16px;
        transform: translateY(-3%);
        width: 50vh;
        box-shadow:  0px 0px 24px rgba(0, 0, 0, 0.2);
        " :src="backgroundimg" alt="" height="55%">
            <div class="text-center">
                <h3>{{ playerStore.currentSong?.name }}</h3>
                <div style="display: flex; flex-direction: column;">
                    <span>
                        <svg style="transform: scale(0.8) translateY(8px); " xmlns='http://www.w3.org/2000/svg'
                            width='24' height='24' viewBox='0 0 24 24'>
                            <g id="user_edit_fill" fill='none'>
                                <path
                                    d='M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z' />
                                <path fill='currentColor'
                                    d='M11 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 11c.59 0 1.167.042 1.724.12a1 1 0 0 1 .539 1.726 6.979 6.979 0 0 0-2.21 6.022 1 1 0 0 1-1.012 1.123c-2.01-.04-3.89-.216-5.294-.646-.702-.215-1.364-.517-1.866-.962C2.35 19.913 2 19.28 2 18.5c0-.787.358-1.523.844-2.139.494-.625 1.177-1.2 1.978-1.69C6.425 13.695 8.605 13 11 13m10.212 1.034a2.5 2.5 0 0 1 0 3.535l-3.418 3.418a1.5 1.5 0 0 1-.848.424l-2.309.33a1.001 1.001 0 0 1-1.132-1.133l.33-2.308a1.5 1.5 0 0 1 .424-.849l3.418-3.418a2.5 2.5 0 0 1 3.535 0Z' />
                            </g>
                        </svg>
                        {{ formatArtists(playerStore.currentSong?.artists) }}
                    </span>

                    <span>
                        <svg style="transform: scale(0.8) translateY(8px); " xmlns='http://www.w3.org/2000/svg'
                            width='24' height='24' viewBox='0 0 24 24'>
                                
                                <g id="album_fill" fill='none'>
                                    <path
                                        d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z' />
                                    <path fill='currentColor'
                                        d='M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-.56-3.493a1 1 0 0 0-1.276-.61 7.019 7.019 0 0 0-3.73 3.1A1 1 0 0 0 8.166 10a5.02 5.02 0 0 1 2.665-2.216 1 1 0 0 0 .61-1.276Z' />
                                </g>

                        </svg>
                        {{ playerStore.currentSong?.album }}
                    </span>
                </div>


            </div>
        </div>

        <div>
            <PlayerBottom></PlayerBottom>
        </div>

        <div style="flex: 0.7;">

            <div v-if="!isParseSuccess && parseError" class="error-message">
                {{ parseError }}
            </div>

            <div class="lyrics-container" :class="{ show: lyricsString !== '' }">
                <!-- ... existing code ... -->
                <div class="lyric-list" ref="lyricListRef">
                    <div v-for="(item, index) in parsedLyrics" :key="index" class="lyric-item" :class="{
                        active: index === currentLyricIndex,
                        'elastic-rebound': index === playedAnimation,
                        'countdown-item': item.isCountdown
                    }" :style="getLyricStyle(index)" @click="handleLyricClick(item.time)"
                        :ref="(el) => setLyricRef(el, index)">

                        <div v-if="item.isCountdown && showCountdown" class="countdown-hint">
                            <Transition name="fadeA">
                                <div class="countdown-circles">
                                    <span class="circle" :style="{ opacity: circleAnimations[0].opacity }"></span>
                                    <span class="circle" :style="{ opacity: circleAnimations[1].opacity }"></span>
                                    <span class="circle" :style="{ opacity: circleAnimations[2].opacity }"></span>
                                </div>
                            </Transition>
                        </div>

                        <template v-else>
                            <div class="text">{{ item.text }}</div>
                            <div class="trans">{{ item.trans }}</div>
                        </template>
                    </div>
                </div>
                <!-- ... existing code ... -->
            </div>
        </div>
    </div>

</template>




<style scoped>
.text-center {
    text-align: start;
    font-family: HarmonyOS_Sans_SC_Bold;
    padding-left: 12px;

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
        transition: all 0.2s ease-in-out;
        color: rgba(255, 255, 255, 0.712);
    }

}

.text-center span:hover {
    color: white;
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;

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
    transform: translateY(16px) translateX(-48px);
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
    height: calc(100vh - 680px);
    -webkit-mask-image: linear-gradient(to bottom, white 0%, transparent 20%, transparent 80%, white 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, white 5%, white 80%, transparent 90%);
    overflow-y: auto;
    will-change: scroll-position;
    /* 添加性能优化 */
    padding: 0px v-bind("listPadding + 'px'") 500px v-bind("listPadding + 'px'");
}

.countdown-hint {
    transform: translateX(-43%) scale(v-bind(countdownScale));
    background-color: rgba(0, 0, 0, 0);
    padding: 12px 24px;
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 100;
    cursor: pointer;
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    transform-origin: center;
}

.countdown-circles {
    display: flex;
    gap: 8px;
    margin-bottom: 6px;
}

.countdown-circles .circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    transform: scale(1);
    /* 固定缩放为1 */
    opacity: 0.3;
    /* 初始透明度30% */
    transition: opacity 0.3s ease;
}


.hint-text {
    color: white;
    font-size: 14px;
    font-weight: 500;
}

.fadeA-enter-active,
.fadeA-leave-active {
    transition: opacity 0.3s ease;
}

.fadeA-enter-from,
.fadeA-leave-to {
    opacity: 0;
}

.lyric-item {
    margin-bottom: v-bind("lyricPadding + 'px'");
    transition: all v-bind("lyricSpeed + 'ms'") cubic-bezier(.25, .90, .35, 1);
    transform-origin: v-bind("lyricCenter ? '50% 50%' : '0% 50%'");
    transform: scale(v-bind("lyricScale / 100"));
    opacity: v-bind("lyricOpacity / 100");
    transition: all v-bind("lyricSpeed + 'ms'") cubic-bezier(.25, .90, .35, 1);
    text-align: v-bind("lyricCenter ? 'center' : 'left'");
    padding: 6px 16px;
    border-radius: 10px;
}


.lyric-item:hover {
    margin-bottom: v-bind("lyricPadding + 'px'");
    transition: all 0.35s cubic-bezier(.25, .90, .35, 1);
    transform-origin: v-bind("lyricCenter ? '50% 50%' : '0% 50%'");
    transform: scale(v-bind("lyricScale / 100"));
    opacity: v-bind("lyricOpacity / 100");
    background-color: rgba(255, 255, 255, 0.178);
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
}
</style>