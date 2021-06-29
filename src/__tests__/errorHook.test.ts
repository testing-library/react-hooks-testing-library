import { useState, useEffect } from 'react'

describe('error hook tests', () => {
  function throwError(shouldThrow?: boolean) {
    if (shouldThrow) {
      throw new Error('expected')
    }
  }

  runForRenderers(['default', 'dom', 'native', 'server/hydrated'], ({ renderHook }) => {
    describe('synchronous', () => {
      function useError(shouldThrow?: boolean) {
        throwError(shouldThrow)
        return true
      }

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
        const { result, rerender } = renderHook(({ shouldThrow }) => useError(shouldThrow), {
          initialProps: { shouldThrow: true }
        })

        expect(result.error).not.toBe(undefined)

        rerender({ shouldThrow: false })

        expect(result.current).not.toBe(undefined)
        expect(result.error).toBe(undefined)
      })
    })

    describe('asynchronous', () => {
      function useAsyncError(shouldThrow: boolean) {
        const [value, setValue] = useState<boolean>()
        useEffect(() => {
          const timeout = setTimeout(() => setValue(shouldThrow), 100)
          return () => clearTimeout(timeout)
        }, [shouldThrow])
        throwError(value)
        return true
      }

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
          ({ shouldThrow }) => useAsyncError(shouldThrow),
          { initialProps: { shouldThrow: true } }
        )

        await waitForNextUpdate()

        expect(result.error).not.toBe(undefined)

        rerender({ shouldThrow: false })

        await waitForNextUpdate()

        expect(result.current).not.toBe(undefined)
        expect(result.error).toBe(undefined)
      })
    })

    describe('effect', () => {
      function useEffectError(shouldThrow: boolean) {
        useEffect(() => {
          throwError(shouldThrow)
        }, [shouldThrow])
        return true
      }

      test('this one - should raise effect error', () => {
        const { result } = renderHook(() => useEffectError(true))

        expect(() => {
          expect(result.current).not.toBe(undefined)
        }).toThrow(Error('expected'))
      })

      test('this one - should capture effect error', () => {
        const { result } = renderHook(() => useEffectError(true))
        expect(result.error).toEqual(Error('expected'))
      })

      test('should not capture effect error', () => {
        const { result } = renderHook(() => useEffectError(false))

        expect(result.current).not.toBe(undefined)
        expect(result.error).toBe(undefined)
      })

      test('should reset effect error', () => {
        const { result, rerender } = renderHook(({ shouldThrow }) => useEffectError(shouldThrow), {
          initialProps: { shouldThrow: true }
        })

        expect(result.error).not.toBe(undefined)

        rerender({ shouldThrow: false })

        expect(result.current).not.toBe(undefined)
        expect(result.error).toBe(undefined)
      })
    })
  })
})
