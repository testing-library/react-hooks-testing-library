import { cleanup, act, RenderOptions, RenderResult } from 'react-testing-library'

export function renderHook<P extends any, R extends any>(
  callback: (...args: [P]) => R,
  options?: {
    initialProps?: P
  } & RenderOptions
): {
  readonly result: {
    current: R
  }
  readonly unmount: RenderResult['unmount']
  readonly rerender: (hookProps?: P) => void
}

export const testHook: typeof renderHook

export { cleanup, act }
