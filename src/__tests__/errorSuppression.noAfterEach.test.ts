// This verifies that if afterEach is unavailable
// then we DON'T auto-wire up the afterEach for folks
describe('error output suppression (noAfterEach) tests', () => {
  const originalConsoleError = console.error
  // @ts-expect-error Turning off AfterEach -- ignore Jest LifeCycle Type
  // eslint-disable-next-line no-global-assign
  afterEach = false

  runForRenderers(['default', 'dom', 'native', 'server'], () => {
    test('should not patch console.error', () => {
      expect(console.error).toBe(originalConsoleError)
    })
  })
})

// eslint-disable-next-line jest/no-export
export {}
