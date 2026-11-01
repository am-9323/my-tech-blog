// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tech-blog.am9323.com',

  integrations: [sitemap()],
});
