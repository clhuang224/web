<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import PlatformLinks from '../components/PlatformLinks.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { copy } from '../content/copy'
import { doodles } from '../content/doodles'
const { state } = useSite()
const illustration = doodles.find((doodle) => doodle.id === '11')
const text = computed(() => copy[state.value.locale])
</script>

<template>
  <view class="page">
    <SectionTitle :title="text.about" large />
    <view v-if="illustration" class="drawing-frame about-frame"
      ><image
        class="drawing-full"
        :src="illustration.src"
        mode="aspectFit"
        :accessibility-label="illustration.alt[state.locale]"
    /></view>
    <SectionTitle :title="text.platformTitle" />
    <view class="card about-platforms"><PlatformLinks labels /></view>
  </view>
</template>
