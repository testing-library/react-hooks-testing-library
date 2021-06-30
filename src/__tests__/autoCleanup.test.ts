import { useEffect } from 'react'

// This verifies that by importing RHTL in an
// environment which supports afterEach (like Jest)
// we'll get automatic cleanup between tests.
describe('auto cleanup tests', () => {
  runForRenderers(['default', 'dom', 'native'], ({ renderHook }) => {
    let cleanupCalled = false

    test('first', () => {
      const useHookWithCleanup = () => {
        useEffect(() => {
          return () => {
            cleanupCalled = true
          }
        })
      }
      renderHook(() => useHookWithCleanup())
    })

    test('second', () => {
      expect(cleanupCalled).toBe(true)
    })
  })

  runForRenderers(['server'], ({ renderHook }) => {
    const cleanups: Record<string, boolean> = {
      ssr: false,
      hydrated: false
    }

    test('first (with hydration)', () => {
      const useHookWithCleanup = (name: string) => {
        useEffect(() => {
          return () => {
            cleanups[name] = true
          }
        })
      }

      renderHook(() => useHookWithCleanup('ssr'))
      const { hydrate } = renderHook(() => useHookWithCleanup('hydrated'))

      hydrate()
    })

    test('second (with hydration)', () => {
      expect(cleanups.ssr).toBe(false)
      expect(cleanups.hydrated).toBe(true)
    })
  })
})
