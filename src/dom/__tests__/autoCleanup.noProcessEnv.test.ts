import { useEffect } from 'react'

import { ReactHooksRenderer } from '../../types/react'

// This verifies that if process.env is unavailable
// then we still auto-wire up the afterEach for folks
describe('auto cleanup (no process.env) tests', () => {
  let cleanupCalled = false
  process.env = {
    ...process.env,
    get RHTL_SKIP_AUTO_CLEANUP(): string | undefined {
      throw new Error('expected')
    }
  }
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
    expect(cleanupCalled).toBe(true)
  })
})
