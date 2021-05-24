import { useEffect } from 'react'

import { ReactHooksRenderer } from '../../types/react'

// This verifies that if process.env is unavailable
// then we still auto-wire up the afterEach for folks
describe('skip auto cleanup (no process.env) tests', () => {
  const originalEnv = process.env
  let cleanupCalled = false
  let renderHook: ReactHooksRenderer['renderHook']

  beforeAll(() => {
    process.env = {
      ...process.env,
      get RHTL_SKIP_AUTO_CLEANUP(): string | undefined {
        throw new Error('expected')
      }
    }
    renderHook = (require('..') as ReactHooksRenderer).renderHook
  })

  afterAll(() => {
    process.env = originalEnv
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
    expect(cleanupCalled).toBe(true)
  })
})
