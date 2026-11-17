<script setup lang="ts">
import { asset, isStandalone } from '../platform/runtime'

defineProps<{ src: string }>()
const native = isStandalone()
</script>

<template>
  <svg v-if="native" :src="asset(src)" />
  <image v-else :src="src" mode="aspectFit" />
</template>
