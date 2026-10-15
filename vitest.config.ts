import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // shared 는 순수 로직이라 node 환경에서 돌린다.
    environment: 'node',
    include: ['shared/**/tests/**/*.test.ts'],
    passWithNoTests: true,
  },
});
