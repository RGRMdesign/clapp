/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e/', '<rootDir>/dist/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/app/**', '!src/test-utils/**', '!**/*.d.ts'],
};
