import { renderHook } from '../src'

describe('suspense hook tests', () => {
  const cache = {}
  const fetchName = (isSuccessful) => {
    if (!cache.value) {
      cache.value = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (isSuccessful) {
            resolve('Bob')
          } else {
            reject(new Error('Failed to fetch name'))
          }
        }, 50)
      })
        .then((value) => (cache.value = value))
        .catch((e) => (cache.value = e))
    }
    return cache.value
  }

  const useFetchName = (isSuccessful = true) => {
    const name = fetchName(isSuccessful)
    if (typeof name.then === 'function' || name instanceof Error) {
      throw name
    }
    return name
  }

  beforeEach(() => {
    delete cache.value
  })

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
})
