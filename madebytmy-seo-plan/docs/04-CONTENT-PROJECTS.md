# 04 · 项目清单与内容建设手册

## 证据分级

- **A：本次公开页面确认** — 目前可直接使用相应公开 URL，后续构建仍需自动检查。
- **B：PDF 提及或用户已陈述** — 代表确实有过讨论，但本次未证明站点已上线；在实际访问确认前不自动发布。
- **C：规划中** — 绝不展示虚构可用链接；日后再补。

| 项目 | 状态与证据 | 显示建议 | 链接处理 |
|---|---|---|---|
| **Tiny's Tool** | A；本次公开验证首页、工具集合、About、中文大型 JSON 工具 | P0 首页主推与完整详情 | `https://tinystool.org/`、`https://tinystool.org/tools/`、`https://tinystool.org/zh/tools/json/large-json-viewer/` 可作为初始候选 |
| **QR Code Generator** | B；PDF 提及 `qr.tinystool.org`，本次工具没有获得可核实响应 | 核验后发布 | 验证首页状态、实际功能、Meta、截图，再改 `published` |
| **IP 检测工具** | C；`ip.tinystool.org` 独立项目构想 | 待正式上线 | 不对外给出“已上线”入口 |
| **图片压缩工具** | C；独立子域 / uTools 版本构想 | 待正式上线 | 未确认最终域名，不要猜测 |
| **H5 游戏** | C；多款概念仍在命名/设计 | 后续添加 | 不造游戏名或下载地址 |
| **OurTable 微信小程序** | B；PDF 的生成代码里出现 | 验证实际名称、公开状态、项目归属、可访问入口后再发布 | 微信小程序不要伪装成有可访问网页 URL |

备注：网页工具可访问性检查失败不等于断言站点未上线；公开前需在实际浏览器再验。

## 英文内容草案：Tiny's Tool

- **Title**：`Tiny's Tool — Browser-based Developer Utilities | Made by TMY`
- **Tagline**：`Small, practical tools for working with JSON, text, and developer data.`
- **Summary**：`Tiny's Tool brings together browser-based utilities for validating, formatting, comparing, and converting developer data. Its public pages document supported inputs, edge cases, and limitations so users can pick the right tool for the job.`
- **Problem**：`Everyday developer tasks are scattered across single-purpose utilities, while many snippets lack clear guidance about what they actually do.`
- **Solution**：`A coherent set of small tools with task-focused explanations and links to related technical guides.`
- **Highlights**：`JSON validation and comparison`; `Conversion and formatting tools`; `Large JSON inspection`; `Guides describing limitations and common pitfalls`。
- **Caution**：除非已审计并确认所有相关页面行为，否则不要笼统声称“所有处理 100% 本地 / 绝对零上传 / 完全隐私安全”。针对具体工具说明即可。

## 中文页面信息示意

**Tiny's Tool — 开发者在线工具集**

日常处理 JSON、格式化源码或比较接口数据时，往往需要在多个工具间来回切换。Tiny's Tool 提供 JSON 校验与格式化、数据比较、文本处理和常见开发辅助工具，并配有真实的功能说明与边界提示。本项目页记录产品设计、技术选型以及持续改进的过程。实际功能以对应工具页面为准。

> 内容不要复用旧站大量段落导致重复模板页；个人站从“做了什么、为什么做、做到了什么程度”角度写原创经验。

## 待用户确认字段

1. 对外显示名是 `TMY`、`Made by TMY` 还是其他笔名？不得自动使用私人姓名。
2. GitHub 主页真实链接？PDF 代码中是占位符。
3. 是否提供邮箱 / 社交账号？经确认后才发布。
4. QR / OurTable / 其他作品当前是否已发布，是否允许公开展示？
5. 初期只做英文，还是中英双语？默认英文单语言，避免没有质量保障的机器批量翻译及 hreflang 错误。

## 更新新项目流程

`draft` 新项目登记 → 核验实际页面、作者关系和可公开内容 → 编写独立介绍 → 填 `published` + 精确 URL → 自动/人工检查 → PR Preview → 公开部署 → 验证抓取 / sitemap / canonical。
