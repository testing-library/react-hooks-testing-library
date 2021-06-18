import { useEffect } from 'react'

import { ReactHooksServerRenderer } from '../../types/react'

// This verifies that if process.env is unavailable
// then we still auto-wire up the afterEach for folks
describe('skip auto cleanup (no process.env) tests', () => {
  const cleanups: Record<string, boolean> = {
    ssr: false,
    hydrated: false
  }
  process.env = {
    ...process.env,
    get RHTL_SKIP_AUTO_CLEANUP(): string | undefined {
      throw new Error('expected')
    }
  }
  const renderHook = (require('..') as ReactHooksServerRenderer).renderHook

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
