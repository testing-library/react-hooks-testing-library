import { useMemo, useCallback } from 'react'

describe('useCallback tests', () => {
  runForRenderers(['default', 'dom', 'native', 'server/hydrated'], ({ renderHook }) => {
    test('should handle useMemo hook', () => {
      const { result, rerender } = renderHook(({ value }) => useMemo(() => ({ value }), [value]), {
        initialProps: { value: 1 }
      })

      const value1 = result.current

      expect(value1).toEqual({ value: 1 })

      rerender()

      const value2 = result.current

      expect(value2).toEqual({ value: 1 })

      expect(value2).toBe(value1)

      rerender({ value: 2 })

      const value3 = result.current

      expect(value3).toEqual({ value: 2 })

      expect(value3).not.toBe(value1)
    })

    test('should handle useCallback hook', () => {
      const { result, rerender } = renderHook(
        ({ value }) => {
          const callback = () => ({ value })
          return useCallback(callback, [value])
        },
        { initialProps: { value: 1 } }
      )

      const callback1 = result.current

      const callbackValue1 = callback1()

      expect(callbackValue1).toEqual({ value: 1 })

      const callback2 = result.current

      const callbackValue2 = callback2()

      expect(callbackValue2).toEqual({ value: 1 })

      expect(callback2).toBe(callback1)

      rerender({ value: 2 })

      const callback3 = result.current

      const callbackValue3 = callback3()

      expect(callbackValue3).toEqual({ value: 2 })

      expect(callback3).not.toBe(callback1)
    })
  })
})
