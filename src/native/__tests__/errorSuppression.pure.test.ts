describe('error output suppression (pure) tests', () => {
  const originalConsoleError = console.error

  test('should not patch console.error', () => {
    require('../pure')
    expect(console.error).toBe(originalConsoleError)
  })
})

export {}
