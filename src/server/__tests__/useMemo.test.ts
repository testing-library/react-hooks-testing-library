import { useMemo, useCallback } from 'react'
import { renderHook } from '..'

describe('useCallback tests', () => {
  test('should handle useMemo hook', () => {
    const { result, hydrate, rerender } = renderHook(
      ({ value }) => useMemo(() => ({ value }), [value]),
      {
        initialProps: { value: 1 }
      }
    )

    const value1 = result.current

    expect(value1).toEqual({ value: 1 })

    hydrate()

    const value2 = result.current

    expect(value2).toEqual({ value: 1 })

    expect(value2).not.toBe(value1)

    rerender()

    const value3 = result.current

    expect(value3).toEqual({ value: 1 })

    expect(value3).toBe(value2)

    rerender({ value: 2 })

    const value4 = result.current

    expect(value4).toEqual({ value: 2 })

    expect(value4).not.toBe(value2)
  })

  test('should handle useCallback hook', () => {
    const { result, hydrate, rerender } = renderHook(
      ({ value }) => {
        const callback = () => ({ value })
        return useCallback(callback, [value])
      },
      { initialProps: { value: 1 } }
    )

    const callback1 = result.current

    const calbackValue1 = callback1()

    expect(calbackValue1).toEqual({ value: 1 })

    hydrate()

    const callback2 = result.current

    const calbackValue2 = callback2()

    expect(calbackValue2).toEqual({ value: 1 })

    expect(callback2).not.toBe(callback1)

    rerender()

    const callback3 = result.current

    const calbackValue3 = callback3()

    expect(calbackValue3).toEqual({ value: 1 })

    expect(callback3).toBe(callback2)

    rerender({ value: 2 })

    const callback4 = result.current

    const calbackValue4 = callback4()

    expect(calbackValue4).toEqual({ value: 2 })

    expect(callback4).not.toBe(callback2)
  })
})
