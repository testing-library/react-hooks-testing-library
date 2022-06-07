# React 18 Migration guide

React Hooks Testing Library will not be updated to support React 18. Instead, React Testing Library
and React Native Testing Library are including their own `renderHook` APIs with the goal of
providing more unified and consistent experience for our users.

In general, the new `renderHook` functions are largely compatible with the React Hooks Testing
Library version and many users will just be able to update their imports, but there are a few
notable exceptions as well as some scenarios which are no longer supported at all. This guide will
outline what has changed and what has been dropped and some strategies to smooth the transition.

## Choose your renderer

React Hooks Testing Library supported three different React renderers that could be used for testing
hooks in different types of environments, as well as a auto-detect import that would attempt to
resolve whichever renderer happened to be installed. `renderHook` could be imported using any of the
following modules:

1. `@testing-library/react-hooks/dom` (`react-dom`), for testing hooks in a web environment
2. `@testing-library/react-hooks/native` (`react-test-renderer`), for testing hooks in a
   `react-native` environment
3. `@testing-library/react-hooks/server` (`react-dom/server`), for testing hooks in a SSR
   environment
4. `@testing-library/react-hooks`, auto-detect either the `dom` or `native` variants based on the
   installed renderer

Depending on which renderer you were using will determine which package to migrate to.

- `@testing-library/react-hooks/dom`

  ```sh
  npm uninstall @testing-library/react-hooks
  npm install --save-dev @testing-library/react
  ```

  ```diff
  -import { renderHook } from '@testing-library/react-hooks`;
  +import { renderHook } from '@testing-library/react';
  ```

- `@testing-library/react-hooks/native`

  ```sh
  npm uninstall @testing-library/react-hooks
  npm install --save-dev @testing-library/react-native
  ```

  ```diff
  -import { renderHook } from '@testing-library/react-hooks`;
  +import { renderHook } from '@testing-library/react-native';
  ```

- `@testing-library/react-hooks/server`

  > There is not an equivalent renderer for this import in the `@testing-library/react` package. You
  > will need to wrap the hook in your own test component and render it with `react-dom/server`
  > manually.

- `@testing-library/react-hooks`
  > If your project is a `react-native` app, follow the instructions above for
  > `@testing-library/react-hooks/native`, otherwise follow the instructions for
  > `@testing-library/react-hooks/dom`.

## `waitFor`

This utility should now be imported at the same time as `renderHook` instead of being accessed from
the `renderHook` return value.

```diff
-import { renderHook } from '@testing-library/react-hooks`;
+import { renderHook, waitFor } from '@testing-library/react';
+// or import { renderHook, waitFor } from '@testing-library/react-native';
```

```diff
-const { result, waitFor } = renderHook(() => useHook());
+const { result } = renderHook(() => useHook());
```

The React Hooks Testing Library version of `waitFor` supported either returning a `boolean` value or
using assertions (e.g. `expect`) to wait for the condition to be met. Both the React Testing Library
and React Native Testing Library version only support the assertion style for their `waitFor`
utilities. If you were using the `boolean` style, you will need to update the callbacks like so:

```diff
-await waitFor(() => result.current.state !== 'loading');
+await waitFor(() => {
+  expect(result.current.state).not.toBe('loading');
+});
```

It should also be noted that the React Hooks Testing Library version of `waitFor` would recheck the
condition any time the hook triggered a render, as well as on a periodic interval but due to
implementation differences of `waitFor` in the new version, the condition will only be checked on
the interval. If your condition can potentially be missed by waiting for the default interval time
(100ms), you may need to adjust the timings using the `interval` option:

```diff
await waitFor(() => {
  expect(result.current.state).not.toBe('loading');
-});
+}, { interval: 20 });
```

## `waitForValueToChange`

This utility has not been included in the React Testing Library or React Native Testing Library
APIs. A similar result can be achieved by using `waitFor`:

```diff
-await waitForValueToChange(() => result.current.state);
+const initialValue = result.current.state;
+await waitFor(() => {
+  expect(result.current.state).not.toBe(initialValue);
+});
```

## `waitForNextUpdate`

This utility has not been included in the React Testing Library or React Native Testing Library
APIs. A similar result can be achieved by using `waitFor`:

```diff
-await waitForValueToChange(() => result.current.state);
+const initialValue = result.current;
+await waitFor(() => {
+  expect(result.current).not.toBe(initialValue);
+});
```

Note that this is not quite the same as the previous implementation, which simply waited for the
next render regardless of whether the value of `result.current` has changed or not, but this is more
in line with how the utility was intended to be used. Writing tests that rely on specific timing or
numbers of renders is discouraged in the Testing Library methodology as it focuses too much on
implementation details of the hooks.

## `result.error`

Errors are now thrown directly from `renderHook`, `rerender` and `unmount` calls. If you were
previously using `result.error` to test for error values, you should update your tests to instead
check for thrown errors:

```diff
-const { result } = renderHook(() => useHook());
-expect(result.error).toBe(Error('something expected'));
+expect(() => renderHook(() => useHook())).toThrow(Error('something expected'));
```

There is an edge case that is no longer covered which is when an asynchronous update to a hook
causes the next render to throw an error, e.g.

```ts
function useAsyncValue() {
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAsyncValue()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (error) {
    throw error
  }

  return { loading, value }
}
```

In this scenario, calling `renderHook(() => useAsyncValue())` will not throw any errors. Tests that
need to access an asynchronous error like this can use the `wrapper` option to wrap the hook call in
an error boundary and capture the error there instead:

```diff
+let asyncError = null;
+
+class ErrorBoundary extends React.Component {
+  componentDidCatch(error) {
+    asyncError = error;
+  }
+
+  render() {
+    return !asyncError && this.props.children;
+  }
+ }

-const { result, waitFor } = renderHook(() => useAsyncValue());
+const { result } = renderHook(() => useAsyncValue(), {
+  wrapper: ErrorBoundary,
+});

await waitFor(() => {
- expect(result.error).toEqual(Error('something expected'));
+ expect(asyncError).toEqual(Error('something expected'));
});
```

## `result.all`

The new `renderHook` APIs in React Testing Library and React Native Testing Library have not
included `result.all` as it was deemed to promote testing implementation details. Tests that rely on
`result.all` should be rewritten to just use `result.current` and/or `waitFor` with more emphasis on
testing the value that will be observed by users and not the intermediate values in between
observable results.

## Suspense

Previously, React Hooks Testing Library would automatically wrap the hook call in a `Suspense`
boundary. This functionality has not been replicated in either React Testing Library or React Native
Testing Library so hooks that rely on suspense will need to add their own suspense boundaries using
the `wrapper` option:

```diff
+const SuspenseBoundary = ({ children }) => <Suspense fallback={null}>{children}</Suspense>

-const { result } = renderHook(() => useSuspendingHook());
+const { result } = renderHook(() => useSuspendingHook(), {
+  wrapper: SuspenseBoundary,
+});
```

## `wrapper` Props
