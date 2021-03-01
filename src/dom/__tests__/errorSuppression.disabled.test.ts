// This verifies that if RHTL_DISABLE_ERROR_FILTERING is set
// then we DON'T auto-wire up the afterEach for folks
describe('error output suppression (disabled) tests', () => {
  const originalConsoleError = console.error

  beforeAll(() => {
    process.env.RHTL_DISABLE_ERROR_FILTERING = 'true'
    require('..')
  })

  test('should not patch console.error', () => {
    expect(console.error).toBe(originalConsoleError)
  })
})

export {}
