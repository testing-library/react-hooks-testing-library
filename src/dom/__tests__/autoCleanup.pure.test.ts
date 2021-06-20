import { useEffect } from 'react'
import { renderHook } from '../pure'

// This verifies that if pure imports are used
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (pure) tests', () => {
  let cleanupCalled = false

  test('first', () => {
    const hookWithCleanup = () => {
      useEffect(() => {
        return () => {
          cleanupCalled = true
        }
      })
    }
    renderHook(() => hookWithCleanup())
  })

  test('second', () => {
    expect(cleanupCalled).toBe(false)
  })
})
