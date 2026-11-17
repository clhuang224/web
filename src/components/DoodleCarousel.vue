<script setup lang="ts">
import VectorImage from './VectorImage.vue'
import { asset } from '../platform/runtime'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue-lynx'
import { useSite } from '../app/context'
import { copy } from '../content/copy'
import { doodles } from '../content/doodles'
import { alignIndex, stepIndex, visibleCount } from '../domain/carousel'

const { state, navigate } = useSite()
const text = computed(() => copy[state.value.locale])
const count = computed(() => visibleCount(state.value.compact))
const index = ref(0)
const playing = ref(true)
const visible = computed(() =>
  doodles.slice(index.value, index.value + count.value),
)
const group = computed(() => Math.floor(index.value / count.value) + 1)
const groupCount = computed(() => Math.ceil(doodles.length / count.value))
let timer: ReturnType<typeof setInterval> | undefined

function schedule() {
  clearInterval(timer)
  if (playing.value && !state.value.reducedMotion) {
    timer = setInterval(() => advance(1), 6000)
  }
}

function advance(direction: 1 | -1) {
  index.value = stepIndex(index.value, doodles.length, count.value, direction)
}

function manualAdvance(direction: 1 | -1) {
  advance(direction)
  schedule()
}

function togglePlayback() {
  playing.value = !playing.value
  schedule()
}

watch(count, (value) => {
  index.value = alignIndex(index.value, doodles.length, value)
})
watch(
  () => state.value.reducedMotion,
  (value) => {
    if (value) playing.value = false
    schedule()
  },
)
onMounted(() => {
  if (state.value.reducedMotion) playing.value = false
  schedule()
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <view class="carousel" :accessibility-label="text.carousel">
    <view class="carousel-frame">
      <view
        v-for="doodle in visible"
        :key="doodle.id"
        class="doodle-panel"
        accessibility-role="link"
        :accessibility-label="`${text.drawingLabel} ${doodle.id}: ${doodle.alt[state.locale]}`"
        @tap="navigate('drawing', doodle.id)"
      >
        <image class="doodle-image" :src="asset(doodle.src)" mode="aspectFit" />
      </view>
    </view>
    <view class="carousel-controls flex items-center justify-between">
      <text class="carousel-caption"
        >2016–2023 · {{ group }} / {{ groupCount }}</text
      >
      <view class="flex items-center gap-3">
        <view
          class="icon-button"
          accessibility-role="button"
          :accessibility-label="text.previous"
          @tap="manualAdvance(-1)"
          ><VectorImage
            class="small-icon"
            src="/images/icons/arrow-left-line.svg"
        /></view>
        <view
          class="playback-button"
          accessibility-role="button"
          :accessibility-label="playing ? text.pause : text.play"
          @tap="togglePlayback"
          ><VectorImage
            class="small-icon"
            :src="`/images/icons/${playing ? 'pause-line' : 'play-line'}.svg`"
          /><text class="control-text">{{
            playing ? text.pause : text.play
          }}</text></view
        >
        <view
          class="icon-button"
          accessibility-role="button"
          :accessibility-label="text.next"
          @tap="manualAdvance(1)"
          ><VectorImage
            class="small-icon"
            src="/images/icons/arrow-right-line.svg"
        /></view>
      </view>
    </view>
  </view>
</template>
