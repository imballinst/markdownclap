import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';

import tailwind from '@astrojs/tailwind';

let basePath = process.env.BASE_PATH || '';
if (!basePath.startsWith('/')) {
  basePath = `/${basePath}`;
}

// https://astro.build/config
export default defineConfig({
  base: basePath,
  site: 'https://imballinst.github.io/markdownclap',
  integrations: [solid(), tailwind()]
});
