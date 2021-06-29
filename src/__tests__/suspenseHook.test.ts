describe('suspense hook tests', () => {
  const cache: { value?: Promise<string | Error> | string | Error } = {}
  const fetchName = (isSuccessful: boolean) => {
    if (!cache.value) {
      cache.value = new Promise<string>((resolve, reject) => {
        setTimeout(() => {
          if (isSuccessful) {
            resolve('Bob')
          } else {
            reject(new Error('Failed to fetch name'))
          }
        }, 50)
      })
        .then((value) => (cache.value = value))
        .catch((e: Error) => (cache.value = e))
    }
    return cache.value
  }

  const useFetchName = (isSuccessful = true) => {
    const name = fetchName(isSuccessful)
    if (name instanceof Promise || name instanceof Error) {
      throw name as unknown
    }
    return name
  }

  beforeEach(() => {
    delete cache.value
  })

  runForRenderers(['default', 'dom', 'native'], ({ renderHook }) => {
    test('should allow rendering to be suspended', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetchName(true))

      await waitForNextUpdate()

      expect(result.current).toBe('Bob')
    })

    test('should set error if suspense promise rejects', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetchName(false))

      await waitForNextUpdate()

      expect(result.error).toEqual(new Error('Failed to fetch name'))
    })

    test('should return undefined if current value is requested before suspension has resolved', async () => {
      const { result } = renderHook(() => useFetchName(true))

      expect(result.current).toBe(undefined)
    })

    test('should return undefined if error is requested before suspension has resolved', async () => {
      const { result } = renderHook(() => useFetchName(true))

      expect(result.error).toBe(undefined)
    })
  })
})

// eslint-disable-next-line jest/no-export
export {}
