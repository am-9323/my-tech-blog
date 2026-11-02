// @ts-check
import { defineConfig } from 'astro/config';

import expressiveCode from 'astro-expressive-code';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tech-blog.am9323.com',

  // expressiveCode は MDX などより前に置く必要がある
  integrations: [
    expressiveCode({
      // ライト・ダークどちらのモードでもコードブロックは暗い配色にする
      themes: ['github-dark'],
      styleOverrides: {
        borderRadius: '6px',
        codeFontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        codeFontSize: '0.875rem',
        uiFontFamily: 'system-ui, -apple-system, sans-serif',
      },
    }),
    sitemap(),
    react(),
  ],
});