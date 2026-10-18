# Tiny Image 作品集接入

2026-10-17，F09。用户授权将 Tiny Image 加入现有作品集。

- 源码依据：`/Users/taomingyang/Desktop/project/Tiny-Image/` 下 codec、policy、dimensions、download、queue、settings、compare 与语言配置。只读检查，没有修改该目录。
- 项目路径：`/projects/image-compression/` 和 `/zh/projects/image-compression/`。
- 首页、项目列表、任务导览增加第三个项目；详情包含6类功能、3个场景、3条问答与实际限制；使用独立图片主题装饰图，不冒充产品截图。
- 支持的输入为静态 JPEG/PNG/WebP；当前界面可保持原格式或转 JPEG/PNG。PNG原格式且不缩放时有OxiPNG无损路径；不能将量化、缩放或所有格式笼统描述为无损。
- 配置官网 https://image.tinystool.org/ 两次curl检查均报35（SSL_ERROR_SYSCALL），没有获得HTTP状态。保留配置地址与明确状态说明，`websiteAvailable=false` 时不展示访问按钮；构建仅检查实际提供给访客的外链。该字段并不表示项目源码不可用。
- 功能说明支持无独立URL的条目，不虚构独立压缩子页面。相关项目区列出其他全部项目，避免第三个项目遗漏在内链之外。

## 验证

Node22.22.3 / Yarn4.5.0。类型、lint、11项测试、12页静态生成与SEO检查通过。日志为 `docs/f09-*.log`。48组Chrome响应式/可访问性检查通过；12页无JS正文、6组语言切换、第三项目导航与官网按钮隐藏检查通过。3002中文详情HTTP200，移动端截图已人工检查。官网部署、DNS/TLS问题不在当前作品集接入范围内。
