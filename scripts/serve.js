import { rm, mkdir } from 'fs/promises';
import { build } from 'esbuild';
import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
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
  define: { 'import.meta.env.DEV': true },
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
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'webview',
        },
      },
    }),
  ],
});
await server.listen(9090);

const app = await electronmon({
  cwd: 'dist',
  args: ['main.cjs'],
  patterns: ['!**/*'], // reloading of electron is done in esbuild hooks
});
