import { ComponentType } from 'react'

import { RenderHook, RenderHookOptions, Act } from '.'

export type WrapperComponent<TProps> = ComponentType<TProps>

export type RendererOptions<TProps> = {
  wrapper?: WrapperComponent<TProps>
}

export interface ReactHooksRenderer {
  renderHook: <TProps, TResult>(
    callback: (props: TProps) => TResult,
    options?: RenderHookOptions<TProps, RendererOptions<TProps>>
  ) => RenderHook<TProps, TResult>
  act: Act
  cleanup: () => void
  addCleanup: (callback: () => Promise<void> | void) => () => void
  removeCleanup: (callback: () => Promise<void> | void) => void
}
