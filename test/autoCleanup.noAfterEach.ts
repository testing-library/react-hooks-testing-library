import { useEffect } from 'react'

// This verifies that if RHTL_SKIP_AUTO_CLEANUP is set
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (no afterEach) tests', () => {
  let cleanupCalled = false
  let renderHook: (arg0: () => void) => void

  beforeAll(() => {
    // @ts-expect-error Turning off AfterEach -- ignore Jest LifeCycle Type
    // eslint-disable-next-line no-global-assign
    afterEach = false
    // eslint-disable-next-line
    renderHook = require('../').renderHook
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
