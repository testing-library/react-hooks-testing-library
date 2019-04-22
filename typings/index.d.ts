import * as React from 'react'

interface RenderHookOptions<P> {
  initialProps?: P
  wrapper?: React.ComponentType
}

interface HookResult<R> {
  readonly current: R
  readonly error: Error
}

interface RenderHookResult<P, R> {
  readonly result: HookResult<R>
  readonly waitForNextUpdate: () => Promise<void>
  readonly unmount: () => boolean
  readonly rerender: (newProps?: P) => void
}

export function renderHook<P, R>(
  callback: (props: P) => R,
  options?: RenderHookOptions<P>
): RenderHookResult<P, R>

export const testHook: typeof renderHook

export function act(callback: () => void): void
