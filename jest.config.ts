const { defaults } = require('jest-config');

module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFiles: ['dotenv/config'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  testPathIgnorePatterns: ['dist', 'config'],
  collectCoverageFrom: [
    '!test/**/*.*',
    '!**/node_modules/**',
    '!*.config.js',
  ],
  coverageDirectory: './test-reports/coverage',
  reporters: [
    'default',
    ['jest-junit',
      {
        outputDirectory: './test-reports',
      },
    ],
  ],
};
