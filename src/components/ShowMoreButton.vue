<script setup lang="ts">
defineProps<{ label: string }>()
defineEmits<{ tap: [] }>()
</script>

<template>
  <view class="show-more-row">
    <view
      class="show-more"
      accessibility-role="link"
      :accessibility-label="label"
      @tap="$emit('tap')"
      ><text class="show-more-label">{{ label }}</text></view
    >
  </view>
</template>
