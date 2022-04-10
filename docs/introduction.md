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
      src="https://raw.githubusercontent.com/mpeyper/react-hooks-testing-library/main/public/ram.png"
    />
  </a>

  <p>
    Simple and complete React hooks testing utilities that encourage good testing practices.
  </p>

</div>

<hr />

## A Note about React 18 Support

As part of the changes for React 18, it has been decided that the `renderHook` API provided by this
library will instead be included as official additions to both `react-testing-library`
([PR](https://github.com/testing-library/react-testing-library/pull/991)) and
`react-native-testing-library`
([PR](https://github.com/callstack/react-native-testing-library/pull/923)) with the intention being
to provide a more cohesive and consistent implementation for our users.

Please be patient as we finalise these changes in the respective testing libraries.

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

1. You're writing a library with one or more custom hooks that are not directly tied to a component
2. You have a complex hook that is difficult to test through component interactions

### When not to use this library

1. Your hook is defined alongside a component and is only used there
2. Your hook is easy to test by just testing the components using it
