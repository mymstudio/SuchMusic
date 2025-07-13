<template>
    <div>
        <h1
            style="margin: 0; margin-top: 20px; margin-bottom: 6px; font-weight: bolder; font-family: HarmoneyOS_Sans_SC_Bold, sans-serif;">
            本地音乐
        </h1>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <div style="transform: scale(1.05); padding-left: 6px; display: flex;  gap: 8px;">
                <n-button round type="primary" @click="scanMusic">
                    全部播放
                    <template #icon>
                        <svg style="transform: scale(0.95);" xmlns='http://www.w3.org/2000/svg' width='24' height='24'
                            viewBox='0 0 24 24'>
                            <title>play_fill</title>
                            <g id="play_fill" fill='none' fill-rule='evenodd'>
                                <path
                                    d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z' />
                                <path fill='currentColor'
                                    d='M5.669 4.76a1.469 1.469 0 0 1 2.04-1.177c1.062.454 3.442 1.533 6.462 3.276 3.021 1.744 5.146 3.267 6.069 3.958.788.591.79 1.763.001 2.356-.914.687-3.013 2.19-6.07 3.956-3.06 1.766-5.412 2.832-6.464 3.28-.906.387-1.92-.2-2.038-1.177-.138-1.142-.396-3.735-.396-7.237 0-3.5.257-6.092.396-7.235' />
                            </g>
                        </svg>
                    </template>
                </n-button>
                <n-button circle @click="scanMusic">
                    <template #icon>
                        <svg style="transform: scale(0.95);" xmlns='http://www.w3.org/2000/svg' width='24' height='24'
                            viewBox='0 0 24 24'>
                            <title>refresh_2_fill</title>
                            <g id="refresh_2_fill" fill='none'>
                                <path
                                    d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z' />
                                <path fill='currentColor'
                                    d='M1.498 12.082c-.01-1.267 1.347-1.987 2.379-1.406l.113.07 2.678 1.804c1.424.96.538 3.146-1.1 2.915l-.137-.025-.109-.024a7.504 7.504 0 0 0 13.175.335 1.5 1.5 0 1 1 2.6 1.498c-2.317 4.02-7.119 6.152-11.815 4.893a10.503 10.503 0 0 1-7.784-10.06m1.406-5.33C5.22 2.731 10.022.6 14.718 1.857a10.503 10.503 0 0 1 7.784 10.06c.01 1.267-1.347 1.987-2.379 1.407l-.113-.07-2.678-1.805c-1.424-.959-.538-3.145 1.099-2.914l.138.025.108.023A7.504 7.504 0 0 0 5.502 8.25a1.5 1.5 0 1 1-2.598-1.498' />
                            </g>
                        </svg>
                    </template>
                </n-button>
                <n-dropdown placement="bottom-start" trigger="click" :options="localoptions">
                    <n-button circle>
                        <template #icon>
                            <svg style="transform: scale(0.95);" xmlns='http://www.w3.org/2000/svg' width='24'
                                height='24' viewBox='0 0 24 24'>
                                <title>menu_line</title>
                                <g id="menu_line" fill='none'>
                                    <path
                                        d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z' />
                                    <path fill='currentColor'
                                        d='M20 18a1 1 0 0 1 .117 1.993L20 20H4a1 1 0 0 1-.117-1.993L4 18zm0-7a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm0-7a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2z' />
                                </g>
                            </svg>
                        </template>
                    </n-button>
                </n-dropdown>

            </div>


            <div style="width: 400px; gap: 8px; display: flex;">

                <n-input round placeholder="模糊搜索">
                    <template #prefix>
                        <svg style="width: 18px; transform: translateY(1px);" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                            <title>search_line</title>
                            <g id="search_line" fill='none' fill-rule='evenodd'>
                                <path
                                    d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z' />
                                <path fill='currentColor'
                                    d='M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0' />
                            </g>
                        </svg>
                    </template>
                </n-input>

                <n-tabs style="border-radius: 500px;" type="segment" animated>
                    <n-tab style="border-radius: 500px;" name="幸福">
                        歌曲
                    </n-tab>
                    <n-tab style="border-radius: 500px;" name="的">
                        歌手
                    </n-tab>
                    <n-tab style="border-radius: 500px;" name="旁边">
                        专辑
                    </n-tab>
                </n-tabs>
            </div>

        </div>

        <p style="display: none;" v-if="songCount > 0">歌曲数量：{{ songCount }}</p>
        <div style="
            min-height: 600px;
            overflow-y: auto;
            height: calc(100vh - 201px);
            padding-bottom: 102px;

            " class="search">
            <div v-for="(item, index) in musicMetadata" :key="index">
                <div :class="{ active: musicMetadata[index].meta.cover === localcoveer }"
                    @click="playLocalSong(item.filePath)" class="search-item">
                    <div style="width: 24px; text-align: center; font-size: 14px; color: #888; margin-right: 2px;">
                        {{ index + 1 }}
                    </div>
                    <img style="
                    border-radius: 7px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.2);
                    " height="48px" :src="item.meta.cover" alt="">
                    <div
                        style="display: flex; flex-direction: column; justify-content: space-between; margin-left: 4px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span
                                style="font-family: HarmonyOS_Sans_SC_Bold; word-wrap: break-word; font-size: 16.5px; font-weight: bold; font-family: HarmoneyOS_Sans_SC_Bold, sans-serif;"
                                :style="{ width: item.meta.title ? '100%' : '80%' }">

                                {{ item.meta.title || item.filePath }}</span>

                        </div>

                        <span style="font-family: HarmoneyOS_Sans_SC; font-size: 14px;         color: #818181;">{{
                            item.meta.artist }}</span>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { useSearchStore } from '../../stores/search';
