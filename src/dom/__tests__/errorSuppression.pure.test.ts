import { ReactHooksRenderer } from '../../types/react'

// This verifies that if pure imports are used
// then we DON'T auto-wire up the afterEach for folks
describe('error output suppression (pure) tests', () => {
  const originalConsoleError = console.error

  let suppressErrorOutput!: ReactHooksRenderer['suppressErrorOutput']

  beforeAll(() => {
    suppressErrorOutput = (require('../pure') as ReactHooksRenderer).suppressErrorOutput
  })

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
