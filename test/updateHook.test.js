import { useState } from 'react'
import { renderHook, act } from 'src'

describe('update hook tests', () => {
  function useUpdate() {
    const [, setState] = useState(0)
    return () => setState((count) => count + 1)
  }

  test('should increase render count every time hook update function is called', () => {
    const { result } = renderHook(() => useUpdate())
    const update = result.current

    expect(result.renderCount).toBe(1)

    act(() => update())
    expect(result.renderCount).toBe(2)

    act(() => update())
    expect(result.renderCount).toBe(3)
  })

  test('should increase render count every time rerender function is called', () => {
    const { result, rerender } = renderHook(() => useUpdate())

    expect(result.renderCount).toBe(1)

    rerender()
    expect(result.renderCount).toBe(2)

    rerender()
    expect(result.renderCount).toBe(3)
  })
})
