import { ComponentType } from 'react'

import { RenderHookOptions as BaseRenderHookOptions, RenderHookResult, Act } from '.'

export type WrapperComponent<TProps> = ComponentType<TProps>

export type RendererOptions<TProps> = {
  wrapper?: WrapperComponent<TProps>
}

export type RenderHookOptions<TProps> = BaseRenderHookOptions<TProps> & {
  wrapper?: WrapperComponent<TProps>
}

export type ReactHooksRenderer = {
  renderHook: <TProps, TResult>(
    callback: (props: TProps) => TResult,
    options?: RenderHookOptions<TProps>
  ) => RenderHookResult<TProps, TResult>
  act: Act
  cleanup: () => void
  addCleanup: (callback: () => Promise<void> | void) => () => void
  removeCleanup: (callback: () => Promise<void> | void) => void
}

export * from '.'
