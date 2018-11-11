import { useState } from 'react'
import { useHook, cleanup } from 'src'

describe('useState tests', () => {
  afterEach(cleanup)

  test('should use setState value', () => {
    const { getCurrentValue } = useHook(() => useState('foo'))

    const [value] = getCurrentValue()

    expect(value).toBe('foo')
  })

  test('should update setState value using setter', () => {
    const { getCurrentValues } = useHook(() => useState('foo'))

    const [_, setValue] = getCurrentValues()

    setValue('bar')

    const [value] = getCurrentValues()

    expect(value).toBe('bar')
  })
})
