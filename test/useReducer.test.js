import { useReducer } from 'react'
import { useHook, cleanup } from 'src'

describe('useReducer tests', () => {
  afterEach(cleanup)

  test('should handle useReducer hook', () => {
    const reducer = (state, action) => (action.type === 'inc' ? state + 1 : state)
    const { getCurrentValues } = useHook(() => useReducer(reducer, 0))

    const [initialState, dispatch] = getCurrentValues()

    expect(initialState).toBe(0)

    dispatch({ type: 'inc' })

    const [state] = getCurrentValues()

    expect(state).toBe(1)
  })
})
