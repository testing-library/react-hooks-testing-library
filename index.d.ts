import { cleanup, act, RenderOptions, RenderResult } from 'react-testing-library'

export function renderHook<P extends any, T extends (...args: [P]) => any>(
  callback: (_: P) => ReturnType<T>,
  options?: {
    initialProps?: P
  } & RenderOptions
): {
  readonly result: {
    current: ReturnType<T>
  }
  readonly unmount: RenderResult['unmount']
  readonly rerender: (hookProps?: P) => void
}

export const testHook: typeof renderHook

export { cleanup, act }
