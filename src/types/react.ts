import { ComponentType } from 'react'

import {
  Act,
  CleanupCallback,
  RenderHookOptions as BaseRenderHookOptions,
  RenderHookResult,
  ServerRenderHookResult
} from './'

export type WrapperComponent<TProps> = ComponentType<TProps>

export type RendererOptions<TProps, TResult> = {
  wrapper?: WrapperComponent<TProps>
  customRender?: WrapperComponent<TResult>
}

export type RenderHookOptions<TProps, TResult> = BaseRenderHookOptions<TProps> &
  RendererOptions<TProps, TResult>

export type ReactHooksRenderer = {
  renderHook: <TProps, TResult>(
    callback: (props: TProps) => TResult,
    options?: RenderHookOptions<TProps, TResult>
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
    options?: RenderHookOptions<TProps, TResult>
  ) => ServerRenderHookResult<TProps, TResult>
}

export * from '.'
