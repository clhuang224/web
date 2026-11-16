<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import SectionTitle from '../components/SectionTitle.vue'
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
      ><image class="small-icon" src="/images/icons/arrow-left-line.svg" /><text
        class="back-label"
        >{{ text.backToDrawings }}</text
      ></view
    >
    <SectionTitle :title="`${text.drawingLabel} ${doodle.id}`" large />
    <view class="drawing-frame"
      ><image
        class="drawing-full"
        :src="doodle.src"
        mode="aspectFit"
        :accessibility-label="doodle.alt[state.locale]"
    /></view>
    <text class="detail-summary drawing-caption">{{
      doodle.alt[state.locale]
    }}</text>
    <view class="drawing-pager">
      <view
        class="pill-button pill-button-outline"
        accessibility-role="link"
        :accessibility-label="text.previousDrawing"
        @tap="step(-1)"
        ><image
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
        ><image class="small-icon" src="/images/icons/arrow-right-line.svg"
      /></view>
    </view>
  </view>
</template>
