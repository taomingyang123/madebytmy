<script setup lang="ts">
import projects from '../data/published.json'
import type { Project } from '../../types/project'
import { site } from '#shared/site'
const { t, localePath } = useSiteLanguage()
const featured = projects.filter(p => p.featured)
useSeo('Developer, QR & image tools — Independent Projects', 'Explore independent web projects for JSON and code tasks, QR code workflows, and local image compression with Tiny Image.', '/', [
  { '@type': 'WebSite', '@id': `${site.origin}/#website`, name: site.name, url: site.origin + '/', inLanguage: 'en' },
  { '@type': 'ItemList', name: 'Featured projects', itemListElement: featured.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${site.origin}/projects/${p.slug}/` })) },
])
</script>
<template>
  <div class="shell">
    <section class="hero">
      <div class="eyebrow"><span class="small-dot orange" /> {{ t("INDEPENDENT DEVELOPER") }}</div>
      <h1>{{ t("Developer tools.") }}<br><span>{{ t("Everyday utilities.") }}</span></h1>
      <div class="hero-bottom"><p>{{ t("I build practical things for the web—") }}<br class="desktop-break"> {{ t("turning everyday friction into something useful.") }}</p><NuxtLink :to="localePath('/projects/')" class="button">{{ t("Explore my projects") }} <span aria-hidden="true">↗</span></NuxtLink></div>
      <div class="hero-margin"><span>{{ t("IDEA → BUILD → REFINE") }}</span><span>{{ t("SCROLL TO EXPLORE ↓") }}</span></div>
    </section>
    <section class="work-section" aria-labelledby="selected-work"><div class="section-heading"><div><span class="eyebrow muted">{{ t("01 / SELECTED WORK") }}</span><h2 id="selected-work">{{ t("Built to be useful.") }}</h2></div><NuxtLink class="text-link" :to="localePath('/projects/')">{{ t("All projects") }} <span aria-hidden="true">↗</span></NuxtLink></div><ProjectCard v-for="(project, index) in featured" :key="project.id" :index="index" :project="(project as Project)" /></section>
    <TaskOverview /><section class="approach-section" aria-labelledby="approach"><div><span class="eyebrow muted">{{ t("02 / THE APPROACH") }}</span><h2 id="approach">{{ t("Less noise.") }}<br>{{ t("More purpose.") }}</h2><NuxtLink class="text-link" :to="localePath('/about/')">{{ t("A little about me") }} <span aria-hidden="true">↗</span></NuxtLink></div><div class="principles"><div><span>01</span><div><h3>{{ t("Start with a real task.") }}</h3><p>{{ t("A small tool should make an everyday job a little easier. That’s a good place to begin.") }}</p></div></div><div><span>02</span><div><h3>{{ t("Keep things understandable.") }}</h3><p>{{ t("Clear inputs, useful explanations, and honest limits. The details are part of the product.") }}</p></div></div><div><span>03</span><div><h3>{{ t("Make room to improve.") }}</h3><p>{{ t("Build something focused, use it, and refine it. Useful software is never quite finished.") }}</p></div></div></div></section>
  </div>
</template>
