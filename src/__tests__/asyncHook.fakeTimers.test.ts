import * as React from 'react'

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

      await waitFor(() => {
        expect(actual).toBe(expected)
        complete = true
      })

      expect(complete).toBe(true)
    })

    test('it waits for the data to be loaded using', async () => {
      const fetchAMessage = () =>
        new Promise((resolve) => {
          // we are using random timeout here to simulate a real-time example
          // of an async operation calling a callback at a non-deterministic time
          const randomTimeout = Math.floor(Math.random() * 100)
          setTimeout(() => {
            resolve({ returnedMessage: 'Hello World' })
          }, randomTimeout)
        })

      function useLoader() {
        const [state, setState] = React.useState<{ data: unknown; loading: boolean }>({
          data: undefined,
          loading: true
        })
        React.useEffect(() => {
          let cancelled = false
          fetchAMessage().then((data) => {
            if (!cancelled) {
              setState({ data, loading: false })
            }
          })

          return () => {
            cancelled = true
          }
        }, [])

        return state
      }

      const { result, waitFor } = renderHook(() => useLoader())

      expect(result.current).toEqual({ data: undefined, loading: true })

      await waitFor(() => {
        expect(result.current).toEqual({ data: { returnedMessage: 'Hello World' }, loading: false })
      })
    })
  })
})

// eslint-disable-next-line jest/no-export
export {}
