import { useEffect, useLayoutEffect } from 'react'

describe('useEffect tests', () => {
  runForRenderers(['default', 'dom', 'native'], ({ renderHook }) => {
    test('should handle useEffect hook', () => {
      const sideEffect: { [key: number]: boolean } = { 1: false, 2: false }

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
      const sideEffect: { [key: number]: boolean } = { 1: false, 2: false }

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

  runForRenderers(['server'], ({ renderHook }) => {
    test('should handle useEffect hook when hydrated', () => {
      const sideEffect: { [key: number]: boolean } = { 1: false, 2: false }

      const { hydrate, rerender, unmount } = renderHook(
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

      expect(sideEffect[1]).toBe(false)
      expect(sideEffect[2]).toBe(false)

      hydrate()

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
})
