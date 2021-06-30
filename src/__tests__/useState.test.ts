import { useState } from 'react'

describe('useState tests', () => {
  runForRenderers(['default', 'dom', 'native', 'server/hydrated'], ({ renderHook, act }) => {
    test('should use setState value', () => {
      const { result } = renderHook(() => {
        const [value, setValue] = useState('foo')
        return { value, setValue }
      })

      expect(result.current.value).toBe('foo')
    })

    test('should update setState value using setter', () => {
      const { result } = renderHook(() => {
        const [value, setValue] = useState('foo')
        return { value, setValue }
      })

      act(() => result.current.setValue('bar'))

      expect(result.current.value).toBe('bar')
    })
  })
})
