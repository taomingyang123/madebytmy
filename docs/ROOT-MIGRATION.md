# 根目录迁移与访问修复（F05）

2026-10-17，用户明确要求从项目根目录直接启动，忽略 Evolve。此前拆分子工程导致根目录继续运行旧模板，且交付时停止了预览服务；这不符合用户访问需求。

## 当前入口

- 项目根目录：`/Users/taomingyang/Desktop/project/madebytmy`。
- 在根目录运行 `yarn dev`，地址 http://127.0.0.1:3002/；本轮交付保留该开发服务运行。
- Node 22.22.3、Yarn 4.5.0；首次使用 `nvm install && nvm use`，再 `yarn install --immutable`。本会话使用已准备的临时 Node/Yarn 运行时，重启后按 .nvmrc 使用环境即可。
- `yarn preview` 默认 http://127.0.0.1:4180/，需要先 `yarn generate`；只启动其中所需模式即可。
- 原 4173 是另一个项目的 Python 服务，3000 也有其他项目服务，因此不复用这些端口。仅停止了 cwd 属于本项目的旧 Nuxt 进程，未停止其他项目。

## 目录用途

`madebytmy-seo-plan/`：用户提供的需求与 SEO 实施资料，保留，不是运行网站。

`madebytmy-portfolio/`：此前新建的实际网站源码目录，现已迁入根目录并移除该子目录。现有 app/、data/、shared/、public/、scripts/、tests/、package.json、nuxt.config.ts 均是当前新站。

`Evolve/`：未改动；Git、lint 忽略，Nuxt 页面从 app/ 读取。

旧模板与冲突文件已移入 `.backups/20261017-root-migration/`。43 个旧源码/配置文件逐一 SHA256 核对通过，摘要见该目录 SOURCE-SHA256.json。旧依赖和生成缓存也保留在备份内。恢复时先停止本项目服务并另行保存当前新站，再依据清单恢复；不要将两套框架目录混合。

## 验证

- 静态：根目录 `yarn install --immutable`、`yarn typecheck`、`yarn lint`、`yarn test`（7/7）、`yarn generate` 全部通过。日志：root-install.log、root-typecheck.log、root-lint.log、root-test.log、root-generate.log。
- 运行：根目录 `yarn dev` 监听 127.0.0.1:3002，HTTP 200；实际浏览器确认正确首页、首页到项目目录的客户端跳转，未发现浏览器错误，见 evidence/root-live.json 和 root-live-home.png。
- 系统场景：根目录静态产物在 4180 实测，16 组响应式/axe、无 JS、键盘、导航、canonical、301/404、草稿路径与无第三方请求全部通过，见 root-browser.log 和 evidence/browser.json。
- 交付保留 3002 开发服务；4180 临时验收服务关闭。默认构建仍为 noindex Preview；未提交、未部署。线上验收仍属 F04。

F03 的 QA/REVIEW 是前次交付历史记录；目录和端口以本文与 README 为准。
