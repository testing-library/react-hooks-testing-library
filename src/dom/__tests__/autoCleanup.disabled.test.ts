import { useEffect } from 'react'

import { ReactHooksRenderer } from '../../types/react'

// This verifies that if RHTL_SKIP_AUTO_CLEANUP is set
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (disabled) tests', () => {
  let cleanupCalled = false
  process.env.RHTL_SKIP_AUTO_CLEANUP = 'true'
  const renderHook = (require('..') as ReactHooksRenderer).renderHook

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
