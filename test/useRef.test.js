import { useRef, useImperativeHandle } from 'react'
import { useHook, cleanup } from 'src'

describe('useHook tests', () => {
  afterEach(cleanup)

  test('should handle useRef hook', () => {
    const { getCurrentValue } = useHook(() => useRef())

    const refContainer = getCurrentValue()

    expect(Object.keys(refContainer)).toEqual(['current'])
    expect(refContainer.current).toBeUndefined()
  })

  test('should handle useImperativeHandle hook', () => {
    const { getCurrentValue } = useHook(() => {
      const ref = useRef()
      useImperativeHandle(ref, () => ({
        fakeImperativeMethod: () => true
      }))
      return ref
    })

    const refContainer = getCurrentValue()

    expect(refContainer.current.fakeImperativeMethod()).toBe(true)
  })
})
