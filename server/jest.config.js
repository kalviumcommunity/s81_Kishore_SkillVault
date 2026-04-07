module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',
  coverageReporters: ['text', 'lcov'],
};