<template>
    <h2 style=" font-family: HarmonyOS_Sans , sans-serif; margin-left: 12px; font-size: 24px; margin-bottom: 10px; ">
        音源设置</h2>
    <div style="display: flex; flex-direction: column; gap: 12px;">

        <div class="settings-item">
            <div style="display: flex; flex-direction: column;">
                <span style="font-family: HarmonyOS_Sans_SC_Bold, sans-serif; font-size: 16px; font-weight: 700;">
                    自定义音源
                </span>
                <span style=" color: #999999; font-size: 13px;">开启后，如默认音源无法使用，将使用自定义音源播放音乐和搜索音乐</span>
            </div>
            <n-switch v-model:value="active" />
        </div>

        <div class="settings-item">
            <div @click="toggleDrawer" style="display: flex; flex-direction: column;">
                <span style="font-family: HarmonyOS_Sans_SC_Bold, sans-serif; font-size: 16px; font-weight: 700;">
                    音源管理
                </span>
                <span style=" color: #999999; font-size: 13px;">当前可用音源数量：{{ sources.length }}</span>
            </div>


            <div class="file-upload-container">
                <input id="hidden-file-input" type="file" accept=".js" @change="handleFileUpload"
                    style="display: none;" />
                <label for="hidden-file-input" @click.stop="handleButtonClick">
                    <n-button icon-placement="left" secondary strong>
                        <template #icon>
                            <n-icon>
                                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                                    <title>add_fill</title>
                                    <g id="add_fill" fill='none'>
                                        <path
                                            d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z' />
                                        <path fill='currentColor'
                                            d='M10.5 20a1.5 1.5 0 0 0 3 0v-6.5H20a1.5 1.5 0 0 0 0-3h-6.5V4a1.5 1.5 0 0 0-3 0v6.5H4a1.5 1.5 0 0 0 0 3h6.5z' />
                                    </g>
                                </svg>
                            </n-icon>
                        </template>
                        添加音源
                    </n-button>
                </label>
            </div>

        </div>


        <!-- 抽屉内容 -->
        <transition name="slide">
            <div v-show="isDrawerOpen" class="drawer-content">

                <n-list hoverable clickable>
                    <!-- 动态渲染导入的音源列表 -->
                    <n-list-item v-for="(source, index) in sources" :key="index">
                        <n-thing :title="source.name" content-style="margin-top: 10px; margin-bottom: 10px;">
                            <template #description>
                                <span style="font-size: 13px; color: #999999; position: relative; top: -7px;">
                                    {{ source.author }} <n-divider vertical /> 版本：{{ source.version }}
                                </span>
                                <n-space size="small" style="transform: translateY(-3px);">
                                    <n-tag round :bordered="false" type="info" size="small">
                                        官方音源
                                    </n-tag>
                                    <n-tag v-for="(platform, i) in source.source" :key="i" round :bordered="false"
                                        :type="platform === 'wyy' ? 'error' : 'warning'" size="small">
                                        {{ platform === 'wyy' ? 'wyy' : platform === 'qq' ? 'QQ' : platform }}
                                    </n-tag>
                                </n-space>
                            </template>
                        </n-thing>
                    </n-list-item>
                </n-list>
            </div>
        </transition>

    </div>

</template>

<style scoped>
.settings-item-description {
    background-color: white;
    display: flex;
    flex-direction: row;
    padding: 30px 20px;
    padding-bottom: 9px;
    padding-top: 8px;
    gap: 8px;
    border-radius: 9px;
    justify-content: start;
    flex: 1;
    align-items: center;
}


.drawer-content {
    overflow: hidden;
    padding: 14px 14px;
    padding-bottom: 14px;
    transition: max-height 0.3s ease-out;
    background-color: white;
    max-height: 500px;
    border-top: 1px solid #d8d7d7;
    transform: translateY(-16px);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    /* 设置合适的高度 */
}

.drawer-content[aria-hidden="true"] {
    max-height: 0;

}

/* 过渡动画样式 */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}

.settings-item {
    background-color: white;
    display: flex;
    flex-direction: row;
    padding: 10px 20px;
    border-radius: 9px;
    justify-content: space-between;
    align-items: center;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import type { NotificationType } from 'naive-ui'
import { useNotification } from 'naive-ui'
import { AudioSourceParser, AudioSourcePlugin, audioSources, addAudioSource } from './AudioSource';

const active = ref(false)
const notification = useNotification()
const isDrawerOpen = ref(false)
const sources = ref<AudioSourcePlugin[]>([])

const handleButtonClick = () => {
    document.getElementById('hidden-file-input')?.click();
};

function notify(type: NotificationType, message: string, description: string) {
    notification[type]({
        content: message,
        meta: description,
        duration: 5500,
        keepAliveOnHover: true
    })
}

function toggleDrawer() {
    isDrawerOpen.value = !isDrawerOpen.value
}

// 处理文件上传
const uploadFileName = ref('')

// 处理文件上传
async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
        const file = input.files[0]
        uploadFileName.value = file.name

        try {
            const source = await AudioSourceParser.parseFromFile(file, notification)
            console.log(source)
            // 测试音源搜索功能
            const testResult = await source.search('wyy', 'test', 1, 10)
            if (!testResult.code) {
                throw new Error(testResult.msg || '音源搜索测试失败')
            }

            addAudioSource(source) // 使用全局方法添加音源
            notification.success({
                title: '导入成功',
                content: `音源 "${source.name}" 已加载`,
                duration: 3000
            })
        } catch (error) {
            uploadFileName.value = ''
            notification.error({
                title: '导入失败',
                content: error instanceof Error ? error.message : '未知错误',
                duration: 5000
            })
        }
    }
}
</script>