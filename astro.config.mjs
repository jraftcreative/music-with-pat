// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://jraftcreative.github.io',
  base: '/music-with-pat',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  }
});
