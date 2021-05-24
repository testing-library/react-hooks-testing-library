import { useState, useEffect } from 'react'

import { renderHook, act } from '..'

describe('error hook tests', () => {
  function useError(throwError?: boolean) {
    if (throwError) {
      throw new Error('expected')
    }
    return true
  }

  function useAsyncError(throwError: boolean) {
    const [value, setValue] = useState<boolean>()
    useEffect(() => {
      const timeout = setTimeout(() => setValue(throwError), 100)
      return () => clearTimeout(timeout)
    }, [throwError])
    return useError(value)
  }

  function useEffectError(throwError: boolean) {
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
      const { result, hydrate, rerender } = renderHook(({ throwError }) => useError(throwError), {
        initialProps: { throwError: true }
      })

      expect(result.error).not.toBe(undefined)

      hydrate()

      rerender({ throwError: false })

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })
  })

  describe('asynchronous', () => {
    test('should raise async error', async () => {
      const { result, hydrate, waitForNextUpdate } = renderHook(() => useAsyncError(true))

      hydrate()

      await waitForNextUpdate()

      expect(() => {
        expect(result.current).not.toBe(undefined)
      }).toThrow(Error('expected'))
    })

    test('should capture async error', async () => {
      const { result, hydrate, waitForNextUpdate } = renderHook(() => useAsyncError(true))

      hydrate()

      await waitForNextUpdate()

      expect(result.error).toEqual(Error('expected'))
    })

    test('should not capture async error', async () => {
      const { result, hydrate, waitForNextUpdate } = renderHook(() => useAsyncError(false))

      hydrate()

      await waitForNextUpdate()

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })

    test('should reset async error', async () => {
      const { result, hydrate, waitForNextUpdate, rerender } = renderHook(
        ({ throwError }) => useAsyncError(throwError),
        { initialProps: { throwError: true } }
      )

      hydrate()

      await waitForNextUpdate()

      expect(result.error).not.toBe(undefined)

      rerender({ throwError: false })

      await waitForNextUpdate()

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })
  })

  describe('effect', () => {
    test('should raise effect error', () => {
      const { result, hydrate } = renderHook(() => useEffectError(true))

      hydrate()

      expect(() => {
        expect(result.current).not.toBe(undefined)
      }).toThrow(Error('expected'))
    })

    test('should capture effect error', () => {
      const { result, hydrate } = renderHook(() => useEffectError(true))

      hydrate()

      expect(result.error).toEqual(Error('expected'))
    })

    test('should not capture effect error', () => {
      const { result, hydrate } = renderHook(() => useEffectError(false))

      hydrate()

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })

    test('should reset effect error', () => {
      const { result, hydrate, rerender } = renderHook(
        ({ throwError }) => useEffectError(throwError),
        { initialProps: { throwError: true } }
      )

      hydrate()

      expect(result.error).not.toBe(undefined)

      rerender({ throwError: false })

      expect(result.current).not.toBe(undefined)
      expect(result.error).toBe(undefined)
    })
  })
})
