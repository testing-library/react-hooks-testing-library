<div align="center">
<h1>react-hooks-testing-library</h1>

<a href="https://www.emojione.com/emoji/1f40f">
  <img
    height="80"
    width="80"
    alt="ram"
    src="https://raw.githubusercontent.com/testing-library/react-hooks-testing-library/master/other/ram.png"
  />
</a>

<p>Simple and complete React hooks testing utilities that encourage good testing practices.</p>

</div>

<hr />

<!-- prettier-ignore-start -->

[![Build Status](https://img.shields.io/travis/testing-library/react-hooks-testing-library.svg?style=flat-square)](https://travis-ci.org/testing-library/react-hooks-testing-library)
[![codecov](https://img.shields.io/codecov/c/github/testing-library/react-hooks-testing-library.svg?style=flat-square)](https://codecov.io/gh/testing-library/react-hooks-testing-library)
[![version](https://img.shields.io/npm/v/@testing-library/react-hooks.svg?style=flat-square)](https://www.npmjs.com/package/@testing-library/react-hooks)
[![downloads](https://img.shields.io/npm/dm/@testing-library/react-hooks.svg?style=flat-square)](http://www.npmtrends.com/@testing-library/react-hooks)
[![MIT License](https://img.shields.io/npm/l/@testing-library/react-hooks.svg?style=flat-square)](https://github.com/testing-library/react-hooks-testing-library/blob/master/LICENSE.md)

[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](https://github.com/testing-library/react-hooks-testing-library/blob/master/CODE_OF_CONDUCT.md)

[![Watch on GitHub](https://img.shields.io/github/watchers/testing-library/react-hooks-testing-library.svg?style=social)](https://github.com/testing-library/react-hooks-testing-library/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/testing-library/react-hooks-testing-library.svg?style=social)](https://github.com/testing-library/react-hooks-testing-library/stargazers)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/testing-library/react-hooks-testing-library.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20react-hooks-testing-library%20by%20%40testing-library%20https%3A%2F%2Fgithub.com%2Ftesting-library%2Freact-hooks-testing-library%20%F0%9F%91%8D)

## The problem

You're writing an awesome custom hook and you want to test it, but as soon as you call it you see
the following error:

> Invariant Violation: Hooks can only be called inside the body of a function component.

You don't really want to write a component solely for testing this hook and have to work out how you
were going to trigger all the various ways the hook can be updated, especially given the
complexities of how you've wired the whole thing together.

## The solution

The `react-hooks-testing-library` allows you to create a simple test harness for React hooks that
handles running them within the body of a function component, as well as providing various useful
utility functions for updating the inputs and retrieving the outputs of your amazing custom hook.

Similarly to [`react-testing-library`](http://npm.im/@testing-library/react), which this library
draws much of it's inspiration from, it aims to provide a testing experience as close as possible to
natively using your hook from within a real component.

Using this library, you do not have to concern yourself with how to construct, render or interact
with the react component in order to test your hook. You can just use the hook directly and assert
the results.

### When to use this library

1. You're writing a library with one or more custom hooks that are not directly tied a component
2. You have a complex hook that is difficult to test through component interactions

### When not to use this library

1. Your hook is defined along side a component and is only used there
2. Your hook is easy to test by just testing the components using it

## Example

```js
// useCounter.js
import { useState, useCallback } from 'react'

function useCounter() {
  const [count, setCount] = useState(0)

  const increment = useCallback(() => setCount((x) => x + 1), [])
  const decrement = useCallback(() => setCount((x) => x - 1), [])

  return { count, increment, decrement }
}

export default useCounter
```

```js
// useCounter.test.js
import { renderHook, act } from '@testing-library/react-hooks'
import useCounter from './useCounter'

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter())

  act(() => result.current.increment())

  expect(result.current.count).toBe(1)
})

test('should decrement counter', () => {
  const { result } = renderHook(() => useCounter())

  act(() => result.current.decrement())

  expect(result.current.count).toBe(-1)
})
```

## Installation

```sh
npm install --save-dev @testing-library/react-hooks
```

We are using [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) as a
peerDependency, so make sure you have installed this library as well. Install the same version like
you use in react.

```sh
npm install --save-dev react-test-renderer@x.y.z
```

## Documentation

There are some [work-in-progress docs here](https://react-hooks-testing-library.netlify.com/).
Please leave any feedback on them in
[this issue](https://github.com/testing-library/react-hooks-testing-library/issues/19). PRs to
update them are very welcome.

## API

### `renderHook(callback[, options])`

Renders a test component that will call the provided `callback`, including any hooks it calls, every
time it renders.

#### Arguments

- `callback` (`function()`) - function to call each render. This function should call one or more
  hooks for testing.
- `options` (`object`) - accept the following settings:
  - `initialProps` (`object`) - the initial values to pass to the `callback` function
  - `wrapper` (`component`) - pass a React Component as the wrapper option to have it rendered
    around the inner element. This is most useful for creating reusable custom render functions for
    common data providers

#### Returns

- `result` (`object`)
  - `current` (`any`) - the return value of the `callback` function
  - `error` (`Error`) - the error that was thrown if the `callback` function threw an error during
    rendering
- `waitForNextUpdate` (`function`) - returns a `Promise` that resolves the next time the hook
  renders, commonly when state is updated as the result of a asynchronous action.
- `rerender` (`function([newProps])`) - function to rerender the test component including any hooks
  called in the `callback` function. If `newProps` are passed, the will replace the `initialProps`
  passed the the `callback` function for future renders.
- `unmount` (`function()`) - function to unmount the test component, commonly used to trigger
  cleanup effects for `useEffect` hooks.

### `act(callback)`

This is the same
[`act` function](https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks) that
is exported by `react-test-renderer`.

## Contributors

Thanks goes to these wonderful people
([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://github.com/mpeyper"><img src="https://avatars0.githubusercontent.com/u/23029903?v=4" width="100px;" alt="Michael Peyper"/><br /><sub><b>Michael Peyper</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mpeyper" title="Code">💻</a> <a href="#design-mpeyper" title="Design">🎨</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mpeyper" title="Documentation">📖</a> <a href="#ideas-mpeyper" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-mpeyper" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#platform-mpeyper" title="Packaging/porting to new platform">📦</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mpeyper" title="Tests">⚠️</a> <a href="#tool-mpeyper" title="Tools">🔧</a></td><td align="center"><a href="https://github.com/otofu-square"><img src="https://avatars0.githubusercontent.com/u/10118235?v=4" width="100px;" alt="otofu-square"/><br /><sub><b>otofu-square</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=otofu-square" title="Code">💻</a></td><td align="center"><a href="https://github.com/ab18556"><img src="https://avatars2.githubusercontent.com/u/988696?v=4" width="100px;" alt="Patrick P. Henley"/><br /><sub><b>Patrick P. Henley</b></sub></a><br /><a href="#ideas-ab18556" title="Ideas, Planning, & Feedback">🤔</a> <a href="#review-ab18556" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://twitter.com/matiosfm"><img src="https://avatars3.githubusercontent.com/u/7120471?v=4" width="100px;" alt="Matheus Marques"/><br /><sub><b>Matheus Marques</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=marquesm91" title="Code">💻</a></td><td align="center"><a href="https://ca.linkedin.com/in/dhruvmpatel"><img src="https://avatars1.githubusercontent.com/u/19353311?v=4" width="100px;" alt="Dhruv Patel"/><br /><sub><b>Dhruv Patel</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/issues?q=author%3Adhruv-m-patel" title="Bug reports">🐛</a> <a href="#review-dhruv-m-patel" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://ntucker.true.io"><img src="https://avatars0.githubusercontent.com/u/866147?v=4" width="100px;" alt="Nathaniel Tucker"/><br /><sub><b>Nathaniel Tucker</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/issues?q=author%3Antucker" title="Bug reports">🐛</a> <a href="#review-ntucker" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://github.com/sgrishchenko"><img src="https://avatars3.githubusercontent.com/u/15995890?v=4" width="100px;" alt="Sergei Grishchenko"/><br /><sub><b>Sergei Grishchenko</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=sgrishchenko" title="Code">💻</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=sgrishchenko" title="Documentation">📖</a> <a href="#ideas-sgrishchenko" title="Ideas, Planning, & Feedback">🤔</a></td></tr><tr><td align="center"><a href="https://github.com/josepot"><img src="https://avatars1.githubusercontent.com/u/8620144?v=4" width="100px;" alt="Josep M Sobrepere"/><br /><sub><b>Josep M Sobrepere</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=josepot" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/mtinner"><img src="https://avatars0.githubusercontent.com/u/5487448?v=4" width="100px;" alt="Marcel Tinner"/><br /><sub><b>Marcel Tinner</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mtinner" title="Documentation">📖</a></td><td align="center"><a href="https://github.com/FredyC"><img src="https://avatars0.githubusercontent.com/u/1096340?v=4" width="100px;" alt="Daniel K."/><br /><sub><b>Daniel K.</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/issues?q=author%3AFredyC" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=FredyC" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors)
specification. Contributions of any kind welcome!

## Issues

_Looking to contribute? Look for the
[Good First Issue](https://github.com/testing-library/react-hooks-testing-library/issues?utf8=✓&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3A"good+first+issue"+)
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**](https://github.com/testing-library/react-hooks-testing-library/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Acreated-desc)

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding a 👍. This helps
maintainers prioritize what to work on.

[**See Feature Requests**](https://github.com/testing-library/react-hooks-testing-library/issues?q=is%3Aissue+sort%3Areactions-%2B1-desc+label%3Aenhancement+is%3Aopen)

### ❓ Questions

For questions related to using the library, you can
[raise issue here](https://github.com/testing-library/react-hooks-testing-library/issues/new), or
visit a support community:

- [Reactiflux on Discord](https://www.reactiflux.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-hooks-testing-library)

## LICENSE

MIT
