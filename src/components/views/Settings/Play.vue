<template>
    <h2 style=" font-family: HarmonyOS_Sans , sans-serif; margin-left: 12px; font-size: 24px; margin-bottom: 10px; ">
        播放设置</h2>
    <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="settings-item-description">
            <img src="../../../assets/Sonus Audio.svg" alt="" height="48px">
            <span
                style="transform: translateX(4px); font-family: HarmonyOS_Sans_SC_Bold, sans-serif; font-size: 20px; font-weight: 700;">Sonus
                Audio</span>
            <span
                style="text-align: center; width: 85%; transform: translateY(-9px) translateX(2px); font-family: HarmonyOS_Sans_SC; color: #999999; font-size: 14px; font-weight: 500;">
                Sonus Audio 是一款基于 AudioContext 的音频控制系统，<br>它拥有独特的体验，并支持多种音频格式
            </span>
        </div>

        <div class="settings-item">
            <div style="display: flex; flex-direction: column;">
                <span style="font-family: HarmonyOS_Sans_SC_Bold, sans-serif; font-size: 16px; font-weight: 700;">Sonus
                    Debug 模式</span>
                <span style=" color: #999999; font-size: 13px;">开启后，Sonus Audio 会在控制台输出调试信息</span>
            </div>
            <n-switch v-model:value="active" />
        </div>
    </div>

</template>

<style scoped>
.settings-item-description {
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 30px 20px;
    padding-bottom: 9px;
    gap: 8px;
    border-radius: 9px;
    justify-content: space-between;
    align-items: center;
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
const active = ref(false)

</script>