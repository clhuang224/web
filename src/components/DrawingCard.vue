<script setup lang="ts">
import DoodleImage from './DoodleImage.vue'
import { useSite } from '../app/context'
import type { Doodle } from '../domain/site'

defineProps<{ doodle: Doodle; label: string }>()
const { navigate } = useSite()
</script>

<template>
  <view
    class="drawing-card"
    accessibility-role="link"
    :accessibility-label="`${label} ${doodle.id}`"
    @tap="navigate('drawing', doodle.id)"
  >
    <view class="drawing-thumb"
      ><DoodleImage class="drawing-image" :src="doodle.src"
    /></view>
  </view>
</template>
