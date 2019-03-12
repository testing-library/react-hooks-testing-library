import { useState, useEffect } from 'react'
import { renderHook, cleanup } from 'src'

describe('async hook tests', () => {
  const getSomeName = () => Promise.resolve('Betty')

  const useName = (prefix) => {
    const [name, setName] = useState('nobody')

    useEffect(() => {
      getSomeName().then((theName) => {
        setName(prefix ? `${prefix} ${theName}` : theName)
      })
    }, [prefix])

    return name
  }

  afterEach(cleanup)

  test('should wait for next update', async () => {
    const { result, nextUpdate } = renderHook(() => useName())

    expect(result.current).toBe('nobody')

    await nextUpdate()

    expect(result.current).toBe('Betty')
  })

  test('should wait for multiple updates', async () => {
    const { result, nextUpdate, rerender } = renderHook(({ prefix }) => useName(prefix), {
      initialProps: { prefix: 'Mrs.' }
    })

    expect(result.current).toBe('nobody')

    await nextUpdate()

    expect(result.current).toBe('Mrs. Betty')

    rerender({ prefix: 'Ms.' })

    await nextUpdate()

    expect(result.current).toBe('Ms. Betty')
  })

  test('should resolve all when updating', async () => {
    const { result, nextUpdate } = renderHook(({ prefix }) => useName(prefix), {
      initialProps: { prefix: 'Mrs.' }
    })

    expect(result.current).toBe('nobody')

    await Promise.all([nextUpdate(), nextUpdate(), nextUpdate()])

    expect(result.current).toBe('Mrs. Betty')
  })
})
