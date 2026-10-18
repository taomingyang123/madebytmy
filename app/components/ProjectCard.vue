<script setup lang="ts">
import type { Project } from '../../types/project'
const { t, localePath, externalUrl } = useSiteLanguage()
defineProps<{ project: Project; index: number }>()
</script>
<template>
  <article class="project-card">
    <div class="art-link"><ToolArtwork :qr="project.slug === 'qr-generator'" :image-tool="project.slug === 'image-compression'" /></div>
    <div class="project-copy"><div class="eyebrow"><span class="small-dot" /> {{ t(project.websiteAvailable === false ? "Project overview" : "PUBLISHED PROJECT") }} <span class="project-number">{{ String(index + 1).padStart(2, '0') }}</span></div><h3><NuxtLink :to="localePath(`/projects/${project.slug}/`)">{{ project.name }}</NuxtLink></h3><p class="project-tagline">{{ t(project.tagline) }}</p><p>{{ t(project.summary) }}</p><div class="tags"><span>{{ t(project.category === 'utility' ? 'Web utilities' : 'Developer tools') }}</span><span>{{ t("Web application") }}</span></div><div class="project-actions"><NuxtLink class="text-link" :to="localePath(`/projects/${project.slug}/`)">{{ t("Explore the project") }} <span aria-hidden="true">↗</span></NuxtLink><a v-if="project.websiteAvailable !== false" :href="externalUrl(project.websiteUrl, project.websiteZhUrl)" target="_blank" rel="noopener noreferrer" class="quiet-link">{{ t("Visit site ↗") }}<span class="sr-only">{{ t(" (opens in a new tab)") }}</span></a><span v-else class="quiet-link">{{ t("Website temporarily unavailable") }}</span></div></div>
  </article>
</template>
