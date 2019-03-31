import { useState, useEffect } from 'react'
import { renderHook } from 'src'

describe('error hook tests', () => {
  function useError(throwError) {
    if (throwError) {
      throw new Error('expected')
    }
    return true
  }

  const somePromise = () => Promise.resolve()

  function useAsyncError(throwError) {
    const [value, setValue] = useState()
    useEffect(() => {
      somePromise().then(() => {
        setValue(throwError)
      })
    }, [throwError])
    return useError(value)
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
})
