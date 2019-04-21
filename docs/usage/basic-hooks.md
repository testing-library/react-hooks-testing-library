---
name: Basic Hooks
menu: Usage
route: '/usage/basic-hooks'
---

# Basic Hooks

## Rendering

Imagine we have a simple hook that we want to test:

```js
import { useState, useCallback } from 'react'

export default function useCounter() {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => setCount(count + 1), [count])
  return { count, increment }
}
```

To test `useCounter` we need to render it using the `renderHook` function to provided by `react-hooks-testing-library`:

```js
import { renderHook } from 'react-hooks-testing-library'
import useCounter from './useCounter'

test('should use counter', () => {
  const { result } = renderHook(() => useCounter())

  expect(result.current.count).toBe(0)
  expect(typeof result.current.increment).toBe('function')
})
```

As you can see, the result's current value matches what is returned by our hook.

## Updates

The test shown above is great and all, but it doesn't actually test what we want to use the counter for, i.e. counting. We can easily improve this test by calling the `increment` function and checking that the `count` value increases:

```js
import { renderHook, act } from 'react-hooks-testing-library'
import useCounter from './useCounter'

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter())

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})
```

After `increment` is called, the current `count` value now reflects the new value returned by our hook.

You may have also noticed that we also wrapped the `increment` call in `act`. This utility simulates how our hook will act in a browser, allowing us to update the values within it. For more details on `act`, please see the [React documentation](https://fb.me/react-wrap-tests-with-act).

So there we have it, the first test for our `useCounter` hook.
