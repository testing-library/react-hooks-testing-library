import { useEffect } from 'react'

import { ReactHooksServerRenderer } from '../../types/react'

// This verifies that if RHTL_SKIP_AUTO_CLEANUP is set
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (disabled) tests', () => {
  const cleanups: Record<string, boolean> = {
    ssr: false,
    hydrated: false
  }
  let renderHook: ReactHooksServerRenderer['renderHook']

  beforeAll(() => {
    process.env.RHTL_SKIP_AUTO_CLEANUP = 'true'
    renderHook = (require('..') as ReactHooksServerRenderer).renderHook
  })

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
    expect(cleanups.hydrated).toBe(false)
  })
})
