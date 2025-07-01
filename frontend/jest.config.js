const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  // Ignore dot-underscore files and standard folders
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '/\\._'
  ],
  verbose: true,
};

module.exports = createJestConfig(customJestConfig);
