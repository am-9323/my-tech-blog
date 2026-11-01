# My Tech Blog

Astro と Content Collections で作った個人の技術ブログです。

## コマンド

プロジェクトのルートで実行します。

| コマンド               | 内容                                                  |
| :--------------------- | :---------------------------------------------------- |
| `pnpm install`         | 依存パッケージをインストールする                      |
| `pnpm dev`             | 開発サーバーを `localhost:4321` で起動する（下書きも表示される） |
| `pnpm build`           | 本番用に `./dist/` へビルドする（下書きは除外される） |
| `pnpm preview`         | ビルド結果をローカルで確認する                        |
| `pnpm astro ...`       | `astro add` や `astro check` などの CLI を実行する    |

## 記事の追加方法

`src/content/blog/<slug>/index.md` を作成します。`<slug>` がそのまま記事の URL（`/blog/<slug>/`）になります。

```text
src/content/blog/
├── astro-content-collections/
│   └── index.md
└── zod-schema-tips/
    ├── index.md
    └── diagram.png   ← 画像は記事と同じフォルダに置く
```

画像がない記事でも、必ずフォルダを作って `index.md` を置きます。`src/content/blog/foo.md` のようにフォルダの外に置いたファイルは読み込まれません。

### slug の決め方

- 英小文字・数字・ハイフンだけを使う（例：`astro-content-collections`）
- 2〜5語程度で、記事の主題を表す
- 日付は入れない（公開日は frontmatter の `pubDate` で管理する）
- バージョン番号など、内容の更新で古くなりやすい情報は入れない
- **公開後は変更しない**（URL が変わり、リンク切れになるため）

### frontmatter

```yaml
---
title: 記事タイトル
description: 概要文
pubDate: 2026-10-30
updatedDate: 2026-11-01
tags: [astro, typescript]
draft: true
heroImage: ./cover.png
---
```

| 項目          | 必須 | 説明                                                         |
| :------------ | :--: | :----------------------------------------------------------- |
| `title`       |  ✓   | 記事タイトル                                                 |
| `description` |  ✓   | 概要文。記事一覧・`<meta name="description">`・OGP・RSS に使われる |
| `pubDate`     |  ✓   | 公開日（`YYYY-MM-DD`）。記事はこの日付の新しい順に並ぶ       |
| `updatedDate` |      | 更新日。記事ページに「更新: 」として表示される               |
| `tags`        |      | タグの配列。省略すると `[]`。タグごとに `/tags/<tag>/` のページが作られる |
| `draft`       |      | `true` にすると本番ビルドから除外される。省略すると `false`  |
| `heroImage`   |      | 記事の先頭に表示する画像。`index.md` からの相対パスで指定する |

スキーマは `src/content.config.ts` で定義しています。必須項目が抜けている場合や型が合わない場合は、ビルド時にエラーになります。

### 画像

記事と同じフォルダに置き、相対パスで参照します。ビルド時に WebP への変換とサイズの最適化が自動で行われます。

```md
![図の説明](./diagram.png)
```

## プロジェクト構成

```text
src/
├── content.config.ts      ← blog コレクションの定義（frontmatter のスキーマ）
├── consts.ts              ← サイト名・説明文
├── content/blog/          ← 記事
├── lib/posts.ts           ← 記事の取得（下書き除外・並べ替え）、タグ集計、日付の整形
├── layouts/
│   ├── BaseLayout.astro   ← 全ページ共通の head・ヘッダー・フッター
│   └── PostLayout.astro   ← 記事ページ
├── components/            ← PostCard / TagList / TableOfContents
└── pages/
    ├── index.astro        ← トップ（新着記事）
    ├── blog/              ← 記事一覧・記事詳細
    ├── tags/              ← タグ一覧・タグ別記事一覧
    └── rss.xml.ts         ← RSS フィード
```
