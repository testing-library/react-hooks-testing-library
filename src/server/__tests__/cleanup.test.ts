import { useEffect } from 'react'
import { renderHook, cleanup } from '..'

describe('cleanup tests', () => {
  test('should flush effects on cleanup', async () => {
    let cleanupCalled = false

    const hookWithCleanup = () => {
      useEffect(() => {
        return () => {
          cleanupCalled = true
        }
      })
    }

    const { hydrate } = renderHook(() => hookWithCleanup())

    hydrate()

    await cleanup()

    expect(cleanupCalled).toBe(true)
  })

  test('should cleanup all rendered hooks', async () => {
    let cleanupCalled = [false, false]
    const hookWithCleanup = (id: number) => {
      useEffect(() => {
        return () => {
          cleanupCalled = cleanupCalled.map((_, i) => (i === id ? true : _))
        }
      })
    }

    const { hydrate: hydrate1 } = renderHook(() => hookWithCleanup(0))
    const { hydrate: hydrate2 } = renderHook(() => hookWithCleanup(1))

    hydrate1()
    hydrate2()

    await cleanup()

    expect(cleanupCalled[0]).toBe(true)
    expect(cleanupCalled[1]).toBe(true)
  })

  test('should only cleanup hydrated hooks', async () => {
    let cleanupCalled = [false, false]
    const hookWithCleanup = (id: number) => {
      useEffect(() => {
        return () => {
          cleanupCalled = cleanupCalled.map((_, i) => (i === id ? true : _))
        }
      })
    }

    renderHook(() => hookWithCleanup(0))
    const { hydrate } = renderHook(() => hookWithCleanup(1))

    hydrate()

    await cleanup()

    expect(cleanupCalled[0]).toBe(false)
    expect(cleanupCalled[1]).toBe(true)
  })
})
