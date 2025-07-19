<template>
    <div>
        <h1
            style="margin: 0; margin-top: 20px; margin-bottom: 6px; font-weight: bolder; font-family: HarmoneyOS_Sans_SC_Bold, sans-serif;">
            发现音乐
        </h1>
        <n-tabs type="segment" animated>
            <n-tab-pane name="chap1" tab="新碟上架">
                <div class="top-albums">
                    <div class="album" v-for="(item, index) in topAlbums" :key="index">
                        <div @click="getAlbumsFormatted(item.id)" class="album-item">
                            <div class="album-cover">
                                <img :src="item.picUrl" alt="" />
                            </div>
                            <div class="album-info">
                                <h2 class="album-title">{{ item.name }}</h2>
                                <p class="album-artist">{{ item.size }} 首 · {{ item.artist.name }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </n-tab-pane>
            <n-tab-pane name="chap2" tab="本地音乐测试（Debug）">
                <div>
                    <n-button type="primary" @click="scanMusic">扫描本地音乐</n-button>
                    <p v-if="songCount > 0">歌曲数量：{{ songCount }}</p>

                </div>
                <div style="
            min-height: 600px;
            overflow-y: auto;
            height: calc(100vh - 201px);
            padding-bottom: 102px;

            " class="search">
                    <div v-for="(item, index) in musicMetadata" :key="index">
                        <div class="search-item">
                            <div
                                style="width: 24px; text-align: center; font-size: 14px; color: #888; margin-right: 2px;">
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
                                        :style="{ width: item.meta.title? '100%' : '80%' }"
                                        >
                                        
                                        {{item.meta.title || item.filePath }}</span>

                                </div>

                                <span
                                    style="font-family: HarmoneyOS_Sans_SC; font-size: 14px;         color: #818181;">{{
                                        item.meta.artist }}</span>
                            </div>

                        </div>
                    </div>
                </div>

            </n-tab-pane>
            <n-tab-pane name="chap3" tab="排行榜">
                但是忽然，公寓的烟味消失，火警也停了。我的女朋友走进了房间，让我震惊的是，她摘下了自己的假发，她是
                Jeff Bezos（Amazon 老板）假扮的！<br /><br />
                “我对你坚持顾客至上的原则感到十分骄傲”，说完，他递给我一张五美金的亚马逊礼品卡，从我家窗户翻了出去，跳上了一辆
                Amazon 会员服务的小货车，一溜烟离开了。<br /><br />虽然现在我已不在 Amazon
                工作，但我还是非常感激在哪里学的到的经验，这些经验我终身难忘。你们同意么？
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { useSearchStore } from '../../stores/search';
import { useRouter } from 'vue-router';
const router = useRouter();
const searchStore = useSearchStore();
const musicFiles = ref([]);
const musicMetadata = ref([]); // 新增：用于保存所有文件的元数据
const songCount = ref(0);

// 修复：使用 store 中的 topAlbums 替代本地未定义的 topAlbums
const topAlbums = ref(searchStore.topAlbums);

function getAlbumsFormatted(albumsid: any) {
   router.push({ name: 'Album', params: { id: albumsid } });
}

function getArtistsFormatted(artistsdata: any[]) {
    if (!artistsdata) return '';
    return artistsdata.ar.map(artist => artist.name).join(' / ');
}


// 组件挂载时自动搜索热门专辑
onMounted(async () => {
    if (searchStore.topAlbums.length === 0) {
        await searchStore.fetchTopAlbumsA(''); // 可传入关键词如 'new album'
        topAlbums.value = searchStore.topAlbums;
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
    padding-top: 0px;
    padding-left: 0;
    padding-bottom: 0px;
    gap: 12px;
    overflow-y: auto;
    height: calc(100vh - 210px);
    width: calc(100vw - 306px);
}

.album {

}

/* 滚动条整体样式 */
.search::-webkit-scrollbar {
    width: 5px;
    /* 设置竖向滚动条宽度 */
    height: 8px;
    color: #818181;
    /* 设置横向滚动条高度（可选） */
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
    box-shadow:  0px 0px 14px rgba(0, 0, 0, 0.123);;
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
