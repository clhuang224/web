<script setup lang="ts">
defineProps<{ title: string; large?: boolean }>()
</script>

<template>
  <view class="section-title-wrap" :class="{ 'section-title-large': large }">
    <view class="section-title-highlight" />
    <text
      class="section-title section-title-outline"
      accessibility-hidden="true"
      >{{ title }}</text
    >
    <text
      class="section-title"
      accessibility-role="heading"
      :accessibility-label="title"
      :accessibility-heading-level="large ? '1' : '2'"
      >{{ title }}</text
    >
  </view>
</template>
