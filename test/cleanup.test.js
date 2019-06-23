import { useEffect } from 'react'
import { renderHook, cleanup } from 'src'

describe('cleanup tests', () => {
  let sideEffect = {}

  function useEffectsCounter({ initialProps }) {
    return renderHook(
      ({ id }) => {
        useEffect(() => {
          sideEffect[id] = 0
          return () => {
            sideEffect[id] = sideEffect[id] + 1
          }
        }, [id])
      },
      { initialProps }
    )
  }

  afterEach(() => (sideEffect = {}))

  test('should unmount the tests', () => {
    useEffectsCounter({ initialProps: { id: 1 } })
    useEffectsCounter({ initialProps: { id: 10 } })
    useEffectsCounter({ initialProps: { id: 100 } })

    cleanup()

    expect(sideEffect).toEqual({ 1: 1, 10: 1, 100: 1 })
  })

  test('should not cleanup a hook that have already unmounted', () => {
    const { unmount } = useEffectsCounter({ initialProps: { id: 1 } })

    unmount()
    cleanup()

    expect(sideEffect).toEqual({ 1: 1 })
  })

  test('should not unmount a hook that have already cleaned up', () => {
    const { unmount } = useEffectsCounter({ initialProps: { id: 1 } })

    cleanup()
    unmount()

    expect(sideEffect).toEqual({ 1: 1 })
  })
})
