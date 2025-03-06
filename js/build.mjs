#!/usr/bin/env node

import { build } from 'esbuild';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Get current directory and project root
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Use BUILD_DIR environment variable if provided, default to 'dist'
const buildDir = process.env.BUILD_DIR || 'dist';
const distDir = join(__dirname, buildDir);

async function main() {
  console.log(`Building data generation script into ${buildDir}...`);
  
  // Ensure dist directory exists
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }
  
  // Build the data generation script
  await build({
    entryPoints: [join(__dirname, 'build/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile: join(distDir, 'build-data.mjs'),
    format: 'esm',
    plugins: [
      {
        name: 'resolve-data-paths',
        setup(build) {
          // Resolve @data/... imports to the root data directory
          build.onResolve({ filter: /^@data\// }, args => {
            const dataPath = args.path.replace('@data/', '');
            return { path: join(rootDir, 'data', dataPath) };
          });
        }
      }
    ]
  });
  
  console.log('Running data generation...');
  
  // Run the generated script to produce data
  // eslint-disable-next-line import/no-unresolved
  const { generateData } = await import(join(distDir, 'build-data.mjs'));
  await generateData();
  
  console.log(`Data generation completed successfully in ${buildDir}!`);
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
}); 