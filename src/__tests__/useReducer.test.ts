import { useReducer } from 'react'

describe('useReducer tests', () => {
  runForRenderers(['default', 'dom', 'native', 'server/hydrated'], ({ renderHook, act }) => {
    test('should handle useReducer hook', () => {
      const reducer = (state: number, action: { type: string }) =>
        action.type === 'inc' ? state + 1 : state
      const { result } = renderHook(() => useReducer(reducer, 0))

      const [initialState, dispatch] = result.current

      expect(initialState).toBe(0)

      act(() => dispatch({ type: 'inc' }))

      const [state] = result.current

      expect(state).toBe(1)
    })
  })
})
