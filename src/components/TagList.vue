<script setup lang="ts">
defineProps<{ tags: readonly string[] }>()
</script>

<template>
  <view class="tags"
    ><text
      v-for="(tag, index) in tags"
      :key="tag"
      class="tag"
      :class="index % 2 === 0 ? 'tag-purple' : 'tag-red'"
      >{{ tag }}</text
    ></view
  >
</template>
