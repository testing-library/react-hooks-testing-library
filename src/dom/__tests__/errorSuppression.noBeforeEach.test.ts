// This verifies that if afterEach is unavailable
// then we DON'T auto-wire up the afterEach for folks
describe('error output suppression (noBeforeEach) tests', () => {
  const originalConsoleError = console.error

  beforeAll(() => {
    // @ts-expect-error Turning off BeforeEach -- ignore Jest LifeCycle Type
    beforeEach = false
  })

  describe('first', () => {
    test('should not patch console.error', () => {
      require('..')
      expect(console.error).toBe(originalConsoleError)
    })
  })
})

export {}
