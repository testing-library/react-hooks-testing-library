---
name: API Reference
route: '/reference/api'
---

# API

`react-hooks-testing-library` exports the following methods:

- [`renderHook`](/reference/api#renderhook)
- [`act`](/reference/api#act)

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

### `options` (Optional)

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

### `...asyncUtils`

Utilities to assist with testing asynchronous behaviour. See the
[Async Utils](/reference/api#async-utils) section for more details.

---

## `act`

This is the same [`act` function](https://reactjs.org/docs/test-utils.html#act) that is exported by
`react-test-renderer`.

---

## Async Utilities

### `wait`

```js
function wait(callback: function(): boolean|void, options?: WaitOptions): Promise<void>
```

Returns a `Promise` that resolves if the provided callback executes without exception and returns a
truthy or `undefined` value. The callback is tested after each render of the hook.

It is safe to use the [`result` of `renderHook`](/reference/api#result) in the callback to perform
assertion or to test values.

See the [`wait` Options](/reference/api#wait-options) section for more details on the optional
`options` parameter.

### `waitForNextUpdate`

```js
function waitForNextUpdate(options?: WaitOptions): Promise<void>
```

Returns a `Promise` that resolves the next time the hook renders, commonly when state is updated as
the result of an asynchronous update.

See the [`wait` Options](/reference/api#wait-options) section for more details on the optional
`options` parameter.

### `wait` Options

The async utilities accepts the following options:

#### `timeout`

The maximum amount of time in milliseconds (ms) to wait. By default, no timeout is applied.
