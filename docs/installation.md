---
name: Installation
route: '/installation'
---

# Installation

## Getting started

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with
[node](https://nodejs.org) and should be installed as one of your project's `devDependencies`:

```sh
# if you're using npm
npm install --save-dev @testing-library/react-hooks
# if you're using yarn
yarn add --dev @testing-library/react-hooks
```

### Peer Dependencies

`react-hooks-testing-library` does not come bundled with a version of
[`react`](https://www.npmjs.com/package/react) to allow you to install the specific version you want
to test against. It also does not come installed with a specific renderer, we currently support
[`react-test-renderer`](https://www.npmjs.com/package/react-test-renderer) and
[`react-dom`](https://www.npmjs.com/package/react-dom), you only need to install one of them. For
more information see [Renderer](/installation#renderer)

```sh
npm install react@^16.9.0
npm install --save-dev react-test-renderer@^16.9.0
```

> **NOTE: The minimum supported version of `react`, `react-test-renderer` and `react-dom` is
> `^16.9.0`.**

## Renderer

React requires a rendering engine, typically when creating an application people use `react-dom`.
When running tests, React still requires an engine. We currently support two different engines:

- `react-test-renderer`
- `react-dom`

If you have both installed in your project, assuming you're using the default imports (see below)
the library defaults to using `react-test-renderer`. This is because rtr is the defacto test
renderer for `react-native` for tests and it enables hooks to be correctly tested that are written
for both `react` & `react-native`.

```js
import { renderHook } from '@testing-library/react-hooks'
```

> The auto detection function may not work if tests are bundled to run in the browser.

## Being specific

If, however, for certain tests you want to use a specific renderer (e.g. you want to use `react-dom`
for SSR) you can import the server module directly:

```ts
import { renderHook } from '@testing-library/react-hooks/server`
```

We have the following exports available:

```ts
import { renderHook, act } from '@testing-library/react-hooks' // will try to auto-detect

import { renderHook, act } from '@testing-library/react-hooks/dom' // will use react-dom

import { renderHook, act } from '@testing-library/react-hooks/native' // will use react-test-renderer

import { renderHook, act } from '@testing-library/react-hooks/server' // will use react-dom
```

## Testing Framework

In order to run tests, you will probably want to be using a test framework. If you have not already
got one, we recommend using [Jest](https://jestjs.io/), but this library should work without issues
with any of the alternatives.
