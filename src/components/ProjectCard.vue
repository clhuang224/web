<script setup lang="ts">
import { useSite } from '../app/context'
import type { Project } from '../domain/site'
import TagList from './TagList.vue'

defineProps<{ project: Project }>()
const { state, navigate } = useSite()
</script>

<template>
  <view
    class="card project-card"
    accessibility-role="link"
    :accessibility-label="project.title"
    @tap="navigate('project', project.id)"
  >
    <text class="card-title">{{ project.title }}</text>
    <text class="card-summary">{{ project.summary[state.locale] }}</text>
    <TagList :tags="project.tags" />
  </view>
</template>
