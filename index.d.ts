import { cleanup, act, RenderOptions, RenderResult } from 'react-testing-library'

export function renderHook<T extends (...args: any[]) => any>(
  callback: T,
  options?: {
    initialProps?: Parameters<T>[0]
    options?: RenderOptions
  }
): {
  readonly result: {
    current: ReturnType<T>
  }
  readonly unmount: RenderResult['unmount']
  readonly rerender: (hookProps?: Parameters<T>[0]) => void
}

export const testHook: typeof renderHook

export { cleanup, act }
