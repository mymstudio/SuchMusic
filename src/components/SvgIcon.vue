<template>
    <div :style="{
        display: 'flex',
        width: `${size}px`,
        height: `${size}px`,
        verticalAlign:'middle',
        alignItems: 'center',
        justifyContent: 'center',
    }"> 
        <svg :style="{
    transform: `scale(${scale})`,
    width: `${size}px`,
    height: `${size}px`,
  }" :width="size" :height="size" :viewBox="'0 0 24 24'" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path :d="path" :fill="color" />
  </svg>
    </div>
  
</template>

<script setup lang="ts">
defineProps<{
  path: string
  color?: string
  size?: number
  scale?: number
}>()
</script>