import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'cobertura', 'text-summary', 'json-summary'],
      reportsDirectory: './vitest/coverage',
    },
  },
});
