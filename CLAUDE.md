@AGENTS.md

## 基本
- パッケージマネージャーは pnpm（例: `pnpm build`）
- 変更後は `pnpm check`（型チェック・frontmatter 検証）と `pnpm build` が通ることを確認する
- CI（`.github/workflows/ci.yml`）で `pnpm check` → `pnpm build` → `pnpm check:dist`（下書き混入・必須ファイルの検査）を実行している
- 開発サーバーは起動しない（AGENTS.md の記載より優先）。表示の確認は `pnpm build` の出力（`dist/`）で行い、ブラウザでの確認はユーザーに依頼する
- 記事の追加方法・slug・frontmatter のルールは README.md を参照

## 注意点
- 記事は `src/content/blog/<slug>/index.md` のみ読み込まれる
- 公開済み記事の slug は変更しない（URL が変わるため）
- 記事一覧は `getCollection` ではなく `src/lib/posts.ts` の `getPosts()` を使う（下書き除外・並び替え込み）
- 日付表示は `formatDate()` を使う（UTC→JST 変換）

## デプロイ
- Cloudflare の Git 連携で自動デプロイされる。手動でデプロイしない

## 慣習
- コメントは日本語
- コミットメッセージは `add: …` / `fix: …`（日本語）
