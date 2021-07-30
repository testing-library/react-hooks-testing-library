import { useEffect } from 'react'

// This verifies that if RHTL_SKIP_AUTO_CLEANUP is set
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (disabled) tests', () => {
  process.env.RHTL_SKIP_AUTO_CLEANUP = 'true'

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
