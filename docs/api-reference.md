---
name: API Reference
route: '/reference/api'
---

# API

`react-hooks-testing-library` exports the following methods:

- [`renderHook`](/reference/api#renderhook)
- [`act`](/reference/api#act)
- [`cleanup`](/reference/api#cleanup)

---

## `renderHook`

```js
function renderHook(
  callback: function(props?: any): any,
  options?: RenderHookOptions
): RenderHookResult
```

Renders a test component that will call the provided `callback`, including any hooks it calls, every
time it renders.

The `renderHook` function accept the following arguments:

### `callback`

The function that is called each `render` of the test component. This function should call one or
more hooks for testing.

The `props` passed into the callback will be the `initialProps` provided in the `options` to
`renderHook`, unless new props are provided by a subsequent `rerender` call.

### `options`

An options object to modify the execution of the `callback` function. See the
[`renderHook` Options](/reference/api#renderhook-options) section for more details.

## `renderHook` Options

The `renderHook` function accepts the following options as the second parameter:

### `initialProps`

The initial values to pass as `props` to the `callback` function of `renderHook.

### `wrapper`

A React component to wrap the test component in when rendering. This is usually used to add context
providers from `React.createContext` for the hook to access with `useContext`.

## `renderHook` Result

The `renderHook` method returns an object that has a following properties:

### `result`

```js
{
  current: any,
  error: Error
}
```

The `current` value or the `result` will reflect whatever is returned from the `callback` passed to
`renderHook`. Any thrown values will be reflected in the `error` value of the `result`.

### `waitForNextUpdate`

```js
function waitForNextUpdate(): Promise<void>
```

- `waitForNextUpdate` (`function`) - returns a `Promise` that resolves the next time the hook
  renders, commonly when state is updated as the result of a asynchronous action

### `rerender`

```js
function rerender(newProps?: any): void
```

A function to rerender the test component, causing any hooks to be recalculated. If `newProps` are
passed, the will replace the `initialProps` passed to the `callback` function for the rerender any
subsequent renders.

### `unmount`

```js
function unmount(): void
```

A function to unmount the test component. This is commonly used to trigger cleanup effects for
`useEffect` hooks.

---

## `act`

This is the same [`act` function](https://reactjs.org/docs/test-utils.html#act) that is exported by
`react-test-renderer`.

---

## `cleanup`

Unmounts any rendered hooks rendered with `renderHook`, ensuring all effects have been flushed.

> Please note that this is done automatically if the testing framework you're using supports the
> `afterEach` global (like mocha, Jest, and Jasmine). If not, you will need to do manual cleanups
> after each test.
>
> Setting the `RHTL_SKIP_AUTO_CLEANUP` environment variable to `true` before the
> `@testing-library/react-hooks` is imported will disable this feature.

```js
async function cleanup: void
```

The `cleanup` function should be called after each test to ensure that previously rendered hooks
will not have any unintended side-effects on the following tests.
