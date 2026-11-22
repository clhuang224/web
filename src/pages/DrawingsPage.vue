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
  <view class="page drawings-page">
    <SectionTitle :title="text.drawings" large />
    <list
      :key="state.compact ? 'compact' : 'wide'"
      class="drawing-gallery"
      :list-type="state.compact ? 'single' : 'waterfall'"
      :span-count="state.compact ? 1 : 2"
      scroll-orientation="vertical"
      ><list-item
        v-for="doodle in doodles"
        :key="doodle.id"
        :item-key="doodle.id"
        ><DrawingCard :doodle="doodle" :label="text.drawingLabel"
      /></list-item>
    </list>
  </view>
</template>
