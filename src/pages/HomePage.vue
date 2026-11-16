<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import DoodleCarousel from '../components/DoodleCarousel.vue'
import ProjectCard from '../components/ProjectCard.vue'
import SectionTitle from '../components/SectionTitle.vue'
import ShowMoreButton from '../components/ShowMoreButton.vue'
import { copy } from '../content/copy'
import { projects } from '../content/projects'

const { state, navigate, openExternal } = useSite()
const text = computed(() => copy[state.value.locale])
</script>

<template>
  <view class="page home-page">
    <DoodleCarousel />
    <view class="introduction">
      <text class="greeting">{{ text.greeting }}</text>
      <text class="intro-copy">{{ text.introduction }}</text>
      <view class="hero-actions">
        <view
          class="pill-button"
          accessibility-role="link"
          @tap="openExternal('https://blog.lynns.me')"
          ><text class="pill-label">{{ text.readBlog }} ↗</text></view
        >
      </view>
    </view>
    <SectionTitle :title="text.projectsTitle" />
    <view class="card-grid" :class="{ 'card-grid-compact': state.compact }"
      ><ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
    /></view>
    <ShowMoreButton :label="text.showMore" @tap="navigate('portfolio')" />
  </view>
</template>
