# F13 · 部署修复后的全局复查

日期：2026-10-19（Asia/Shanghai）。基线为用户已在别处完成的 `efbf10b`；开始时工作区干净，保留现有 Workers 部署方案。

## 发现与修复

1. **Worker 的条件请求可能得到空白 404**。实际本地 ASSETS 返回的错误文档具有 ETag；用该值再次请求未知路径或 `/zh/404.html` 时，内部资源响应为 304，Worker 将状态改为 404 却保留空正文。修复为读取替代错误文档时去除条件请求及 Range 头，并用 GET 获取完整正文；对客户端 HEAD 仍不输出正文。正常页面的条件请求仍返回 304。
2. **本地静态预览直接请求错误文档返回 200**。`/404.html` 与 `/zh/404.html` 被当成普通文件；现返回 404，与 Workers 保持一致。

涉及 `workers/site.ts`、`scripts/preview.ts`，并在 `tests/workers-http.ts` 增加双语条件请求/Range 回归，在 `tests/browser.mjs` 增加直接错误文档验证。不改变项目展示内容、部署架构及内容更新时间。

## 验证

环境：Node 22.22.3、Yarn 4.5.0（显式调用临时运行时中的 Yarn）、缓存 Wrangler 4.118.0、Chrome。当前 shell 的裸 yarn 为 1.22.22，检查使用项目要求的 Yarn 4；未修改全局工具。

- 静态：typecheck（含 Worker）、lint、14 项测试通过；生产完整 `yarn generate` 通过，50 个公开外链均返回成功；Preview 分步执行 prepare / Nuxt static generate / finalize / check-generated-html 通过。两个环境均覆盖 12 页的唯一标题、描述、canonical/hreflang、结构化数据、sitemap、robots、404 和草稿隔离。公开项目文案未发现缺少中文映射。
- 运行时：真实本地 Wrangler + ASSETS，通过 `yarn test:workers` 的 12 页、资源、301/query、双语 404、异常编码、HEAD/405 及新增的错误页条件请求/Range 检查。正常 `/zh/` ETag 条件请求仍返回 304；本地 preview 的两份错误文档及未知路径共 4 个请求均为正确语言的 404/noindex。
- 系统级：`PREVIEW_URL=http://127.0.0.1:8788 yarn test:browser` 通过 48 组响应式/可访问性场景，另含双语切换、项目跳转、键盘、无 JS 和错误页检查；无控制台错误或第三方请求。[本轮浏览器证据](evidence/f13-browser.json)。
- 最终静态产物恢复为 Preview/noindex，开发服务保留在 3002。本地测试 Workers 与静态预览已关闭。

命令日志：`docs/f13-typecheck.log`、`f13-lint.log`、`f13-test.log`、`f13-production.log`、`f13-preview.log`、`f13-workers-http.log`、`f13-browser.log`、`f13-dev.log`（沿用 *.log 忽略规则）。Wrangler 临时配置仅移除已完整运行的自定义构建命令并使用绝对资源路径，其余沿用仓库配置。

## 仍存在的外部限制

[已公开外链](evidence/external-links.json) 的 50 个地址通过；另行复查的 [不可用入口](evidence/f13-unavailable-links.json) 仍异常：Tiny Image 官网 HTTPS 连接失败；二维码 generate / beautify / batch / optimize 返回 HTTP 500。站内这些入口仍不提供访问按钮或直链，未修改外部项目。

本次不重新修复已解决的部署配置，不推送、不发布。真实云端域名、DNS、HTTP→HTTPS、www、生产环境变量与部署成功状态未在本轮验收，仍属 F04；本地通过不替代线上验收。本轮本地修复尚未提交。

## 后续纠正（F14）

上文“4 个二维码入口异常”描述的是该轮默认 curl 请求结果，不能推断浏览器也无法使用。后续独立 Chrome 复核确认 5 项功能的中英文页可打开；F14 已恢复链接并分别记录 HTTP 与浏览器证据，详见 [外链复核](2026-10-19-link-verification.md)。F13 修复与 F14 变更按用户授权合并提交。
