import { renderHook } from '../../src/native'

describe('result history tests', () => {
  let count = 0
  function useCounter() {
    const result = count++
    if (result === 2) {
      throw Error('expected')
    }
    return result
  }

  test('should capture all renders states of hook', () => {
    const { result, rerender } = renderHook(() => useCounter())

    expect(result.current).toEqual(0)
    expect(result.all).toEqual([0])

    rerender()

    expect(result.current).toBe(1)
    expect(result.all).toEqual([0, 1])

    rerender()

    expect(result.error).toEqual(Error('expected'))
    expect(result.all).toEqual([0, 1, Error('expected')])

    rerender()

    expect(result.current).toBe(3)
    expect(result.all).toEqual([0, 1, Error('expected'), 3])
  })
})
