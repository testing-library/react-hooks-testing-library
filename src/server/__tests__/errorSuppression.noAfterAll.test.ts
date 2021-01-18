describe('error output suppression (noAfterAll) tests', () => {
  const originalConsoleError = console.error

  beforeAll(() => {
    // @ts-expect-error Turning off AfterAll -- ignore Jest LifeCycle Type
    // eslint-disable-next-line no-global-assign
    afterAll = false
  })

  describe('first', () => {
    test('should patch console.error', () => {
      require('..')
      expect(console.error).not.toBe(originalConsoleError)
    })
  })

  describe('second', () => {
    test('should still used patched console.error', () => {
      expect(console.error).not.toBe(originalConsoleError)
    })
  })
})

export {}
