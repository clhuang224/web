<script setup lang="ts">
import VectorImage from './components/VectorImage.vue'
import { computed, provide, ref, watch } from 'vue-lynx'
import { RouterView } from 'vue-router'
import { siteContextKey } from './app/context'
import { router } from './app/router'
import InAppBrowser from './components/InAppBrowser.vue'
import PlatformLinks from './components/PlatformLinks.vue'
import { copy } from './content/copy'
import { pathForPage } from './domain/navigation'
import { locales } from './domain/site'
import type { Locale, Page } from './domain/site'
import { useHost } from './platform/host'
import './styles/uno.css'
import './styles/site.css'

const site = useHost()
provide(siteContextKey, site)
const { state, navigate, setLocale, openExternal, openGuide, browserUrl } = site
const text = computed(() => copy[state.value.locale])
const languageNames: Record<Locale, string> = {
  'zh-TW': '繁體中文',
  en: 'English',
  ja: '日本語',
}
const languageOpen = ref(false)

type NavigationItem =
  'home' | 'blog' | 'portfolio' | 'drawings' | 'about' | 'guide'
const navigation: NavigationItem[] = [
  'home',
  'blog',
  'portfolio',
  'drawings',
  'about',
  'guide',
]
const sections: Record<Page, NavigationItem> = {
  home: 'home',
  portfolio: 'portfolio',
  project: 'portfolio',
  drawings: 'drawings',
  drawing: 'drawings',
  about: 'about',
}

function select(item: NavigationItem) {
  if (item === 'blog') openExternal('https://blog.lynns.me')
  else if (item === 'guide') openGuide()
  else navigate(item)
}

function chooseLocale(locale: Locale) {
  languageOpen.value = false
  if (locale !== state.value.locale) setLocale(locale)
}

watch(
  () => [state.value.page, state.value.id] as const,
  ([page, id]) => {
    void router.replace(pathForPage('zh-TW', page, id))
  },
  { immediate: true },
)
</script>

<template>
  <view class="site-shell" :class="{ 'site-shell-compact': state.compact }">
    <view class="sidebar">
      <view
        class="brand-link"
        accessibility-role="link"
        :accessibility-label="'Lynn’s · ' + text.home"
        @tap="navigate('home')"
        ><VectorImage class="wordmark" src="/images/brand/lynns-wordmark.svg"
      /></view>
      <view class="sidebar-platforms"><PlatformLinks /></view>
      <view class="navigation">
        <view
          v-for="item in navigation"
          :key="item"
          class="nav-link"
          accessibility-role="link"
          :accessibility-label="
            item === 'guide'
              ? `${text.guide} (${text.guideLanguage})`
              : text[item]
          "
          :accessibility-selected="String(sections[state.page] === item)"
          @tap="select(item)"
          ><text
            class="nav-label"
            :class="{ 'nav-label-active': sections[state.page] === item }"
            >{{ text[item] }}{{ item === 'blog' ? ' ↗' : '' }}</text
          ></view
        >
      </view>
      <view class="sidebar-bottom">
        <view class="language-select">
          <view
            class="language-trigger"
            :class="{ 'language-trigger-open': languageOpen }"
            accessibility-role="button"
            :accessibility-label="`${text.language}: ${languageNames[state.locale]}`"
            @tap="languageOpen = !languageOpen"
            ><VectorImage
              class="small-icon"
              src="/images/icons/translate-2.svg" /><text
              class="language-current"
              >{{ languageNames[state.locale] }}</text
            ><VectorImage
              class="small-icon"
              :src="`/images/icons/${languageOpen ? 'arrow-up-s-line' : 'arrow-down-s-line'}.svg`"
          /></view>
        </view>
        <text class="copyright">{{ text.copyright }}</text>
        <text class="sidebar-note">{{ text.madeWith }}</text>
      </view>
    </view>
    <scroll-view class="main-scroll" scroll-orientation="vertical">
      <view class="main-content"><RouterView /></view>
    </scroll-view>
    <view v-if="languageOpen" class="language-menu">
      <view
        v-for="locale in locales"
        :key="locale"
        class="language-option"
        :class="{ 'language-option-active': state.locale === locale }"
        accessibility-role="button"
        :accessibility-label="languageNames[locale]"
        :accessibility-selected="String(state.locale === locale)"
        @tap="chooseLocale(locale)"
        ><text class="language-text">{{ languageNames[locale] }}</text></view
      >
    </view>
    <InAppBrowser v-if="browserUrl" :url="browserUrl" />
  </view>
</template>
