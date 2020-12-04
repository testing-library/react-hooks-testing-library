---
name: Introduction
route: '/'
---

<div align="center">
  <h1>react-hooks-testing-library</h1>

  <a href="https://www.emojione.com/emoji/1f40f">
    <img
      height="80"
      width="80"
      alt="ram"
      src="https://raw.githubusercontent.com/mpeyper/react-hooks-testing-library/master/public/ram.png"
    />
  </a>

  <p>
    Simple and complete React hooks testing utilities that encourage good testing practices.
  </p>

</div>

<hr />

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

### When to use this library

1. You're writing a library with one or more custom hooks that are not directly tied a component
2. You have a complex hook that is difficult to test through component interactions

### When not to use this library

1. Your hook is defined alongside a component and is only used there
2. Your hook is easy to test by just testing the components using it

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
`react-test-renderer` should have matching versions:

```sh
npm install react@^16.9.0
npm install --save-dev react-test-renderer@^16.9.0
```

> **NOTE: The minimum supported version of `react` and `react-test-renderer` is `^16.9.0`.**

## Testing Framework

In order to run tests, you will probably want to be using a test framework. If you have not already
got one, we recommend using [Jest](https://jestjs.io/), but this library should work without issues
with any of the alternatives.
