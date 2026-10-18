# 08 · QA 与发布验收矩阵

> 下面是**应当执行的测试计划**，不是已通过报告。Codex 执行后补上 PASS/FAIL、截图和命令记录。

## 编译与类型

```sh
node -v
corepack --version
# 按仓库 packageManager 选择 yarn/npm，以下以 yarn 为例
yarn install --immutable
yarn typecheck
yarn lint
yarn test
yarn generate
find .output/public -maxdepth 4 -name 'index.html' -print
```

如果构建产物使用平铺 `.html` 而非目录 `index.html`，检查脚本应兼容两者；目录由**实际构建结果**确定。

## 自动校验清单

| 测试 | 输入 / 方法 | 通过标准 |
|---|---|---|
| Published 门禁 | `projects.seed.json` 中 published / draft 组合 | `draft` 不出现在站点 HTML、sitemap、JSON-LD、导航；动态路由不生成 |
| Slug 唯一 | 人工注入两个相同 slug | 构建检查失败，报出重复项 |
| SEO HTML | 读取 `.output/public` 全部已发布页面 | title 非空独立；description 非空；H1 一致；唯一 canonical 为官方域名 |
| 真实外链 | 遍历 published 资源和 deep links | 可访问，或显式标为待核验且不发布 |
| Sitemap | 访问 `/sitemap.xml` | HTTP 200，XML 合法，只有 canonical 公开路由 |
| robots | 访问 `/robots.txt` | 不误封公开页，正确声明 Sitemap |
| 404 | 不存在的 slug / 路径 | 对应 HTTP 404，非软 404，也不生成错误 canonical |
| OG | 每个公开页面 HTML | og:title、og:description、og:url 正确，图片链接可访问或不伪造 |
| JSON-LD | 解析 `<script type="application/ld+json">` | JSON 可解析；实体 URL 精确匹配；无 draft / 虚构评分 |
| SSL / 301 | http 和 www | 归一到 `https://madebytmy.com/`（301/308），不跳转链环 |
| JS 关闭 | 禁用 JS 后访问本站 | 主要正文/项目导航仍可用 |
| 键盘 | Tab / Enter / Escape | 可访问每个链接，焦点可见，跳过导航有效 |
| 移动端 | 320/375/768 px | 内容不溢出、不重叠，外链易触达 |
| 性能 | Lighthouse mobile 多次复测 | 参考目标性能 ≥90 / A11y ≥95 / SEO ≥95；不把分数当 SEO 保证 |
| 隐私 | Network 请求检查 | 未经确认不存在第三方追踪、无敏感个人资料泄露 |

## 验证 URL 清单（生产真实地址）

```text
https://madebytmy.com/
https://madebytmy.com/projects/
https://madebytmy.com/projects/tinys-tool/
https://madebytmy.com/about/
https://madebytmy.com/robots.txt
https://madebytmy.com/sitemap.xml
https://madebytmy.com/does-not-exist/
```

是否采用 `tinys-tool` 作为最终 slug 可调整；测试 URL 以项目 registry 真值为准。

## 验收结论格式

```text
Commit SHA:
Node / package manager:
Commands run:
Results (PASS / FAIL / NOT RUN):
Generated page count:
Published project count:
Unexpected indexed or draft URLs:
External URLs verified + date:
Cloudflare Preview URL / screenshots:
Remaining risks and owner TODOs:
```

没有执行的项必须写 `NOT RUN`，不是 PASS。
