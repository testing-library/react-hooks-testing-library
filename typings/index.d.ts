import { ComponentType } from 'react'
export { act } from 'react-test-renderer'

export interface RenderHookOptions<P> {
  initialProps?: P
  wrapper?: React.ComponentType
}

export interface HookResult<R> {
  readonly current: R
  readonly error: Error
}

export interface RenderHookResult<P, R> {
  readonly result: HookResult<R>
  readonly waitForNextUpdate: () => Promise<void>
  readonly unmount: () => boolean
  readonly rerender: (newProps?: P) => void
}

export function renderHook<P, R>(
  callback: (props: P) => R,
  options?: RenderHookOptions<P>
): RenderHookResult<P, R>
