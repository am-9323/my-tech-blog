---
title: ブログを始めました
description: Astro で技術ブログを作りました。このブログの記事の書き方をまとめます。
pubDate: 2026-10-30
tags: [astro, blog]
---

Astro と Content Collections を使って技術ブログを作りました。

## 記事の追加方法

`src/content/blog/<slug>/index.md` を作成します。`<slug>` がそのまま URL（`/blog/<slug>/`）になります。

### frontmatter

```yaml
title: 記事タイトル
description: 概要文
pubDate: 2026-10-30
tags: [astro]
draft: true # 本番ビルドから除外する
```

## コードブロック

```ts
const posts = await getCollection('blog');
```
