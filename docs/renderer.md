---
name: Renderer
route: '/renderer'
---

# Render Engine

## Overview

React requires a rendering engine, typically when creating an application people use `react-dom`.
When running tests, React still requires an engine. We currently support two different engines –
`react-test-renderer` & `react-dom`. If you have both installed in your project, by default we will
use `react-test-renderer`, assuming you're using the default imports:

```js
import { renderHook } from '@testing-library/react-hooks'
```

It does this because the library runs a check for available renderers, in the order:

- `react-test-renderer`
- `react-dom`

If neither are available you will see an error asking you to check that one of the above is
installed. If only one is installed, then it will use that renderer.

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

## Caveats

### SSR

While calling `renderHook` from `@testing-library/react-hooks/native` and
`@testing-library/react-hooks/dom` will return the same `RenderHookResult` as documented
[here](/reference/api#renderhook-result), using `@testing-library/react-hooks/server` will return an
additional function:

```ts
hydrate: () => void
```

For more information on `hydrate` see the [API documentation](/reference/api#hydrate)
