<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import ArticleCard from '../components/ArticleCard.vue'
import DoodleCarousel from '../components/DoodleCarousel.vue'
import ProjectCard from '../components/ProjectCard.vue'
import SectionTitle from '../components/SectionTitle.vue'
import ShowMoreButton from '../components/ShowMoreButton.vue'
import { selectedArticles } from '../content/articles'
import { copy } from '../content/copy'
import { projects } from '../content/projects'

const { state, navigate } = useSite()
const text = computed(() => copy[state.value.locale])
</script>

<template>
  <view class="page home-page">
    <DoodleCarousel />
    <view class="introduction">
      <text
        class="greeting"
        accessibility-role="heading"
        :accessibility-label="text.greeting"
        accessibility-heading-level="1"
        >{{ text.greeting }}</text
      >
      <text class="intro-copy">{{ text.introduction }}</text>
      <view class="hero-actions">
        <view
          class="pill-button"
          accessibility-role="link"
          @tap="navigate('blog')"
          ><text class="pill-label">{{ text.readBlog }}</text></view
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
    <SectionTitle :title="text.postsTitle" />
    <view class="article-list"
      ><ArticleCard
        v-for="article in selectedArticles"
        :key="article.id"
        :article="article"
    /></view>
    <ShowMoreButton :label="text.showMore" @tap="navigate('blog')" />
  </view>
</template>
