module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 97,
      functions: 100,
      lines: 100,
    },
  },
};
