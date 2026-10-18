# 03 · 技术架构与工程规范

## 选型

- **Nuxt 4**（当前支持版本；PDF 的 Nuxt 3 已于 2026-07-31 结束维护）。若用户硬性坚持 Nuxt 3：先说明维护风险，核心架构保持可迁移，尽快规划升级；不要默默把 Nuxt 3 当最新版本。
- TypeScript strict，Tailwind CSS（安装与 Nuxt 当前版本兼容的官方或维护中方案，拒绝照搬旧教程依赖）。
- Node.js 22 LTS 或当前仍维护的 LTS；以部署环境可用版本为准，锁定 `.nvmrc` 与 packageManager，CI 严格使用锁文件。若用户选择 Yarn 4，按其 `corepack` 兼容流程执行。
- 无数据库、无服务端运行时、无账号/鉴权；项目数据位于 Git 仓库，编译时生成全部静态 HTML。
- GitHub 单独仓库 + Cloudflare Pages Git 自动部署；Preview 用于验收。

## 目录建议（Nuxt 4）

```text
madebytmy-portfolio/
├─ app/
│  ├─ app.vue
│  ├─ assets/css/main.css
│  ├─ components/{SiteHeader,SiteFooter,ProjectCard,ProjectGrid}.vue
│  ├─ pages/index.vue
│  ├─ pages/about.vue
│  ├─ pages/projects/index.vue
│  ├─ pages/projects/[slug].vue
│  ├─ error.vue                     # Nuxt 错误模板，可放在 app/error.vue 依版本确认
│  └─ composables/useSeo.ts
├─ data/projects.ts                # 经过审查且已发布的项目数据
├─ data/site.ts                    # 站点唯一域名/作者/账号数据
├─ types/project.ts
├─ public/{favicon.svg,robots.txt,sitemap.xml,og-default.png}
├─ scripts/{validate-projects.mjs,check-generated-html.mjs}
├─ tests/{project-registry.spec.ts,seo-output.spec.ts}
├─ nuxt.config.ts
├─ package.json
├─ .nvmrc
└─ README.md
```

> 如果使用 Nuxt 4 `app/` 布局，以生成的官方模板为权威；`data/` 和 `types/` 可以放根目录或 `shared/`，但必须统一导入。生成器和类型检查必须通过。

## 核心数据类型

```ts
type ProjectStatus = 'draft' | 'published' | 'archived'
type ProjectCategory = 'developer-tool' | 'utility' | 'game' | 'mini-program' | 'experiment'
interface Project {
  id: string
  slug: string
  name: string
  category: ProjectCategory
  status: ProjectStatus
  featured: boolean
  tagline: string
  summary: string
  problem?: string
  solution?: string
  highlights: string[]
  limitations?: string[]
  technologies: string[]
  websiteUrl?: string
  links?: Array<{ label: string; url: string; verified: boolean }>
  cover?: { src: string; alt: string }
  publishDate?: string // 仅在真实可核实情况下填写
  seo?: { title?: string; description?: string }
}
```

**核心不变量**：

1. `draft` / `archived` 默认不出现在公开项目列表，也不产出 SSG 详情；不要靠 `noindex` 掩盖本应不发布的页面。
2. `published` 必须具有唯一合法 slug、真实描述、可核实 URL（若为不能通过浏览器公开访问的微信小程序则必须明示发布载体和获取方式，且不能伪造 https 外链）。
3. 所有 URL 只能用 `https:`（有真正的公开网页时）；阻止 `javascript:`、`data:`、伪造路径与示例域名进入生产。
4. 深层链接 `verified=true` 只有经过人工或自动实际请求检查才允许设置；链接失效要从页面撤掉或修复。
5. 详情页不得只复制官网元描述；必须有作者自己的背景、开发职责、解决问题或取舍。

## SSG 和渲染

**唯一构建指令**：`npx nuxt generate`（在 package.json 中映射到 `npm/yarn run generate`）；检查实际产物路径，通常是 `.output/public`。**不要**把 Cloudflare 官方针对动态 Nuxt 的 `npm run build` + `dist` 和本项目静态路线混用。Cloudflare Pages「输出目录」必须设置为本次 CI 真实生成目录。

动态详情路由 `projects/[slug]` 的 slug 列表必须由 `published` 项目生成，显式加入 `nitro.prerender.routes` 或等价的当前 API，不要指望静态爬虫“碰巧发现”全部内容。

可复用的 `nuxt.config.ts` 示意（Codex 需在当前 Nuxt 4 上实际验证）：

```ts
import { publishedProjects } from './data/projects'
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/about/', '/projects/',
        ...publishedProjects.map(p => `/projects/${p.slug}/`)]
    }
  },
  typescript: { strict: true },
})
```

检查 Nuxt 4 对动态路由预渲染和末尾斜杠的实际生成行为，必要时统一改用无末尾斜杠方案。对于 `sitemap.xml`、`robots.txt`，可以在 `public/` 生成静态文件；仅列真实公开 canonical，动态生成时务必在构建前执行，避免遗漏。

## 非功能需求

- 所有可索引页面首包 HTML 中直接包含 H1、核心正文、真实链接、title/description/canonical；关闭 JavaScript 也可阅读主要文本与跳转。
- 禁止把全部内容延后 `onMounted` 客户端加载。
- 目标参考（并非 SEO 排名保证）：Lighthouse mobile Performance ≥ 90、Accessibility ≥ 95、Best Practices ≥ 95、SEO ≥ 95；LCP/CLS/INP 遵循 Web Vitals 评估，使用真实设备复测。
- images 用精确宽高和 lazy loading，首屏主图按需 eager；默认不引入追踪或远程埋点脚本。
- 不设强制外部接口，不发送用户浏览数据到未披露的第三方。
