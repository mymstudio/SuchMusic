<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'
import { useSearchStore } from '../stores/search'
import { usePlayerStore } from '../stores/player'
import { NSelect, NTag, useNotification } from 'naive-ui'
import { audioSources, activeSourceId, AudioSourcePlugin } from './views/Settings/AudioSource'
import axios from 'axios'

const searchStore = useSearchStore()
const playerStore = usePlayerStore()
const notification = useNotification()
const currentPlayingSongId = ref<string | null>(null)
const sourceA = ref<AudioSourcePlugin | null>(null)
const availableSources = computed(() => {
  return audioSources.value
})

const currentSource = computed(() => {
  return audioSources.value.find(s => s.id === activeSourceId.value) || {
    id: 'default',
    name: '默认音源'
  }
})

// 音源状态监控
watchEffect(() => {
  console.groupCollapsed(`[音源监控] 当前音源: ${activeSourceId.value}`)
  console.log('可用音源列表:', audioSources.value)
  console.log('当前激活音源:',
    activeSourceId.value === 'default'
      ? '默认音源'
      : audioSources.value.find(s => s.id === activeSourceId.value) || '未找到'
  )
  console.groupEnd()
})

const searchWithSource = async () => {
  console.group(`[搜索开始] 关键词: "${searchStore.query}"`)
  try {
    const source = audioSources.value.find(s => s.id === activeSourceId.value)
    console.log('➡️ 使用音源:', source || '默认音源')


    // 设置通知方法
    if (source) {
      source.notify = (type, message, title, duration, sourcename) => {
        notification[type]({
          content: message,
          title: title,
          duration: duration,
          meta: '来自' + `${sourcename || '默认音源'}`,
        })
      }
    }

    if (source?.search && activeSourceId.value !== 'default') {
      console.log('🔄 调用自定义音源搜索接口...')
      const result = await source.search(source.source[0], searchStore.query, 1, 10)
      console.log('✅ 音源返回原始数据:', result)

      if (result.code) {
        searchStore.songs = result.data.song_data.map((item: any) => {
          const song = {
            id: item.id,
            name: item.name,
            al: { picUrl: item.pic },
            ar: typeof item.music_author === 'string'
              ? [{ name: item.artist }]
              : item.artist.map((name: string) => ({ name })),
            fee: 0,
            isOriginal: false,
            isVip: false
          }
          console.log(`🎵 歌曲处理: ${song.name} (ID: ${song.id})`)
          return song
        })
        console.log('✔️ 最终歌曲列表:', searchStore.songs)
      } else {
        console.warn('❌ 音源返回错误:', result.error)
        notification.error({
          title: '搜索失败',
          content: result.msg || '音源返回错误',
          duration: 3000
        })
      }
    } else {
      if (!source?.search && activeSourceId.value !== 'default') {
        notification.error({
          title: '音源初始化失败',
          content: `音源 "${source?.name}" 搜索接口出现问题，请尝试选择其他音源`,
          meta: '将使用默认音源搜索',
          duration: 3000
        })
      }
      console.log('🔄 调用默认音源搜索...')
      await searchStore.fetchTopAlbums(searchStore.query).then(() => {
        console.log('🔍 原始搜索结果:', searchStore.songs)

        const originalIds = searchStore.songs
          .filter(album => album.originSongSimpleData)
          .map(album => album.originSongSimpleData.songId)
        console.log('🆔 原唱歌曲ID列表:', originalIds)

        searchStore.songs = searchStore.songs.map(album => {
          const processed = {
            ...album,
            isOriginal: originalIds.includes(album.id),
            isVip: album.fee === 1
          }
          console.log(`🎵 处理歌曲: ${processed.name} (原唱: ${processed.isOriginal}, VIP: ${processed.isVip})`)
          return processed
        })
      })
    }
  } catch (error) {
    console.error('💥 搜索出错:', error)
    notification.error({
      title: '搜索失败',
      content: error instanceof Error ? error.message : '未知错误',
      duration: 3000
    })
  } finally {
    console.groupEnd()
  }
}

