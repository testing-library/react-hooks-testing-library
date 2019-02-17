import { useState } from 'react'
import { testHook, cleanup, act } from 'src'

describe('useState tests', () => {
  afterEach(cleanup)

  test('should use setState value', () => {
    const { result } = testHook(() => useState('foo'))

    const [value] = result.current

    expect(value).toBe('foo')
  })

  test('should update setState value using setter', () => {
    const { result } = testHook(() => useState('foo'))

    const [_, setValue] = result.current

    act(() => setValue('bar'))

    const [value] = result.current

    expect(value).toBe('bar')
  })
})
