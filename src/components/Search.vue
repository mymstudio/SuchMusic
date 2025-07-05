<script lang="ts" setup>

import { useSearchStore } from '../stores/search';
import { usePlayerStore } from '../stores/player'; // 引入播放器 store
import axios from 'axios';
const searchStore = useSearchStore();
const playerStore = usePlayerStore();


searchStore.fetchTopAlbums(searchStore.query).then(() => {
    // 提取 originSongSimpleData.id 并标记 isOriginal
    const originalIds = searchStore.topAlbums
        .filter(album => album.originSongSimpleData)
        .map(album => album.originSongSimpleData.songId);

    // 处理每首歌曲
    searchStore.topAlbums = searchStore.topAlbums.map(album => {
        const isMatch = originalIds.includes(album.id);
        const isVip = album.fee === 1; // 判断是否为 VIP 歌曲

        return {
            ...album,
            isOriginal: isMatch,
            isVip: isVip
        };
    });
});

async function getTlyric(formattedSong: {
    id: any;
    name: any;
    picUrl: any;
    artists: any;
    mp3Url: any;
    lyric: any;
    tlyric: string;
}) {
    const responseA = await axios.get('https://ncm.nekogan.com/lyric', {
        params: {
            id: formattedSong.id,
        },
    });

    if (responseA?.data) {
        const tlyric = responseA.data.tlyric.lyric;
        formattedSong.tlyric = tlyric || '';
    }

    console.log('最终歌曲信息:', formattedSong);
    playerStore.playSong(formattedSong);
}

async function playSong(song: any) {


    axios.get(`https://www.lihouse.xyz/coco_widget/music_resource/id/${song.id}`).then(response => {
        const songData = response.data.song_data;
        const formattedSong = {
            id: song.id,
            name: song.name,
            picUrl: song.al.picUrl,
            artists: song.ar || [],
            mp3Url: songData.url || '', // 确保数据包含音频地址
            lyric: songData.lyric || '', // 确保数据包含歌词
            tlyric: '', // 歌词翻译
        };
        console.log(formattedSong);
        getTlyric(formattedSong);
    }).catch(error => {
        console.error('请求歌曲数据失败:', error);
    });
}
function getArtistsFormatted(artistsdata: any[]) {
    if (!artistsdata) return '';
    return artistsdata.ar.map(artist => artist.name).join(' / ');
}


</script>

<template>
    <div class="search">
        <h1
            style="margin: 0; margin-top: 20px; margin-bottom: 6px; font-weight: bolder; font-family: HarmoneyOS_Sans_SC_Bold, sans-serif;">
            {{ searchStore.query }} <span style="
            font-size: 15px;
            font-weight: normal;
            font-family: HarmoneyOS_Sans_SC, sans-serif;
            position: relative;
            top: -1px;
            color: #999;
            ">的搜索结果</span></h1>
        <div style="
            min-height: 600px;
            overflow-y: auto;
            height: calc(100vh - 201px);
            padding-bottom: 102px;

            " class="search">
            <div v-for="(album, index) in searchStore.topAlbums" :key="album.id">
                <div class="search-item" @click="playSong(album)">
                    <div style="width: 24px; text-align: center; font-size: 14px; color: #888; margin-right: 2px;">
                        {{ index + 1 }}
                    </div>
                    <img style="
                    border-radius: 7px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.2);
                    " height="48px" :src="album.al.picUrl" alt="">
                    <div
                        style="display: flex; flex-direction: column; justify-content: space-between; margin-left: 4px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span
                                style="font-family: HarmonyOS_Sans_SC_Bold; font-size: 16.5px; font-weight: bold; font-family: HarmoneyOS_Sans_SC_Bold, sans-serif;">{{
                                    album.name }}</span>
                            <n-tag v-if="album.isOriginal" type="success" style="transform: scale(0.92);" size="small"
                                round @close="handleClose">
                                原唱
                            </n-tag>
                            <n-tag v-if="album.isVip" type="warning" size="small" round style="transform: scale(0.92);">
                                VIP
                            </n-tag>
                        </div>

                        <span style="font-family: HarmoneyOS_Sans_SC; font-size: 14px;         color: #818181;">{{
                            getArtistsFormatted(album) }}</span>
                    </div>

                </div>
            </div>
        </div>

    </div>

</template>

<style scoped>
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

.search {
    width: calc(100vw - 306px);
    margin-top: 0px;
}
</style>
