import { rm, mkdir } from 'fs/promises';
import glob from 'tiny-glob';
import { build } from 'esbuild';
import { build as viteBuild } from 'vite';
import vue from '@vitejs/plugin-vue';
import { build as electronBuild } from 'electron-builder';

/** @type {import('esbuild').BuildOptions} */
const sharedBuildOptions = {
  bundle: true,
  minify: true,
  logLevel: 'info',
  platform: 'node',
  format: 'cjs',
  external: ['electron'],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
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
});

await build({
  ...sharedBuildOptions,
  entryPoints: ['src/preload/index.ts'],
  outfile: 'dist/preload.js',
});

const htmlFiles = await glob('src/renderer/**/*.html', { absolute: true });
await viteBuild({
  configFile: false,
  root: 'src/renderer',
  base: './',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'webview',
        },
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: htmlFiles.reduce((res, path, i) => ({ ...res, [i]: path }), {}),
    },
    outDir: `${process.cwd()}/dist`,
  },
});

await electronBuild({
  config: {
    files: ['dist/**/*', 'build/**/*'],
    directories: {
      output: 'release',
    },
  },
});
