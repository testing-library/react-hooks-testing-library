describe('async hook (fake timers) tests', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  runForRenderers(['default', 'dom', 'native', 'server/hydrated'], ({ renderHook }) => {
    test('should wait for arbitrary expectation to pass when using advanceTimersByTime()', async () => {
      const { waitFor } = renderHook(() => null)

      let actual = 0
      const expected = 1

      setTimeout(() => {
        actual = expected
      }, 200)

      let complete = false

      jest.advanceTimersByTime(200)

      await waitFor(() => {
        expect(actual).toBe(expected)
        complete = true
      })

      expect(complete).toBe(true)
    })

    test('should wait for arbitrary expectation to pass when using runOnlyPendingTimers()', async () => {
      const { waitFor } = renderHook(() => null)

      let actual = 0
      const expected = 1

      setTimeout(() => {
        actual = expected
      }, 200)

      let complete = false

      jest.runOnlyPendingTimers()

      await waitFor(() => {
        expect(actual).toBe(expected)
        complete = true
      })

      expect(complete).toBe(true)
    })
  })
})

// eslint-disable-next-line jest/no-export
export {}
