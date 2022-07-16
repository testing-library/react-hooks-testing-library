---
name: API Reference
route: '/reference/api'
---

# API

`react-hooks-testing-library` exports the following methods:

- [`renderHook`](/reference/api#renderhook)
- [`act`](/reference/api#act)
- [`cleanup`](/reference/api#cleanup)
- [`addCleanup`](/reference/api#addcleanup)
- [`removeCleanup`](/reference/api#removecleanup)
- [`suppressErrorOutput`](/reference/api#manually-suppress-output)

---

## `renderHook`

```ts
function renderHook(callback: (props?: any) => any, options?: RenderHookOptions): RenderHookResult
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

The initial values to pass as `props` to the `callback` function of `renderHook`.

### `wrapper`

A React component to wrap the test component in when rendering. This is usually used to add context
providers from `React.createContext` for the hook to access with `useContext`. `initialProps` and
props subsequently set by `rerender` will be provided to the wrapper.

## `renderHook` Result

The `renderHook` function returns an object that has the following properties:

### `result`

```ts
{
  all: Array<any>
  current: any,
  error: Error
}
```

The `current` value of the `result` will reflect the latest of whatever is returned from the
`callback` passed to `renderHook`. Any thrown values from the latest call will be reflected in the
`error` value of the `result`. The `all` value is an array containing all the returns (including the
most recent) from the callback. These could be `result` or an `error` depending on what the callback
returned at the time.

### `rerender`

```ts
function rerender(newProps?: any): void
```

A function to rerender the test component, causing any hooks to be recalculated. If `newProps` are
passed, they will replace the `callback` function's `initialProps` for subsequent rerenders.

### `unmount`

```ts
function unmount(): void
```

A function to unmount the test component. This is commonly used to trigger cleanup effects for
`useEffect` hooks.

### `hydrate`

```ts
function hydrate(): void
```

> This is only used when using the `server` module. See [SSR](/usage/ssr) for more information on
> server-side rendering your hooks.

A function to hydrate a server rendered component into the DOM. This is required before you can
interact with the hook, whether that is an `act` or `rerender` call. Effects created using
`useEffect` or `useLayoutEffect` are also not run on server rendered hooks until `hydrate` is
called.

### `...asyncUtils`

Utilities to assist with testing asynchronous behaviour. See the
[Async Utils](/reference/api#async-utilities) section for more details.

---

## `act`

This is the same [`act` function](https://reactjs.org/docs/test-utils.html#act) function that is
exported from your [chosen renderer](/installation#renderer).

---

## `cleanup`

```ts
function cleanup(): Promise<void>
```

Unmounts any rendered hooks rendered with `renderHook`, ensuring all effects have been flushed. Any
callbacks added with [`addCleanup`](<(/reference/api#addCleanup).>) will also be called when
`cleanup` is run.

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

Alternatively, you can change your test to import from `@testing-library/react-hooks/pure` (or any
of the [other non-pure imports](/installation#pure-imports)) instead of the regular imports.

```diff
- import { renderHook, cleanup, act } from '@testing-library/react-hooks'
+ import { renderHook, cleanup, act } from '@testing-library/react-hooks/pure'
```

If neither of these approaches are suitable, setting the `RHTL_SKIP_AUTO_CLEANUP` environment
variable to `true` before importing `@testing-library/react-hooks` will also disable this feature.

---

## `addCleanup`

```ts
function addCleanup(callback: () => void | Promise<void>): (): void
```

Add a callback to be called during [`cleanup`](/reference/api#cleanup), returning a function to
remove the cleanup if is no longer required. Cleanups are called in reverse order to being added.
This is usually only relevant when wanting a cleanup to run after the component has been unmounted.

If the provided callback is an `async` function or returns a promise, `cleanup` will wait for it to
be resolved before moving onto the next cleanup callback.

> Please note that any cleanups added using `addCleanup` are removed after `cleanup` is called. For
> cleanups that need to run with every test, it is advised to add them in a `beforeEach` block (or
> equivalent for your test runner).

## `removeCleanup`

```ts
function removeCleanup(callback: () => void | Promise<void>): void
```

Removes a cleanup callback previously added with [`addCleanup`](/reference/api#addCleanup). Once
removed, the provided callback will no longer execute as part of running
[`cleanup`](/reference/api#cleanup).

---

## Async Utilities

### `waitForNextUpdate`

```ts
function waitForNextUpdate(options?: { timeout?: number | false }): Promise<void>
```

Returns a `Promise` that resolves the next time the hook renders, commonly when state is updated as
the result of an asynchronous update.

#### `timeout`

_Default: 1000_

The maximum amount of time in milliseconds (ms) to wait.

### `waitFor`

```ts
function waitFor(
  callback: () => boolean | void,
  options?: {
    interval?: number | false
    timeout?: number | false
  }
): Promise<void>
```

Returns a `Promise` that resolves if the provided callback executes without exception and returns a
truthy or `undefined` value. It is safe to use the [`result` of `renderHook`](/reference/api#result)
in the callback to perform assertion or to test values.

#### `interval`

_Default: 50_

The amount of time in milliseconds (ms) to wait between checks of the callback if no renders occur.
Interval checking is disabled if `interval` is not provided as a `falsy`.

#### `timeout`

_Default: 1000_

The maximum amount of time in milliseconds (ms) to wait.

### `waitForValueToChange`

```ts
function waitForValueToChange(
  selector: () => any,
  options?: {
    interval?: number | false
    timeout?: number | false
  }
): Promise<void>
```

Returns a `Promise` that resolves if the value returned from the provided selector changes. It is
expected that the [`result` of `renderHook`](/reference/api#result) will be used to select the value
for comparison.

#### `interval`

_Default: 50_

The amount of time in milliseconds (ms) to wait between checks of the callback if no renders occur.
Interval checking is disabled if `interval` is not provided as a `falsy`.

#### `timeout`

_Default: 1000_

The maximum amount of time in milliseconds (ms) to wait.

---

## `console.error`

In order to catch errors that are produced in all parts of the hook's lifecycle, the test harness
used to wrap the hook call includes an
[Error Boundary](https://reactjs.org/docs/error-boundaries.html) which causes a
[significant amount of output noise](https://reactjs.org/docs/error-boundaries.html#component-stack-traces)
in tests.

To keep test output clean, we patch `console.error` when importing from
`@testing-library/react-hooks` (or any of the [other non-pure imports](/installation#pure-imports))
to filter out the unnecessary logging and restore the original version during cleanup. This
side-effect can affect tests that also patch `console.error` (e.g. to assert a specific error
message get logged) by replacing their custom implementation as well.

> Please note that this is done automatically if the testing framework you're using supports the
> `beforeEach` and `afterEach` global (like Jest, mocha and Jasmine). If not, you will need to do
> [manual suppression](/reference/api#manually-suppress-output) around the test run.

### Disabling `console.error` filtering

Importing `@testing-library/react-hooks/disable-error-filtering.js` in test setup files disable the
error filtering feature and not patch `console.error` in any way.

For example, in [Jest](https://jestjs.io/) this can be added to your
[Jest config](https://jestjs.io/docs/configuration):

```js
module.exports = {
  setupFilesAfterEnv: [
    '@testing-library/react-hooks/disable-error-filtering.js'
    // other setup files
  ]
}
```

Alternatively, you can change your test to import from `@testing-library/react-hooks` (or any of the
[other non-pure imports](/installation#pure-imports)) instead of the regular imports.

```diff
- import { renderHook, cleanup, act } from '@testing-library/react-hooks'
+ import { renderHook, cleanup, act } from '@testing-library/react-hooks/pure'
```

If neither of these approaches are suitable, setting the `RHTL_DISABLE_ERROR_FILTERING` environment
variable to `true` before importing `@testing-library/react-hooks` will also disable this feature.

> Please note that this may result in a significant amount of additional logging in your test
> output.

### Manually suppress output

If you are using [a pure import](/installation#pure-imports), you are running your tests in an
environment that does not support `beforeEach` and `afterEach`, or if the automatic suppression is
not available to you for some other reason, then you can use the `suppressErrorOutput` export to
manually start and stop suppressing the output:

```ts
import { renderHook, suppressErrorOutput } from '@testing-library/react-hooks/pure'

test('should handle thrown error', () => {
  const restoreConsole = suppressErrorOutput()

  try {
    const { result } = renderHook(() => useCounter())
    expect(result.error).toBeDefined()
  } finally {
    restoreConsole()
  }
})
```
