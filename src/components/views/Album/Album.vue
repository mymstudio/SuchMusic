<template>
    <div class="album-container">
        <div class="album-img-wrapper">
            <img draggable="false" :src="albumdata.album?.picUrl" alt="" class="gradient-img">
        </div>
        <div v-if="albumdata" class="album-info">
            <img draggable="false" :src="albumdata.album?.picUrl" alt="" style="
            width: 200px;
            border-radius: 11px;
            box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
            ">

            <div
                style="height: 100%; display: flex; align-items: start; justify-content: space-between; flex-direction: column; margin-left: 20px;">
                <div style="position: relative; top: -14px;">
                    <h1>{{ albumdata.album?.name }}</h1>
                    <n-ellipsis :line-clamp="4"
                        :tooltip="{ width: '40vw', placement: 'bottom-start', 'show-arrow': false }"
                        style="color: #676767; max-width: 40vw">
                        {{ albumdata.album?.description }}
                    </n-ellipsis>
                </div>

                <div class="flex align-center justify-start" style="position: relative; top: -14px; gap: 10px;">
                    <div>
                        <svg style="transform: scale(0.8) translateY(8px); margin-right: 4px; "
                            xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                            <g id="user_edit_fill" fill='none'>
                                <path
                                    d='M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z' />
                                <path fill='currentColor'
                                    d='M11 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 11c.59 0 1.167.042 1.724.12a1 1 0 0 1 .539 1.726 6.979 6.979 0 0 0-2.21 6.022 1 1 0 0 1-1.012 1.123c-2.01-.04-3.89-.216-5.294-.646-.702-.215-1.364-.517-1.866-.962C2.35 19.913 2 19.28 2 18.5c0-.787.358-1.523.844-2.139.494-.625 1.177-1.2 1.978-1.69C6.425 13.695 8.605 13 11 13m10.212 1.034a2.5 2.5 0 0 1 0 3.535l-3.418 3.418a1.5 1.5 0 0 1-.848.424l-2.309.33a1.001 1.001 0 0 1-1.132-1.133l.33-2.308a1.5 1.5 0 0 1 .424-.849l3.418-3.418a2.5 2.5 0 0 1 3.535 0Z' />
                            </g>
                        </svg>
                        <span>{{ albumdata.album?.artist.name }}</span>
                    </div>

                    <div>
                        <svg style="transform: scale(0.8) translateY(8.5px); margin-right: 3px; "
                            xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>


                            <g id="music_3_fill" fill='none'>
                                <path
                                    d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z' />
                                <path fill='currentColor'
                                    d='M10.414 3.012A1.5 1.5 0 0 1 9.5 4.926 7.5 7.5 0 1 0 19.5 12c0-1.2-.28-2.33-.779-3.332a1.5 1.5 0 0 1 2.687-1.336A10.463 10.463 0 0 1 22.5 12c0 5.799-4.701 10.5-10.5 10.5S1.5 17.799 1.5 12c0-4.574 2.924-8.461 7-9.902a1.5 1.5 0 0 1 1.914.914m2.086.002a1.51 1.51 0 0 1 1.86-1.47l.128.037 2.986.996a1.5 1.5 0 0 1-.81 2.885l-.138-.039-1.026-.342V12l-.005.192a3.5 3.5 0 1 1-3.16-3.676l.165.02z' />
                            </g>

                        </svg>
                        <span>{{ albumdata.album?.size }}</span>
                    </div>
                </div>



            </div>
        </div>
        <div v-else>
            加载中...
        </div>
    </div>
</template>

<script setup lang="ts">
//@ts-nocheck
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
const albumId = ref(useRoute().params.id);
const albumdata = ref({});
async function fetchAlbum() {
    const response = await axios.get('https://zm.armoe.cn/album', {
        params: {
            id: albumId.value,
        },
    });
    console.log(response.data);
    albumdata.value = response.data;

}

onMounted(() => {
    fetchAlbum();
})
</script>

<style scoped>
.album-container {
    height: calc(100vh - 210px);
    width: calc(100vw - 306px);
    display: flex;
    margin-top: 22px;
    justify-content: start;
    padding: 10px;
    align-items: start;
    font-family: HarmonyOS_Sans_SC, sans-serif;

    h1 {
        font-family: HarmonyOS_Sans_SC_Bold, sans-serif;
        margin-bottom: 0;
    }

}


.gradient-img {
    width: 100%;
    height: 200px;
    transform: rotate(180deg);
    display: block;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.603), rgba(0, 0, 0, 0));
    -webkit-mask-image: linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0));
    object-fit: cover;
    z-index: 0;
}

.album-info {
    display: flex;
    flex-direction: row;
    height: 200px;
    align-items: center;
    justify-content: start;
    z-index: 999;
}

.album-img-wrapper {
    position: absolute;
    display: block;
    overflow: hidden;
    left: 253px;
    width: calc(100vw - 252px);
    height: 240px;
    top: 0;
    z-index: 1;
}

.album-img-wrapper::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.164), transparent);
    pointer-events: none;
    z-index: 1;
    backdrop-filter: blur(16px);
}
</style>