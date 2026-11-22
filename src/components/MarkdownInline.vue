<script setup lang="ts">
import { useSite } from '../app/context'
import type { MarkdownSpan } from '../domain/markdown'

defineProps<{ spans: readonly MarkdownSpan[] }>()
const { openExternal } = useSite()
</script>

<template>
  <text class="markdown-inline"
    ><text
      v-for="(span, index) in spans"
      :key="index"
      :class="{
        'markdown-bold': span.bold,
        'markdown-italic': span.italic,
        'markdown-code-inline': span.code,
        'markdown-link': span.href,
      }"
      :accessibility-role="span.href ? 'link' : undefined"
      :accessibility-label="span.href ? span.text : undefined"
      @tap="span.href && openExternal(span.href)"
      >{{ span.text }}</text
    ></text
  >
</template>
