<script setup lang="ts">
import type { MarkdownBlock } from '../domain/markdown'
import MarkdownInline from './MarkdownInline.vue'

defineProps<{ blocks: readonly MarkdownBlock[] }>()
</script>

<template>
  <view class="markdown-body">
    <view v-for="(block, index) in blocks" :key="index">
      <MarkdownInline
        v-if="block.kind === 'paragraph' || block.kind === 'heading'"
        :spans="block.spans"
        :class="
          block.kind === 'heading'
            ? `markdown-heading markdown-h${block.level}`
            : ''
        "
        :accessibility-role="block.kind === 'heading' ? 'heading' : undefined"
        :accessibility-heading-level="
          block.kind === 'heading' ? String(block.level) : undefined
        "
      />
      <view v-else-if="block.kind === 'quote'" class="markdown-quote"
        ><MarkdownBody :blocks="block.blocks"
      /></view>
      <view v-else-if="block.kind === 'list'" class="markdown-list">
        <view
          v-for="(item, itemIndex) in block.items"
          :key="itemIndex"
          class="markdown-list-item"
        >
          <text class="markdown-marker">{{
            block.ordered ? `${block.start + itemIndex}.` : '•'
          }}</text>
          <MarkdownBody class="markdown-list-content" :blocks="item" />
        </view>
      </view>
      <text v-else-if="block.kind === 'code'" class="markdown-code">{{
        block.text
      }}</text>
      <view v-else class="markdown-rule" />
    </view>
  </view>
</template>
