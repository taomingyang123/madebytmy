<script setup lang="ts">
import type { NuxtError } from '#app'
const { t, localePath, isZh } = useSiteLanguage()
const props = defineProps<{ error: NuxtError }>()
useSeoMeta({ title: () => t(props.error.statusCode === 404 ? 'Page not found | Independent Projects' : 'Something went wrong | Independent Projects'), description: () => t(props.error.statusCode === 404 ? 'This page could not be found. Explore the published projects instead.' : 'This page could not be loaded. Please try again or return to the homepage.'), robots: 'noindex, nofollow' })
useHead({ htmlAttrs: { lang: isZh.value ? 'zh-Hans' : 'en' } })
</script>
<template><div><a class="skip-link" href="#main">{{ t("Skip to content") }}</a><SiteHeader /><main id="main" tabindex="-1" class="shell error-page"><span class="eyebrow muted">{{ t(error.statusCode === 404 ? '404 / A LITTLE OFF TRACK' : 'SOMETHING WENT WRONG') }}</span><h1>{{ t(error.statusCode === 404 ? 'Nothing here. Yet.' : 'Let’s try that again.') }}</h1><p>{{ t(error.statusCode === 404 ? "The page you’re looking for isn’t available." : "This page could not be loaded. Please try again or return to the homepage.") }}</p><a class="button" :href="localePath('/')">{{ t("Back to home") }} <span aria-hidden="true">↗</span></a></main><SiteFooter /></div></template>
