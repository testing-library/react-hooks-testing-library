import { useEffect } from 'react'
import { renderHook } from '..'

// This verifies that by importing RHTL in an
// environment which supports afterEach (like Jest)
// we'll get automatic cleanup between tests.
describe('auto cleanup tests', () => {
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
    expect(cleanupCalled).toBe(true)
  })
})
