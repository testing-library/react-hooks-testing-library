import { useEffect, useLayoutEffect } from 'react'
import { renderHook } from 'src'

describe('useEffect tests', () => {
  test('should handle useEffect hook', () => {
    const sideEffect = { [1]: false, [2]: false }

    const { rerender, unmount } = renderHook(
      ({ id }) => {
        useEffect(() => {
          sideEffect[id] = true
          return () => {
            sideEffect[id] = false
          }
        }, [id])
      },
      { initialProps: { id: 1 } }
    )

    expect(sideEffect[1]).toBe(true)
    expect(sideEffect[2]).toBe(false)

    rerender({ id: 2 })

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(true)

    unmount()

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(false)
  })

  test('should handle useLayoutEffect hook', () => {
    const sideEffect = { [1]: false, [2]: false }

    const { rerender, unmount } = renderHook(
      ({ id }) => {
        useLayoutEffect(() => {
          sideEffect[id] = true
          return () => {
            sideEffect[id] = false
          }
        }, [id])
      },
      { initialProps: { id: 1 } }
    )

    expect(sideEffect[1]).toBe(true)
    expect(sideEffect[2]).toBe(false)

    rerender({ id: 2 })

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(true)

    unmount()

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(false)
  })
})
