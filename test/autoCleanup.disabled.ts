import { useEffect } from 'react'

// This verifies that if RHTL_SKIP_AUTO_CLEANUP is set
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (disabled) tests', () => {
  let cleanupCalled = false
  let renderHook: (arg0: () => void) => void

  beforeAll(() => {
    process.env.RHTL_SKIP_AUTO_CLEANUP = 'true'
    // eslint-disable-next-line
    renderHook = require('../src').renderHook
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