async function playSong(song: any) {
  console.group(`[播放开始] ${song.name} (ID: ${song.id})`)
  try {
    const source = audioSources.value.find(s => s.id === activeSourceId.value)
    console.log('➡️ 使用音源:', source?.name || '默认音源')
    currentPlayingSongId.value = song.id

    if (source && activeSourceId.value !== 'default') {
      console.log('🔄 调用自定义音源获取播放地址...')
      const result = await source.getMusicUrl(source.source[0], song.id)
      console.log('✅ 音源返回数据:', result)

      if (result.code) {
        const formattedSong = {
          id: song.id,
          name: song.name,
          album: result.music_album || '未知专辑',
          picUrl: song.al.picUrl,
          artists: song.ar || [],
          mp3Url: result.music_url,
          lyric: result.music_lrc || '',
          tlyric: result.music_translationlrc || ''
        }
        console.log('🎼 格式化歌曲信息:', formattedSong)
        playerStore.playSong(formattedSong)
      } else {
        console.warn('❌ 获取播放地址失败:', result.error)
        notification.error({
          title: '播放失败',
          content: result.error || '音源返回错误',
          duration: 3000
        })
      }
    } else {
      console.log('🔄 调用默认音源获取播放地址...')
      const response = await axios.get(`https://www.lihouse.xyz/coco_widget/music_resource/id/${song.id}`)
      console.log('✅ 默认音源返回数据:', response.data)

      const songData = response.data.song_data
      const formattedSong = {
        id: song.id,
        name: song.name,
        album: songData.album || '未知专辑',
        picUrl: song.al.picUrl,
        artists: song.ar || [],
        mp3Url: songData.url || '',
        lyric: songData.lyric || '',
        tlyric: ''
      }
      console.log('🎼 格式化歌曲信息:', formattedSong)
      await getTlyric(formattedSong)
    }
  } catch (error) {
    console.error('💥 播放出错:', error)
    notification.error({
      title: '播放失败',
      content: error instanceof Error ? error.message : '未知错误',
      duration: 3000
    })
  } finally {
    console.groupEnd()
  }
}

async function getTlyric(formattedSong: any) {
  console.log('🔄 获取歌词翻译...')
  try {
    const response = await axios.get('https://zm.armoe.cn/lyric', {
      params: { id: formattedSong.id }
    })
    console.log('✅ 歌词API返回:', response.data)

    if (response?.data) {
      formattedSong.tlyric = response.data.tlyric.lyric || ''
      console.log('✔️ 成功获取歌词翻译')
    }
    playerStore.playSong(formattedSong)
  } catch (error) {
    console.warn('⚠️ 获取歌词翻译失败:', error)
    playerStore.playSong(formattedSong)
  }
}

function getArtistsFormatted(artistsdata: any) {
  return artistsdata.ar?.map((artist: any) => artist.name).join(' / ') || ''
}
</script>

<template>
  <div class="search">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
      <h1 style="margin: 0; font-weight: bolder; font-family: HarmoneyOS_Sans_SC_Bold, sans-serif;">
        {{ searchStore.query }}
        <span style="font-size: 15px; font-weight: normal; color: #999;">的搜索结果</span>
      </h1>

      <n-select v-model:value="activeSourceId" :options="[
        { label: '默认音源', value: 'default' },
        ...audioSources.map(source => ({
          label: source.name,
          value: source.id,
        }))
      ]" style="width: 180px; transform: translateY(4px);" size="small" @update:value="searchWithSource" />
    </div>

    <div class="search-result"
      style="min-height: 600px; overflow-y: auto; height: calc(100vh - 201px); padding-bottom: 102px;">
      <div v-for="(album, index) in searchStore.songs" :key="album.id">
        <div :class="{ active: album.id === currentPlayingSongId }" class="search-item" @click="playSong(album)">
          <div style="width: 24px; text-align: center; font-size: 14px; color: #888; margin-right: 2px;">
            {{ index + 1 }}
          </div>
          <img style="border-radius: 7px; box-shadow: 0 0 10px rgba(0,0,0,0.2);" height="48px" :src="album.al?.picUrl"
            alt="">
          <div style="display: flex; flex-direction: column; justify-content: space-between; margin-left: 4px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: HarmonyOS_Sans_SC_Bold; font-size: 16.5px; font-weight: bold;">
                {{ album.name }}
              </span>
              <n-tag v-if="album.isOriginal" type="success" size="small" round>原唱</n-tag>
              <n-tag v-if="album.isVip" type="warning" size="small" round>VIP</n-tag>
              <n-tag v-if="activeSourceId !== 'default'" type="info" size="small" round>自定义</n-tag>
            </div>
            <span style="font-family: HarmoneyOS_Sans_SC; font-size: 14px; color: #818181;">
              {{ getArtistsFormatted(album) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search {
  width: calc(100vw - 306px);
  margin-top: 15px;
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
  cursor: pointer;
}

.search-item.active {
  background-color: rgb(153, 192, 255);
  border: #3080FF solid 2.5px;
}

.search-item:hover {
  border: #5F9CFEFF solid 2.5px;
}

.search-result::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  margin-left: 4px;
  color: #818181;
}

.search-result::-webkit-scrollbar-track {
  background-color: transparent;
}

.search-result::-webkit-scrollbar-thumb {
  background-color: #b8b8b8;
  border-radius: 4px;
  margin-left: 4px;
  transition: background-color 0.3s ease;
}

.search-result::-webkit-scrollbar-thumb:hover {
  background-color: #6b6b6b;
}
</style>