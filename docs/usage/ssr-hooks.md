---
name: SSR Hooks
menu: Usage
route: '/usage/ssr-hooks'
---

# Server Side Renderering

## Setup

To SSR your hook, you must ensure `react-dom >= 16.9.0` is installed in your project and then import
the server module in your test:

```ts
import { renderHook } from '@testing-library/react-hooks/server'
```

## Render Hook

`renderHook` when called returns the same result as documented in the
[API](/reference/api#renderhook-result) but includes an additional argument, `hydrate`:

```ts
function hydrate(): void
```

The `hydrate` function is a light wrapper around
[`ReactDOM.hydrate`](https://reactjs.org/docs/react-dom.html#hydrate) but no arguments are required
as the library will pass the element & container for you. Remember, certain effects such as
`useEffect` will not run server side and `hydrate` must be called before those effects are
ran.`hydrate`is also necessary before the first `act` or `rerender` call. For more information on
`hydrate` see the [API documentation](/reference/api#hydrate). There is also an
[example below](/usage/ssr-hooks#example)

## Example

### Hydration

```js
import { renderHook, act } from '@testing-library/react-hooks/server'

describe('custom hook tests', () => {
  function useCounter() {
    const [count, setCount] = useState(0)

    const increment = useCallback(() => setCount(count + 1), [count])
    const decrement = useCallback(() => setCount(count - 1), [count])

    return { count, increment, decrement }
  }

  test('should decrement counter', () => {
    const { result, hydrate } = renderHook(() => useCounter())

    expect(result.current.count).toBe(0)

    // hydrate is called because we want to interact with the hook
    hydrate()

    act(() => result.current.decrement())

    expect(result.current.count).toBe(-1)
  })
})
```

### Effects

```js
describe('useEffect tests', () => {
  test('should handle useEffect hook', () => {
    const sideEffect = { 1: false, 2: false }

    const useEffectHook = ({ id }) => {
      useEffect(() => {
        sideEffect[id] = true
        return () => {
          sideEffect[id] = false
        }
      }, [id])
    }

    const { hydrate, rerender, unmount } = renderHook((id) => useEffectHook({ id }), {
      initialProps: { id: 1 }
    })

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(false)

    hydrate()

    expect(sideEffect[1]).toBe(true)
    expect(sideEffect[2]).toBe(false)
  })
})
```
