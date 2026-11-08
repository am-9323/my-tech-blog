---
name: create-pr
description: 現在の変更をブランチ作成・コミット・push し、GitHub の PR を作成して CI の結果まで確認する。ユーザーが /create-pr を実行したときだけ使う
disable-model-invocation: true
argument-hint: "[ブランチ名や PR の補足（任意）]"
---

# PR 作成

現在の作業ツリーの変更から PR を作る。引数: $ARGUMENTS

このスキルの実行は「PR を作る作業を始めてよい」という意味であり、コミット・push の許可ではない。**手順 2 でユーザーの承認を得るまで、コミット・push はしない。**

## 1. 状況の確認

- `git status --short`、`git branch --show-current`、`git diff` で変更内容を把握する
- `pnpm check` と `pnpm build` が通ることを確認する。失敗したら止めて報告する
- 変更が複数の目的にまたがる場合は、コミットを分ける案を出す

## 2. 承認を取る

次の内容をまとめて提示し、承認を得る。

- **ブランチ名**：main にいる場合は新しく作る。英語の kebab-case で短く（例: `add-ci`、`fix-rss-icon`）。引数で指定があればそれを使う
- **コミット対象のファイル**：一覧で示す
- **コミットメッセージ**：`add: …` / `fix: …`（日本語）
- **PR のタイトルと本文**：タイトルはコミットメッセージと同じでよい。本文は「概要」「変更内容」「確認したこと」の見出しで書く

ユーザーが修正を求めたら直して再提示する。承認されたら手順 3〜6 を続けて進める。

## 3. ブランチ作成・コミット

- main にいる場合は `git switch -c <ブランチ名>`
- `git add` はファイルを個別に指定する（`-A` や `.` は使わない）
- コミットメッセージの末尾には、会話中で指示されている attribution の行を付ける

## 4. push

- `git push origin <ブランチ名>` を `allowed_domains: ["github.com"]` 付きで実行する
- `-u` は付けない（sandbox で `.git/config` に書き込めず失敗する）

## 5. PR 作成（ユーザーに実行してもらう）

`gh` は sandbox 内で証明書エラー（`x509: OSStatus -26276`）になり使えない。

1. PR 本文を scratchpad ディレクトリの `pr-body.md` に書き出す
2. 次のコマンドを、`--body-file` に絶対パスを入れた形で提示する

   ```
   gh pr create --base main --head <ブランチ名> --title "<タイトル>" --body-file <pr-body.md の絶対パス>
   ```

3. 実行方法も添える：「入力欄が空の状態で `!` を手で1文字入力してから、コマンドを貼り付けて Enter」。`!` ごと貼り付けたり、先頭にスペースが入ったりすると、シェルで実行されずメッセージとして届く
4. メッセージとして届いた場合は実行されていないので、上の方法を再度案内する

## 6. CI の結果確認

PR の URL が返ってきたら、push したコミットのチェック結果を `curl` で GitHub API から取得する（`allowed_domains: ["api.github.com"]`）。

```sh
sha=$(git rev-parse HEAD)
curl -s "https://api.github.com/repos/am-9323/my-tech-blog/commits/$sha/check-runs" | python3 -c '
import json,sys
d=json.load(sys.stdin)
for r in d.get("check_runs",[]): print(r["name"], r["status"], r["conclusion"], r["html_url"])'
```

- チェックは2つある：GitHub Actions の `check` と、Cloudflare の `Workers Builds: my-tech-blog`
- 両方が `completed` になるまで、上のコマンドを30秒間隔のループで `run_in_background` で回して待つ
- ループ内でエラー出力を捨てない（`2>/dev/null` などで握りつぶすと、取得に失敗しても気づけずタイムアウトまで待ち続ける）
- 結果は両方の成否を報告する
- Cloudflare が失敗した場合、ログはダッシュボードでしか見られない。チェック結果に含まれるビルドページの URL を示し、ユーザーにログを貼ってもらう

## 失敗したときの修正

CI や Cloudflare の失敗を直す場合も、**修正内容を提示して承認を得てから**コミット・push する。PR 作成時の承認は、後から加える変更には及ばない。
