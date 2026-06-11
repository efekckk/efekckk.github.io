import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://efekck.github.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr'],
    routing: { prefixDefaultLocale: false },
  },
});
