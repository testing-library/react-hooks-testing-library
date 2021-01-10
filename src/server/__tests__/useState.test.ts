import { useState } from 'react'
import { renderHook, act } from '..'

describe('useState tests', () => {
  test('should use state value', () => {
    const { result } = renderHook(() => {
      const [value, setValue] = useState('foo')
      return { value, setValue }
    })

    expect(result.current.value).toBe('foo')
  })

  test('should retain state value after hydration', () => {
    const { result, hydrate } = renderHook(() => {
      const [value, setValue] = useState('foo')
      return { value, setValue }
    })

    hydrate()

    expect(result.current.value).toBe('foo')
  })

  test('should update state value using setter', () => {
    const { result, hydrate } = renderHook(() => {
      const [value, setValue] = useState('foo')
      return { value, setValue }
    })

    hydrate()

    act(() => {
      result.current.setValue('bar')
    })

    expect(result.current.value).toBe('bar')
  })
})
