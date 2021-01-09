// eslint-disable-next-line
const { jest: jestConfig } = require('kcd-scripts/config')

module.exports = Object.assign(jestConfig, {
  roots: ['<rootDir>/src'],
  testMatch: ['<rootDir>/**/__tests__/*.(ts|tsx|js)']
})
