<script setup lang="ts">
import projects from '../../data/published.json'
import { site } from '#shared/site'
import type { Project } from '../../../types/project'
const { t } = useSiteLanguage()
useSeo('Developer, QR & image projects — Independent Projects', 'Compare Tiny’s Tool, Tiny QR Toolkit and Tiny Image by task, features and availability, with practical workflows and project links.', '/projects/', [
  { '@type': 'CollectionPage', name: 'Project directory', url: site.origin + '/projects/', mainEntity: { '@type': 'ItemList', itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${site.origin}/projects/${p.slug}/` })) } },
])
</script>
<template>
  <div class="shell"><section class="page-intro"><span class="eyebrow muted">{{ t("THE PROJECT INDEX") }}</span><h1>{{ t("Web tool projects,") }}<br><span>{{ t("organized by task.") }}</span></h1><p>{{ t("Choose Tiny’s Tool for JSON, code and text; Tiny QR Toolkit for QR workflows; and Tiny Image for local image compression and resizing. Each detail page explains features, limits and website availability.") }}</p></section><section class="project-list" aria-labelledby="published"><div class="section-heading"><h2 id="published">{{ t("Project directory") }}</h2><span class="eyebrow muted">{{ String(projects.length).padStart(2, '0') }} {{ t('PROJECTS_COUNT') }}</span></div><ProjectCard v-for="(project, index) in projects" :key="project.id" :index="index" :project="(project as Project)" /></section><aside class="end-note"><span aria-hidden="true">↳</span><p>{{ t("Small by design.") }}<br><span>{{ t("More work will appear here when it’s ready to use.") }}</span></p></aside></div>
</template>
