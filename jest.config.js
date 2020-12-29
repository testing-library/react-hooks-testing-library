// eslint-disable-next-line
const { jest: jestConfig } = require('kcd-scripts/config')

module.exports = Object.assign(jestConfig, {
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['<rootDir>/test/**/*.(ts|tsx|js)']
})
