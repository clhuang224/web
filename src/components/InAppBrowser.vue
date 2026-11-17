<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import { copy } from '../content/copy'
import VectorImage from './VectorImage.vue'

const props = defineProps<{ url: string }>()
const { state, closeBrowser } = useSite()
const text = computed(() => copy[state.value.locale])
const host = computed(
  () => /^https?:\/\/([^/?#]+)/.exec(props.url)?.[1] ?? props.url,
)
</script>

<template>
  <view class="in-app-browser">
    <view class="browser-bar">
      <view
        class="icon-button"
        accessibility-role="button"
        :accessibility-label="text.closePage"
        @tap="closeBrowser"
        ><VectorImage class="small-icon" src="/images/icons/close-line.svg"
      /></view>
      <text class="browser-host">{{ host }}</text>
    </view>
    <webview class="browser-page" :src="url" />
  </view>
</template>
