import { useState } from 'react'
import { renderHook, act } from 'src/dom'

describe('useState tests', () => {
  test('should use state value', () => {
    const { result } = renderHook(() => {
      const [value, setValue] = useState('foo')
      return { value, setValue }
    })

    expect(result.current.value).toBe('foo')
  })

  test('should update state value using setter', () => {
    const { result } = renderHook(() => {
      const [value, setValue] = useState('foo')
      return { value, setValue }
    })

    act(() => result.current.setValue('bar'))

    expect(result.current.value).toBe('bar')
  })
})
