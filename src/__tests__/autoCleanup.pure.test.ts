import { useEffect } from 'react'

// This verifies that if pure imports are used
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (pure) tests', () => {
  runForRenderers(
    ['default/pure', 'dom/pure', 'native/pure', 'server/hydrated/pure'],
    ({ renderHook }) => {
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
    }
  )
})
