// This verifies that if process.env is unavailable
// then we still auto-wire up the afterEach for folks
describe('error output suppression (no process.env) tests', () => {
  const originalConsoleError = console.error
  process.env = {
    ...process.env,
    get RHTL_DISABLE_ERROR_FILTERING(): string | undefined {
      throw new Error('expected')
    }
  }
  require('..')

  test('should not patch console.error', () => {
    expect(console.error).not.toBe(originalConsoleError)
  })
})

export {}
