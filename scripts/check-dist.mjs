// ビルド結果（dist/）の検査。`pnpm build` の後に実行する
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BLOG_DIR = 'src/content/blog';
const DIST_DIR = 'dist';

const errors = [];

// 出力されるべきファイル
const requiredFiles = ['index.html', '404.html', 'rss.xml', 'robots.txt', 'sitemap-index.xml'];
for (const file of requiredFiles) {
  if (!existsSync(join(DIST_DIR, file))) {
    errors.push(`${file} が出力されていません`);
  }
}

// 下書き記事が本番ビルドに含まれていないか
const drafts = readdirSync(BLOG_DIR).filter((slug) => {
  const path = join(BLOG_DIR, slug, 'index.md');
  if (!existsSync(path)) return false;
  const frontmatter = readFileSync(path, 'utf-8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  return /^draft:\s*true\s*$/m.test(frontmatter);
});

const feeds = ['rss.xml', 'sitemap-0.xml']
  .map((file) => join(DIST_DIR, file))
  .filter((path) => existsSync(path))
  .map((path) => ({ path, content: readFileSync(path, 'utf-8') }));

for (const slug of drafts) {
  if (existsSync(join(DIST_DIR, 'blog', slug))) {
    errors.push(`下書き記事のページが出力されています: blog/${slug}`);
  }
  for (const { path, content } of feeds) {
    if (content.includes(`/blog/${slug}/`)) {
      errors.push(`下書き記事が ${path} に含まれています: ${slug}`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}
console.log(`✓ dist/ の検査 OK（下書き ${drafts.length} 件が除外されていることを確認）`);
