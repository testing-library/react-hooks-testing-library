import { useState, useCallback } from 'react'

describe('custom hook tests', () => {
  function useCounter() {
    const [count, setCount] = useState(0)

    const increment = useCallback(() => setCount(count + 1), [count])
    const decrement = useCallback(() => setCount(count - 1), [count])

    return { count, increment, decrement }
  }

  runForRenderers(['default', 'dom', 'native', 'server/hydrated'], ({ renderHook, act }) => {
    test('should increment counter', () => {
      const { result } = renderHook(() => useCounter())

      act(() => result.current.increment())

      expect(result.current.count).toBe(1)
    })

    test('should decrement counter', () => {
      const { result } = renderHook(() => useCounter())

      act(() => result.current.decrement())

      expect(result.current.count).toBe(-1)
    })
  })
})
