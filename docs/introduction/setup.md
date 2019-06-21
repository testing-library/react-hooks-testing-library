---
name: Setup
menu: Introduction
route: '/setup'
---

# Setup

## Installation

This module is distributed via [npm](https://www.npmjs.com/) which is bundled with
[node](https://nodejs.org) and should be installed as one of your project's `devDependencies`:

```sh
npm install --save-dev @testing-library/react-hooks
```

### Peer Dependencies

`react-hooks-testing-library` does not come bundled with a version of
[`react`](https://www.npmjs.com/package/react) or
[`react-test-renderer`](https://www.npmjs.com/package/react-test-renderer) to allow you to install
the specific version you want to test against. Generally, the installed versions for `react` and
`react-test-renderer` should match:

```sh
npm install react@^x.y.z
npm install --save-dev react-test-renderer@^x.y.z
```

Both of these dependecies must be installed as at least version `16.8.0` to be compatible with
`react-hooks-testing-library`.

## Testing Framework

In order to run tests, you will probably want to be using a test framework. If you have not already
got one, we recommend using [jest](https://jestjs.io/), but this library should work without issues
with any of the alternatives.
