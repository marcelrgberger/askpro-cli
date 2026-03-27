import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'openai-cli': 'bin/openai-cli.ts',
    'index': 'src/index.ts',
  },
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: false,
  splitting: false,
});
