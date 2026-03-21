import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 1000 * 60 * 5,
    include: ['tests/aiwrapper-chat.test.ts'],
    exclude: [],
    setupFiles: ['./tests/setup.ts'],
  },
});
