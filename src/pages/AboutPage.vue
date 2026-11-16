<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import PlatformLinks from '../components/PlatformLinks.vue'
import { copy } from '../content/copy'
import { doodles } from '../content/doodles'
const { state } = useSite()
const illustration = doodles.find((doodle) => doodle.id === 'doodle-11')
const text = computed(() => copy[state.value.locale])
</script>

<template>
  <view class="page about-page">
    <text class="eyebrow">LYNN’S</text>
    <text class="page-title">{{ text.about }}</text>
    <image
      v-if="illustration"
      class="about-illustration"
      :src="illustration.src"
      mode="aspectFit"
      :accessibility-label="illustration.alt[state.locale]"
    />
    <text class="section-title about-platform-title">{{
      text.platformTitle
    }}</text>
    <PlatformLinks labels />
  </view>
</template>
