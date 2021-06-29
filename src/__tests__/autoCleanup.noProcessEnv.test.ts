import { useEffect } from 'react'

// This verifies that if process.env is unavailable
// then we still auto-wire up the afterEach for folks
describe('auto cleanup (no process.env) tests', () => {
  process.env = {
    ...process.env,
    get RHTL_SKIP_AUTO_CLEANUP(): string | undefined {
      throw new Error('expected')
    }
  }

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
      expect(cleanupCalled).toBe(true)
    })
  })
})
