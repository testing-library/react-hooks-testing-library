import { renderHook } from '..'

describe('error output suppression (disabled) tests', () => {
  function useError(throwError?: boolean) {
    if (throwError) {
      throw new Error('expected')
    }
    return true
  }

  const originalConsoleError = console.error
  const mockConsoleError = jest.fn()

  beforeAll(() => {
    process.env.RHTL_DISABLE_ERROR_FILTERING = 'true'
  })

  beforeEach(() => {
    console.error = mockConsoleError
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  test('should not suppress error output', () => {
    const { result } = renderHook(() => useError(true))

    expect(result.error).toEqual(Error('expected'))
    expect(mockConsoleError).toBeCalledWith(
      expect.stringMatching(/^Error: Uncaught \[Error: expected\]/),
      expect.any(Error)
    )
    expect(mockConsoleError).toBeCalledWith(
      expect.stringMatching(/^The above error occurred in the <TestComponent> component:/)
    )
    expect(mockConsoleError).toBeCalledTimes(2)
  })
})
