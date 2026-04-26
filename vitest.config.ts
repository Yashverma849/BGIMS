import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '~lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      '~scripts': fileURLToPath(new URL('./src/scripts', import.meta.url)),
      '~components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '~styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.{test,spec}.ts'],
    environment: 'node',
    globals: false,
  },
});
