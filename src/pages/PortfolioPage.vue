<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import ProjectCard from '../components/ProjectCard.vue'
import { copy } from '../content/copy'
import { projects } from '../content/projects'
const { state } = useSite()
const text = computed(() => copy[state.value.locale])
</script>

<template>
  <view class="page portfolio-page">
    <text class="eyebrow">LYNN’S</text>
    <text class="page-title">{{ text.portfolio }}</text>
    <text class="page-description">{{ text.projectsIntro }}</text>
    <view
      class="project-grid"
      :class="{ 'project-grid-compact': state.compact }"
      ><ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
    /></view>
  </view>
</template>
