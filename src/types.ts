/**
 *
 * Shared
 *
 */

export interface Act {
  (callback: () => void | undefined): void
  (callback: () => Promise<void | undefined>): Promise<undefined>
}

export interface WaitOptions {
  interval?: number
  timeout?: number
  suppressErrors?: boolean
}

export type Renderer<TProps> = {
  render: (props?: TProps) => void
  rerender: (props?: TProps) => void
  unmount: () => void
  act: Act
}

/**
 *
 * pure
 *
 */

export interface ReactHooksRenderer {
  renderHook: <TProps, TResult>() => RenderHook<TProps, TResult>
  act: Act
  cleanup: () => void
  addCleanup: (callback: () => Promise<void> | void) => () => void
  removeCleanup: (callback: () => Promise<void> | void) => void
}

export type RenderingEngineArray = Array<{ required: string; renderer: string }>

/**
 *
 * core/asyncUtils
 *
 */

export type AsyncUtils = {
  waitFor: (callback: () => boolean | void, opts?: WaitOptions) => Promise<void>
  waitForNextUpdate: (opts?: Pick<WaitOptions, 'timeout'>) => Promise<void>
  waitForValueToChange: (selector: () => unknown, options?: WaitOptions) => Promise<void>
}

/**
 *
 * core/index
 *
 */

export type RendererProps<TProps, TResult> = {
  callback: (props: TProps) => TResult
  setError: (error: Error) => void
  setValue: (value: TResult) => void
}

export type CreateRenderer<TProps, TResult, TOptions, TRenderer extends Renderer<TProps>> = (
  props: RendererProps<TProps, TResult>,
  options: TOptions
) => TRenderer

export type RendererUtils<TRenderer extends Renderer<never>> = Omit<
  TRenderer,
  keyof Renderer<never>
>

export type RenderResult<TValue> = {
  readonly all: (TValue | Error | undefined)[]
  readonly current: TValue
  readonly error: Error | undefined
}

export type ResultContainer<TValue> = {
  result: RenderResult<TValue>
  addResolver: (resolver: () => void) => void
  setValue: (val: TValue) => void
  setError: (error: Error) => void
}

export type RenderHookOptions<TProps, TOptions extends {}> = TOptions & {
  initialProps?: TProps
}

export type RenderHook<TProps, TValue, TRenderer extends Renderer<TProps> = Renderer<TProps>> = {
  result: RenderResult<TValue>
} & Omit<Renderer<TProps>, 'render' | 'act'> &
  RendererUtils<TRenderer> &
  AsyncUtils
