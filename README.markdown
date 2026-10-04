# 011011100 · Blog

个人博客与动画实验室，基于 VitePress、Vue 3 和 GSAP。

- 线上地址：https://011011100.github.io/
- 动画实验室：https://011011100.github.io/lab.html
- RSS：https://011011100.github.io/feed.rss

## 环境与运行

使用 Node.js 24 与 pnpm 10.34.6。`.nvmrc` 与 `package.json` 固定了运行环境，CI 使用同一组版本。

```sh
nvm install
nvm use
npm install --global pnpm@10.34.6
pnpm install --frozen-lockfile
pnpm dev
```

不想修改全局 pnpm，或本机的全局代理无法切换版本时，可以直接使用指定版本：

```sh
npx --yes pnpm@10.34.6 install --frozen-lockfile
npx --yes pnpm@10.34.6 dev
```

下文的 `pnpm` 命令也可以替换为 `npx --yes pnpm@10.34.6`。

如果已使用 Corepack，可以用 `corepack pnpm install --frozen-lockfile` 和 `corepack pnpm dev`。无需数据库。

```sh
pnpm test       # 文章索引、日期与 RSS 回归检查
pnpm build      # 静态页面、RSS 和 sitemap
pnpm preview    # 预览构建产物，默认 8099 端口
```

已有开发服务时直接复用；不要为了查看页面反复启动服务。

## 动画实验室

`/lab.html` 提供 GSAP 时间轴演示与 HTML-in-Canvas 实验。GSAP 控件可以播放、暂停、重播和调整进度；优先使用 `transform` / `opacity` 动画，并在组件卸载时清理动画和事件。

HTML-in-Canvas 属于实验性浏览器能力。页面会检测 API：支持时启用原生绘制，不支持时保留可读、可交互的 HTML 预览和能力说明。普通浏览器无需启用实验开关即可访问博客和实验室；Canvas 2D 或 HTML 降级预览不等同于原生 HTML-in-Canvas 支持。

新增实验建议放在 `.vitepress/theme/experiments/`，再接入实验室页面。只在 Vue 的 `onMounted` 中访问浏览器 API；通过 `onUnmounted` 清理监听器、`requestAnimationFrame`、GSAP context 和 ScrollTrigger。尊重 `prefers-reduced-motion`：启用减少动态效果后禁用播放控件，保留手动调节进度的静态预览。

手动验收：

1. 打开首页、博客列表、历史文章、项目页和 `/lab.html`，确认导航与直接刷新正常。
2. 在实验室使用播放、暂停、重播、进度控制，确认状态和画面一致。
3. 在不支持 HTML-in-Canvas 的浏览器检查降级界面，仍能查看演示内容。
4. 调整窄屏宽度，并启用系统的减少动态效果选项，检查内容可读、播放控件禁用，且仍能手动调节进度查看静态画面。
5. 离开实验室后返回，确认没有重复动画、事件或控制台错误。

## 内容与结构

| 文件 | 用途 |
| --- | --- |
| `index.md` | 首页资料 |
| `blog.md`、`posts/**/*.md` | 博客列表与文章 |
| `projects.md` | 项目展示 |
| `lab.md`、`.vitepress/theme/Lab.vue`、`.vitepress/theme/experiments/` | 动画实验室 |
| `.vitepress/theme/` | Vue 布局与主题样式 |
| `.vitepress/config.ts` | 站点设置、sitemap 与构建 hook |
| `.vitepress/posts.data.js` | 构建时加载文章索引 |
| `.vitepress/genFeed.mjs` | 从 Markdown 生成 RSS |

添加文章时保留以下 frontmatter。第一条正文分隔线之前为摘要：

```md
---
title: 文章标题
date: 2026-10-04
author: 011011100
github: '011011100'
---

这里是摘要。

---

这里是正文。
```

文章按日期倒序排列，日期以 UTC 格式化，构建遇到缺失或无效日期会明确报错。RSS 直接使用 Markdown 的渲染结果，修改页面布局不再影响订阅源。

## 部署

推送 `main` 或在 `main` 手动触发 GitHub Actions，会安装锁文件依赖、运行测试、构建并上传 Pages artifact，随后由独立部署任务发布。Pull Request 只验证，不上传部署产物、不发布。

仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。工作流使用官方 `configure-pages`、`upload-pages-artifact`、`deploy-pages`，无需 `gh-pages` 分支。构建任务仅有代码读取权限；部署任务通过 `pages: write`、`id-token: write` 与 `github-pages` 环境授权发布。

生产文件位于 `.vitepress/dist`。默认域名为 `https://011011100.github.io`；迁移到自定义域名时更新站点 URL、Pages 自定义域名设置与 DNS。工作流不写入模板作者的 CNAME。

## 升级说明

- VitePress 0.22 → 1.6.4 稳定版；Vue 显式升级到 3.5。
- pnpm 6 → 10；Node.js 24；重新生成锁文件。
- Tailwind 保留 3.x，升级至 3.4，保留旧主题的工具类兼容。
- 新增 GSAP 3.15，并用现代 `createContentLoader` 替换旧版同步 Markdown loader。

本项目由 [Elone Hoo 的 vitepress-theme-simple](https://github.com/elonehoo/vitepress-theme-simple) 演进而来，原始许可与历史文章保留。
