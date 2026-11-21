<script setup lang="ts">
import VectorImage from '../components/VectorImage.vue'
import { computed, watch } from 'vue-lynx'
import { useSite } from '../app/context'
import SectionTitle from '../components/SectionTitle.vue'
import TagList from '../components/TagList.vue'
import { copy } from '../content/copy'
import { projects } from '../content/projects'
import { repositoryFromSource } from '../domain/repository'

const { state, repositories, navigate, openExternal, requestRepository } =
  useSite()
const text = computed(() => copy[state.value.locale])
const project = computed(() =>
  projects.find((candidate) => candidate.id === state.value.id),
)
const repositoryName = computed(() =>
  project.value ? repositoryFromSource(project.value.source) : null,
)
const repository = computed(() =>
  repositoryName.value ? repositories.value[repositoryName.value] : undefined,
)
const updated = computed(() =>
  repository.value
    ? new Date(repository.value.pushedAt).toISOString().slice(0, 10)
    : '',
)

watch(
  repositoryName,
  (name) => {
    if (name) requestRepository(name)
  },
  { immediate: true },
)
</script>

<template>
  <view v-if="project" class="page detail-page">
    <view
      class="back-link"
      accessibility-role="link"
      @tap="navigate('portfolio')"
      ><VectorImage
        class="small-icon"
        src="/images/icons/arrow-left-line.svg"
      /><text class="back-label">{{ text.backToPortfolio }}</text></view
    >
    <SectionTitle :title="project.title" large />
    <view class="card detail-card">
      <text class="detail-summary">{{ project.summary[state.locale] }}</text>
      <TagList :tags="project.tags" />
      <view v-if="repository" class="repository-facts">
        <view v-if="repository.language" class="fact"
          ><text class="fact-label">{{ text.repositoryLanguage }}</text
          ><text class="fact-value">{{ repository.language }}</text></view
        >
        <view class="fact"
          ><text class="fact-label">{{ text.repositoryStars }}</text
          ><text class="fact-value">{{ repository.stars }}</text></view
        >
        <view class="fact"
          ><text class="fact-label">{{ text.repositoryUpdated }}</text
          ><text class="fact-value">{{ updated }}</text></view
        >
      </view>
      <view class="detail-actions">
        <view
          class="pill-button"
          accessibility-role="link"
          @tap="openExternal(project.website)"
          ><text class="pill-label">{{ text.openProject }}</text
          ><VectorImage
            class="small-icon"
            src="/images/icons/arrow-right-up-line.svg"
        /></view>
        <view
          class="pill-button pill-button-outline"
          accessibility-role="link"
          @tap="openExternal(project.source)"
          ><VectorImage
            class="small-icon"
            src="/images/icons/github-line.svg"
          /><text class="pill-label">{{ text.source }}</text></view
        >
      </view>
    </view>
  </view>
</template>
