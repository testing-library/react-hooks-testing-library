const { jest: jestConfig } = require('kcd-scripts/config')
module.exports = Object.assign(jestConfig, {
  setupFiles: ['<rootDir>/src/__tests__/utils/runForRenderers.ts']
})
