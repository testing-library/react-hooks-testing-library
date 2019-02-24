# react-hooks-testing-library

Simple component wrapper and utilities for testing React hooks.

---

[![Build Status](https://img.shields.io/travis/mpeyper/react-hooks-testing-library.svg?style=flat-square)](https://travis-ci.org/mpeyper/react-hooks-testing-library)
[![version](https://img.shields.io/npm/v/react-hooks-testing-library.svg?style=flat-square)](https://www.npmjs.com/package/react-hooks-testing-library)
[![downloads](https://img.shields.io/npm/dm/react-hooks-testing-library.svg?style=flat-square)](http://www.npmtrends.com/react-hooks-testing-library)
[![MIT License](https://img.shields.io/npm/l/react-hooks-testing-library.svg?style=flat-square)](https://github.com/mpeyper/react-hooks-testing-library/blob/master/LICENSE.md)

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
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

The `react-hooks-testing-library` is build on top of the wonderful [`react-testing-library`](http://npm.im/react-testing-library) to create a simple test harness for React hooks that handles running them within the body of a function component, as well as providing various useful utility functions for updating the inputs and retrieving the outputs of your amazing custom hook.

Using this library, you do not have to concern yourself with how the to interact construct, render or interact with the react component in order to test your hook. You can just use the hook directly and assert the resulting values.

### When to use this library

1. You're writing a library with one or more custom hooks that are not directly tied a component
2. You have a complex hook that is difficult to test through component interactions

### When not to use this library

1. Your hook is defined along side a component and is only used there
2. Your hook is easy to test by just testing the components using it

## Example

```js
// useTheme.js
import { useState, createContext, useContext, useMemo } from 'react'

const themes = {
  light: { primaryLight: '#FFFFFF', primaryDark: '#000000' },
  dark: { primaryLight: '#000000', primaryDark: '#FFFFFF' }
}

const ThemesContext = createContext(themes)

const useTheme = (initialTheme) => {
  const themes = useContext(ThemesContext)
  const [theme, setTheme] = useState(initialTheme)
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  return useMemo(() => ({ ...themes[theme], toggleTheme }), [theme])
}

// useTheme.test.js
import { renderHook, cleanup, act } from 'react-hooks-testing-library'

describe('custom hook tests', () => {
  afterEach(cleanup)

  test('should use theme', () => {
    const { result } = renderHook(() => useTheme('light'))

    const theme = result.current

    expect(theme.primaryLight).toBe('#FFFFFF')
    expect(theme.primaryDark).toBe('#000000')
  })

  test('should update theme', () => {
    const { result } = renderHook(() => useTheme('light'))

    const { toggleTheme } = result.current

    act(() => toggleTheme())

    const theme = result.current

    expect(theme.primaryLight).toBe('#000000')
    expect(theme.primaryDark).toBe('#FFFFFF')
  })

  test('should use custom theme', () => {
    const customThemes = {
      light: { primaryLight: '#AABBCC', primaryDark: '#CCBBAA' },
      dark: { primaryLight: '#CCBBAA', primaryDark: '#AABBCC' }
    }

    const wrapper = ({ children }) => (
      <ThemesContext.Provider value={customThemes}>{children}</ThemesContext.Provider>
    )

    const { result } = renderHook(() => useTheme('light'), { wrapper })

    const theme = result.current

    expect(theme.primaryLight).toBe('#AABBCC')
    expect(theme.primaryDark).toBe('#CCBBAA')
  })
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
| [<img src="https://avatars0.githubusercontent.com/u/23029903?v=4" width="100px;"/><br /><sub><b>Michael Peyper</b></sub>](https://github.com/mpeyper)<br />[💻](https://github.com/mpeyper/react-hooks-testing-library/commits?author=mpeyper "Code") [🎨](#design-mpeyper "Design") [📖](https://github.com/mpeyper/react-hooks-testing-library/commits?author=mpeyper "Documentation") [🤔](#ideas-mpeyper "Ideas, Planning, & Feedback") [🚇](#infra-mpeyper "Infrastructure (Hosting, Build-Tools, etc)") [📦](#platform-mpeyper "Packaging/porting to new platform") [⚠️](https://github.com/mpeyper/react-hooks-testing-library/commits?author=mpeyper "Tests") [🔧](#tool-mpeyper "Tools") |
| :---: |

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
