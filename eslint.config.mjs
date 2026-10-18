import withNuxt from './.nuxt/eslint.config.mjs'
export default withNuxt({ ignores: ['app/data/published.json', 'docs/**', '.backups/**', 'Evolve/**', 'universal-project-template/**', 'madebytmy-seo-plan/**', '.template-import-*/**'] }, { rules: { 'vue/multi-word-component-names': 'off' } })
