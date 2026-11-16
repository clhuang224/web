<script setup lang="ts">
defineProps<{ title: string; large?: boolean }>()
</script>

<template>
  <view class="section-title-wrap" :class="{ 'section-title-large': large }">
    <view class="section-title-highlight" />
    <text class="section-title">{{ title }}</text>
  </view>
</template>
