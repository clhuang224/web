<script setup lang="ts">
import { tagColor } from '../content/tags'

defineProps<{ tags: readonly string[] }>()
</script>

<template>
  <view class="tags"
    ><text
      v-for="tag in tags"
      :key="tag"
      class="tag"
      :style="{ backgroundColor: tagColor(tag) }"
      >{{ tag }}</text
    ></view
  >
</template>
