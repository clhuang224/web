<script setup lang="ts">
import { asset } from '../platform/runtime'
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import PlatformLinks from '../components/PlatformLinks.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { aboutStory } from '../content/about'
import { copy } from '../content/copy'
import { doodles } from '../content/doodles'
const { state } = useSite()
const illustration = doodles.find((doodle) => doodle.id === '11')
const text = computed(() => copy[state.value.locale])
const story = computed(() => aboutStory[state.value.locale])
</script>

<template>
  <view class="page">
    <SectionTitle :title="text.about" large />
    <view v-if="illustration" class="drawing-frame about-frame"
      ><image
        class="drawing-full"
        :src="asset(illustration.src)"
        mode="aspectFit"
        :accessibility-label="illustration.alt[state.locale]"
    /></view>
    <view class="about-story">
      <view
        v-for="(paragraph, index) in story.serious"
        :key="`serious-${index}`"
        class="about-paragraph"
      >
        <text v-for="line in paragraph" :key="line" class="about-line">{{
          line
        }}</text>
      </view>
      <view class="about-divider">
        <view class="about-divider-rule" />
        <text class="about-divider-label">{{ story.divider }}</text>
        <view class="about-divider-rule" />
      </view>
      <view
        v-for="(paragraph, index) in story.trivia"
        :key="`trivia-${index}`"
        class="about-paragraph"
      >
        <text v-for="line in paragraph" :key="line" class="about-line">
          {{ line }}
        </text>
      </view>
      <text class="about-date">{{ story.date }}</text>
    </view>
    <SectionTitle :title="text.platformTitle" />
    <view class="card about-platforms"><PlatformLinks labels /></view>
  </view>
</template>
