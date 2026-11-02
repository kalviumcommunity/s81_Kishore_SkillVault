module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/server/**/*.test.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/client/',
    '/dist/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/client/',
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',
  coverageReporters: ['text', 'lcov'],
};
