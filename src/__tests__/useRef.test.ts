import { useRef, useImperativeHandle } from 'react'

describe('useHook tests', () => {
  runForRenderers(['default', 'dom', 'native', 'server/hydrated'], ({ renderHook }) => {
    test('should handle useRef hook', () => {
      const { result } = renderHook(() => useRef('value'))

      expect(result.current.current).toBe('value')
    })

    test('should handle useImperativeHandle hook', () => {
      const { result } = renderHook(() => {
        const ref = useRef<Record<string, () => boolean>>({})
        useImperativeHandle(ref, () => ({
          fakeImperativeMethod: () => true
        }))
        return ref
      })

      expect(result.current.current.fakeImperativeMethod()).toBe(true)
    })
  })
})
