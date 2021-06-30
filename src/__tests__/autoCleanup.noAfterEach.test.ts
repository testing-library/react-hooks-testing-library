import { useEffect } from 'react'

// This verifies that if afterEach is unavailable
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (no afterEach) tests', () => {
  // @ts-expect-error Turning off AfterEach -- ignore Jest LifeCycle Type
  // eslint-disable-next-line no-global-assign
  afterEach = false

  runForRenderers(['default', 'dom', 'native', 'server/hydrated'], ({ renderHook }) => {
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
      expect(cleanupCalled).toBe(false)
    })
  })
})
