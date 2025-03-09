import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, 'dist');

export default {
  entry: ['./src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  clean: false,
  outDir: distDir,
};
