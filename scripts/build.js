import { rm, mkdir } from 'fs/promises';
import glob from 'tiny-glob';
import { build } from 'esbuild';
import { build as viteBuild } from 'vite';
import vue from '@vitejs/plugin-vue';
import { build as electronBuild } from 'electron-builder';
import { execSync } from 'child_process';
import { join, dirname } from 'path';

const args = process.argv.slice(2);

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

const cwd = process.cwd();
const rendererPath = join(cwd, 'src', 'renderer');
const htmlFiles = await glob('**/*.html', { cwd: rendererPath });
for (const file of htmlFiles) {
  const dir = dirname(file);
  await viteBuild({
    configFile: false,
    root: join(rendererPath, dir),
    base: './',
    plugins: [
      vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === 'webview' } } }),
    ],
    build: { assetsDir: '.', outDir: join(cwd, 'dist', dir) },
  });
}

if (args.includes('--start')) {
  execSync('cd dist && npx electron main.cjs', { stdio: 'inherit' });
}
if (args.includes('--release')) {
  await electronBuild({
    config: {
      files: ['dist/**/*', 'build/**/*'],
      directories: {
        output: 'release',
      },
    },
  });
}
