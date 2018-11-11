import { useMemo, useCallback } from 'react'
import { useHook, cleanup } from 'src'

describe('useCallback tests', () => {
  afterEach(cleanup)

  test('should handle useMemo hook', () => {
    const { getCurrentValue, setProps } = useHook(
      ({ value }) => useMemo(() => ({ value }), [value]),
      { value: 1 }
    )

    const value1 = getCurrentValue()

    expect(value1).toEqual({ value: 1 })

    const value2 = getCurrentValue()

    expect(value2).toEqual({ value: 1 })

    expect(value2).toBe(value1)

    setProps({ value: 2 })

    const value3 = getCurrentValue()

    expect(value3).toEqual({ value: 2 })

    expect(value3).not.toBe(value1)
  })

  test('should handle useCallback hook', () => {
    const { getCurrentValue, setProps } = useHook(
      ({ value }) => {
        const callback = () => ({ value })
        return useCallback(callback, [value])
      },
      { value: 1 }
    )

    const callback1 = getCurrentValue()

    const calbackValue1 = callback1()

    expect(calbackValue1).toEqual({ value: 1 })

    const callback2 = getCurrentValue()

    const calbackValue2 = callback2()

    expect(calbackValue2).toEqual({ value: 1 })

    expect(callback2).toBe(callback1)

    setProps({ value: 2 })

    const callback3 = getCurrentValue()

    const calbackValue3 = callback3()

    expect(calbackValue3).toEqual({ value: 2 })

    expect(callback3).not.toBe(callback1)
  })
})
