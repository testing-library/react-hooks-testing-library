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

    test('should waitFor arbitrary expectation to pass when fake timers are not advanced explicitly', async () => {
      const fn = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const { waitFor } = renderHook(() => null)

      await waitFor(() => {
        expect(fn()).toBe(true)
      })
    })

    test('should reject if timeout is passed close to when promise resolves', async () => {
      const { waitFor } = renderHook(() => null)

      let actual = 0
      const expected = 1

      setTimeout(() => {
        actual = expected
      }, 101)

      let complete = false

      await expect(
        waitFor(
          () => {
            expect(actual).toBe(expected)
            complete = true
          },
          { timeout: 100, interval: 50 }
        )
      ).rejects.toThrow(Error('Timed out in waitFor after 100ms.'))

      expect(complete).toBe(false)
    })
  })
})

// eslint-disable-next-line jest/no-export
export {}
