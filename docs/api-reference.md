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

The `renderHook` function accepts the following arguments:

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

The `renderHook` function returns an object that has the following properties:

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
passed, they will replace the `callback` function's `initialProps` for subsequent rerenders.

### `unmount`

```js
function unmount(): void
```

A function to unmount the test component. This is commonly used to trigger cleanup effects for
`useEffect` hooks.

### `...asyncUtils`

Utilities to assist with testing asynchronous behaviour. See the
[Async Utils](/reference/api#async-utilities) section for more details.

---

## `act`

This is the same [`act` function](https://reactjs.org/docs/test-utils.html#act) that is exported by
`react-test-renderer`.

---

## `cleanup`

```js
function cleanup: Promise<void>
```

Unmounts any rendered hooks rendered with `renderHook`, ensuring all effects have been flushed.

> Please note that this is done automatically if the testing framework you're using supports the
> `afterEach` global (like Jest, mocha and Jasmine). If not, you will need to do manual cleanups
> after each test.

The `cleanup` function should be called after each test to ensure that previously rendered hooks
will not have any unintended side-effects on the following tests.

### Skipping Auto-Cleanup

Importing `@testing-library/react-hooks/dont-cleanup-after-each.js` in test setup files will disable
the auto-cleanup feature.

For example, in [Jest](https://jestjs.io/) this can be added to your
[Jest config](https://jestjs.io/docs/configuration):

```js
module.exports = {
  setupFilesAfterEnv: [
    '@testing-library/react-hooks/dont-cleanup-after-each.js'
    // other setup files
  ]
}
```

Alternatively, you can change your test to import from `@testing-library/react-hooks/pure` instead
of the regular imports.

```diff
- import { renderHook, cleanup, act } from '@testing-library/react-hooks'
+ import { renderHook, cleanup, act } from '@testing-library/react-hooks/pure'
```

If neither of these approaches are suitable, setting the `RHTL_SKIP_AUTO_CLEANUP` environment
variable to `true` before importing `@testing-library/react-hooks` will also disable this feature.

---

## Async Utilities

### `waitForNextUpdate`

```js
function waitForNextUpdate(options?: WaitOptions): Promise<void>
```

Returns a `Promise` that resolves the next time the hook renders, commonly when state is updated as
the result of an asynchronous update.

See the [`wait` Options](/reference/api#wait-options) section for more details on the available
`options`.

### `wait`

```js
function wait(callback: function(): boolean|void, options?: WaitOptions): Promise<void>
```

Returns a `Promise` that resolves if the provided callback executes without exception and returns a
truthy or `undefined` value. It is safe to use the [`result` of `renderHook`](/reference/api#result)
in the callback to perform assertion or to test values.

The callback is tested after each render of the hook. By default, errors raised from the callback
will be suppressed (`suppressErrors = true`).

See the [`wait` Options](/reference/api#wait-options) section for more details on the available
`options`.

### `waitForValueToChange`

```js
function waitForValueToChange(selector: function(): any, options?: WaitOptions): Promise<void>
```

Returns a `Promise` that resolves if the value returned from the provided selector changes. It
expected that the [`result` of `renderHook`](/reference/api#result) to select the value for
comparison.

The value is selected for comparison after each render of the hook. By default, errors raised from
selecting the value will not be suppressed (`suppressErrors = false`).

See the [`wait` Options](/reference/api#wait-options) section for more details on the available
`options`.

### `wait` Options

The async utilities accepts the following options:

#### `timeout`

The maximum amount of time in milliseconds (ms) to wait. By default, no timeout is applied.

#### `suppressErrors`

If this option is set to `true`, any errors that occur while waiting are treated as a failed check.
If this option is set to `false`, any errors that occur while waiting cause the promise to be
rejected. Please refer to the [utility descriptions](/reference/api#async-utilities) for the default
values of this option (if applicable).
