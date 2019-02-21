import { useReducer } from 'react'
import { renderHook, cleanup, act } from 'src'

describe('useReducer tests', () => {
  afterEach(cleanup)

  test('should handle useReducer hook', () => {
    const reducer = (state, action) => (action.type === 'inc' ? state + 1 : state)
    const { result } = renderHook(() => useReducer(reducer, 0))

    const [initialState, dispatch] = result.current

    expect(initialState).toBe(0)

    act(() => dispatch({ type: 'inc' }))

    const [state] = result.current

    expect(state).toBe(1)
  })
})
