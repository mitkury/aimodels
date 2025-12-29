import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 1000 * 60 * 5, // 5 minutes timeout
    include: ['tests/**/*.test.ts'],
    // Networked smoke tests (aiwrapper) are opt-in via a dedicated npm script.
    exclude: ['tests/aiwrapper-chat.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/types/**',
        '**/builders/**',
      ],
    },
  },
}); 