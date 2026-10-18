# 07 · 开发任务拆分：按依赖排序，可直接用作 Codex todo

## Sprint 0（基础环境与真值）

| ID | 工作 | 依赖 | DoD（完成定义） |
|---|---|---|---|
| P0-01 | 新建独立 Nuxt 4 仓库、TS strict、Tailwind、锁文件、.nvmrc | 无 | 依赖安装、dev 页面能启动；无现有项目代码被修改 |
| P0-02 | 导入项目 registry / schema / 状态门禁 | P0-01 | 草稿不会加入已发布列表；相同 slug 被单测拒绝 |
| P0-03 | 统一站点配置、作者公开标识及 canonical origin | P0-01 | 只有 `madebytmy.com`，不出现假 GitHub 账号 |
| P0-04 | 核验深链与公开项目基础资料 | P0-02 | 实测 URL，失效项剔除/标记；记录验证日期 |

## Sprint 1（用户体验）

| ID | 工作 | 依赖 | DoD |
|---|---|---|---|
| P1-01 | 全局导航、页脚、布局、移动端样式 | P0-01 | 320/375/768/1280 像素不溢出 |
| P1-02 | 首页 hero、精选项目、真实 About | P1-01,P0-02 | 没有虚构数据；卡片可用 |
| P1-03 | 项目目录 + 项目详情模板 | P0-02,P1-01 | 明确 project slug/404；至少主站真实详情 |
| P1-04 | 404、图片替代文本、导航状态与键盘交互 | P1-03 | 非法路由正确 404；可 tab 操作 |

## Sprint 2（构建/SEO）

| ID | 工作 | 依赖 | DoD |
|---|---|---|---|
| P2-01 | `generate` + published 动态路由显式预渲染 | P1-03 | 产物含每个已发布详情，**不含** draft |
| P2-02 | 每页 title/description/H1/canonical/OG | P1-03 | 读取生成 HTML 校验，不只看浏览器最终 DOM |
| P2-03 | Homepage WebSite+Person/ItemList；About ProfilePage | P0-03,P1-02 | JSON 有效，数据映射真实，未发布项目不在 JSON-LD |
| P2-04 | Sitemap / robots 与 301 规范化策略 | P2-01 | sitemap 可访问、每条 URL canonical 一致 |
| P2-05 | 编译产物 / 外链的脚本化审查 | P2-01 | CI 失败时能指出具体 URL 和原因 |

## Sprint 3（验证与上线）

| ID | 工作 | 依赖 | DoD |
|---|---|---|---|
| P3-01 | 单元测试、Typecheck、Lint、构建 | P2-05 | 在 CI 真实执行，报告命令及结果 |
| P3-02 | 模拟器/真机多分辨率、可访问性、链接核查 | P1-04 | 有可复现的测试记录，无重大缺陷 |
| P3-03 | Cloudflare Pages Preview / 生产 DNS | P3-01 | Preview 合格后绑定 madebytmy.com，证书正常 |
| P3-04 | Search Console / Bing Webmaster / Sitemap | P3-03 | 验证记录、提交记录、检查结果截图或报告 |
| P3-05 | 可选作者署名链接与外部资料更新 | P3-03 | 仅在内容真实时进行，不批量 SEO 互链 |

## 迭代顺序

首次提交建议 4 个 PR：

1. `chore/bootstrap-and-project-registry`：脚手架 + registry + 测试。
2. `feat/portfolio-pages`：页面和组件。
3. `feat/ssg-seo`：SEO / static output / 产物检查。
4. `chore/deploy-and-docs`：Pages 配置、验收、说明。

每个 PR 独立通过 `typecheck`、lint、test、generate；不要等到最后才首次验证生成产物。

## 风险和处置

- **QR 子域无响应或暂不可访问**：保持 draft，用户确认后再上架。
- **项目详情信息不足**：不造假；先用主站一个高质量页面实现模版，其余延后。
- **Cloudflare 官方 Nuxt 模版是动态构建**：对本项目明确改为 generate + 真实输出目录，不混用。
- **Nuxt 4 API 更新**：按官方最新稳定模版修订目录和插件，不复制旧 Nuxt 3 代码片段。
- **用户偏好保留 Nuxt 3**：提供成本与 EOL 风险，仍能以相同数据模型迁移，但不默认使用 EOL 版本。
