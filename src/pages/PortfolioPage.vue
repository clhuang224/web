<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import ProjectCard from '../components/ProjectCard.vue'
import SectionTitle from '../components/SectionTitle.vue'
import { copy } from '../content/copy'
import { projects } from '../content/projects'
const { state } = useSite()
const text = computed(() => copy[state.value.locale])
</script>

<template>
  <view class="page">
    <SectionTitle :title="text.portfolio" large />
    <text class="page-description">{{ text.projectsIntro }}</text>
    <view class="card-grid" :class="{ 'card-grid-compact': state.compact }"
      ><ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
    /></view>
  </view>
</template>
