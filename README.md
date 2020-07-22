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

  <br />
  <a href="https://react-hooks-testing-library.com/"><strong>Read The Docs</strong></a>
  <br />
</div>

<hr />

<!-- prettier-ignore-start -->

[![Build Status](https://img.shields.io/travis/testing-library/react-hooks-testing-library.svg?style=flat-square)](https://travis-ci.org/testing-library/react-hooks-testing-library)
[![codecov](https://img.shields.io/codecov/c/github/testing-library/react-hooks-testing-library.svg?style=flat-square)](https://codecov.io/gh/testing-library/react-hooks-testing-library)
[![version](https://img.shields.io/npm/v/@testing-library/react-hooks.svg?style=flat-square)](https://www.npmjs.com/package/@testing-library/react-hooks)
[![downloads](https://img.shields.io/npm/dm/@testing-library/react-hooks.svg?style=flat-square)](http://www.npmtrends.com/@testing-library/react-hooks)
[![MIT License](https://img.shields.io/npm/l/@testing-library/react-hooks.svg?style=flat-square)](https://github.com/testing-library/react-hooks-testing-library/blob/master/LICENSE.md)

[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](https://github.com/testing-library/react-hooks-testing-library/blob/master/CODE_OF_CONDUCT.md)
[![Netlify Status](https://api.netlify.com/api/v1/badges/9a8f27a5-df38-4910-a248-4908b1ba29a7/deploy-status)](https://app.netlify.com/sites/react-hooks-testing-library/deploys)
[![Discord](https://img.shields.io/discord/723559267868737556.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square)](https://discord.gg/c6JN9fM)

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
This library aims to provide a testing experience as close as possible to natively using your hook
from within a real component.

Using this library, you do not have to concern yourself with how to construct, render or interact
with the react component in order to test your hook. You can just use the hook directly and assert
the results.

## When to use this library

1. You're writing a library with one or more custom hooks that are not directly tied to a component
2. You have a complex hook that is difficult to test through component interactions

## When not to use this library

1. Your hook is defined alongside a component and is only used there
2. Your hook is easy to test by just testing the components using it

## Example

### `useCounter.js`

```js
import { useState, useCallback } from 'react'

function useCounter() {
  const [count, setCount] = useState(0)

  const increment = useCallback(() => setCount((x) => x + 1), [])

  return { count, increment }
}

export default useCounter
```

### `useCounter.test.js`

```js
import { renderHook, act } from '@testing-library/react-hooks'
import useCounter from './useCounter'

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter())

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})
```

More advanced usage can be found in the
[documentation](https://react-hooks-testing-library.com/usage/basic-hooks).

## Installation

```sh
npm install --save-dev @testing-library/react-hooks
```

### Peer Dependencies

`react-hooks-testing-library` does not come bundled with a version of
[`react`](https://www.npmjs.com/package/react) or
[`react-test-renderer`](https://www.npmjs.com/package/react-test-renderer) to allow you to install
the specific version you want to test against. Generally, the installed versions for `react` and
`react-test-renderer` should have matching versions:

```sh
npm install react@^16.9.0
npm install --save-dev react-test-renderer@^16.9.0
```

> **NOTE: The minimum supported version of `react` and `react-test-renderer` is `^16.9.0`.**

## API

See the [API reference](https://react-hooks-testing-library.com/reference/api).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/mpeyper"><img src="https://avatars0.githubusercontent.com/u/23029903?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Peyper</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mpeyper" title="Code">💻</a> <a href="#design-mpeyper" title="Design">🎨</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mpeyper" title="Documentation">📖</a> <a href="#ideas-mpeyper" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-mpeyper" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#platform-mpeyper" title="Packaging/porting to new platform">📦</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mpeyper" title="Tests">⚠️</a> <a href="#tool-mpeyper" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/otofu-square"><img src="https://avatars0.githubusercontent.com/u/10118235?v=4?s=100" width="100px;" alt=""/><br /><sub><b>otofu-square</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=otofu-square" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ab18556"><img src="https://avatars2.githubusercontent.com/u/988696?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Patrick P. Henley</b></sub></a><br /><a href="#ideas-ab18556" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/react-hooks-testing-library/pulls?q=is%3Apr+reviewed-by%3Aab18556" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://twitter.com/matiosfm"><img src="https://avatars3.githubusercontent.com/u/7120471?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matheus Marques</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=marquesm91" title="Code">💻</a></td>
    <td align="center"><a href="https://ca.linkedin.com/in/dhruvmpatel"><img src="https://avatars1.githubusercontent.com/u/19353311?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dhruv Patel</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/issues?q=author%3Adhruv-m-patel" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/react-hooks-testing-library/pulls?q=is%3Apr+reviewed-by%3Adhruv-m-patel" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://ntucker.true.io"><img src="https://avatars0.githubusercontent.com/u/866147?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nathaniel Tucker</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/issues?q=author%3Antucker" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/react-hooks-testing-library/pulls?q=is%3Apr+reviewed-by%3Antucker" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/sgrishchenko"><img src="https://avatars3.githubusercontent.com/u/15995890?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sergei Grishchenko</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=sgrishchenko" title="Code">💻</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=sgrishchenko" title="Documentation">📖</a> <a href="#ideas-sgrishchenko" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/josepot"><img src="https://avatars1.githubusercontent.com/u/8620144?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Josep M Sobrepere</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=josepot" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/mtinner"><img src="https://avatars0.githubusercontent.com/u/5487448?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marcel Tinner</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mtinner" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/FredyC"><img src="https://avatars0.githubusercontent.com/u/1096340?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Daniel K.</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/issues?q=author%3AFredyC" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=FredyC" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/VinceMalone"><img src="https://avatars0.githubusercontent.com/u/2516349?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vince Malone</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=VinceMalone" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/doppelmutzi"><img src="https://avatars1.githubusercontent.com/u/4130968?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sebastian Weber</b></sub></a><br /><a href="#blog-doppelmutzi" title="Blogposts">📝</a></td>
    <td align="center"><a href="https://gillchristian.xyz"><img src="https://avatars2.githubusercontent.com/u/8309423?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Christian Gill</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=gillchristian" title="Documentation">📖</a></td>
    <td align="center"><a href="https://jsjoe.io"><img src="https://avatars3.githubusercontent.com/u/3806031?v=4?s=100" width="100px;" alt=""/><br /><sub><b>JavaScript Joe</b></sub></a><br /><a href="#tutorial-jsjoeio" title="Tutorials">✅</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://frontstuff.io"><img src="https://avatars1.githubusercontent.com/u/5370675?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sarah Dayan</b></sub></a><br /><a href="#platform-sarahdayan" title="Packaging/porting to new platform">📦</a></td>
    <td align="center"><a href="https://github.com/102"><img src="https://avatars1.githubusercontent.com/u/5839225?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Roman Gusev</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=102" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/hemlok"><img src="https://avatars2.githubusercontent.com/u/9043345?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adam Seckel</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=hemlok" title="Code">💻</a></td>
    <td align="center"><a href="https://keiya01.github.io/portfolio"><img src="https://avatars1.githubusercontent.com/u/34934510?v=4?s=100" width="100px;" alt=""/><br /><sub><b>keiya sasaki</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=keiya01" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://allcontributors.org/) specification.
Contributions of any kind welcome!

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

- [Discord](https://discord.gg/c6JN9fM)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-hooks-testing-library)

## LICENSE

MIT
