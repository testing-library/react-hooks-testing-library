---
name: Server-Side Rendering
menu: Usage
route: '/usage/ssr'
---

# Server-Side Rendering (SSR)

## Setup

To test how your hook will behave when rendered on the server, you can change your import to the use
the `server` module:

```ts
import { renderHook } from '@testing-library/react-hooks/server'
```

> SSR is only available when using the `react-dom` renderer. Please refer to the
> [installation guide](/installation#peer-dependencies) for instructions and supported versions.

This import has the same [API as the standard import](/reference/api) except the behaviour changes
to use SSR semantics.

## Hydration

The result of rendering you hook is static are not interactive until it is hydrated into the DOM.
This can be done using the `hydrate` function that is returned from `renderHook`.

Consider the `useCounter` example from the [Basic Hooks section](/usage/basic-hooks):

```js
import { useState, useCallback } from 'react'

export default function useCounter() {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => setCount((x) => x + 1), [])
  return { count, increment }
}
```

If we try to call `increment` immediately after server rendering, nothing happens and the hook is
not interactive:

```js
import { renderHook, act } from '@testing-library/react-hooks/server'
import useCounter from './useCounter'

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter(0))

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1) // fails as result.current.count is still 0
})
```

We can make the hook interactive by calling the `hydrate` function that is returned from
`renderHook`:

```js
import { renderHook, act } from '@testing-library/react-hooks/server'
import useCounter from './useCounter'

test('should increment counter', () => {
  const { result, hydrate } = renderHook(() => useCounter(0))

  hydrate()

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1) // now it passes
})
```

Anything that causes the hook's state to change will not work until `hydrate` is called. This
includes both the [`rerender`](/reference/api#rerender) and [`unmount`](/reference/api#unmount)
functionality.

### Effects

Another caveat of SSR is that `useEffect` and `useLayoutEffect` hooks, by design, do not run on when
rendering.

Consider this `useTimer` hook:

```js
import { useState, useCallback, useEffect } from 'react'

export default function useTimer() {
  const [count, setCount] = useState(0)
  const reset = useCallback(() => setCount(0), [])
  useEffect(() => {
    const intervalId = setInterval(() => setCount((c) => c + 1, 1000))
    return () => {
      clearInterval(intervalId)
    }
  })
  return { count, reset }
}
```

Upon initial render, the interval will not start:

```js
import { renderHook, act } from '@testing-library/react-hooks/server'
import useTimer from './useTimer'

test('should start the timer', async () => {
  const { result, waitForValueToChange } = renderHook(() => useTimer(0))

  await waitForValueToChange(() => result.current.count) // times out as the value never changes

  expect(result.current.count).toBe(1) // fails as result.current.count is still 0
})
```

Similarly to updating the hooks state, the effect will start after `hydrate` is called:

```js
import { renderHook, act } from '@testing-library/react-hooks/server'
import useTimer from './useTimer'

test('should start the timer', async () => {
  const { result, hydrate, waitForValueToChange } = renderHook(() => useTimer(0))

  hydrate()

  await waitForValueToChange(() => result.current.count) // now resolves when the interval fires

  expect(result.current.count).toBe(1)
})
```
