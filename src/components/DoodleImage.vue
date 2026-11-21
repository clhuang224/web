<script setup lang="ts">
import { ref, watch } from 'vue-lynx'
import { doodlePlaceholders } from '../content/doodle-placeholders'
import { asset } from '../platform/runtime'

const props = defineProps<{ src: string; label?: string }>()
const loaded = ref(false)
watch(
  () => props.src,
  () => {
    loaded.value = false
  },
)
</script>

<template>
  <view class="doodle-layers"
    ><image
      v-if="!loaded && doodlePlaceholders[src]"
      class="doodle-layer doodle-placeholder"
      :src="doodlePlaceholders[src]"
      mode="aspectFit" /><image
      class="doodle-layer"
      :src="asset(src)"
      mode="aspectFit"
      :accessibility-label="label"
      @load="loaded = true"
  /></view>
</template>
