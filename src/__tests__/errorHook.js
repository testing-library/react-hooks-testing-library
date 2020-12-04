import { useState, useEffect } from 'react'
import { renderHook } from '../'

describe('error hook tests', () => {
  function useError(throwError) {
    if (throwError) {
      throw new Error('expected')
    }
    return true
  }

  function useAsyncError(throwError) {
    const [value, setValue] = useState()
    useEffect(() => {
      const timeout = setTimeout(() => setValue(throwError), 100)
      return () => clearTimeout(timeout)
    }, [throwError])
    return useError(value)
  }

  function useEffectError(throwError) {
    useEffect(() => {
      useError(throwError)
    }, [throwError])
    return true
  }

  describe('synchronous', () => {
    test('should raise error', () => {
      const { result } = renderHook(() => useError(true))

      expect(() => {
        expect(result.current).not.toBe(undefined)
      }).toThrow(Error('expected'))
    })

    test('should capture error', () => {
      const { result } = renderHook(() => useError(true))

      expect(result.error).toEqual(Error('expected'))
    })

    test('should not capture error', () => {
      const { result } = renderHook(() => useError(false))

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })

    test('should reset error', () => {
      const { result, rerender } = renderHook((throwError) => useError(throwError), {
        initialProps: true
      })

      expect(result.error).not.toBe(undefined)

      rerender(false)

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })
  })

  describe('asynchronous', () => {
    test('should raise async error', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useAsyncError(true))

      await waitForNextUpdate()

      expect(() => {
        expect(result.current).not.toBe(undefined)
      }).toThrow(Error('expected'))
    })

    test('should capture async error', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useAsyncError(true))

      await waitForNextUpdate()

      expect(result.error).toEqual(Error('expected'))
    })

    test('should not capture async error', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useAsyncError(false))

      await waitForNextUpdate()

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })

    test('should reset async error', async () => {
      const { result, waitForNextUpdate, rerender } = renderHook(
        (throwError) => useAsyncError(throwError),
        {
          initialProps: true
        }
      )

      await waitForNextUpdate()

      expect(result.error).not.toBe(undefined)

      rerender(false)

      await waitForNextUpdate()

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })
  })

  /*
    These tests capture error cases that are not currently being caught successfully.
    Refer to https://github.com/testing-library/react-hooks-testing-library/issues/308
    for more details.
  */
  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('effect', () => {
    test('should raise effect error', () => {
      const { result } = renderHook(() => useEffectError(true))

      expect(() => {
        expect(result.current).not.toBe(undefined)
      }).toThrow(Error('expected'))
    })

    test('should capture effect error', () => {
      const { result } = renderHook(() => useEffectError(true))
      expect(result.error).toEqual(Error('expected'))
    })

    test('should not capture effect error', () => {
      const { result } = renderHook(() => useEffectError(false))

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })

    test('should reset effect error', () => {
      const { result, rerender } = renderHook((throwError) => useEffectError(throwError), {
        initialProps: true
      })

      expect(result.error).not.toBe(undefined)

      rerender(false)

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })
  })
})
