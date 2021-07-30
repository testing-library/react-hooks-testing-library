// This verifies that if pure imports are used
// then we DON'T auto-wire up the afterEach for folks
describe('error output suppression (pure) tests', () => {
  const originalConsoleError = console.error

  runForRenderers(
    ['default/pure', 'dom/pure', 'native/pure', 'server/pure'],
    ({ suppressErrorOutput }) => {
      test('should not patch console.error', () => {
        expect(console.error).toBe(originalConsoleError)
      })

      test('should manually patch console.error', () => {
        const restore = suppressErrorOutput()

        try {
          expect(console.error).not.toBe(originalConsoleError)
        } finally {
          restore()
        }

        expect(console.error).toBe(originalConsoleError)
      })
    }
  )
})

// eslint-disable-next-line jest/no-export
export {}
