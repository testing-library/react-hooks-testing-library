const { jest: jestConfig } = require('kcd-scripts/config')
jestConfig.coverageThreshold = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
module.exports = Object.assign(jestConfig, {
  setupFiles: ['<rootDir>/src/__tests__/utils/runForRenderers.ts']
})
