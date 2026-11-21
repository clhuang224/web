<script setup lang="ts">
import { computed } from 'vue-lynx'
import { useSite } from '../app/context'
import { copy } from '../content/copy'
import { blogPath } from '../content/articles'
import type { SelectedArticle } from '../content/articles'
import TagList from './TagList.vue'

defineProps<{ article: SelectedArticle }>()
const { state, navigate } = useSite()
const text = computed(() => copy[state.value.locale])
</script>

<template>
  <view
    class="card article-card"
    accessibility-role="link"
    :accessibility-label="`${article.title[state.locale]} (${text.articleLanguage})`"
    @tap="navigate('post', blogPath(article.url))"
  >
    <view class="article-meta"
      ><text class="article-date">{{ article.date }}</text
      ><text
        v-if="state.locale !== article.language"
        class="article-language"
        >{{ text.articleLanguage }}</text
      ></view
    >
    <text class="card-title">{{ article.title[state.locale] }}</text>
    <text class="card-summary">{{ article.summary[state.locale] }}</text>
    <TagList :tags="article.tags" />
  </view>
</template>
