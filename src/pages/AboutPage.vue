<script setup lang="ts">
import { asset } from '../platform/runtime'
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import PlatformLinks from '../components/PlatformLinks.vue'
import MarkdownBody from '../components/MarkdownBody.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { aboutStory } from '../content/about'
import { copy } from '../content/copy'
import { doodles } from '../content/doodles'
const { state } = useSite()
const illustration = doodles.find((doodle) => doodle.id === '02')
const text = computed(() => copy[state.value.locale])
const story = aboutStory
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
      <text
        v-if="state.locale !== 'zh-TW'"
        class="article-language about-language"
        >{{ text.aboutLanguage }}</text
      >
      <MarkdownBody :blocks="story.blocks" />
      <text v-if="story.date" class="about-date">{{ story.date }}</text>
    </view>
    <SectionTitle :title="text.platformTitle" />
    <view class="card about-platforms"><PlatformLinks labels /></view>
  </view>
</template>
