<script setup lang="ts">
import DoodleImage from '../components/DoodleImage.vue'
import MarkdownBody from '../components/MarkdownBody.vue'
import VectorImage from '../components/VectorImage.vue'
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import { copy } from '../content/copy'
import { doodles } from '../content/doodles'

const { state, navigate } = useSite()
const text = computed(() => copy[state.value.locale])
const index = computed(() =>
  doodles.findIndex((doodle) => doodle.id === state.value.id),
)
const doodle = computed(() => doodles[index.value])

function step(direction: 1 | -1) {
  const next =
    doodles[(index.value + direction + doodles.length) % doodles.length]
  navigate('drawing', next.id)
}
</script>

<template>
  <view v-if="doodle" class="page detail-page">
    <view
      class="back-link"
      accessibility-role="link"
      @tap="navigate('drawings')"
      ><VectorImage
        class="small-icon"
        src="/images/icons/arrow-left-line.svg"
      /><text class="back-label">{{ text.backToDrawings }}</text></view
    >
    <view class="drawing-frame"
      ><DoodleImage
        class="drawing-full"
        :src="doodle.src"
        :label="`${text.drawingLabel} ${doodle.id}`"
    /></view>
    <view v-if="doodle.story" class="drawing-story">
      <view class="drawing-story-meta">
        <text v-if="doodle.story.date" class="drawing-date">{{
          doodle.story.date
        }}</text>
        <text v-if="state.locale !== 'zh-TW'" class="article-language">{{
          text.originalChinese
        }}</text>
      </view>
      <MarkdownBody :blocks="doodle.story.blocks" />
    </view>
    <view class="drawing-pager">
      <view
        class="pill-button pill-button-outline"
        accessibility-role="link"
        :accessibility-label="text.previousDrawing"
        @tap="step(-1)"
        ><VectorImage
          class="small-icon"
          src="/images/icons/arrow-left-line.svg"
        /><text class="pill-label">{{ text.previousDrawing }}</text></view
      >
      <text class="drawing-position"
        >{{ index + 1 }} / {{ doodles.length }}</text
      >
      <view
        class="pill-button pill-button-outline"
        accessibility-role="link"
        :accessibility-label="text.nextDrawing"
        @tap="step(1)"
        ><text class="pill-label">{{ text.nextDrawing }}</text
        ><VectorImage
          class="small-icon"
          src="/images/icons/arrow-right-line.svg"
      /></view>
    </view>
  </view>
</template>