import { useAudioStore } from '../../stores/audio'
import { Song, usePlayerStore } from '../../stores/player'; // 导入 playerStore
import type { Component } from 'vue'
import {
    Pencil as EditIcon,
    LogOutOutline as LogoutIcon,
    PersonCircleOutline as UserIcon
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import SvgIcon from '../SvgIcon.vue';
import { defineComponent, h } from 'vue'
import { transform } from 'typescript';

function renderIcon(icon: Component) {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        })
    }
}
const audioStore = useAudioStore()
const searchStore = useSearchStore();
const musicFiles = ref([]);
const musicMetadata = ref([]); // 新增：用于保存所有文件的元数据
const songCount = ref(0);
const localoptions = [
    {
        label: '本地目录管理',
        key: 'profile',
        icon: () => h(SvgIcon, {
            path: 'M12.52 3a2 2 0 0 1 1.442.614l.12.137L15.48 5.5H20a2 2 0 0 1 1.995 1.85L22 7.5V15a2 2 0 0 1-1.85 1.995L20 17h-2v2a2 2 0 0 1-1.85 1.995L16 21H4a2 2 0 0 1-1.995-1.85L2 19V9a2 2 0 0 1 1.85-1.995L4 7h2V5a2 2 0 0 1 1.85-1.995L8 3zm0 2H8v2h.52a2 2 0 0 1 1.561.75l1.4 1.75H16a2 2 0 0 1 2 2V15h2V7.5h-4.52a2 2 0 0 1-1.561-.75z',
            size: 17,
            style: {
                transform: 'translateY(-0.5px) translateX(1px)'
            }
        })
    },
    {
        label: '批量操作',
        key: 'editProfile',
        icon: () => h(SvgIcon, {
            path: 'M20 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zM6 9H4v11h11v-2H8a2 2 0 0 1-2-2zm11.89-1.768a1 1 0 0 0-1.32-.083l-.095.083-3.536 3.536-1.414-1.414a1 1 0 0 0-1.497 1.32l.083.094 2.05 2.05a1.1 1.1 0 0 0 1.46.086l.096-.085 4.172-4.172a1 1 0 0 0 0-1.415Z',
            size: 17,
            style: {
                transform: 'translateY(-0.5px) translateX(1px)'
            }
        })
    }
]
// 修复：使用 store 中的 topAlbums 替代本地未定义的 topAlbums
const topAlbums = ref(searchStore.topAlbums);

function getArtistsFormatted(artistsdata: any[]) {
    if (!artistsdata) return '';
    return artistsdata.ar.map(artist => artist.name).join(' / ');
}
// ... existing code ...


