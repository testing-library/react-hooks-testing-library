import { suppressErrorOutput } from '../pure'

// This verifies that if pure imports are used
// then we DON'T auto-wire up the afterEach for folks
describe('error output suppression (pure) tests', () => {
  const originalConsoleError = console.error

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
})
