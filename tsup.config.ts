import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/cmd/cli.ts'],
  bundle: true,
  splitting: true,
  minify: process.env.NODE_ENV === 'production',
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  shims: true
});
