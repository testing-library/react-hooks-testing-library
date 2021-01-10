import { useEffect } from 'react'
import { renderHook } from '..'

// This verifies that by importing RHTL in an
// environment which supports afterEach (like Jest)
// we'll get automatic cleanup between tests.
describe('auto cleanup tests', () => {
  const cleanups: Record<string, boolean> = {
    ssr: false,
    hydrated: false
  }

  test('first', () => {
    const hookWithCleanup = (name: string) => {
      useEffect(() => {
        return () => {
          cleanups[name] = true
        }
      })
    }

    renderHook(() => hookWithCleanup('ssr'))

    const { hydrate } = renderHook(() => hookWithCleanup('hydrated'))
    hydrate()
  })

  test('second', () => {
    expect(cleanups.ssr).toBe(false)
    expect(cleanups.hydrated).toBe(true)
  })
})
