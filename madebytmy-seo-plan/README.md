# madebytmy.com · 个人开发者网站与 SEO 实施方案

**版本**：1.0（2026-10-16）  
**类型**：Codex 可执行的技术设计与任务包（**不是**完整可直接上线的应用源码）  
**决策**：Nuxt 4 + TypeScript + Tailwind CSS + 静态生成（SSG） + Cloudflare Pages + GitHub  
**原始依据**：用户提供的 8 页《怎么判断必应是否收录站点.pdf》；结合 2026-10-16 的官方文档及有限公开网页核查。

## 你要交付的产品

madebytmy.com 是公开的、真实的个人开发者作品集与项目导航，不是以操纵外链权重为目的的 SEO 中转站。首页呈现作者、技能、代表项目、开发原则；每个已上线的主要项目有独立介绍页；内容准确、可维护、可访问、可被搜索引擎读取。

### 目录导航（建议顺序）

1. `docs/01-GEMINI-AUDIT.md`：PDF 审查、修改理由与证据分级。
2. `docs/02-PRD-IA.md`：产品需求、路由、交互与内容版式。
3. `docs/03-ARCHITECTURE.md`：Nuxt 4 技术选型、数据模型、项目结构与 SSG。
4. `docs/04-CONTENT-PROJECTS.md`：实际项目、上线状态、展示模板、示例英文文案。
5. `docs/05-SEO-STRUCTURED-DATA.md`：站内 SEO、自然外链、JSON-LD、canonical、sitemap、IndexNow。
6. `docs/06-CODEX-MASTER-PROMPT.md`：直接复制给 Codex 的主任务指令。
7. `docs/07-IMPLEMENTATION-BACKLOG.md`：按依赖排序的开发任务与完成定义。
8. `docs/08-QA-ACCEPTANCE.md`：功能 / SEO / 安全 / 可访问性验收矩阵。
9. `docs/09-DEPLOY-RUNBOOK.md`：GitHub → Cloudflare Pages → 域名与回滚。
10. `docs/10-POSTLAUNCH-METRICS.md`：上线后 0/7/14/30 天监测方法。
11. `docs/11-REFERENCES.md`：来源、核实状态和需要人确认的字段。
12. `examples/projects.seed.json`：机器可读的项目录入起点，注意草稿/待核实的发布门禁。
13. `examples/jsonld-home.example.json`：首页示例结构化数据（不得盲目将占位字段上线）。
14. `config/seo-checklist.yaml`：开发/验收条款机器可读版。
15. `checklists/OWNER-DECISIONS.md`：需用户决定的最少事项与默认策略。

## 推荐开发路径

1. 将**整个目录**提供给 Codex，让它先阅读 `docs/06-CODEX-MASTER-PROMPT.md`。
2. 创建**新的 GitHub 仓库** `madebytmy-portfolio`，不动 tinystool.org 等现有仓库。
3. 第一阶段只发布首页、`/projects/`、`/about/`，以及有核实信息的项目详情页。
4. 通过 PR/Cloudflare Pages Preview 完成验收，再绑定 `madebytmy.com`。
5. 站点上线后，先做搜索引擎验证、真实个人资料链接和有限的自然互链，再视需要扩充文章。

## 重要的已知限制

- PDF 最后两页出现过 Gemini “已生成压缩包”的文字，但 PDF **不包含该压缩包或可验证的完整源码**。这份交付不是对那份不可见压缩包的恢复。
- `madebytmy.com` / `qr.tinystool.org` / `ip.tinystool.org` 的实时可访问性在本次工具检查中未确认：上线前实际打开并核实，不得把“无法验证”当作“已下线”。
- 仅 `tinystool.org` 主站与其工具目录 / 相关页面有本次可访问的公开证据；其他项目来自 PDF 中的对话，或用户既往项目背景，先以草稿处理。
- 预览/未发布的项目页面不得索引；**尚未上线项目的外链不应公开**，也不要让 SSG 输出“伪上线”页面。
- 初期不追求短期 SEO 排名或所谓自动“传权”；以真实作者、真实项目、稳定可发现的内容作为可验证目标。

## 工程边界

此包是**实施规范、示例数据与 Codex 指令**；没有冒充已编译、已测试或已发布的 Nuxt 应用。Codex 必须实际执行安装、生成、预览验证，遇到环境限制则提供可以复现的命令与原始错误。
