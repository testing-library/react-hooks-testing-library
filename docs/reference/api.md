---
name: API
menu: Reference
route: '/reference/api'
---

# API

## `renderHook(callback[, options])`

Renders a test component that will call the provided `callback`, including any hooks it calls, every time it renders.

> _Note: `testHook` has been renamed to `renderHook`. `testHook` will continue work in the current version with a deprecation warning, but will be removed in a future version._
>
> **_You should update any usages of `testHook` to use `renderHook` instead._**

### Arguments

- `callback` (`function([props])`) - function to call each render. This function should call one or more hooks for testing
  - The `props` passed into the callback will be the `initialProps` provided in the `options` until new props are provided by a `rerender` call
- `options` (`object`)
  - `initialProps` (`object`) - the initial values to pass to the `callback` function
  - `wrapper` (`component`) - pass a React component to wrap the test component
    - This is usually used to add context providers from `React.createContext` for the hook access with `useContext`

### Returns

- `result` (`object`)
  - `current` (`any`) - the return value of the `callback` function
  - `error` (`Error`) - the error that was thrown if the `callback` function threw an error during rendering
- `waitForNextUpdate` (`function`) - returns a `Promise` that resolves the next time the hook renders, commonly when state is updated as the result of a asynchronous action
- `rerender` (`function([newProps])`) - function to rerender the test component including any hooks called in the `callback` function
  - If `newProps` are passed, the will replace the `initialProps` passed the the `callback` function for future renders
- `unmount` (`function()`) - function to unmount the test component, commonly used to trigger cleanup effects for `useEffect` hooks

## `act(callback)`

This is the same [`act` function](https://testing-library.com/docs/react-testing-library/api#act) that is exported by `react-testing-library`.
