<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import DoodleCarousel from '../components/DoodleCarousel.vue'
import PlatformLinks from '../components/PlatformLinks.vue'
import ProjectCard from '../components/ProjectCard.vue'
import { copy } from '../content/copy'
import { projects } from '../content/projects'

const { state, navigate, openExternal } = useSite()
const text = computed(() => copy[state.value.locale])
</script>

<template>
  <view class="page home-page">
    <DoodleCarousel />
    <view class="introduction">
      <text class="eyebrow">{{ text.eyebrow }}</text>
      <text class="greeting">{{ text.greeting }}</text>
      <text class="intro-copy">{{ text.introduction }}</text>
      <view class="hero-actions flex items-center gap-3">
        <view
          class="button button-primary"
          accessibility-role="link"
          @tap="navigate('portfolio')"
          ><text class="button-label">{{ text.portfolio }}</text
          ><image class="small-icon" src="/images/icons/arrow-right-line.svg"
        /></view>
        <view
          class="button button-secondary"
          accessibility-role="link"
          @tap="openExternal('https://blog.lynns.me')"
          ><text class="button-label">{{ text.readBlog }}</text
          ><image
            class="small-icon"
            src="/images/icons/arrow-right-up-line.svg"
        /></view>
      </view>
    </view>
    <view class="section-heading flex items-center justify-between"
      ><text class="section-title">{{ text.projectsTitle }}</text
      ><view accessibility-role="link" @tap="navigate('portfolio')"
        ><text class="section-more">{{ text.allProjects }} ↗</text></view
      ></view
    >
    <view
      class="project-grid"
      :class="{ 'project-grid-compact': state.compact }"
      ><ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
    /></view>
    <view class="home-platforms"><PlatformLinks labels /></view>
  </view>
</template>
