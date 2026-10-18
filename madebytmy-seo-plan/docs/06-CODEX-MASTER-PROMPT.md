# 06 · 给 Codex 的完整主提示词（整段复制）

> 你是该独立仓库的资深前端工程师、SEO 工程师和 QA。请先阅读本 ZIP 解压后的 `README.md` 和 `docs/01-...` 至 `docs/11-...`、`examples/`、`config/`、`checklists/`，将这些视为本次项目规范。**不要只看主提示词就开写**。

## 目标

为 `https://madebytmy.com/` 创建并实际验证一个简洁、精致、响应式、内容真实的个人开发者作品集。主功能：展示作者与已发布项目、项目详情页、About 页面，支持后续加项目，兼顾静态 SEO 和 Cloudflare Pages 部署。新项目独立仓库，不修改任何现有工具站代码。

## 框架和架构

- 新项目首选 **Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS**；根据官网选与 Nuxt 4 兼容版本，按 2026 年维护版本固定依赖。不要无解释退回 Nuxt 3；Nuxt 3 已 EOL。如用户主动要求 Nuxt 3，明确列出风险并提供迁移方案。
- 静态生成（SSG / `nuxt generate`），Cloudflare Pages 部署纯静态产物。新站**不要**添加后端 API、DB、权限系统、重型状态库、CMS 或追踪脚本。
- Node 22 LTS、Yarn 4（若创建环境使用 npm 则保持一致；不混用锁文件）。需有 `package.json` scripts `dev`, `generate`, `typecheck`, `lint`, `test`, `check:seo`。
- 视觉设计由你自行完成，但需整洁、专业、移动端优先，尊重减少动画偏好；不得用错误图片或演示徽章伪造产品成绩。
- 目录与 schema 见 `docs/03-ARCHITECTURE.md`，不可随意改变状态字段含义。

## 内容处理（严格）

1. 数据使用项目清单 `docs/04-CONTENT-PROJECTS.md` 和 `examples/projects.seed.json`。**只默认公开 Tiny's Tool**；QR、OurTable、IP 检测、图压缩、小游戏先标为草稿/待确认；若你能获得可靠页面验证才可建议从草稿转已发布，但在用户确认前仍不要自动公开未授权项目。
2. `tinystool.org` 已核实站点：首页 `https://tinystool.org/`、工具集合 `https://tinystool.org/tools/`、中文大 JSON 查看器 `https://tinystool.org/zh/tools/json/large-json-viewer/`。链接末尾斜杠及跳转必须由你实际验证；禁止采用 Gemini PDF 中编造的 `/tools/json-viewer`。
3. GitHub URL、个人邮箱、实际姓名、照片、项目截图、上线日期、真实技术栈不明确时，省略该字段或使用**不会被自动发布**的 TODO；不能生成虚构数据。
4. 首发至少有：首页、项目列表、About、Tiny's Tool 项目详情和 404；每页有独立的正文、title、description、canonical、H1。
5. 不得为了 SEO 生造大量同质化文章或工具页；项目详情应体现问题、实现、取舍和真实限制。允许后续轻量增加开发日志。

## SEO 实现

- 所有公开页面在生成的 HTML 中都能看到正文和可抓取 `<a href>`；不要用客户端 mounted 后才能加载正文。
- `robots.txt`、`sitemap.xml`、canonical、唯一主域 301、OG/Twitter、`lang`、必要的 JSON-LD（首页 WebSite/Person/ItemList，关于页可用 ProfilePage；有依据才用 WebApplication）。
- `draft` 项目不出现在构建产物、导航、Sitemap 或结构化数据里；不要仅隐藏 UI。
- `https://madebytmy.com/` 必须是唯一 Canonical origin；如果使用 www 或 `pages.dev`，线上需有唯一域名策略。Preview 应设置访问保护/避免索引，不能将 Preview URL 当正式 canonical。
- 外部链接以真实导航为目的，少量上下文相关链接即可，不做关键词链轮或人为交叉链接。不宣称排名和抓取保证。

## 工作流（必须按顺序做）

1. **检查环境**：输出 Node、包管理器、可用网络/依赖安装条件；先明确目录，确认没有覆盖其他项目。
2. **产出计划**：列出阶段、将新增的文件、关键依赖、路由、项目数据发布状态；如遇缺少个人资料，采用不影响开发的保守默认值，放在 TODO 文档中而不是反复中断。
3. **实现 P0**：工程脚手架、响应式 UI、项目 registry、SSG 动态路由、页面 SEO、结构化数据、站点地图、404、静态资源。
4. **质量保证**：执行 install/`typecheck`/lint/tests/`generate`；自动抽检 `.output/public` 下每个公开页面的 HTML，确认标题/描述/H1/canonical/可抓取链接/无草稿 URL；验证项目链接 2xx 或合法重定向。
5. **部署说明**：写一个可复制的 Cloudflare Pages Git 配置表；区分 `nuxt generate` 的静态输出目录 `.output/public` 与其他 Nuxt 运行模式的构建设置；实际编译目录优先。
6. **收尾**：给出完整文件树、执行过的命令与真实结果、未通过的检查及原因、待用户补齐的真实信息、发布步骤和回滚方法。不要声称未执行的测试通过。

## 验收门槛

- 必要页面首包 HTML 有唯一 title、准确 description、H1、规范 HTTPS canonical；全部公开路由为静态 HTML。
- 主站卡片功能正确，未发布项目不会输出到 `.output/public` 或 sitemap；发布项目都有独立 detail 页。
- 外链真实可用、准确描述，`target=_blank` 使用 `rel=noopener noreferrer`。
- 手机 / 桌面 / 键盘交互、深色模式（若开发）均正常，无横向溢出、无 SSR hydration warning。
- 单独部署到 Pages 可访问；DNS/HTTPS/301/404/站点地图/robots 正常。
- 不集成运行时第三方分析，除非用户主动同意。

## 如果无法实际运行

诚实输出受限环节及复现指令，保留可运行工程和可验证脚本；**绝不**用静态文本假装测试通过或网站已上线。

## 强制参考文件

- `docs/07-IMPLEMENTATION-BACKLOG.md` — 任务顺序
- `docs/08-QA-ACCEPTANCE.md` — 测试矩阵
- `docs/09-DEPLOY-RUNBOOK.md` — 部署细节
- `checklists/OWNER-DECISIONS.md` — 保守默认值
