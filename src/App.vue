<script setup lang="ts">
import { computed, provide, watch } from 'vue-lynx'
import { RouterView } from 'vue-router'
import { siteContextKey } from './app/context'
import { router } from './app/router'
import PlatformLinks from './components/PlatformLinks.vue'
import { copy } from './content/copy'
import { locales } from './domain/site'
import type { Page } from './domain/site'
import { useHost } from './platform/host'
import './styles/uno.css'
import './styles/site.css'

const site = useHost()
provide(siteContextKey, site)
const { state, navigate, setLocale, openExternal } = site
const text = computed(() => copy[state.value.locale])
const navigation: Page[] = ['home', 'portfolio', 'about']
const languageNames = { 'zh-TW': '繁中', en: 'EN', ja: '日本語' }
const routes: Record<Page, string> = {
  home: '/',
  portfolio: '/portfolio',
  about: '/about',
}
watch(
  () => state.value.page,
  (page) => {
    void router.replace(routes[page])
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
        ><image
          class="wordmark"
          src="/images/brand/lynns-wordmark.svg"
          mode="aspectFit"
      /></view>
      <view class="sidebar-platforms"><PlatformLinks /></view>
      <view class="navigation">
        <view
          v-for="page in navigation"
          :key="page"
          class="nav-link"
          :class="{ 'nav-link-active': state.page === page }"
          accessibility-role="link"
          :accessibility-label="text[page]"
          :accessibility-selected="String(state.page === page)"
          @tap="navigate(page)"
          ><text class="nav-label">{{ text[page] }}</text></view
        >
        <view
          class="nav-link"
          accessibility-role="link"
          :accessibility-label="text.blog"
          @tap="openExternal('https://blog.lynns.me')"
          ><text class="nav-label">{{ text.blog }} ↗</text></view
        >
      </view>
      <view class="sidebar-bottom">
        <view class="language-picker" :accessibility-label="text.language"
          ><view
            v-for="locale in locales"
            :key="locale"
            class="language-option"
            :class="{ 'language-option-active': state.locale === locale }"
            accessibility-role="button"
            :accessibility-label="languageNames[locale]"
            :accessibility-selected="String(state.locale === locale)"
            @tap="setLocale(locale)"
            ><text class="language-text">{{
              languageNames[locale]
            }}</text></view
          ></view
        >
        <text class="sidebar-note">{{ text.madeWith }}</text>
        <text class="copyright">© Lynn</text>
      </view>
    </view>
    <scroll-view class="main-scroll" scroll-orientation="vertical">
      <view class="main-content"
        ><RouterView /><view class="footer"
          ><text class="footer-label">LYNN’S · {{ text.madeWith }}</text></view
        ></view
      >
    </scroll-view>
  </view>
</template>
