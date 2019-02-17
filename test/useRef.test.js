import { useRef, useImperativeHandle } from 'react'
import { testHook, cleanup } from 'src'

describe('useHook tests', () => {
  afterEach(cleanup)

  test('should handle useRef hook', () => {
    const { result } = testHook(() => useRef())

    const refContainer = result.current

    expect(Object.keys(refContainer)).toEqual(['current'])
    expect(refContainer.current).toBeUndefined()
  })

  test('should handle useImperativeHandle hook', () => {
    const { result } = testHook(() => {
      const ref = useRef()
      useImperativeHandle(ref, () => ({
        fakeImperativeMethod: () => true
      }))
      return ref
    })

    const refContainer = result.current

    expect(refContainer.current.fakeImperativeMethod()).toBe(true)
  })
})
