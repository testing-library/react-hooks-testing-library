<div align="center">
<h1>react-hooks-testing-library</h1>

<a href="https://www.emojione.com/emoji/1f40f">
  <img
    height="80"
    width="80"
    alt="ram"
    src="https://raw.githubusercontent.com/mpeyper/react-hooks-testing-library/master/other/ram.png"
  />
</a>

<p>Simple component wrapper and utilities for testing React hooks.</p>

</div>

<hr />

<!-- prettier-ignore-start -->

[![Build Status](https://img.shields.io/travis/mpeyper/react-hooks-testing-library.svg?style=flat-square)](https://travis-ci.org/mpeyper/react-hooks-testing-library)
[![codecov](https://img.shields.io/codecov/c/github/mpeyper/react-hooks-testing-library.svg?style=flat-square)](https://codecov.io/gh/mpeyper/react-hooks-testing-library)
[![version](https://img.shields.io/npm/v/react-hooks-testing-library.svg?style=flat-square)](https://www.npmjs.com/package/react-hooks-testing-library)
[![downloads](https://img.shields.io/npm/dm/react-hooks-testing-library.svg?style=flat-square)](http://www.npmtrends.com/react-hooks-testing-library)
[![MIT License](https://img.shields.io/npm/l/react-hooks-testing-library.svg?style=flat-square)](https://github.com/mpeyper/react-hooks-testing-library/blob/master/LICENSE.md)

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](https://github.com/mpeyper/react-hooks-testing-library/blob/master/CODE_OF_CONDUCT.md)

[![Watch on GitHub](https://img.shields.io/github/watchers/mpeyper/react-hooks-testing-library.svg?style=social)](https://github.com/mpeyper/react-hooks-testing-library/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/mpeyper/react-hooks-testing-library.svg?style=social)](https://github.com/mpeyper/react-hooks-testing-library/stargazers)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/mpeyper/react-hooks-testing-library.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20react-hooks-testing-library%20by%20%40mpeyper%20https%3A%2F%2Fgithub.com%2Fmpeyper%2Freact-hooks-testing-library%20%F0%9F%91%8D)

## The problem

You're writing an awesome custom hook and you want to test it, but as soon as you call it you see the following error:

> Invariant Violation: Hooks can only be called inside the body of a function component.

You don't really want to write a component solely for testing this hook and have to work out how you were going to trigger all the various ways the hook can be updated, especially given the complexities of how you've wired the whole thing together.

## The solution

The `react-hooks-testing-library` is built on top of the wonderful [`react-testing-library`](http://npm.im/react-testing-library) to create a simple test harness for React hooks that handles running them within the body of a function component, as well as providing various useful utility functions for updating the inputs and retrieving the outputs of your amazing custom hook.

Using this library, you do not have to concern yourself with how to construct, render or interact with the react component in order to test your hook. You can just use the hook directly and assert the results.

### When to use this library

1. You're writing a library with one or more custom hooks that are not directly tied a component
2. You have a complex hook that is difficult to test through component interactions

### When not to use this library

1. Your hook is defined along side a component and is only used there
2. Your hook is easy to test by just testing the components using it

## Example

```js
// useCounter.js
import { useState } from 'react'

function useCounter(initialCount = 0) {
  const [count, setCount] = useState(initialCount)

  const incrementBy = useCallback((n) => setCount(count + n), [count])
  const decrementBy = useCallback((n) => setCount(count - n), [count])

  return { count, incrementBy, decrementBy }
}

export default useCounter
```

```js
// useCounter.test.js
import { renderHook, cleanup, act } from 'react-hooks-testing-library'
import useCounter from './useCounter'

afterEach(cleanup)

test('should create counter', () => {
  const { result } = renderHook(() => useCounter())

  expect(result.current.count).toBe(0)
})

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter())

  act(() => result.current.incrementBy(1))

  expect(result.current.count).toBe(1)

  act(() => result.current.incrementBy(2))

  expect(result.current.count).toBe(3)
})

test('should decrement counter', () => {
  const { result } = renderHook(() => useCounter())

  act(() => result.current.decrementBy(1))

  expect(result.current.count).toBe(-1)

  act(() => result.current.decrementBy(2))

  expect(result.current.count).toBe(-3)
})
```

## Installation

```sh
npm install --save-dev react-hooks-testing-library
```

## API

### `renderHook(callback[, options])`

Renders a test component that will call the provided `callback`, including any hooks it calls, every time it renders.

> _Note: `testHook` has been renamed to `renderHook`. `testHook` will continue work in the current version with a deprecation warning, but will be removed in a future version._
>
> **_You should update any usages of `testHook` to use `renderHook` instead._**

#### Arguments

- `callback` (`function()`) - function to call each render. This function should call one or more hooks for testing.
- `options` (`object`) - accepts the [same options as `react-testing-library`'s `render` function](https://testing-library.com/docs/react-testing-library/api#render-options), as well as:
  - `initialProps` (`object`) - the initial values to pass to the `callback` function

#### Returns

- `result` (`object`)
  - `current` (`any`) - the return value of the `callback` function
- `waitForNextUpdate` (`function`) - returns a `Promise` that resolves the next time the hook renders, commonly when state is updated as the result of a asynchronous action.
- `rerender` (`function([newProps])`) - function to rerender the test component including any hooks called in the `callback` function. If `newProps` are passed, the will replace the `initialProps` passed the the `callback` function for future renders.
- `unmount` (`function()`) - function to unmount the test component, commonly used to trigger cleanup effects for `useEffect` hooks.

### `cleanup()`

Unmounts any React trees that were mounted with [renderHook](#renderhookcallback-options).

This is the same [`cleanup` function](https://testing-library.com/docs/react-testing-library/api#cleanup) that is exported by `react-testing-library`.

### `act(callback)`

This is the same [`act` function](https://testing-library.com/docs/react-testing-library/api#act) that is exported by `react-testing-library`.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://github.com/mpeyper"><img src="https://avatars0.githubusercontent.com/u/23029903?v=4" width="100px;" alt="Michael Peyper"/><br /><sub><b>Michael Peyper</b></sub></a><br /><a href="https://github.com/mpeyper/react-hooks-testing-library/commits?author=mpeyper" title="Code">💻</a> <a href="#design-mpeyper" title="Design">🎨</a> <a href="https://github.com/mpeyper/react-hooks-testing-library/commits?author=mpeyper" title="Documentation">📖</a> <a href="#ideas-mpeyper" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-mpeyper" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#platform-mpeyper" title="Packaging/porting to new platform">📦</a> <a href="https://github.com/mpeyper/react-hooks-testing-library/commits?author=mpeyper" title="Tests">⚠️</a> <a href="#tool-mpeyper" title="Tools">🔧</a></td><td align="center"><a href="https://github.com/otofu-square"><img src="https://avatars0.githubusercontent.com/u/10118235?v=4" width="100px;" alt="otofu-square"/><br /><sub><b>otofu-square</b></sub></a><br /><a href="https://github.com/mpeyper/react-hooks-testing-library/commits?author=otofu-square" title="Code">💻</a></td><td align="center"><a href="https://github.com/ab18556"><img src="https://avatars2.githubusercontent.com/u/988696?v=4" width="100px;" alt="Patrick P. Henley"/><br /><sub><b>Patrick P. Henley</b></sub></a><br /><a href="#ideas-ab18556" title="Ideas, Planning, & Feedback">🤔</a> <a href="#review-ab18556" title="Reviewed Pull Requests">👀</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Issues

_Looking to contribute? Look for the [Good First Issue](https://github.com/mpeyper/react-hooks-testing-library/issues?utf8=✓&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3A"good+first+issue"+)
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**](https://github.com/mpeyper/react-hooks-testing-library/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Acreated-desc)

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**](https://github.com/mpeyper/react-hooks-testing-library/issues?q=is%3Aissue+sort%3Areactions-%2B1-desc+label%3Aenhancement+is%3Aopen)

### ❓ Questions

For questions related to using the library, you can [raise issue here](https://github.com/mpeyper/react-hooks-testing-library/issues/new), or visit a support community:

- [Reactiflux on Discord](https://www.reactiflux.com/)
- [Stack Overflow](https://stackoverflow.com/)

## LICENSE

MIT
