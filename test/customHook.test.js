import { useState, useCallback } from 'react'
import { renderHook, cleanup, act } from 'src'

describe('custom hook tests', () => {
  function useCounter(initialCount = 0) {
    const [count, setCount] = useState(initialCount)

    const incrementBy = useCallback((n) => setCount(count + n), [count])
    const decrementBy = useCallback((n) => setCount(count - n), [count])

    return { count, incrementBy, decrementBy }
  }

  afterEach(cleanup)

  test('should create counter', () => {
    const { result } = renderHook(() => useCounter())

    expect(result.current.count).toBe(0)
  })

  test('should increment counter', () => {
    const { result } = renderHook(() => useCounter())

    act(() => result.current.incrementBy(1))

    expect(result.current.count).toBe(1)

    act(() => result.current.incrementBy(2))

    expect(result.current.count).toBe(3)
  })

  test('should decrement counter', () => {
    const { result } = renderHook(() => useCounter())

    act(() => result.current.decrementBy(1))

    expect(result.current.count).toBe(-1)

    act(() => result.current.decrementBy(2))

    expect(result.current.count).toBe(-3)
  })
})
