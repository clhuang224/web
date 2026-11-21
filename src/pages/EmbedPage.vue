<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import { blogUrl } from '../content/articles'
import { guideUrl, isStandalone } from '../platform/runtime'

const { state } = useSite()
const native = isStandalone()
const blog = computed(
  () => state.value.page === 'blog' || state.value.page === 'post',
)
const source = computed(() =>
  blog.value
    ? blogUrl(state.value.page === 'post' ? state.value.id : null)
    : guideUrl(state.value.page === 'chapter' ? state.value.id : null),
)
</script>

<template>
  <webview v-if="native" class="embed-frame" :src="source" />
  <view v-else-if="blog" class="embed-frame embed-blog" />
  <view v-else class="embed-frame embed-guide" />
</template>
