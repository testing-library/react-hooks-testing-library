import {
  useState,
  useContext,
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo
} from 'react'
import { useHook, cleanup } from 'src'

describe('useHook tests', () => {
  afterEach(cleanup)

  test('should handle useState hook', () => {
    const { use, flush } = useHook(() => useState('foo'))

    const [value1, setValue] = use()

    expect(value1).toBe('foo')

    setValue('bar')

    const [value2] = flush()

    expect(value2).toBe('bar')
  })

  test('should handle useEffect hook', () => {
    const sideEffect = { [1]: false, [2]: false }

    const { use, flush, update } = useHook(({ id }) =>
      useEffect(
        () => {
          sideEffect[id] = true
          return () => {
            sideEffect[id] = false
          }
        },
        [id]
      )
    )

    use({ id: 1 })

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(false)

    flush()

    expect(sideEffect[1]).toBe(true)
    expect(sideEffect[2]).toBe(false)

    update({ id: 2 })

    expect(sideEffect[1]).toBe(true)
    expect(sideEffect[2]).toBe(false)

    flush()

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(true)
  })

  test('should handle useContext hook', () => {
    const TestContext = createContext('foo')

    const { use } = useHook(() => useContext(TestContext)).withContextProvider(
      TestContext.Provider,
      { value: 'bar' }
    )

    const value = use()

    expect(value).toBe('bar')
  })

  test('should handle useReducer hook', () => {
    const reducer = (state, action) => (action.type === 'inc' ? state + 1 : state)
    const { use, flush } = useHook(() => useReducer(reducer, 0))

    const [initialState, dispatch] = use()

    expect(initialState).toBe(0)

    dispatch({ type: 'inc' })

    const [state] = flush()

    expect(state).toBe(1)
  })

  test('should handle useCallback hook', () => {
    const { use, flush, update } = useHook(({ value }) => {
      const callback = () => ({ value })
      return useCallback(callback, [value])
    })

    const callback1 = use({ value: 1 })

    const calbackValue1 = callback1()

    expect(calbackValue1).toEqual({ value: 1 })

    const callback2 = flush()

    const calbackValue2 = callback2()

    expect(calbackValue2).toEqual({ value: 1 })

    expect(callback2).toBe(callback1)

    const callback3 = update({ value: 2 })

    const calbackValue3 = callback3()

    expect(calbackValue3).toEqual({ value: 2 })

    expect(callback3).not.toBe(callback1)
  })

  test('should handle useMemo hook', () => {
    const { use, flush, update } = useHook(({ value }) => useMemo(() => ({ value }), [value]))

    const value1 = use({ value: 1 })

    expect(value1).toEqual({ value: 1 })

    const value2 = flush()

    expect(value2).toEqual({ value: 1 })

    expect(value2).toBe(value1)

    const value3 = update({ value: 2 })

    expect(value3).toEqual({ value: 2 })

    expect(value3).not.toBe(value1)
  })
})
