<script setup lang="ts">
const { t, localePath, isZh, alternatePath } = useSiteLanguage()
</script>
<template>
  <header class="site-header shell">
    <NuxtLink :to="localePath('/')" class="brand"><span class="brand-mark" aria-hidden="true">↗</span><span>{{ t("Independent Projects") }}</span></NuxtLink>
    <nav :aria-label="t('Main navigation')">
      <NuxtLink :to="localePath('/')" exact-active-class="current">{{ t("Home") }}</NuxtLink>
      <NuxtLink :to="localePath('/projects/')" active-class="current">{{ t("Projects") }}</NuxtLink>
      <NuxtLink :to="localePath('/about/')" active-class="current">{{ t("About") }} <span aria-hidden="true">↗</span></NuxtLink>
    <NuxtLink class="language-switch" :to="alternatePath" :lang="isZh ? 'en' : 'zh-Hans'" :aria-label="isZh ? 'EN — Switch to English' : '切换到中文'">{{ isZh ? 'EN' : '中文' }}</NuxtLink>
    </nav>
  </header>
</template>
