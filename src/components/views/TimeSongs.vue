<template>
    <div>
        <h1
            style="margin: 0; margin-top: 20px; margin-bottom: 6px; font-weight: bolder; font-family: HarmoneyOS_Sans_SC_Bold, sans-serif;">
            最近播放
        </h1>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <div style=" display: flex;  gap: 8px;">
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


            </div>


            <div style="width: 400px; gap: 8px; display: flex;">

                <n-input v-model:value="searchQuery" round placeholder="模糊搜索">
                    <template #prefix>
                        <svg style="width: 18px; transform: translateY(1px);" xmlns='http://www.w3.org/2000/svg'
                            width='24' height='24' viewBox='0 0 24 24'>
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


        <div style="
            min-height: 600px;
            overflow-y: auto;
            height: calc(100vh - 201px);
            padding-bottom: 102px;

            " class="search">
            <div v-for="(song, index) in filteredSongs" :key="song.id" class="search-item"
                :class="{ active: currentPlayingSongId === song.id }" @click="playSong(song)">
                <div style="width: 24px; text-align: center; font-size: 14px; color: #888; margin-right: 2px;">{{ index
                    + 1 }}
                </div>
                <img :src="song.picUrl || 'https://via.placeholder.com/48'" alt="Cover"
                    style="border-radius: 7px; box-shadow: 0 0 10px rgba(0,0,0,0.2);" height="48px" />
                <div style=" margin-left: 4px;display: flex; flex-direction: column; align-items: start; gap: 0px;">
                    <div style="font-family: HarmonyOS_Sans_SC_Bold; font-size: 16.5px; font-weight: bold;">{{ song.name
                        }}
                    </div>
                    <div style="font-family: HarmoneyOS_Sans_SC; font-size: 14px; color: #818181;">{{
                        formatArtists(song.artists) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { NButton, NInput,  useNotification } from 'naive-ui';
import { useRecentlyPlayedStore } from '../../stores/recentlyPlayed';
import { usePlayerStore } from '../../stores/player';
import { Song } from '../../stores/player';
const recentlyPlayedStore = useRecentlyPlayedStore();
const playerStore = usePlayerStore();
const notification = useNotification();

const searchQuery = ref('');
const currentPlayingSongId = ref<number | null>(null);

// 加载初始数据
onMounted(() => {
  recentlyPlayedStore.loadFromStorage();
});

// 播放歌曲
const playSong = (song: Song) => {
  currentPlayingSongId.value = song.id;
  playerStore.playSong(song);
};

// 全部播放
const playAll = () => {
  if (recentlyPlayedStore.songs.length > 0) {
    playSong(recentlyPlayedStore.songs[0]);
  }
};

// 清空记录
const clearAll = () => {
  recentlyPlayedStore.clearAll();
  notification.success({
    content: '已清空最近播放记录',
    duration: 2000
  });
};

// 删除单个记录
const removeSong = (id: number) => {
  recentlyPlayedStore.removeSong(id);
};

// 格式化艺术家
const formatArtists = (artists: any[]) => {
  return artists?.map(artist => artist.name).join(" / ") || '未知艺术家';
};

// 格式化时间
const formatTime = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString();
};

// 图片加载失败处理
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = 'https://via.placeholder.com/48?text=No+Cover';
};

// 搜索过滤
const filteredSongs = computed(() => {
  return recentlyPlayedStore.filteredSongs(searchQuery.value);
});
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
