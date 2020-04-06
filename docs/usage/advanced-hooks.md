---
name: Advanced Hooks
menu: Usage
route: '/usage/advanced-hooks'
---

# Advanced Hooks

## Context

Often, a hook is going to need a value out of context. The `useContext` hook is really good for
this, but it will often require a `Provider` to be wrapped around the component using the hook. We
can use the `wrapper` option for `renderHook` to do just that.

Let's change the `useCounter` example from the [Basic Hooks section](/usage/basic-hooks) to get a
`step` value from context and build a `CounterStepProvider` that allows us to set the value:

```js
import React, { useState, useContext, useCallback } from 'react'

const CounterStepContext = React.createContext(1)

export const CounterStepProvider = ({ step, children }) => (
  <CounterStepContext.Provider value={step}>{children}</CounterStepContext.Provider>
)

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const step = useContext(CounterStepContext)
  const increment = useCallback(() => setCount((x) => x + step), [step])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  return { count, increment, reset }
}
```

In our test, we simply use `CounterStepProvider` as the `wrapper` when rendering the hook:

```js
import { renderHook, act } from '@testing-library/react-hooks'
import { CounterStepProvider, useCounter } from './counter'

test('should use custom step when incrementing', () => {
  const wrapper = ({ children }) => <CounterStepProvider step={2}>{children}</CounterStepProvider>
  const { result } = renderHook(() => useCounter(), { wrapper })

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(2)
})
```

The `wrapper` option will accept any React component, but it **must** render `children` in order for
the test component to render and the hook to execute.

### ESLint Warning

It can be very tempting to try to inline the `wrapper` variable into the `renderHook` line, and
there is nothing technically wrong with doing that, but if you are using
[`eslint`](https://eslint.org/) and
[`eslint-plugin-react`](https://github.com/yannickcr/eslint-plugin-react), you will see a linting
error that says:

> Component definition is missing display name

This is caused by the `react/display-name` rule and although it's unlikely to cause you any issues,
it's best to take steps to remove it. If you feel strongly about not having a separate `wrapper`
variable, you can disable the error for the test file by adding a special comment to the top of the
file:

```js
/* eslint-disable react/display-name */

import { renderHook, act } from '@testing-library/react-hooks'
import { CounterStepProvider, useCounter } from './counter'

test('should use custom step when incrementing', () => {
  const { result } = renderHook(() => useCounter(), {
    wrapper: ({ children }) => <CounterStepProvider step={2}>{children}</CounterStepProvider>
  })

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(2)
})
```

Similar techniques can be used to disable the error for just the specific line, or for the whole
project, but please take the time to understand the impact that disabling linting rules will have on
you, your team, and your project.

## Async

Sometimes, a hook can trigger asynchronous updates that will not be immediately reflected in the
`result.current` value. Luckily, `renderHook` returns some utilities that allows the test to wait
for the hook to update using `async/await` (or just promise callbacks if you prefer). The most basic
async utility is called `waitForNextUpdate`.

Let's further extend `useCounter` to have an `incrementAsync` callback that will update the `count`
after `100ms`:

```js
import React, { useState, useContext, useCallback } from 'react'

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const step = useContext(CounterStepContext)
  const increment = useCallback(() => setCount((x) => x + step), [step])
  const incrementAsync = useCallback(() => setTimeout(increment, 100), [increment])
  const reset = useCallback(() => setCount(initialValue), [initialValue])
  return { count, increment, incrementAsync, reset }
}
```

To test `incrementAsync` we need to `await waitForNextUpdate()` before making our assertions:

```js
import { renderHook } from '@testing-library/react-hooks'
import { useCounter } from './counter'

test('should increment counter after delay', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useCounter())

  result.current.incrementAsync()

  await waitForNextUpdate()

  expect(result.current.count).toBe(1)
})
```

Wrapping `incrementAsync` in `act()` is not necessary since the state updates happen
asynchronously during `await waitForNextUpdate()`. The async utilities automatically wrap the
waiting code in the asynchronous `act()` wrapper.

For more details on the the other async utilities, please refer to the
[API Reference](/reference/api#asyncutils).

### Suspense

All the [async utilities](/reference/api#async-utilities) will also wait for hooks that suspends
using [React's `Suspense`](https://reactjs.org/docs/react-api.html#reactsuspense) functionality to
complete rendering.

## Errors

If you need to test that a hook throws the errors you expect it to, you can use `result.error` to
access an error that may have been thrown in the previous render. For example, we could make the
`useCounter` hook threw an error if the count reached a specific value:

```js
import React, { useState, useContext, useCallback } from 'react'

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  const step = useContext(CounterStepContext)
  const increment = useCallback(() => setCount((x) => x + step), [step])
  const incrementAsync = useCallback(() => setTimeout(increment, 100), [increment])
  const reset = useCallback(() => setCount(initialValue), [initialValue])

  if (count > 9000) {
    throw Error("It's over 9000!")
  }

  return { count, increment, incrementAsync, reset }
}
```

```js
import { renderHook, act } from '@testing-library/react-hooks'
import { useCounter } from './counter'

it('should throw when over 9000', () => {
  const { result } = renderHook(() => useCounter(9000))

  act(() => {
    result.current.increment()
  }

  expect(result.error).toEqual(Error("It's over 9000!"))
})
```
