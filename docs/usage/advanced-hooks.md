---
name: Advanced Hooks
menu: Usage
route: '/usage/advanced-hooks'
---

# Advanced Hooks

## Providing Props

Sometimes a hook relies on the props passed to it in order to do it's thing. For example the `useCounter` hook we built in the [Basic Hooks](/usage/basic-hooks) section could easily accept the initial value of the counter:

```js
import { useState, useCallback } from 'react'

export default function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const increment = useCallback(() => setCount((x) => x + 1), [])
  return { count, increment }
}
```

Overriding the `initialValue` prop in out test is as easy as calling the hook with the value we want to use:

```js
import { renderHook, act } from 'react-hooks-testing-library'
import useCounter from './useCounter'

test('should increment counter from custom initial value', () => {
  const { result } = renderHook(() => useCounter(9000))

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(9001)
})
```

### Changing Props

Many of the hook primitives use an array of dependent values to determine when to perform specific actions, such as recalculating an expensive value or running an effect. If we update our `useCounter` hook to have a `reset` function that resets the value to the `initialValue` it might look something like this:

```js
import { useState, useCallback } from 'react'

export default function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const increment = useCallback(() => setCount((x) => x + 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  return { count, increment, reset }
}
```

Now, the only time the `reset` function will be updated is if `initialValue` changes. The most basic way to handle changing the input props of our hook in a test is to simply update the value in a variable and rerender the hook:

```js
import { renderHook, act } from 'react-hooks-testing-library'
import useCounter from './useCounter'

test('should reset counter to updated initial value', () => {
  let initialValue = 0
  const { result, rerender } = renderHook(() => useCounter(initialValue))

  initialValue = 10
  rerender()

  act(() => {
    result.current.reset()
  })

  expect(result.current.count).toBe(10)
})
```

This is fine, but if there are lots of props, it can become a bit difficult to have variables to keep track of them all. Another option is to use the `initialProps` option and `newProps` of `rerender`:

```js
import { renderHook, act } from 'react-hooks-testing-library'
import useCounter from './useCounter'

test('should reset counter to updated initial value', () => {
  const { result, rerender } = renderHook(({ initialValue }) => useCounter(initialValue), {
    initialProps: { initialValue: 0 }
  })

  rerender({ initialValue: 10 })

  act(() => {
    result.current.reset()
  })

  expect(result.current.count).toBe(10)
})
```

Another case where this is useful is when you want limit the scope of the variables being closed over to just be inside the hook callback. The following (contrived) example fails because the `id` value changes for both the setup and cleanup of the `useEffect` call:

```js
import { useEffect } from 'react'
import { renderHook } from "react-hooks-testing-library"
import sideEffect from './sideEffect

test("should clean up side effect", () => {
  let id = "first"
  const { rerender } = renderHook(() => {
    useEffect(() => {
      sideEffect.start(id)
      return () => {
        sideEffect.stop(id) // this id will get the new value when the effect is cleaned up
      }
    }, [id])
  })

  id = "second"
  rerender()

  expect(sideEffect.get("first")).toBe(false)
  expect(sideEffect.get("second")).toBe(true)
})
```

By using the `initialProps` and `newProps` the captured `id` value from the first render is used to clean up the effect, allowing the test to pass as expected:

```js
import { useEffect } from 'react'
import { renderHook } from "react-hooks-testing-library"
import sideEffect from './sideEffect

test("should clean up side effect", () => {
  const { rerender } = renderHook(
    ({ id }) => {
      useEffect(() => {
      sideEffect.start(id)
      return () => {
        sideEffect.stop(id) // this id will get the new value when the effect is cleaned up
      }
    }, [id])
    },
    {
      initialProps: { id: "first" }
    }
  )

  rerender({ id: "second" })

  expect(thing.get("first")).toBe(false)
  expect(thing.get("second")).toBe(true)
})
```

This is a fairly obscure case, so pick the method that fits best for you and your test.
