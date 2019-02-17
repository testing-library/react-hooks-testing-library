import { useMemo, useCallback } from 'react'
import { testHook, cleanup } from 'src'

describe('useCallback tests', () => {
  afterEach(cleanup)

  test('should handle useMemo hook', () => {
    const { result, rerender } = testHook(({ value }) => useMemo(() => ({ value }), [value]), {
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
    const { result, rerender } = testHook(
      ({ value }) => {
        const callback = () => ({ value })
        return useCallback(callback, [value])
      },
      { initialProps: { value: 1 } }
    )

    const callback1 = result.current

    const calbackValue1 = callback1()

    expect(calbackValue1).toEqual({ value: 1 })

    const callback2 = result.current

    const calbackValue2 = callback2()

    expect(calbackValue2).toEqual({ value: 1 })

    expect(callback2).toBe(callback1)

    rerender({ value: 2 })

    const callback3 = result.current

    const calbackValue3 = callback3()

    expect(calbackValue3).toEqual({ value: 2 })

    expect(callback3).not.toBe(callback1)
  })
})
