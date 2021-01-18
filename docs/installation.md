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

When running tests, a renderer is required in order to render the React component we wrap around
your hook. We currently support two different renderers:

- `react-test-renderer`
- `react-dom`

When using standard import for this library (show below), we will attempt to auto-detect which
renderer you have installed and use it without needing any specific wiring up to make it happen. If
you have both installed in your project, and you use the standard import (see below) the library
will default to using `react-test-renderer`.

> We use `react-test-renderer` by default as it enables hooks to be tested that are designed for
> either `react` or `react-native` and it is compatible with more test runners out-of-the-box as
> there is no DOM requirement to use it.

The standard import looks like:

```js
import { renderHook } from '@testing-library/react-hooks'
```

> Note: The auto detection function may not work if tests are being bundled (e.g. to be run in a
> browser)

### Act

Each render also provides a unique [`act` function](https://reactjs.org/docs/test-utils.html#act)
that cannot be used with other renderers. In order to simplify with `act `function you need to use,
we also export the correct one alongside the detected renderer for you:

```js
import { renderHook, act } from '@testing-library/react-hooks'
```

## Being specific

Auto-detection is great for simplifying setup and getting out of your way, but sometimes you do need
a little but more control. If a test needs requires a specific type of environment, the import can
be appended to force a specific renderer to be use. The supported environments are:

- `dom`
- `native`
- `server`

The imports for each type of renderer are as follows:

```ts
import { renderHook, act } from '@testing-library/react-hooks' // will attempt to auto-detect

import { renderHook, act } from '@testing-library/react-hooks/dom' // will use react-dom

import { renderHook, act } from '@testing-library/react-hooks/native' // will use react-test-renderer

import { renderHook, act } from '@testing-library/react-hooks/server' // will use react-dom/server
```

## Testing Framework

In order to run tests, you will probably want to be using a test framework. If you have not already
got one, we recommend using [Jest](https://jestjs.io/), but this library should work without issues
with any of the alternatives.
