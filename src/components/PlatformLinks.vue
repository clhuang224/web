<script setup lang="ts">
import { useSite } from '../app/context'
import { platforms } from '../content/projects'
defineProps<{ labels?: boolean }>()
const { openExternal } = useSite()
</script>

<template>
  <view
    class="platform-links flex gap-3"
    :class="{ 'platform-links-labeled': labels }"
  >
    <view
      v-for="platform in platforms"
      :key="platform.id"
      class="platform-link"
      accessibility-role="link"
      :accessibility-label="platform.label"
      @tap="openExternal(platform.url)"
    >
      <image
        class="platform-icon"
        :src="`/images/icons/${platform.icon}.svg`"
      />
      <text v-if="labels" class="platform-label">{{ platform.label }}</text>
    </view>
  </view>
</template>
