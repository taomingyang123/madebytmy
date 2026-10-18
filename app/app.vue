<script setup lang="ts">
const { t } = useSiteLanguage()
</script>
<template>
  <div>
    <a class="skip-link" href="#main">{{ t("Skip to content") }}</a>
    <SiteHeader />
    <main id="main" tabindex="-1"><NuxtPage :page-key="route => route.path" /></main>
    <SiteFooter />
  </div>
</template>
