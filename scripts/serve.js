import { rm, mkdir } from 'fs/promises';
import { build } from 'esbuild';
import { createServer } from 'vite';
import preact from '@preact/preset-vite';
import electronmon from 'electronmon';

/** @type {import('esbuild').BuildOptions} */
const sharedBuildOptions = {
  bundle: true,
  minify: true,
  platform: 'node',
  format: 'cjs',
  external: ['electron', 'sharp'],
  sourcemap: 'inline',
  logLevel: 'info',
  define: { 'process.env.NODE_ENV': JSON.stringify('development') },
};

try {
  await rm('dist', { recursive: true, force: true });
} finally {
  await mkdir('dist');
}

await build({
  ...sharedBuildOptions,
  entryPoints: ['src/main/index.ts'],
  outfile: 'dist/main.cjs',
  watch: { onRebuild: () => app?.restart() },
});

await build({
  ...sharedBuildOptions,
  entryPoints: ['src/preload/index.ts'],
  outfile: 'dist/preload.js',
  watch: { onRebuild: () => app?.reload() },
});

const server = await createServer({
  configFile: false,
  root: 'src/renderer',
  css: { modules: { localsConvention: 'camelCase' } },
  plugins: [preact()],
});
await server.listen(9090);

const app = await electronmon({
  cwd: 'dist',
  args: ['main.cjs'],
  patterns: ['!**/*'], // reloading of electron is done in esbuild hooks
});
