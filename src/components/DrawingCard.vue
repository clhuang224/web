<script setup lang="ts">
import { useSite } from '../app/context'
import type { Doodle } from '../domain/site'

defineProps<{ doodle: Doodle; label: string }>()
const { state, navigate } = useSite()
</script>

<template>
  <view
    class="card drawing-card"
    accessibility-role="link"
    :accessibility-label="`${label} ${doodle.id}: ${doodle.alt[state.locale]}`"
    @tap="navigate('drawing', doodle.id)"
  >
    <view class="drawing-thumb"
      ><image class="drawing-image" :src="doodle.src" mode="aspectFit"
    /></view>
    <text class="drawing-number">{{ label }} {{ doodle.id }}</text>
    <text class="card-summary">{{ doodle.alt[state.locale] }}</text>
  </view>
</template>