const playerStore = usePlayerStore(); // 新增：使用 playerStore
// ... existing code ...
const localcoveer = ref(null);
async function playLocalSong(filePath: string) {
    try {
        const path: string = await invoke('get_blob_url', { path: filePath });

        // 新增：获取音频元数据
        const meta = await invoke('get_audio_metadata', { path: filePath });

        // 构造包含元数据的歌曲对象
        const songWithMetadata: Song = {
            id: Math.floor(Math.random() * 100000), // 模拟 ID
            name: meta.title + '（本地音乐）' || '未知标题',
            picUrl: meta.cover,
            artists: [meta.artist],
            mp3Url: path,
            lyric: meta.lyrics,
            tlyric: null
        };
        localcoveer.value = meta.cover; // 保存封面图片路径
        // 保存元数据到 playerStore
        playerStore.playSong(songWithMetadata);



    } catch (error) {
        console.error('播放本地歌曲失败:', error);
    }
}
// ... existing code ...

// 组件挂载时自动搜索热门专辑
onMounted(async () => {
    if (searchStore.topAlbums.length === 0) {
        await searchStore.fetchTopAlbums(''); // 可传入关键词如 'new album'
    }
});

const scanMusic = async () => {
    const startTime = performance.now(); // 新增：记录开始时间
    try {
        const path = 'D:\\Music'; // 默认扫描路径，可以根据需要修改
        const result = await invoke('scan_music_files', { path });
        musicFiles.value = result;
        songCount.value = result.length;

        // 新增：逐个获取每个文件的元数据
        const metadataList = [];
        for (const filePath of result) {
            try {
                const meta = await invoke('get_audio_metadata', { path: filePath });
                metadataList.push({ filePath, meta });
            } catch (error) {
                console.error(`无法读取 ${filePath} 的元数据`, error);
            }
        }

        musicMetadata.value = metadataList; // 将元数据保存到响应式变量
        console.log(`音频元数据： ${JSON.stringify(metadataList, (key, value) => {
            if (key === 'cover') return undefined; // 过滤掉 cover 字段
            return value;
        }, 2)}`);
    } catch (error) {
        console.error('扫描音乐文件失败:', error);
    } finally {
        const endTime = performance.now(); // 新增：记录结束时间
        const duration = endTime - startTime; // 新增：计算耗时
        console.log(`扫描音乐文件耗时: ${duration.toFixed(2)} 毫秒`); // 新增：输出耗时
    }
};
</script>

<style scoped>
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
.search::-webkit-scrollbar {
    width: 5px;
    /* 设置竖向滚动条宽度 */
    height: 8px;
    color: #818181;
    /* 设置横向滚动条高度（可选） */
}

.search-item.active {
    background-color: rgb(153, 192, 255);
    /* 浅蓝色背景 */
    border: #3080FF solid 2.5px;

}

.search-item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #2c2c2c;
    padding: 12px 12px;
    background-color: #ffffff;
    border-radius: 9px;
    transition: all 0.3s ease;
    border: #3d889b00 solid 2.5px;
}


.search-item:hover {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #2c2c2c;
    padding: 12px 12px;
    background-color: #ffffff;
    border-radius: 8px;
    border: #5F9CFEFF solid 2.5px;
}

/* 滚动条轨道 */
.search::-webkit-scrollbar-track {
    background-color: transparent;
}

/* 滚动条滑块 */
.search::-webkit-scrollbar-thumb {
    background-color: #b8b8b8;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

/* 滚动条滑块悬停效果 */
.search::-webkit-scrollbar-thumb:hover {
    background-color: #6b6b6b;
}

/* 可选：滚动条两端按钮 */
.search::-webkit-scrollbar-button {
    display: none;
}


/* 滚动条整体样式 */
.top-albums::-webkit-scrollbar {
    width: 5px;
    /* 设置竖向滚动条宽度 */
    height: 8px;
    /* 设置横向滚动条高度（可选） */
}

/* 滚动条轨道 */
.top-albums::-webkit-scrollbar-track {
    background-color: transparent;
}

/* 滚动条滑块 */
.top-albums::-webkit-scrollbar-thumb {
    background-color: #b8b8b8;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

/* 滚动条滑块悬停效果 */
.top-albums::-webkit-scrollbar-thumb:hover {
    background-color: #6b6b6b;
}

/* 可选：滚动条两端按钮 */
.top-albums::-webkit-scrollbar-button {
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
</style>
