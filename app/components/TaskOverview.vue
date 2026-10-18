<script setup lang="ts">
import projects from '../data/published.json'
const { t, localePath } = useSiteLanguage()
</script>
<template>
  <section class="task-overview" aria-labelledby="task-heading">
    <span class="eyebrow muted">{{ t('Code, QR and image workflows') }}</span>
    <h2 id="task-heading">{{ t('Choose a tool for the task') }}</h2>
    <p>{{ t('Choose Tiny’s Tool for JSON, code and text; Tiny QR Toolkit for QR workflows; and Tiny Image for local image compression and resizing. Each detail page explains features, limits and website availability.') }}</p>
    <div class="task-grid"><article v-for="project in projects" :key="project.slug"><h3>{{ project.name }}</h3><ul><li v-for="group in project.featureGroups" :key="group.title">{{ t(group.title) }}</li></ul><NuxtLink class="text-link" :to="localePath(`/projects/${project.slug}/`)">{{ t('Explore the feature directory') }} <span aria-hidden="true">↗</span></NuxtLink></article></div>
  </section>
</template>
