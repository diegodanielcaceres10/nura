import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './vitest/junit-report.xml',
    },
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'text-summary', 'json-summary'],
      reportsDirectory: './vitest/coverage',
    },
  },
});
