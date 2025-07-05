<template>
    <div class="spectrum-container">
        <div v-if="audioStore.analyser" class="spectrum-placeholder">已检测到音频会话（当前会话数量：{{activeAudioCount}}）</div>
        <canvas v-if="audioStore.analyser" ref="canvas" class="spectrum-canvas"></canvas>
        <div v-else class="spectrum-placeholder">等待音频会话...</div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useAudioStore } from '../stores/audio';
import { computed } from 'vue';

const audioStore = useAudioStore();
const canvas = ref<HTMLCanvasElement | null>(null);
let animationFrameId = 0;

// ✅ 获取当前活跃的音频数量
const activeAudioCount = computed(() => {
  return audioStore.isPlaying ? 1 : 0;
});
function drawSpectrum() {
  if (!canvas.value || !audioStore.analyser) return;

  const canvasEl = canvas.value;
  canvasEl.width = canvasEl.clientWidth;
  canvasEl.height = canvasEl.clientHeight;

  const ctx = canvasEl.getContext('2d');
  if (!ctx) return;

  const bufferLength = audioStore.analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    if (!audioStore.analyser) return;

    audioStore.analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.fillStyle = '#4CAF50';

    const barWidth = (canvasEl.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      ctx.fillRect(x, canvasEl.height - barHeight / 2, barWidth, barHeight / 2);
      x += barWidth + 1;
    }
  }

  animationFrameId = requestAnimationFrame(renderFrame);
}

// 监听 analyser 是否存在，存在后才开始绘制
watch(
  () => audioStore.analyser,
  (newAnalyser) => {
    if (newAnalyser) {
      drawSpectrum();
    }
  }
);

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>


<style scoped>
.spectrum-container {
    width: 100%;
    height: 105px;
    background-color: #f9f9f9;
    display: flex;
    align-items: start;
    flex-direction: column;
}

.spectrum-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #999;
}

.spectrum-canvas {
    width: 100%;
    height: 100%;
}
</style>