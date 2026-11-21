<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import { guideUrl, isStandalone } from '../platform/runtime'

const { state } = useSite()
const native = isStandalone()
const source = computed(() =>
  guideUrl(state.value.page === 'chapter' ? state.value.id : null),
)
</script>

<template>
  <webview v-if="native" class="guide-frame" :src="source" />
  <view v-else class="guide-frame" />
</template>
