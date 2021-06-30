import { useEffect } from 'react'

describe('cleanup tests', () => {
  runForRenderers(
    ['default/pure', 'dom/pure', 'native/pure', 'server/hydrated/pure'],
    ({ renderHook, cleanup, addCleanup, removeCleanup }) => {
      test('should flush effects on cleanup', async () => {
        let cleanupCalled = false

        const useHookWithCleanup = () => {
          useEffect(() => {
            return () => {
              cleanupCalled = true
            }
          })
        }

        renderHook(() => useHookWithCleanup())

        await cleanup()

        expect(cleanupCalled).toBe(true)
      })

      test('should cleanup all rendered hooks', async () => {
        const cleanupCalled: boolean[] = []
        const useHookWithCleanup = (id: number) => {
          useEffect(() => {
            return () => {
              cleanupCalled[id] = true
            }
          })
        }

        renderHook(() => useHookWithCleanup(1))
        renderHook(() => useHookWithCleanup(2))

        await cleanup()

        expect(cleanupCalled[1]).toBe(true)
        expect(cleanupCalled[2]).toBe(true)
      })

      test('should call cleanups in reverse order', async () => {
        const callSequence: string[] = []
        addCleanup(() => {
          callSequence.push('cleanup')
        })
        addCleanup(() => {
          callSequence.push('another cleanup')
        })
        const useHookWithCleanup = () => {
          useEffect(() => {
            return () => {
              callSequence.push('unmount')
            }
          })
        }
        renderHook(() => useHookWithCleanup())

        await cleanup()

        expect(callSequence).toEqual(['unmount', 'another cleanup', 'cleanup'])
      })

      test('should wait for async cleanup', async () => {
        const callSequence: string[] = []
        addCleanup(() => {
          callSequence.push('cleanup')
        })
        addCleanup(async () => {
          await new Promise((resolve) => setTimeout(resolve, 10))
          callSequence.push('another cleanup')
        })
        const useHookWithCleanup = () => {
          useEffect(() => {
            return () => {
              callSequence.push('unmount')
            }
          })
        }
        renderHook(() => useHookWithCleanup())

        await cleanup()

        expect(callSequence).toEqual(['unmount', 'another cleanup', 'cleanup'])
      })

      test('should remove cleanup using removeCleanup', async () => {
        const callSequence: string[] = []
        addCleanup(() => {
          callSequence.push('cleanup')
        })
        const anotherCleanup = () => {
          callSequence.push('another cleanup')
        }
        addCleanup(anotherCleanup)
        const useHookWithCleanup = () => {
          useEffect(() => {
            return () => {
              callSequence.push('unmount')
            }
          })
        }
        renderHook(() => useHookWithCleanup())

        removeCleanup(anotherCleanup)

        await cleanup()

        expect(callSequence).toEqual(['unmount', 'cleanup'])
      })

      test('should remove cleanup using returned handler', async () => {
        const callSequence: string[] = []
        addCleanup(() => {
          callSequence.push('cleanup')
        })
        const remove = addCleanup(() => {
          callSequence.push('another cleanup')
        })
        const useHookWithCleanup = () => {
          useEffect(() => {
            return () => {
              callSequence.push('unmount')
            }
          })
        }
        renderHook(() => useHookWithCleanup())

        remove()

        await cleanup()

        expect(callSequence).toEqual(['unmount', 'cleanup'])
      })
    }
  )

  runForRenderers(['server/pure'], ({ renderHook, cleanup }) => {
    test('should only cleanup hydrated hooks', async () => {
      const cleanups: Record<string, boolean> = {
        ssr: false,
        hydrated: false
      }

      const useHookWithCleanup = (name: string) => {
        useEffect(() => {
          return () => {
            cleanups[name] = true
          }
        })
      }

      renderHook(() => useHookWithCleanup('ssr'))
      const { hydrate } = renderHook(() => useHookWithCleanup('hydrated'))

      hydrate()

      await cleanup()

      expect(cleanups.ssr).toBe(false)
      expect(cleanups.hydrated).toBe(true)
    })
  })
})
