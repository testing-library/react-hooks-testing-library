import { useEffect } from 'react'

import { ReactHooksRenderer } from '../../types/react'

// This verifies that if afterEach is unavailable
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (no afterEach) tests', () => {
  let cleanupCalled = false
  let renderHook: ReactHooksRenderer['renderHook']

  beforeAll(() => {
    // @ts-expect-error Turning off AfterEach -- ignore Jest LifeCycle Type
    afterEach = false
    renderHook = (require('..') as ReactHooksRenderer).renderHook
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
