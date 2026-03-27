import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['bin/openai-cli.ts', 'src/index.ts'],
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: false,
  splitting: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
