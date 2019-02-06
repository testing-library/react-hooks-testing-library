import { useEffect, useLayoutEffect } from 'react'
import { useHook, cleanup } from 'src'

describe('useEffect tests', () => {
  afterEach(cleanup)

  test('should handle useEffect hook', () => {
    const sideEffect = { [1]: false, [2]: false }

    const { flushEffects, setProps } = useHook(
      ({ id }) => {
        useEffect(() => {
          sideEffect[id] = true
          return () => {
            sideEffect[id] = false
          }
        }, [id])
      },
      { id: 1 }
    )

    flushEffects()

    expect(sideEffect[1]).toBe(true)
    expect(sideEffect[2]).toBe(false)

    setProps({ id: 2 })
    flushEffects()

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(true)
  })

  test('should handle useLayoutEffect hook', () => {
    const sideEffect = { [1]: false, [2]: false }

    const { flushEffects, setProps } = useHook(
      ({ id }) => {
        useLayoutEffect(() => {
          sideEffect[id] = true
          return () => {
            sideEffect[id] = false
          }
        }, [id])
      },
      { id: 1 }
    )

    flushEffects()

    expect(sideEffect[1]).toBe(true)
    expect(sideEffect[2]).toBe(false)

    setProps({ id: 2 })
    flushEffects()

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(true)
  })
})
