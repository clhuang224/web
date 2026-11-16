<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import DrawingCard from '../components/DrawingCard.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { copy } from '../content/copy'
import { doodles } from '../content/doodles'
const { state } = useSite()
const text = computed(() => copy[state.value.locale])
</script>

<template>
  <view class="page">
    <SectionTitle :title="text.drawings" large />
    <text class="page-description">{{ text.drawingsIntro }}</text>
    <view
      class="card-grid card-grid-wrap"
      :class="{ 'card-grid-compact': state.compact }"
      ><DrawingCard
        v-for="doodle in doodles"
        :key="doodle.id"
        :doodle="doodle"
        :label="text.drawingLabel"
    /></view>
  </view>
</template>
