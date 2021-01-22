// This verifies that if pure imports are used
// then we DON'T auto-wire up the afterEach for folks
describe('error output suppression (pure) tests', () => {
  const originalConsoleError = console.error

  beforeAll(() => {
    require('../pure')
  })

  test('should not patch console.error', () => {
    expect(console.error).toBe(originalConsoleError)
  })
})

export {}
