<script setup lang="ts">
import DoodleImage from './DoodleImage.vue'
import VectorImage from './VectorImage.vue'
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
const previous = ref<number | null>(null)
const direction = ref<1 | -1>(1)
const groups = computed(() => {
  const current = { start: index.value, items: slice(index.value) }
  if (previous.value === null) return [current]
  const leaving = { start: previous.value, items: slice(previous.value) }
  return direction.value === 1 ? [leaving, current] : [current, leaving]
})
let slideTimer: ReturnType<typeof setTimeout> | undefined
const width = ref(0)
const offset = ref(0)
const sliding = ref(false)
const trackStyle = computed(() => {
  if (groups.value.length < 2) return {}
  const measured = width.value > 0
  return {
    width: measured ? `${width.value * 2}px` : '200%',
    transform: measured
      ? `translateX(${offset.value * width.value}px)`
      : `translateX(${offset.value * 50}%)`,
    transition: sliding.value
      ? `transform ${slideDuration}ms ease-in-out`
      : 'none',
  }
})

function measure(event: { detail?: { width?: number } }) {
  const value = event.detail?.width
  if (typeof value === 'number' && value > 0) width.value = value
}

function slice(start: number) {
  return doodles.slice(start, start + count.value)
}
const group = computed(() => Math.floor(index.value / count.value) + 1)
const groupCount = computed(() => Math.ceil(doodles.length / count.value))
let timer: ReturnType<typeof setInterval> | undefined
const slideDuration = 600

function schedule() {
  clearInterval(timer)
  if (playing.value && !state.value.reducedMotion) {
    timer = setInterval(() => advance(1), 6000)
  }
}

function advance(step: 1 | -1) {
  clearTimeout(slideTimer)
  const next = stepIndex(index.value, doodles.length, count.value, step)
  if (!state.value.reducedMotion) {
    previous.value = index.value
    direction.value = step
    sliding.value = false
    offset.value = step === 1 ? 0 : -1
    slideTimer = setTimeout(() => {
      sliding.value = true
      offset.value = step === 1 ? -1 : 0
      slideTimer = setTimeout(() => {
        sliding.value = false
        previous.value = null
        offset.value = 0
      }, slideDuration)
    }, 20)
  }
  index.value = next
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
onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(slideTimer)
})
</script>

<template>
  <view
    class="carousel"
    accessibility-role="region"
    :accessibility-label="text.carousel"
  >
    <view class="carousel-frame">
      <view class="carousel-viewport" @layoutchange="measure">
        <view class="carousel-track" :style="trackStyle">
          <view
            v-for="group in groups"
            :key="group.start"
            class="carousel-group"
            :accessibility-hidden="group.start === index ? undefined : 'true'"
          >
            <view
              v-for="doodle in group.items"
              :key="doodle.id"
              class="doodle-panel"
              accessibility-role="link"
              :accessibility-label="`${text.drawingLabel} ${doodle.id}: ${doodle.alt[state.locale]}`"
              @tap="navigate('drawing', doodle.id)"
            >
              <DoodleImage class="doodle-image" :src="doodle.src" />
            </view>
          </view>
        </view>
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
