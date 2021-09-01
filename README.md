<div align="center">
  <h1>react-hooks-testing-library</h1>

<a href="https://www.emojione.com/emoji/1f40f">
  <img
    height="80"
    width="80"
    alt="ram"
    src="https://raw.githubusercontent.com/testing-library/react-hooks-testing-library/main/public/ram.png"
  />
</a>

<p>Simple and complete React hooks testing utilities that encourage good testing practices.</p>

  <br />
  <a href="https://react-hooks-testing-library.com/"><strong>Read The Docs</strong></a>
  <br />
</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status](https://img.shields.io/github/workflow/status/testing-library/react-hooks-testing-library/validate?logo=github&style=flat-square)](https://github.com/testing-library/react-hooks-testing-library/actions?query=workflow%3Avalidate)
[![codecov](https://img.shields.io/codecov/c/github/testing-library/react-hooks-testing-library.svg?style=flat-square)](https://codecov.io/gh/testing-library/react-hooks-testing-library)
[![version](https://img.shields.io/npm/v/@testing-library/react-hooks.svg?style=flat-square)](https://www.npmjs.com/package/@testing-library/react-hooks)
[![downloads](https://img.shields.io/npm/dm/@testing-library/react-hooks.svg?style=flat-square)](http://www.npmtrends.com/@testing-library/react-hooks)
[![MIT License](https://img.shields.io/npm/l/@testing-library/react-hooks.svg?style=flat-square)](https://github.com/testing-library/react-hooks-testing-library/blob/main/LICENSE.md)

[![All Contributors](https://img.shields.io/github/all-contributors/testing-library/react-hooks-testing-library?color=orange&style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](https://github.com/testing-library/react-hooks-testing-library/blob/main/CODE_OF_CONDUCT.md)
[![Netlify Status](https://api.netlify.com/api/v1/badges/9a8f27a5-df38-4910-a248-4908b1ba29a7/deploy-status)](https://app.netlify.com/sites/react-hooks-testing-library/deploys)
[![Discord](https://img.shields.io/discord/723559267868737556.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square)](https://discord.gg/testing-library)

[![Watch on GitHub](https://img.shields.io/github/watchers/testing-library/react-hooks-testing-library.svg?style=social)](https://github.com/testing-library/react-hooks-testing-library/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/testing-library/react-hooks-testing-library.svg?style=social)](https://github.com/testing-library/react-hooks-testing-library/stargazers)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/testing-library/react-hooks-testing-library.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20react-hooks-testing-library%20by%20%40testing-library%20https%3A%2F%2Fgithub.com%2Ftesting-library%2Freact-hooks-testing-library%20%F0%9F%91%8D)
<!-- prettier-ignore-end -->

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The problem](#the-problem)
- [The solution](#the-solution)
- [When to use this library](#when-to-use-this-library)
- [When not to use this library](#when-not-to-use-this-library)
- [Example](#example)
  - [`useCounter.js`](#usecounterjs)
  - [`useCounter.test.js`](#usecountertestjs)
- [Installation](#installation)
  - [Peer Dependencies](#peer-dependencies)
- [API](#api)
- [Contributors](#contributors)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
  - [❓ Questions](#-questions)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
[`react`](https://www.npmjs.com/package/react) to allow you to install the specific version you want
to test against. It also does not come installed with a specific renderer, we currently support
[`react-test-renderer`](https://www.npmjs.com/package/react-test-renderer) and
[`react-dom`](https://www.npmjs.com/package/react-dom). You only need to install one of them,
however, if you do have both installed, we will use `react-test-renderer` as the default. For more
information see the [installation docs](https://react-hooks-testing-library.com/#installation).
Generally, the installed versions for `react` and the selected renderer should have matching
versions:

```sh
npm install react@^16.9.0
npm install --save-dev react-test-renderer@^16.9.0
```

> **NOTE: The minimum supported version of `react`, `react-test-renderer` and `react-dom` is
> `^16.9.0`.**

## API

See the [API reference](https://react-hooks-testing-library.com/reference/api).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/mpeyper"><img src="https://avatars0.githubusercontent.com/u/23029903?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Peyper</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mpeyper" title="Code">💻</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mpeyper" title="Documentation">📖</a> <a href="#ideas-mpeyper" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-mpeyper" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-mpeyper" title="Maintenance">🚧</a> <a href="#question-mpeyper" title="Answering Questions">💬</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mpeyper" title="Tests">⚠️</a></td>
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
    <td align="center"><a href="https://huchen.dev/"><img src="https://avatars3.githubusercontent.com/u/2078389?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hu Chen</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=huchenme" title="Code">💻</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=huchenme" title="Documentation">📖</a> <a href="#example-huchenme" title="Examples">💡</a></td>
    <td align="center"><a href="https://github.com/joshuaellis"><img src="https://avatars0.githubusercontent.com/u/37798644?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Josh</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=joshuaellis" title="Documentation">📖</a> <a href="#question-joshuaellis" title="Answering Questions">💬</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=joshuaellis" title="Code">💻</a> <a href="#ideas-joshuaellis" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-joshuaellis" title="Maintenance">🚧</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=joshuaellis" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Goldziher"><img src="https://avatars1.githubusercontent.com/u/30733348?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Na'aman Hirschfeld</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=Goldziher" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/nobrayner"><img src="https://avatars2.githubusercontent.com/u/40751395?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Braydon Hall</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=nobrayner" title="Code">💻</a></td>
    <td align="center"><a href="https://dev.to/jacobmgevans"><img src="https://avatars1.githubusercontent.com/u/27247160?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jacob M-G Evans</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=JacobMGEvans" title="Code">💻</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=JacobMGEvans" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://tigerabrodi.dev/"><img src="https://avatars1.githubusercontent.com/u/49603590?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tiger Abrodi</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=tigerabrodi" title="Code">💻</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=tigerabrodi" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/merodiro"><img src="https://avatars1.githubusercontent.com/u/17033502?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Amr A.Mohammed</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=merodiro" title="Code">💻</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=merodiro" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/juhanakristian"><img src="https://avatars1.githubusercontent.com/u/544386?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Juhana Jauhiainen</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=juhanakristian" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jensmeindertsma"><img src="https://avatars3.githubusercontent.com/u/64677517?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jens Meindertsma</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=jensmeindertsma" title="Code">💻</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=jensmeindertsma" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/marcosvega91"><img src="https://avatars2.githubusercontent.com/u/5365582?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marco Moretti</b></sub></a><br /><a href="#infra-marcosvega91" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.parkside.at/"><img src="https://avatars0.githubusercontent.com/u/27507295?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Martin V.</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=ndresx" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/erozak"><img src="https://avatars3.githubusercontent.com/u/22066282?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Erozak</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=erozak" title="Documentation">📖</a></td>
    <td align="center"><a href="https://nickmccurdy.com/"><img src="https://avatars0.githubusercontent.com/u/927220?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nick McCurdy</b></sub></a><br /><a href="#maintenance-nickmccurdy" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://codepen.io/aryyya/"><img src="https://avatars1.githubusercontent.com/u/29365565?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Arya</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=aryyya" title="Documentation">📖</a></td>
    <td align="center"><a href="https://numb86.net/"><img src="https://avatars1.githubusercontent.com/u/16703337?v=4?s=100" width="100px;" alt=""/><br /><sub><b>numb86</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=numb86" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/foray1010"><img src="https://avatars3.githubusercontent.com/u/3212221?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Young</b></sub></a><br /><a href="#maintenance-foray1010" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://blam.sh/"><img src="https://avatars1.githubusercontent.com/u/3645856?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ben Lambert</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=benjdlambert" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/ElRatonDeFuego"><img src="https://avatars1.githubusercontent.com/u/12750934?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Cho-Lerat</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=ElRatonDeFuego" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/evanharmon"><img src="https://avatars1.githubusercontent.com/u/8229989?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Evan Harmon</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=evanharmon" title="Documentation">📖</a></td>
    <td align="center"><a href="http://codedaily.io/"><img src="https://avatars1.githubusercontent.com/u/1714673?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jason Brown</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=browniefed" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/kahwee"><img src="https://avatars1.githubusercontent.com/u/262105?v=4?s=100" width="100px;" alt=""/><br /><sub><b>KahWee Teng</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=kahwee" title="Documentation">📖</a></td>
    <td align="center"><a href="http://shagabutdinov.com/"><img src="https://avatars2.githubusercontent.com/u/1635613?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Leonid Shagabutdinov</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=shagabutdinov" title="Documentation">📖</a></td>
    <td align="center"><a href="https://levibutcher.dev/"><img src="https://avatars2.githubusercontent.com/u/31522433?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Levi Butcher</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=LeviButcher" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/7michele7"><img src="https://avatars2.githubusercontent.com/u/17926167?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michele Settepani</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=7michele7" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/samnoh"><img src="https://avatars1.githubusercontent.com/u/14857416?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sam</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=samnoh" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/tanaypratap"><img src="https://avatars0.githubusercontent.com/u/10216863?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tanay Pratap</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=tanaypratap" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/techanvil"><img src="https://avatars0.githubusercontent.com/u/18395600?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tom Rees-Herdman</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=techanvil" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/iqbal125"><img src="https://avatars2.githubusercontent.com/u/24860061?v=4?s=100" width="100px;" alt=""/><br /><sub><b>iqbal125</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=iqbal125" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/cliffzhaobupt"><img src="https://avatars3.githubusercontent.com/u/7374506?v=4?s=100" width="100px;" alt=""/><br /><sub><b>cliffzhaobupt</b></sub></a><br /><a href="#maintenance-cliffzhaobupt" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/jonkoops"><img src="https://avatars2.githubusercontent.com/u/695720?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jon Koops</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=jonkoops" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jpeyper"><img src="https://avatars2.githubusercontent.com/u/6560018?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonathan Peyper</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/pulls?q=is%3Apr+reviewed-by%3Ajpeyper" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=jpeyper" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://seanbaines.com/"><img src="https://avatars.githubusercontent.com/u/24367010?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sean Baines</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mrseanbaines" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/mike-vasin/"><img src="https://avatars.githubusercontent.com/u/12434833?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mikhail Vasin</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=mvasin" title="Documentation">📖</a></td>
    <td align="center"><a href="https://aleksandar.xyz"><img src="https://avatars.githubusercontent.com/u/7226555?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aleksandar Grbic</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=agjs" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/yoniholmes"><img src="https://avatars.githubusercontent.com/u/184589?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonathan Holmes</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=yoniholmes" title="Code">💻</a></td>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars.githubusercontent.com/u/6643991?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="#maintenance-MichaelDeBoey" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/xobotyi"><img src="https://avatars.githubusercontent.com/u/6178739?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anton Zinovyev</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/issues?q=author%3Axobotyi" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=xobotyi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/marianna-exelate"><img src="https://avatars.githubusercontent.com/u/24763042?v=4?s=100" width="100px;" alt=""/><br /><sub><b>marianna-exelate</b></sub></a><br /><a href="#infra-marianna-exelate" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://matan.io"><img src="https://avatars.githubusercontent.com/u/12711091?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matan Borenkraout</b></sub></a><br /><a href="#maintenance-MatanBobi" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/andyrooger"><img src="https://avatars.githubusercontent.com/u/420834?v=4?s=100" width="100px;" alt=""/><br /><sub><b>andyrooger</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=andyrooger" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bdwain"><img src="https://avatars.githubusercontent.com/u/3982094?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bryan Wain</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/issues?q=author%3Abdwain" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/react-hooks-testing-library/pulls?q=is%3Apr+reviewed-by%3Abdwain" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/snowystinger"><img src="https://avatars.githubusercontent.com/u/698229?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Robert Snow</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=snowystinger" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/chris110408"><img src="https://avatars.githubusercontent.com/u/10645051?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chris Chen</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=chris110408" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.facebook.com/masoud.bonabi"><img src="https://avatars.githubusercontent.com/u/6429009?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Masious</b></sub></a><br /><a href="https://github.com/testing-library/react-hooks-testing-library/commits?author=masious" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
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

- [Discord](https://discord.gg/testing-library)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-hooks-testing-library)

## LICENSE

MIT
