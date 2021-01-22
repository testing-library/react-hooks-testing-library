import { useEffect } from 'react'

import { ReactHooksRenderer } from '../../types/react'

// This verifies that if pure imports are used
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (pure) tests', () => {
  let cleanupCalled = false
  let renderHook: ReactHooksRenderer['renderHook']

  beforeAll(() => {
    renderHook = (require('../pure') as ReactHooksRenderer).renderHook
  })

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
