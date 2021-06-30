import { ComponentType } from 'react'

import {
  RenderHookOptions as BaseRenderHookOptions,
  RenderHookResult,
  ServerRenderHookResult,
  Act,
  CleanupCallback
} from '.'

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
  cleanup: () => Promise<void>
  addCleanup: (callback: CleanupCallback) => () => void
  removeCleanup: (callback: CleanupCallback) => void
  suppressErrorOutput: () => () => void
}

export type ReactHooksServerRenderer = Omit<ReactHooksRenderer, 'renderHook'> & {
  renderHook: <TProps, TResult>(
    callback: (props: TProps) => TResult,
    options?: RenderHookOptions<TProps>
  ) => ServerRenderHookResult<TProps, TResult>
}

export * from '.'
