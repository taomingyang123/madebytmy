<script setup lang="ts">
const { t, localePath } = useSiteLanguage()
</script>
<template>
  <footer class="site-footer shell">
    <div><NuxtLink :to="localePath('/')" class="footer-name">{{ t("Independent Projects") }}<span class="brand-dot">.</span></NuxtLink><p>{{ t("Small tools. Thoughtfully made.") }}</p></div>
    <nav :aria-label="t('Footer navigation')"><NuxtLink :to="localePath('/projects/')">{{ t("Projects") }}</NuxtLink><NuxtLink :to="localePath('/about/')">{{ t("About") }}</NuxtLink><a href="#main">{{ t("Back to top ↑") }}</a></nav>
    <p class="footer-note">{{ t("Independent developer · No third-party analytics") }}</p>
  </footer>
</template>
