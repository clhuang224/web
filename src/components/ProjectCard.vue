<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import { copy } from '../content/copy'
import type { Project } from '../domain/site'

defineProps<{ project: Project }>()
const { state, openExternal } = useSite()
const text = computed(() => copy[state.value.locale])
</script>

<template>
  <view class="project-card">
    <view class="project-marker" />
    <text class="project-title">{{ project.title }}</text>
    <text class="project-summary">{{ project.summary[state.locale] }}</text>
    <view class="tags flex gap-3"
      ><text v-for="tag in project.tags" :key="tag" class="tag">{{
        tag
      }}</text></view
    >
    <view class="card-actions flex items-center justify-between">
      <view
        class="text-link"
        accessibility-role="link"
        :accessibility-label="`${text.openProject}: ${project.title}`"
        @tap="openExternal(project.website)"
        ><text class="link-label">{{ text.openProject }}</text
        ><image class="small-icon" src="/images/icons/arrow-right-up-line.svg"
      /></view>
      <view
        class="text-link"
        accessibility-role="link"
        :accessibility-label="`${project.title} ${text.source}`"
        @tap="openExternal(project.source)"
        ><image class="small-icon" src="/images/icons/github-line.svg" /><text
          class="source-label"
          >{{ text.source }}</text
        ></view
      >
    </view>
  </view>
</template>
